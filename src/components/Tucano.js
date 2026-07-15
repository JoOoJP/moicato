// Tucano — motivo do manual de marca, mesmo tratamento line-art em
// currentColor dos outros ícones de marca (CapimFlor, Folhagem).
export default function Tucano({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Corpo */}
        <path d="M20 40c-3-8 1-16 9-19 7-3 15-1 19 5 2 3 2 7-1 9-2 2-5 2-7 1" />
        {/* Bico grande */}
        <path d="M47 27c8-2 14 1 16 6-3 3-9 4-14 2" />
        <path d="M47 27c6 1 10 4 11 8" />
        {/* Cauda */}
        <path d="M20 40c-5 2-9 6-10 11" />
        {/* Galho */}
        <path d="M8 54h28" />
      </g>
      {/* Olho */}
      <circle cx="33" cy="30" r="1.6" fill="currentColor" />
    </svg>
  );
}
