import CapimFlor from "./CapimFlor";

// Logo inline (sem next/image): renderiza sempre, sem requisição nem cache.
// Mark de hastes de capim dourado (CapimFlor) + wordmark "moikato".
export default function Logo({ compact = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <CapimFlor
        className={`transition-all duration-500 ${compact ? "h-6" : "h-7"}`}
      />
      <span
        className={`font-logo leading-none text-verdemoikato transition-all duration-500 ${
          compact ? "text-2xl" : "text-3xl"
        }`}
      >
        moikato
      </span>
    </span>
  );
}
