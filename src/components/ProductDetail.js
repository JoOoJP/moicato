import Link from "next/link";
import ProductCard from "./ProductCard";
import ProductGallery from "./shop/ProductGallery";
import ProductPurchase from "./shop/ProductPurchase";

function Accordion({ title, children, open = false }) {
  return (
    <details open={open} className="group border-b border-verdemoikato/10">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[0.88rem] text-verdemoikato [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-xl font-light transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-5 text-[0.95rem] leading-7 text-verdemoikato/75">{children}</div>
    </details>
  );
}

export default function ProductDetail({ piece, related, dict, lang, pricing, salesLive, shippingReady, giftWrapEnabled }) {
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
          {piece.collection ? (
            <Link scroll={true} className="min-h-11 content-center transition-colors hover:text-verdemoikato" href={`/${lang}/catalogo#${piece.collection.slug}`}>
              {piece.collection.name}
            </Link>
          ) : (
            <span className="min-h-11 content-center">{category}</span>
          )}
        </nav>

        <article className="grid gap-0 sm:gap-9 min-[900px]:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] min-[900px]:items-start min-[900px]:gap-14 lg:gap-20">
          <ProductGallery images={piece.images} name={piece.name} />

          <div className="px-5 pt-8 sm:px-0 sm:pt-0 min-[900px]:sticky min-[900px]:top-28 min-[900px]:self-start">
            <p className="text-[0.72rem] tracking-[0.14em] text-amarelomoikato-700">
              {piece.collection ? `${t.fromCollection.toUpperCase()} ${piece.collection.name.toUpperCase()}` : (piece.kindLabel ?? category).toUpperCase()}
            </p>
            <h1 className="mt-3 font-display text-[2.4rem] font-light leading-[1] text-verdemoikato sm:text-5xl">
              {piece.name}
            </h1>

            <ProductPurchase
              piece={piece}
              pricing={pricing}
              salesLive={salesLive}
              shippingReady={shippingReady}
              giftWrapEnabled={giftWrapEnabled}
              t={t}
            />

            <ul className="mt-8 grid grid-cols-3 gap-4 border-t border-verdemoikato/10 pt-6">
              {t.trust.map((item) => (
                <li key={item.title}>
                  <p className="text-[0.78rem] text-verdemoikato">{item.title}</p>
                  <p className="mt-0.5 text-[0.72rem] leading-snug text-verdemoikato/50">{item.text}</p>
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
                <Link href={`/${lang}/politicas/trocas-e-devolucoes`} className="mt-3 inline-block text-sm text-verdemoikato underline underline-offset-4 hover:text-floresta">
                  {t.policyLink}
                </Link>
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
