import Image from "next/image";
import { Fragment } from "react";
import CatalogNav from "./CatalogNav";
import ProductCard from "./ProductCard";
import { CATEGORY_ORDER, getCatalogPieces } from "../lib/catalog";

const EDITORIAL_IMAGES = {
  joias: { src: "/model-editorial.webp", position: "center 28%" },
  moda: { src: "/model-backstage.webp", position: "center 30%" },
};

export default function CatalogGrid({ dict, lang }) {
  const pieces = getCatalogPieces(dict);
  const categories = CATEGORY_ORDER.map((category) => ({
    id: category,
    label: dict.catalogPage.categories[category].shortLabel,
    count: pieces.filter((piece) => piece.category === category).length,
  }));

  return (
    <main id="topo" className="bg-osso pt-[60px] motion-safe:animate-[pageEnter_400ms_ease-out] md:pt-20">
      <section id="catalogo-inicio" className="mx-auto max-w-7xl scroll-mt-36 px-5 pb-7 pt-8 sm:px-8 sm:pb-10 sm:pt-12">
        <p className="eyebrow text-amarelomoikato-700">{dict.catalogPage.eyebrow}</p>
        <div className="mt-4 grid gap-4 border-t border-verdemoikato/20 pt-5 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-10">
          <h1 className="max-w-3xl font-display text-[2.8rem] font-light leading-[0.95] text-verdemoikato sm:text-6xl">
            {dict.catalogPage.title}
          </h1>
          <p className="max-w-xl text-[0.95rem] leading-6 text-verdemoikato/70 md:justify-self-end">
            {dict.catalogPage.intro}
          </p>
        </div>
      </section>

      <div className="sticky top-[60px] z-30 border-y border-verdemoikato/15 bg-osso/95 backdrop-blur-md md:top-[73px]">
        <CatalogNav label={dict.catalogPage.categoryNav} allLabel={dict.catalogPage.allLabel} categories={categories} />
      </div>

      {CATEGORY_ORDER.map((category, sectionIndex) => {
        const categoryPieces = pieces.filter((piece) => piece.category === category);
        const copy = dict.catalogPage.categories[category];

        return (
          <section
            id={category}
            key={category}
            className={`scroll-mt-28 border-b border-verdemoikato/15 ${
              category === "moda" ? "bg-floresta text-osso" : category === "home" ? "bg-areia-100" : "bg-osso"
            }`}
          >
            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
              <header className="grid gap-3 md:grid-cols-[1fr_0.8fr] md:items-end md:gap-8">
                <div>
                  <span className="font-display text-lg italic text-amarelomoikato-700">
                    0{sectionIndex + 1}
                  </span>
                  <h2 className={`mt-1 font-display text-[2.35rem] font-light sm:text-5xl ${category === "moda" ? "text-osso" : "text-verdemoikato"}`}>
                    {copy.label}
                  </h2>
                </div>
                <p className={`max-w-lg text-sm leading-relaxed md:justify-self-end ${category === "moda" ? "text-osso/65" : "text-verdemoikato/65"}`}>
                  {copy.description}
                </p>
              </header>

              <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-9 sm:mt-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3">
                {categoryPieces.map((piece, index) => (
                  <Fragment key={piece.slug}>
                    <ProductCard piece={piece} lang={lang} label={dict.catalogPage.viewPiece} priority={sectionIndex === 0 && index < 2} featured={index === 0 && categoryPieces.length > 4} minimal inverted={category === "moda"} />
                    {index === 3 && EDITORIAL_IMAGES[category] && (
                      <figure className="relative col-span-2 min-h-[26rem] overflow-hidden sm:min-h-[34rem] lg:col-span-1 lg:min-h-0">
                        <Image src={EDITORIAL_IMAGES[category].src} alt={copy.editorialAlt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" style={{ objectPosition: EDITORIAL_IMAGES[category].position }} />
                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-floresta/80 to-transparent px-5 pb-5 pt-20 text-xs font-semibold uppercase tracking-[0.16em] text-osso">
                          {dict.catalogPage.editorialLabel}
                        </figcaption>
                      </figure>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
