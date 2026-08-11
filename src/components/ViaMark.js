export default function ViaMark({ title = "VIA" }) {
  return (
    <svg
      viewBox="0 0 92 46"
      role="img"
      aria-label={title}
      focusable="false"
      className="h-4 w-auto"
    >
        <defs>
          <linearGradient id="via-footer-mark" x1="0" y1="0" x2="92" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5B12D1" />
            <stop offset="0.34" stopColor="#2E6BE8" />
            <stop offset="0.58" stopColor="#00B8D4" />
            <stop offset="0.8" stopColor="#17C9A8" />
            <stop offset="1" stopColor="#39D67A" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#via-footer-mark)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 6 L20 40 L34 6" />
          <path d="M46 6 L46 40" />
          <path d="M58 40 L72 6 L86 40" />
        </g>
    </svg>
  );
}
