import Image from "next/image";
import { waLink, whatsappReady } from "../lib/contato";

// A imagem de cada peça vem do dicionário (piece.image) — trocar pelos arquivos
// das fotos reais das joias quando o cliente enviar (mesmo aspect-[4/5]).

// Silhuetas orgânicas onduladas (tipo "espelho orgânico") — SVG clip-path com
// curvas irregulares e assimétricas. Coordenadas normalizadas (0–1) para escalar
// com qualquer tamanho. Cada peça alterna entre 3 formas diferentes.
const CLIPS = [
  "M0.44,0.03 C0.62,0.01 0.75,0.09 0.78,0.23 C0.81,0.35 0.72,0.43 0.76,0.55 C0.80,0.69 0.73,0.82 0.60,0.91 C0.51,0.97 0.42,0.98 0.35,0.91 C0.26,0.83 0.31,0.70 0.27,0.58 C0.23,0.45 0.30,0.37 0.26,0.25 C0.23,0.13 0.31,0.05 0.44,0.03 Z",
  "M0.56,0.03 C0.38,0.01 0.25,0.10 0.23,0.24 C0.21,0.37 0.30,0.45 0.25,0.58 C0.20,0.71 0.28,0.83 0.41,0.92 C0.50,0.98 0.59,0.97 0.66,0.89 C0.75,0.80 0.70,0.66 0.74,0.54 C0.78,0.41 0.70,0.34 0.75,0.22 C0.78,0.11 0.69,0.05 0.56,0.03 Z",
  "M0.5,0.03 C0.71,0.02 0.83,0.17 0.80,0.35 C0.78,0.49 0.86,0.59 0.79,0.72 C0.72,0.88 0.59,0.98 0.45,0.96 C0.31,0.93 0.19,0.83 0.20,0.67 C0.21,0.53 0.14,0.44 0.20,0.30 C0.27,0.14 0.34,0.04 0.5,0.03 Z",
];

const external = whatsappReady
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

// Moldura "fio-buriti": o MESMO path do clip desenhado como contorno, mais uma
// fileira de pontos-semente dourados que acompanham a borda orgânica. Cita o
// material da marca (capim dourado trançado + sementes) e ecoa o Hero (hastes
// douradas com semente na ponta) e o GoldenThread. viewBox 0 0 1 1 +
// preserveAspectRatio="none" casa 1:1 com o clip-path (mesmas unidades 0–1);
// non-scaling-stroke mantém a espessura constante em qualquer tamanho/aspect.
function FioBuriti({ d }) {
  return (
    <svg
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* (a) fio contínuo hairline — o capim trançado que contorna a peça */}
      <path
        d={d}
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
        className="opacity-60 transition-opacity duration-700 group-hover:opacity-90 motion-reduce:transition-none"
      />
      {/* (b) pontos-semente no mesmo contorno — dot curto + gap largo */}
      <path
        d={d}
        fill="none"
        stroke="#C9A23A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="0.15 5.5"
        vectorEffect="non-scaling-stroke"
        className="opacity-70 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none"
      />
    </svg>
  );
}

// Barro do Cerrado: gradiente areia torrada que substitui o branco clínico
// dentro da silhueta, para a peça "assentar na terra" e não flutuar em papel.
const BARRO =
  "radial-gradient(120% 100% at 50% 0%, #faf4e8 0%, #efe2c9 55%, #e3cfa6 100%)";

export default function Catalog({ dict }) {
  return (
    <section id="colecao" className="scroll-mt-24 bg-areia-50">
      {/* Definições de recorte orgânico (uma vez) */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          {CLIPS.map((d, i) => (
            <clipPath
              key={i}
              id={`moikato-blob-${i}`}
              clipPathUnits="objectBoundingBox"
            >
              <path d={d} />
            </clipPath>
          ))}
        </defs>
      </svg>

      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px w-10 bg-amarelomoikato-700" />
          <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
        </div>
        <h2 className="mt-4 text-4xl sm:text-5xl">{dict.title}</h2>
        <p className="lead mt-4 max-w-xl">{dict.lead}</p>

        {/* Menos colunas + gap vertical maior = peças com mais presença.
            No lg, as colunas pares descem um pouco (ritmo de canteiro à mão,
            não grade de e-commerce) — só em motion-safe. */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
          {dict.pieces.map((p, i) => (
            <article
              key={i}
              className="group motion-safe:lg:[&:nth-child(even)]:mt-12"
            >
              {/* Levanta da página no hover */}
              <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                {/* Sombra QUENTE (terracota) que acompanha a silhueta — aterra a
                    peça no Cerrado em vez de recortá-la sobre branco frio. */}
                <div className="transition-[filter] duration-500 [filter:drop-shadow(0_12px_22px_#7a3f2e26)] group-hover:[filter:drop-shadow(0_26px_34px_#7a3f2e40)]">
                  <div
                    style={{
                      clipPath: `url(#moikato-blob-${i % CLIPS.length})`,
                      backgroundImage: BARRO,
                    }}
                    className="relative aspect-[4/5] overflow-hidden"
                  >
                    <Image
                      src={p.image}
                      alt={`${p.name} — ${p.material} · ${dict.altSuffix}`}
                      width={1000}
                      height={1250}
                      sizes="(min-width: 640px) 45vw, 90vw"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                </div>

                {/* Moldura fio-buriti sobre a mesma silhueta (fora do clip,
                    para o contorno não ser cortado). Puramente decorativa. */}
                <FioBuriti d={CLIPS[i % CLIPS.length]} />
              </div>

              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  {/* Carimbo de origem: 3 sementes douradas ecoando a moldura
                      e as sementes-ponta do capim no Hero. "Feito à mão." */}
                  <span
                    aria-hidden
                    className="mb-2 flex items-center gap-1"
                  >
                    <span className="h-[3px] w-[3px] rounded-full bg-amarelomoikato" />
                    <span className="h-[3px] w-[3px] rounded-full bg-amarelomoikato-600" />
                    <span className="h-[3px] w-[3px] rounded-full bg-terra/70" />
                  </span>
                  <h3 className="text-lg leading-tight">{p.name}</h3>
                  <p className="mt-0.5 text-sm text-verdemoikato-700/70">
                    {p.material}
                  </p>
                  {p.tag && (
                    <span className="mt-2 inline-block border border-terra/30 bg-terra/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-terra-700">
                      {p.tag}
                    </span>
                  )}
                </div>
                <a
                  href={waLink(
                    dict.waPiece
                      .replace("{name}", p.name)
                      .replace("{material}", p.material)
                  )}
                  {...external}
                  className="mt-1 whitespace-nowrap rounded-none text-sm font-medium text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-colors hover:text-terra-600 focus-visible:ring-2"
                >
                  {dict.order}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <a
            href={waLink(dict.waCatalog)}
            {...external}
            className="inline-flex border border-verdemoikato/40 px-8 py-4 text-sm font-medium text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-colors hover:bg-verdemoikato hover:text-white focus-visible:ring-2"
          >
            {dict.seeAll}
          </a>
        </div>
      </div>
    </section>
  );
}
