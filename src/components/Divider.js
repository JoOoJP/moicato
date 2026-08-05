// Divisor editorial: espiga de capim dourado (ecoa o motivo da marca).
// Usado entre seções, centralizado — como na referência.
export default function Divider({ className = "" }) {
  return (
    <div className={`flex justify-center ${className}`} aria-hidden="true">
      <svg width="20" height="40" viewBox="0 0 20 40" fill="none">
        <g stroke="#b48332" strokeWidth="1.1" strokeLinecap="round">
          <path d="M10 39 V12" />
          {/* grãos pareados subindo a haste */}
          <path d="M10 16 C6.5 15 5.5 12.5 6 10" />
          <path d="M10 16 C13.5 15 14.5 12.5 14 10" />
          <path d="M10 21 C6.8 20 6 17.8 6.6 15.6" />
          <path d="M10 21 C13.2 20 14 17.8 13.4 15.6" />
          <path d="M10 26 C7 25 6.3 23 6.9 21" />
          <path d="M10 26 C13 25 13.7 23 13.1 21" />
        </g>
        <circle cx="10" cy="9" r="1.5" fill="#b48332" />
      </svg>
    </div>
  );
}
