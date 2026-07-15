// Folhagem tropical (monstera + palmeira) — motivo do manual de marca,
// line-art em currentColor pra herdar a cor do contexto (mesmo tratamento de
// traço do CapimFlor e dos ícones de Values.js), não clip-art flat colorido.
export default function Folhagem({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Folha de monstera, com furos característicos */}
        <path d="M20 54c-6-8-8-18-3-27 4-7 12-11 20-9 7 2 11 8 10 15-1 6-6 10-13 10-3 0-6-1-8-3" />
        <circle cx="27" cy="24" r="2.2" />
        <circle cx="35" cy="30" r="2" />
        <circle cx="24" cy="34" r="1.8" />
        {/* Folhas de palmeira ao fundo */}
        <path d="M44 58c2-10 1-20-4-28" />
        <path d="M44 58c6-8 9-17 8-27" />
        <path d="M44 58c-2-11-7-20-15-26" />
      </g>
    </svg>
  );
}
