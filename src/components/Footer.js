import { INSTAGRAM_URL, waLink } from "../lib/contato";

const destinations = {
  top: "#topo",
  collection: "#colecao",
  story: "#historia",
  events: "#feiras",
  resellers: "#revendedores",
};

export default function Footer({ dict }) {
  const year = new Date().getFullYear();

  return (
    <footer id="contato" className="scroll-mt-24 border-t border-osso/15 bg-floresta">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <a href="#topo" className="font-display text-3xl italic lowercase text-osso">
              moikato
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-osso/65">
              {dict.tagline}
            </p>
          </div>

          <nav aria-label={dict.exploreTitle}>
            <p className="eyebrow text-amarelomoikato-300">{dict.exploreTitle}</p>
            <ul className="mt-5 space-y-3 text-sm text-osso/70">
              {dict.explore.map((link) => (
                <li key={link.key}>
                  <a className="transition-colors hover:text-amarelomoikato-300" href={destinations[link.key]}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-amarelomoikato-300">{dict.contactTitle}</p>
            <ul className="mt-5 space-y-3 text-sm text-osso/70">
              <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-amarelomoikato-300">Instagram</a></li>
              <li><a href={waLink(dict.waMessage)} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-amarelomoikato-300">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-osso/15 pt-6 text-xs text-osso/55">
          <span>{dict.copyright.replace("{year}", String(year))}</span>
          <a href="#topo" className="uppercase tracking-[0.12em] transition-colors hover:text-amarelomoikato-300">{dict.backToTop} ↑</a>
        </div>
      </div>
    </footer>
  );
}
