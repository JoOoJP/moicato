import Link from "next/link";
import ProductCard from "./ProductCard";
import { getCatalogPieces } from "../lib/catalog";

const HOME_SELECTION = [
  "bolsa-royale",
  "brinco-helia",
  "clutch-amalfi",
  "brinco-entrelacos",
  "centro-de-mesa-solaris",
  "cesto-raizes",
];

export default function Collection({ dict, lang }) {
  const allPieces = getCatalogPieces({ collection: dict });
  const pieces = HOME_SELECTION.map((slug) => allPieces.find((piece) => piece.slug === slug)).filter(Boolean);

  return (
    <section id="colecao" className="scroll-mt-24 bg-osso">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28">
        <header className="grid gap-7 border-t border-verdemoikato/20 pt-7 md:grid-cols-[1fr_0.9fr] md:items-end">
          <div>
            <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-light leading-[1.05] text-verdemoikato sm:text-6xl">
              {dict.title}
            </h2>
          </div>
          <div className="md:justify-self-end">
            <p className="max-w-lg text-base leading-relaxed text-verdemoikato/70">{dict.intro}</p>
            <Link
              href={`/${lang}/catalogo`}
              className="mt-5 inline-flex min-h-11 items-center border-b border-amarelomoikato-700 text-xs font-semibold uppercase tracking-[0.14em] text-amarelomoikato-700 transition-colors hover:text-verdemoikato focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarelomoikato/70 motion-reduce:transition-none"
            >
              {dict.viewCatalog} →
            </Link>
          </div>
        </header>

        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {pieces.map((piece, index) => (
            <ProductCard
              key={piece.slug}
              piece={piece}
              lang={lang}
              label={dict.viewPiece}
              priority={index < 2}
              featured={index === 0}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href={`/${lang}/catalogo`}
            className="inline-flex min-h-14 items-center justify-between gap-12 bg-verdemoikato px-7 text-sm font-semibold uppercase tracking-[0.13em] text-osso transition-colors hover:bg-floresta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarelomoikato focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            {dict.viewCatalog}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
