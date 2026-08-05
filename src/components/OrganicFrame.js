// Moldura orgânica da marca: silhueta irregular assimétrica (clip-path) com o
// "fio-buriti" por cima — o MESMO path desenhado como contorno contínuo mais
// uma fileira de pontos-semente dourados. Cita o material (capim trançado +
// sementes) e ecoa o Hero e o GoldenThread. Nasceu no Catalog; hoje veste as
// fotos da história (o catálogo passou a fotos quadradas).
//
// Coordenadas normalizadas 0–1 (clipPathUnits/viewBox casam 1:1), escalam com
// qualquer tamanho/aspect; non-scaling-stroke mantém a espessura do fio.
const CLIPS = [
  "M0.44,0.03 C0.62,0.01 0.75,0.09 0.78,0.23 C0.81,0.35 0.72,0.43 0.76,0.55 C0.80,0.69 0.73,0.82 0.60,0.91 C0.51,0.97 0.42,0.98 0.35,0.91 C0.26,0.83 0.31,0.70 0.27,0.58 C0.23,0.45 0.30,0.37 0.26,0.25 C0.23,0.13 0.31,0.05 0.44,0.03 Z",
  "M0.56,0.03 C0.38,0.01 0.25,0.10 0.23,0.24 C0.21,0.37 0.30,0.45 0.25,0.58 C0.20,0.71 0.28,0.83 0.41,0.92 C0.50,0.98 0.59,0.97 0.66,0.89 C0.75,0.80 0.70,0.66 0.74,0.54 C0.78,0.41 0.70,0.34 0.75,0.22 C0.78,0.11 0.69,0.05 0.56,0.03 Z",
  "M0.5,0.03 C0.71,0.02 0.83,0.17 0.80,0.35 C0.78,0.49 0.86,0.59 0.79,0.72 C0.72,0.88 0.59,0.98 0.45,0.96 C0.31,0.93 0.19,0.83 0.20,0.67 C0.21,0.53 0.14,0.44 0.20,0.30 C0.27,0.14 0.34,0.04 0.5,0.03 Z",
];

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
        className="opacity-60"
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
        className="opacity-70"
      />
    </svg>
  );
}

// shape: 0..2 — usar formas diferentes em molduras vizinhas (o id do clipPath
// é derivado da forma; duas molduras com a MESMA forma na mesma página
// duplicam o id, o browser resolve pro primeiro e o recorte é idêntico mesmo).
export default function OrganicFrame({
  shape = 0,
  className = "",
  children,
  ...rest
}) {
  const d = CLIPS[shape % CLIPS.length];
  const clipId = `moikato-blob-${shape % CLIPS.length}`;
  return (
    <div className={`relative ${className}`} {...rest}>
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        </defs>
      </svg>
      <div
        style={{ clipPath: `url(#${clipId})` }}
        className="relative h-full w-full overflow-hidden"
      >
        {children}
      </div>
      <FioBuriti d={d} />
    </div>
  );
}
