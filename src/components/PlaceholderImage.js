// Bloco marcando ONDE entra cada foto real (o site é ~90% fotografia de
// lifestyle). Trocar por <Image> quando as fotos chegarem — mesma proporção.
export default function PlaceholderImage({
  label,
  sub,
  tone = "light",
  className = "",
}) {
  const dark = tone === "dark";
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden ${
        dark
          ? "bg-floresta-700 text-osso/55"
          : "bg-areia-300/70 text-verdemoikato/40"
      } ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(130%_120%_at_28%_18%,rgba(255,255,255,0.28),transparent_60%)]" />
      <span className="relative flex flex-col items-center gap-2 px-6 text-center">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="6.5" width="18" height="13.5" rx="2" />
          <circle cx="12" cy="13.5" r="3.6" />
          <path d="M8 6.5 9.4 4h5.2L16 6.5" />
        </svg>
        {label && (
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
            {label}
          </span>
        )}
        {sub && <span className="text-xs opacity-70">{sub}</span>}
      </span>
    </div>
  );
}
