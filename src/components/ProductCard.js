import Image from "next/image";
import Link from "next/link";
import { formatBRL } from "../lib/money";
import { installmentsFor } from "../lib/pricing";

export default function ProductCard({ piece, lang, label, pricing, t, priority = false, featured = false, minimal = false, inverted = false }) {
  const installments = pricing && piece.priceCents != null ? installmentsFor(piece.priceCents, pricing) : null;
  const badge = !t ? null : piece.soldOut ? t.soldOut : piece.isUnique && piece.priceCents != null ? t.uniquePiece : null;

  return (
    <Link
      href={`/${lang}/catalogo/${piece.slug}`}
      scroll={true}
      className={`group block min-w-0 outline-none ring-amarelomoikato/70 ring-offset-4 focus-visible:ring-2 ${inverted ? "ring-offset-floresta" : "ring-offset-osso"} ${featured ? "col-span-2" : ""}`}
      aria-label={`${label}: ${piece.name}`}
    >
      <article>
        <div
          className={`relative overflow-hidden bg-areia-200 ${
            featured ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[4/5]"
          }`}
        >
          <Image
            src={piece.image}
            alt={piece.imageAlt}
            fill
            priority={priority}
            sizes={
              featured
                ? "(min-width: 1024px) 58vw, (min-width: 768px) 66vw, 100vw"
                : "(min-width: 1024px) 29vw, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025] motion-reduce:transition-none"
            style={{ objectPosition: piece.imagePosition ?? "center" }}
          />
          {badge && (
            <span className={`absolute left-3 top-3 z-10 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${piece.soldOut ? "bg-osso/90 text-verdemoikato/70" : "bg-verdemoikato text-osso"}`}>
              {badge}
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-floresta/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />
        </div>
        <div className={`grid grid-cols-[1fr_auto] gap-2 border-b py-3 sm:gap-4 sm:py-4 ${inverted ? "border-osso/20" : "border-verdemoikato/20"}`}>
          <div className="min-w-0">
            <h3 className={`font-display leading-tight ${featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-2xl"} ${inverted ? "text-osso" : "text-verdemoikato"}`}>{piece.name}</h3>
            {!minimal && <p className={`mt-1 text-xs uppercase tracking-[0.14em] ${inverted ? "text-osso/55" : "text-verdemoikato/55"}`}>{label}</p>}
          </div>
          <div className="pt-1 text-right">
            <span className={`block text-xs sm:text-sm ${inverted ? "text-osso/80" : "text-verdemoikato"}`}>
              {piece.hasPriceRange && t ? `${t.from} ` : ""}
              {piece.priceCents != null ? formatBRL(piece.priceCents) : piece.price}
            </span>
            {installments && (
              <span className={`block text-[0.68rem] ${inverted ? "text-osso/55" : "text-verdemoikato/55"}`}>
                {installments.count}x {formatBRL(installments.eachCents)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
