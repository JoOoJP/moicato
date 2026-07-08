// Logo inline (sem next/image): renderiza sempre, sem requisição nem cache.
// Mark de hastes de capim dourado + wordmark "moikato" na serifada da marca.
export default function Logo({ compact = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 36 48"
        fill="none"
        aria-hidden="true"
        className={`w-auto shrink-0 transition-all duration-500 ${
          compact ? "h-6" : "h-7"
        }`}
      >
        <g strokeLinecap="round" fill="none">
          <path d="M18 41 C14 27 13 21 12 11" stroke="#2A6F46" strokeWidth="2.2" />
          <path d="M18 41 C18 26 18 19 18 8" stroke="#235b36" strokeWidth="2.2" />
          <path d="M18 41 C22 27 24 21 26 12" stroke="#D4AF37" strokeWidth="2.2" />
          <path d="M18 41 C26 31 29 27 32 22" stroke="#D4AF37" strokeWidth="1.5" opacity="0.65" />
        </g>
        <circle cx="12" cy="10" r="1.9" fill="#2A6F46" />
        <circle cx="18" cy="7" r="2" fill="#D4AF37" />
        <circle cx="26" cy="11" r="1.9" fill="#D4AF37" />
        <circle cx="32" cy="21" r="1.4" fill="#D4AF37" opacity="0.65" />
      </svg>
      <span
        className={`font-display font-semibold leading-none tracking-tight text-verdemoikato transition-all duration-500 ${
          compact ? "text-xl" : "text-2xl"
        }`}
      >
        moikato
      </span>
    </span>
  );
}
