// Mega footer editorial: wordmark + tagline + 4 colunas + copyright.
export default function Footer({ dict }) {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contato"
      className="scroll-mt-24 border-t border-verdemoikato/12 bg-osso"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <a
              href="#topo"
              className="font-display text-2xl italic lowercase text-verdemoikato"
            >
              moikato
            </a>
            <p className="mt-3 max-w-xs text-sm text-verdemoikato/60">
              {dict.tagline}
            </p>
          </div>

          {dict.cols.map((col, i) => (
            <div key={i}>
              <p className="eyebrow text-amarelomoikato-700">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-verdemoikato/70">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      className="transition-colors hover:text-amarelomoikato-700"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-verdemoikato/10 pt-6 text-xs text-verdemoikato/55">
          {dict.copyright.replace("{year}", String(year))}
        </div>
      </div>
    </footer>
  );
}
