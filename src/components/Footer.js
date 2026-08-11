import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_URL, waLink } from "../lib/contato";
import ViaMark from "./ViaMark";

const destinations = {
  top: "#topo",
  collection: "#colecao",
  story: "#historia",
  events: "#feiras",
  resellers: "#revendedores",
};

export default function Footer({ dict, lang = "pt-BR" }) {
  const year = new Date().getFullYear();
  const destination = (key) =>
    key === "collection" ? `/${lang}/catalogo` : `/${lang}${destinations[key]}`;

  return (
    <footer id="contato" className="scroll-mt-24 bg-floresta text-osso">
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-12 sm:pb-10 sm:pt-14">
        <div className="grid gap-10 pb-12 sm:pb-14 md:grid-cols-[minmax(0,1.45fr)_minmax(9rem,.7fr)_minmax(9rem,.7fr)] md:items-start md:gap-12 lg:gap-16">
          <div>
            <Link
              href={`/${lang}#topo`}
              aria-label="Moikato"
              className="relative block h-20 w-full max-w-[19rem] outline-none ring-amarelomoikato-300/70 ring-offset-4 ring-offset-floresta focus-visible:ring-2 sm:h-24 sm:max-w-[22rem]"
            >
              <Image
                src="/logo-moikato-header.png"
                alt="Moikato"
                fill
                sizes="(max-width: 640px) 304px, 352px"
                className="object-contain object-left brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-osso/60">{dict.tagline}</p>
            <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amarelomoikato-300">
              {dict.origin}
            </p>
          </div>

          <nav aria-label={dict.exploreTitle}>
            <p className="eyebrow text-amarelomoikato-300">{dict.exploreTitle}</p>
            <ul className="mt-6 space-y-4 text-sm text-osso/70">
              {dict.explore.map((link) => (
                <li key={link.key}>
                  <Link
                    className="inline-flex min-h-6 items-center outline-none transition-colors hover:text-osso focus-visible:text-amarelomoikato-300"
                    href={destination(link.key)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-amarelomoikato-300">{dict.contactTitle}</p>
            <ul className="mt-6 space-y-4 text-sm text-osso/70">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center outline-none transition-colors hover:text-osso focus-visible:text-amarelomoikato-300">
                  Instagram ↗
                </a>
              </li>
              <li>
                <a href={waLink(dict.waMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center outline-none transition-colors hover:text-osso focus-visible:text-amarelomoikato-300">
                  WhatsApp ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-osso/20 pt-6 text-[0.68rem] uppercase tracking-[0.12em] text-osso/45 sm:flex-row sm:items-center sm:justify-between">
          <span>{dict.copyright.replace("{year}", String(year))}</span>
          <Link href={`/${lang}#topo`} className="w-fit py-2 outline-none transition-colors hover:text-amarelomoikato-300 focus-visible:text-amarelomoikato-300">
            {dict.backToTop} ↑
          </Link>
        </div>

      </div>

      <div
        className="bg-neutral-950"
        style={{
          backgroundImage:
            "radial-gradient(circle at left center, rgba(91,18,209,0.4), transparent 38%), radial-gradient(circle at right center, rgba(57,214,122,0.34), transparent 38%)",
        }}
      >
        <div className="mx-auto flex min-h-12 max-w-6xl items-center justify-center gap-2.5 px-6 text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-osso/50">
          <span>{dict.createdBy}</span>
          <ViaMark />
        </div>
      </div>
    </footer>
  );
}
