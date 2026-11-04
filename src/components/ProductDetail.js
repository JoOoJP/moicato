import Link from "next/link";
import ProductCard from "./ProductCard";
import ProductGallery from "./shop/ProductGallery";
import ProductPurchase from "./shop/ProductPurchase";

function Accordion({ title, children, open = false }) {
  return (
    <details open={open} className="group border-b border-verdemoikato/15">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-[0.12em] text-verdemoikato [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-xl font-light transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-5 text-[0.95rem] leading-7 text-verdemoikato/75">{children}</div>
    </details>
  );
}

export default function ProductDetail({ piece, related, dict, lang, pricing, salesLive, shippingReady }) {
  const t = dict.shop;
  const category = dict.catalogPage.categories[piece.category].label;

  return (
    <main id="topo" className="bg-osso pt-[60px] motion-safe:animate-[pageEnter_400ms_ease-out] md:pt-20">
      <div className="mx-auto max-w-7xl pb-20 pt-2 sm:px-8 sm:pb-28 sm:pt-6">
        <nav aria-label={dict.productPage.breadcrumbLabel} className="mb-2 flex min-h-11 flex-wrap items-center gap-2 px-5 text-[0.68rem] uppercase tracking-[0.12em] text-verdemoikato/55 sm:mb-5 sm:px-0 sm:text-xs">
          <Link scroll={true} className="min-h-11 content-center transition-colors hover:text-verdemoikato" href={`/${lang}/catalogo`}>
            {dict.productPage.backToCatalog}
          </Link>
          <span aria-hidden>/</span>
          <Link scroll={true} className="min-h-11 content-center transition-colors hover:text-verdemoikato" href={`/${lang}/catalogo#${piece.category}`}>
            {category}
          </Link>
        </nav>

        <article className="grid gap-0 sm:gap-9 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.75fr)] min-[900px]:items-start min-[900px]:gap-12 lg:gap-16">
          <ProductGallery images={piece.images} name={piece.name} />

          <div className="px-5 pt-7 sm:px-0 sm:pt-0 min-[900px]:sticky min-[900px]:top-24 min-[900px]:self-start">
            <p className="eyebrow text-amarelomoikato-700">{category}</p>
            <h1 className="mt-2 font-display text-[2.6rem] font-light leading-[0.98] text-verdemoikato sm:mt-3 sm:text-5xl xl:text-6xl">
              {piece.name}
            </h1>

            <ProductPurchase piece={piece} pricing={pricing} salesLive={salesLive} shippingReady={shippingReady} t={t} />

            <ul className="mt-7 grid grid-cols-3 gap-px border-y border-verdemoikato/15 bg-verdemoikato/10 text-center">
              {t.trust.map((item) => (
                <li key={item.title} className="bg-osso px-2 py-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-verdemoikato">{item.title}</p>
                  <p className="mt-1 text-[0.72rem] leading-snug text-verdemoikato/60">{item.text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-2">
              <Accordion title={t.details} open>
                {piece.description && <p>{piece.description}</p>}
                {piece.details && <p className="mt-3 whitespace-pre-line">{piece.details}</p>}
                <p className="mt-3 text-sm text-verdemoikato/60">{t.handmadeNote}</p>
              </Accordion>
              <Accordion title={t.care}>
                <p className="whitespace-pre-line">{piece.care || t.careDefault}</p>
              </Accordion>
              <Accordion title={t.shippingReturns}>
                <p>{t.shippingReturnsText}</p>
              </Accordion>
            </div>
          </div>
        </article>

        <section className="mx-5 mt-20 border-t border-verdemoikato/20 pt-10 sm:mx-0 sm:mt-28 sm:pt-14">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-4xl text-verdemoikato sm:text-5xl">{dict.productPage.related}</h2>
            <Link scroll={true} href={`/${lang}/catalogo`} className="hidden min-h-11 items-center text-xs font-semibold uppercase tracking-[0.13em] text-amarelomoikato-700 sm:flex">
              {dict.productPage.seeAll} →
            </Link>
          </div>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedPiece) => (
              <ProductCard key={relatedPiece.slug} piece={relatedPiece} lang={lang} label={dict.catalogPage.viewPiece} pricing={pricing} t={t} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
