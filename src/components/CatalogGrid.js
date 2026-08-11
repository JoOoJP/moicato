import ProductCard from "./ProductCard";
import { CATEGORY_ORDER, getCatalogPieces } from "../lib/catalog";

export default function CatalogGrid({ dict, lang }) {
  const pieces = getCatalogPieces(dict);

  return (
    <main id="topo" className="bg-osso pt-20 motion-safe:animate-[pageEnter_400ms_ease-out]">
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
        <p className="eyebrow text-amarelomoikato-700">{dict.catalogPage.eyebrow}</p>
        <div className="mt-5 grid gap-7 border-t border-verdemoikato/20 pt-7 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <h1 className="max-w-3xl font-display text-5xl font-light leading-[0.98] text-verdemoikato sm:text-7xl">
            {dict.catalogPage.title}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-verdemoikato/70 md:justify-self-end">
            {dict.catalogPage.intro}
          </p>
        </div>

        <nav aria-label={dict.catalogPage.categoryNav} className="mt-10 flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((category) => (
            <a
              key={category}
              href={`#${category}`}
              className="inline-flex min-h-11 items-center border border-verdemoikato/25 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-verdemoikato transition-colors hover:border-amarelomoikato-700 hover:bg-amarelomoikato-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarelomoikato/70 motion-reduce:transition-none"
            >
              {dict.catalogPage.categories[category].label}
            </a>
          ))}
        </nav>
      </section>

      {CATEGORY_ORDER.map((category, sectionIndex) => {
        const categoryPieces = pieces.filter((piece) => piece.category === category);
        const copy = dict.catalogPage.categories[category];

        return (
          <section
            id={category}
            key={category}
            className={`scroll-mt-24 border-t border-verdemoikato/15 ${
              category === "moda" ? "bg-areia-100" : "bg-osso"
            }`}
          >
            <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
              <header className="grid gap-5 md:grid-cols-[1fr_0.8fr] md:items-end">
                <div>
                  <span className="font-display text-xl italic text-amarelomoikato-700">
                    0{sectionIndex + 1}
                  </span>
                  <h2 className="mt-3 font-display text-4xl font-light text-verdemoikato sm:text-6xl">
                    {copy.label}
                  </h2>
                </div>
                <p className="max-w-lg text-sm leading-relaxed text-verdemoikato/65 md:justify-self-end">
                  {copy.description}
                </p>
              </header>

              <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {categoryPieces.map((piece, index) => (
                  <ProductCard
                    key={piece.slug}
                    piece={piece}
                    lang={lang}
                    label={dict.catalogPage.viewPiece}
                    priority={sectionIndex === 0 && index < 2}
                    featured={index === 0 && categoryPieces.length > 4}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
