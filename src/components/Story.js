"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Folhagem from "./Folhagem";

// História única: o material (capim dourado) + a jornada (palco fixo, campo→joia)
// + quem faz (Moikato/Samuel/comunidades). Uma narrativa só.
const IMAGES = [
  "/story-nasce.jpg",
  "/story-colheita.jpg",
  "/story-brilho.jpg",
  "/story-costura.jpg",
  "/story-joia.jpg",
];

export default function Story({ dict }) {
  const scenes = dict.scenes;
  const total = scenes.length;
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const stepRefs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    const els = stepRefs.current.filter(Boolean);
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      setActive(0);
      return;
    }
    const ratios = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = Number(entry.target.dataset.index);
          ratios.set(i, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = -1;
        let bestRatio = 0;
        for (const [i, r] of ratios) {
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        }
        if (best >= 0) setActive(best);
      },
      { rootMargin: "-34% 0px -34% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [total]);

  const goTo = (i) =>
    stepRefs.current[i]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });

  const stepLabel = dict.stepLabel
    .replace("{i}", String(active + 1))
    .replace("{total}", String(total))
    .replace("{title}", scenes[active].title);

  return (
    <section
      id="jornada"
      aria-labelledby="jornada-titulo"
      className="scroll-mt-24 border-y border-amarelomoikato/20 bg-gradient-to-b from-areia to-areia-100"
    >
      {/* 1) Abertura — o material */}
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-28">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px w-10 bg-amarelomoikato-700" />
          <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
        </div>
        <h2
          id="jornada-titulo"
          className="mt-5 max-w-3xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
        >
          {dict.titleBefore}
          <span className="italic text-amarelomoikato-700">{dict.titleEm}</span>
          {dict.titleAfter}
        </h2>
        <p className="lead mt-6 max-w-xl">{dict.lead}</p>
      </div>

      {/* Anúncio da etapa ativa para leitores de tela */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {stepLabel}
      </p>

      {/* 2) A jornada — palco fixo + passos que deslizam */}
      <div className="mx-auto grid max-w-6xl gap-x-14 px-6 pb-6 pt-10 sm:pt-14 lg:grid-cols-2">
        {/* PALCO — fixo no topo (mobile) / à esquerda (desktop) */}
        <div className="sticky top-16 z-10 -mx-6 mb-6 self-start bg-areia px-6 pb-5 pt-2 lg:top-28 lg:mx-0 lg:mb-0 lg:bg-transparent lg:px-0 lg:pb-0">
          <div
            aria-hidden
            className="relative mx-auto aspect-[16/10] w-full overflow-hidden border border-amarelomoikato/30 sm:aspect-[16/9] lg:aspect-[4/5] lg:max-w-[400px]"
          >
            {scenes.map((s, i) => (
              <Image
                key={s.n}
                src={IMAGES[i] ?? IMAGES[0]}
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-verdemoikato-900/35 via-transparent to-transparent"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 right-4 font-display text-4xl !text-areia/90 sm:text-5xl"
            >
              {scenes[active].n}
            </span>
          </div>

          <div className="mx-auto mt-4 flex w-full items-center justify-between lg:max-w-[400px]">
            <div className="flex items-center gap-2.5">
              {scenes.map((s, i) => (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${s.n} — ${s.title}`}
                  aria-current={i === active ? "step" : undefined}
                  title={s.title}
                  className="group/dot -my-3 flex h-11 cursor-pointer items-center px-2 outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia focus-visible:ring-2"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 motion-reduce:transition-none ${
                      i === active
                        ? "w-7 bg-amarelomoikato-600"
                        : "w-1.5 bg-amarelomoikato/40 group-hover/dot:bg-amarelomoikato/70 group-focus-visible/dot:bg-amarelomoikato/70"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="eyebrow text-amarelomoikato-700">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* PASSOS */}
        <ol>
          {scenes.map((s, i) => {
            const isActive = i === active;
            return (
              <li
                key={s.n}
                data-index={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="flex min-h-[46vh] flex-col justify-center border-t border-amarelomoikato/15 py-8 first:border-t-0 lg:min-h-[54vh] lg:border-t-0"
              >
                <div
                  className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
                    isActive
                      ? "opacity-100"
                      : "opacity-40 lg:translate-x-1 lg:opacity-35"
                  }`}
                >
                  <span className="eyebrow text-[0.7rem] text-amarelomoikato-700 sm:text-xs">
                    {s.n} — {s.tag}
                  </span>
                  <h3 className="mt-4 text-3xl leading-[1.1] sm:text-4xl">
                    {s.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-lg leading-relaxed text-verdemoikato-900/85 sm:text-xl">
                    {s.caption}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* 3) Quem faz — a Moikato / Samuel / comunidades */}
      <div className="relative mx-auto max-w-6xl px-6 pt-8 sm:pt-12">
        {/* Folhagem — motivo do manual de marca, textura baixíssima no canto */}
        <Folhagem className="pointer-events-none absolute -top-4 right-0 h-28 w-28 text-amarelomoikato-700/10" />
        <div className="grid items-center gap-10 border-t border-amarelomoikato/20 pt-14 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[5/4] overflow-hidden border border-verdemoikato/15">
            <Image
              src="/story-comunidade.jpg"
              alt={dict.makersTitle}
              width={1600}
              height={1200}
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-amarelomoikato-700" />
              <span className="eyebrow text-amarelomoikato-700">
                {dict.makersEyebrow}
              </span>
            </div>
            <h3 className="mt-4 text-3xl sm:text-4xl">{dict.makersTitle}</h3>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-verdemoikato-900/85">
              {dict.makersP1}
            </p>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-verdemoikato-900/85">
              {dict.makersP2}
            </p>
            {/* história real de Samuel Moikato entra aqui quando o cliente enviar */}
            <p className="mt-6 font-display text-lg italic text-verdemoikato">
              {dict.signature}
            </p>
          </div>
        </div>
      </div>

      {/* 4) Ponte para a coleção */}
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pb-28">
        {/* .gradiente-dourado no lugar do bg-amarelomoikato chapado — ecoa o
            manual de marca. Hover só desloca/sombreia (a troca de cor de
            fundo no hover foi removida: um bg-* do Tailwind não sobrescreve
            de forma confiável o `background` da classe custom no cascade). */}
        <a
          href="#colecao"
          className="group gradiente-dourado inline-flex items-center gap-2 px-8 py-4 text-sm font-medium tracking-wide text-amarelomoikato-900 outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(160,127,41,0.6)] focus-visible:ring-2 active:translate-y-0 active:shadow-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {dict.cta}
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </a>
      </div>
    </section>
  );
}
