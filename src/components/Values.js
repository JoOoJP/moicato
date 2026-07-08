// Ícones ficam no componente (JSX não vai no dicionário); os textos vêm do dict,
// na mesma ordem.
const icons = [
  <path
    key="i"
    d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"
  />,
  <g key="i">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </g>,
  <g key="i">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </g>,
  <g key="i">
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </g>,
];

export default function Values({ dict }) {
  return (
    <section className="border-y border-verdemoikato/10">
      {/* grid com fios finos entre as células (hairlines) */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-verdemoikato/10 lg:grid-cols-4">
        {dict.items.map((v, i) => (
          <div key={i} className="bg-areia px-6 py-10 sm:px-8">
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amarelomoikato-600"
              aria-hidden
            >
              {icons[i]}
            </svg>
            <h3 className="mt-5 text-lg">{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-verdemoikato-800/70">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
