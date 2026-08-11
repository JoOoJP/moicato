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
    <main id="topo" className="bg-osso pt-20">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 sm:pb-28 sm:pt-12">
        <nav aria-label={dict.productPage.breadcrumbLabel} className="mb-7 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-verdemoikato/55">
          <Link className="min-h-11 content-center hover:text-verdemoikato" href={`/${lang}/catalogo`}>
            {dict.productPage.backToCatalog}
          </Link>
          <span aria-hidden>/</span>
          <span>{category}</span>
        </nav>

        <article className="grid gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.75fr)] lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-areia-200 lg:aspect-[5/6]">
            <Image
              src={piece.image}
              alt={piece.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-contain"
              style={{ objectPosition: piece.imagePosition ?? "center" }}
            />
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-amarelomoikato-700">{category}</p>
            <h1 className="mt-4 font-display text-5xl font-light leading-[0.98] text-verdemoikato sm:text-6xl">
              {piece.name}
            </h1>
            <p className="mt-6 font-display text-3xl text-verdemoikato">{piece.price}</p>
            {piece.priceNote && <p className="mt-1 text-sm text-verdemoikato/60">{piece.priceNote}</p>}

            <div className="mt-8 border-y border-verdemoikato/20 py-7">
              <p className="text-base leading-8 text-verdemoikato/75">{piece.description}</p>
            </div>

            <dl className="grid grid-cols-2 gap-px bg-verdemoikato/15 border-b border-verdemoikato/15">
              <div className="bg-osso py-5 pr-4">
                <dt className="text-xs uppercase tracking-[0.13em] text-verdemoikato/50">{dict.productPage.madeLabel}</dt>
                <dd className="mt-2 text-sm text-verdemoikato">{dict.productPage.madeValue}</dd>
              </div>
              <div className="bg-osso py-5 pl-4">
                <dt className="text-xs uppercase tracking-[0.13em] text-verdemoikato/50">{dict.productPage.availabilityLabel}</dt>
                <dd className="mt-2 text-sm text-verdemoikato">{dict.productPage.availabilityValue}</dd>
              </div>
            </dl>

            <a
              href={waLink(message)}
              {...external}
              className="mt-8 flex min-h-14 w-full items-center justify-between bg-verdemoikato px-6 text-sm font-semibold uppercase tracking-[0.13em] text-osso transition-colors hover:bg-floresta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarelomoikato focus-visible:ring-offset-2 motion-reduce:transition-none"
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
            <Link href={`/${lang}/catalogo`} className="hidden min-h-11 items-center text-xs font-semibold uppercase tracking-[0.13em] text-amarelomoikato-700 sm:flex">
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
