"use client";

import { useEffect, useRef } from "react";

// Campo de capim dourado denso e felpudo (canvas 2D), com vento suave contínuo.
// Chave para o scroll não travar / não "mexer" o capim:
//  1) o canvas é uma CAMADA própria da GPU (translateZ(0)) → rolar a página só
//     move a camada (barato), sem repintar; a animação não interfere no scroll
//     e o scroll não interfere na animação (totalmente desacoplados);
//  2) relógio de animação próprio (só avança quando desenha, com dt limitado)
//     → sem "saltos" ao voltar de fora da tela;
//  3) pausa só quando o hero sai da viewport (IntersectionObserver).
// prefers-reduced-motion = 1 quadro estático.
export default function Hero({ dict }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let W = 0;
    let H = 0;
    let blades = [];
    const rand = (a, b) => a + Math.random() * (b - a);

    function makeBlades() {
      const count = Math.max(55, Math.min(180, Math.round(W / 7)));
      blades = [];
      for (let i = 0; i < count; i++) {
        const depth = Math.random(); // 0 fundo .. 1 frente
        const len = H * (0.42 + depth * 0.56) * rand(0.75, 1.12);
        blades.push({
          x: Math.random() * W,
          depth,
          len,
          width: 0.8 + depth * 1.7,
          phase: Math.random() * Math.PI * 2,
          speed: rand(0.3, 0.75),
          flex: rand(0.5, 1.15),
          lean: rand(-0.14, 0.14),
          barbs: Math.round(depth < 0.5 ? rand(5, 9) : rand(11, 17)),
          barbLen: (6 + depth * 13) * rand(0.85, 1.2),
          stalk: `hsla(41, 54%, ${Math.round(33 + depth * 13)}%, ${(
            0.45 +
            depth * 0.45
          ).toFixed(2)})`,
          plume: `hsla(45, 74%, ${Math.round(52 + depth * 15)}%, ${(
            0.5 +
            depth * 0.42
          ).toFixed(2)})`,
        });
      }
      blades.sort((a, b) => a.depth - b.depth);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeBlades();
    }
    resize();

    const bez = (p0, c, p1, t) => {
      const mt = 1 - t;
      return mt * mt * p0 + 2 * mt * t * c + t * t * p1;
    };

    function drawBlade(b, gust, t) {
      const bx = b.x;
      const by = H;
      const len = b.len;
      const s = gust * b.flex + Math.sin(t * b.speed + b.phase) * 0.11 + b.lean;
      const tipX = bx + s * len * 0.55;
      const tipY = by - len;
      const cpX = bx + s * len * 0.28;
      const cpY = by - len * 0.55;

      ctx.strokeStyle = b.stalk;
      ctx.lineWidth = b.width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
      ctx.stroke();

      ctx.strokeStyle = b.plume;
      ctx.lineWidth = b.width * 0.7;
      const start = 0.52;
      for (let j = 0; j < b.barbs; j++) {
        const f = start + (1 - start) * (j / b.barbs);
        const px = bez(bx, cpX, tipX, f);
        const py = bez(by, cpY, tipY, f);
        const side = j % 2 === 0 ? 1 : -1;
        const bl = b.barbLen * (1 - f * 0.5);
        const ang = -Math.PI / 2 + side * (0.6 - f * 0.4) + s * 1.1;
        const ex = px + Math.cos(ang) * bl;
        const ey = py + Math.sin(ang) * bl;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(
          (px + ex) / 2 - side * bl * 0.15,
          (py + ey) / 2,
          ex,
          ey
        );
        ctx.stroke();
      }
    }

    function render(time) {
      ctx.clearRect(0, 0, W, H);
      const t = time * 0.001;
      const gust =
        Math.sin(time * 0.0006) * 0.1 +
        Math.sin(time * 0.00023 + 1.3) * 0.06 +
        Math.sin(time * 0.00009 + 2.1) * 0.05;
      for (let i = 0; i < blades.length; i++) drawBlade(blades[i], gust, t);
    }

    if (reduce) {
      render(0);
      const onResizeStatic = () => {
        resize();
        render(0);
      };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    // Relógio próprio: avança só quando desenha (dt limitado) — sem salto.
    let animTime = 0;
    let lastFrame = 0;
    let raf = 0;
    let running = false;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (lastFrame && now - lastFrame < 33) return; // ~30fps
      const dt = lastFrame ? Math.min(now - lastFrame, 60) : 16;
      lastFrame = now;
      animTime += dt;
      render(animTime);
    };
    const start = () => {
      if (!running) {
        running = true;
        lastFrame = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    // Pausa APENAS quando o hero sai da tela (não no scroll dentro dele).
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);
    start();

    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(resize, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, []);

  return (
    <section
      id="topo"
      className="relative flex h-[100svh] min-h-[560px] w-full flex-col justify-end overflow-hidden"
    >
      {/* Céu de hora dourada */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #f7efe1 0%, #f2e0aa 50%, #e6c877 100%)",
        }}
      />
      {/* Brilho do sol */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[14%] top-[8%] h-[46vh] w-[46vh] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,246,210,0.9), rgba(255,246,210,0) 70%)",
        }}
      />

      {/* Campo de capim dourado — canvas isolado numa camada própria da GPU
          (translateZ) para o scroll não repintá-lo. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[78%] w-full"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      />

      {/* Scrim para leitura: base de areia atrás da coluna de texto (esquerda),
          deixando o campo vivo à direita */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(247,239,225,0.92) 0%, rgba(247,239,225,0.68) 32%, rgba(247,239,225,0.25) 55%, rgba(247,239,225,0) 72%)",
        }}
      />
      {/* Transição suave para a próxima seção */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%]"
        style={{
          backgroundImage:
            "linear-gradient(to top, #f7efe1 0%, rgba(247,239,225,0) 100%)",
        }}
      />

      {/* Conteúdo (mantém CTAs de venda) */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-28 sm:pb-32">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px w-10 bg-amarelomoikato-700" />
          <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
        </div>
        <h1 className="mt-6 max-w-3xl text-5xl leading-[1.0] sm:text-7xl lg:text-8xl">
          {dict.titleBefore}
          <span className="italic text-amarelomoikato-700">{dict.titleEm}</span>
          {dict.titleAfter}
        </h1>
        <p className="lead mt-6 max-w-xl">{dict.lead}</p>
        <div className="mt-9 flex flex-wrap items-center gap-7">
          <a
            href="#colecao"
            className="bg-verdemoikato px-8 py-4 text-sm font-medium tracking-wide text-white outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-all duration-300 hover:-translate-y-0.5 hover:bg-verdemoikato-600 hover:shadow-[0_10px_30px_-12px_rgba(26,67,40,0.5)] focus-visible:ring-2 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {dict.ctaPrimary}
          </a>
          <a
            href="#jornada"
            className="group inline-flex items-center gap-2 rounded-none text-sm font-medium text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia focus-visible:ring-2"
          >
            <span className="relative">
              {dict.ctaSecondary}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-amarelomoikato transition-transform duration-300 group-hover:scale-x-100"
              />
            </span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>

      {/* Indicador de rolagem */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="eyebrow text-[0.6rem] text-verdemoikato/50">
          {dict.scroll}
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-verdemoikato/20">
          <span className="absolute inset-x-[-0.5px] top-0 h-3 rounded-full bg-amarelomoikato motion-safe:animate-[scrollHint_1.9s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}
