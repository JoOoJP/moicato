import Image from "next/image";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { waLink, whatsappReady } from "../lib/contato";

const external = whatsappReady ? { target: "_blank", rel: "noopener noreferrer" } : {};

export default function ProductDetail({ piece, related, dict, lang }) {
  const category = dict.catalogPage.categories[piece.category].label;
  const price = piece.priceNote ? `${piece.price} · ${piece.priceNote}` : piece.price;
  const message = dict.collection.waPiece.replace("{name}", piece.name).replace("{price}", price);

  return (
    <main id="topo" className="bg-osso pt-20 motion-safe:animate-[pageEnter_400ms_ease-out]">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-8 sm:pb-28 sm:pt-8">
        <nav aria-label={dict.productPage.breadcrumbLabel} className="mb-5 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-verdemoikato/55 sm:mb-6">
          <Link scroll={true} className="min-h-11 content-center transition-colors hover:text-verdemoikato" href={`/${lang}/catalogo`}>
            {dict.productPage.backToCatalog}
          </Link>
          <span aria-hidden>/</span>
          <span>{category}</span>
        </nav>

        <article className="grid gap-9 min-[900px]:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.72fr)] min-[900px]:items-start min-[900px]:gap-10 lg:gap-14">
          <div className="relative aspect-[4/5] overflow-hidden bg-areia-200 min-[900px]:h-[min(72vh,720px)] min-[900px]:min-h-[560px] min-[900px]:aspect-auto">
            <Image
              src={piece.image}
              alt={piece.imageAlt}
              fill
              priority
              sizes="(min-width: 900px) 58vw, 100vw"
              className="object-contain"
              style={{ objectPosition: piece.imagePosition ?? "center" }}
            />
          </div>

          <div className="min-[900px]:sticky min-[900px]:top-24 min-[900px]:self-start">
            <p className="eyebrow text-amarelomoikato-700">{category}</p>
            <h1 className="mt-3 font-display text-4xl font-light leading-[0.98] text-verdemoikato sm:text-5xl xl:text-6xl">
              {piece.name}
            </h1>
            <p className="mt-5 font-display text-3xl text-verdemoikato">{piece.price}</p>
            {piece.priceNote && <p className="mt-1 text-sm text-verdemoikato/60">{piece.priceNote}</p>}

            <div className="mt-6 border-y border-verdemoikato/20 py-5 xl:py-6">
              <p className="text-[0.95rem] leading-7 text-verdemoikato/75 xl:text-base">{piece.description}</p>
            </div>

            <dl className="grid grid-cols-2 gap-px bg-verdemoikato/15 border-b border-verdemoikato/15">
              <div className="bg-osso py-5 pr-4">
                <dt className="text-xs uppercase tracking-[0.13em] text-verdemoikato/50">{dict.productPage.madeLabel}</dt>
                <dd className="mt-2 text-sm leading-snug text-verdemoikato">{dict.productPage.madeValue}</dd>
              </div>
              <div className="bg-osso py-5 pl-4">
                <dt className="text-xs uppercase tracking-[0.13em] text-verdemoikato/50">{dict.productPage.availabilityLabel}</dt>
                <dd className="mt-2 text-sm leading-snug text-verdemoikato">{dict.productPage.availabilityValue}</dd>
              </div>
            </dl>

            <a
              href={waLink(message)}
              {...external}
              className="mt-6 flex min-h-14 w-full items-center justify-between bg-verdemoikato px-6 text-sm font-semibold uppercase tracking-[0.13em] text-osso transition-colors hover:bg-floresta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarelomoikato focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <span>{dict.productPage.order}</span>
              <span aria-hidden>→</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-verdemoikato/55">{dict.productPage.orderNote}</p>
          </div>
        </article>

        <section className="mt-20 border-t border-verdemoikato/20 pt-10 sm:mt-28 sm:pt-14">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-4xl text-verdemoikato sm:text-5xl">{dict.productPage.related}</h2>
            <Link scroll={true} href={`/${lang}/catalogo`} className="hidden min-h-11 items-center text-xs font-semibold uppercase tracking-[0.13em] text-amarelomoikato-700 sm:flex">
              {dict.productPage.seeAll} →
            </Link>
          </div>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedPiece) => (
              <ProductCard key={relatedPiece.slug} piece={relatedPiece} lang={lang} label={dict.catalogPage.viewPiece} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
