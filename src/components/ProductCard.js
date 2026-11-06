import Image from "next/image";
import Link from "next/link";
import { formatBRL } from "../lib/money";
import { installmentsFor } from "../lib/pricing";

// Card de galeria: a peça é a protagonista. Proporção única, segunda foto no
// hover, nome em serifa, coleção discreta e preço — sem botões nem rótulos.
export default function ProductCard({ piece, lang, label, pricing, t, subline: sublineOverride, priority = false, featured = false, inverted = false }) {
  const installments = pricing && piece.priceCents != null ? installmentsFor(piece.priceCents, pricing) : null;
  const badge = !t ? null : piece.soldOut ? t.soldOut : piece.isUnique && piece.priceCents != null ? t.uniquePiece : null;
  const subline = sublineOverride !== undefined ? sublineOverride : piece.collection?.name ?? piece.kindName;
  const text = inverted ? "text-osso" : "text-verdemoikato";
  const muted = inverted ? "text-osso/60" : "text-verdemoikato/55";
  const sizes = featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 50vw";

  return (
    <Link
      href={`/${lang}/catalogo/${piece.slug}`}
      scroll={true}
      aria-label={`${label}: ${piece.name}`}
      className={`group block min-w-0 outline-none ring-amarelomoikato/70 ring-offset-4 focus-visible:ring-2 ${inverted ? "ring-offset-floresta" : "ring-offset-osso"} ${featured ? "sm:col-span-2" : ""}`}
    >
      <article>
        <div className={`relative overflow-hidden bg-areia-100 ${featured ? "aspect-[4/5] sm:aspect-[16/10]" : "aspect-[4/5]"}`}>
          {piece.image && (
            <Image
              src={piece.image}
              alt={piece.imageAlt ?? piece.name}
              fill
              priority={priority}
              sizes={sizes}
              className={`object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none ${piece.hoverImage ? "group-hover:opacity-0" : ""}`}
              style={{ objectPosition: piece.imagePosition ?? "center" }}
            />
          )}
          {piece.hoverImage && (
            <Image
              src={piece.hoverImage.src}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 motion-reduce:transition-none"
              style={{ objectPosition: piece.hoverImage.position ?? "center" }}
            />
          )}
          {badge && (
            <span className={`absolute left-3 top-3 bg-osso/90 px-2 py-1 text-[0.7rem] tracking-[0.06em] ${piece.soldOut ? "text-verdemoikato/60" : "text-verdemoikato"}`}>
              {badge}
            </span>
          )}
        </div>

        <div className="mt-3.5 flex items-start justify-between gap-3 sm:mt-4">
          <div className="min-w-0">
            <h3 className={`font-display leading-tight ${featured ? "text-2xl sm:text-3xl" : "text-[1.1rem] sm:text-[1.35rem]"} ${text}`}>{piece.name}</h3>
            {subline && <p className={`mt-1 text-[0.78rem] ${muted}`}>{subline}</p>}
          </div>
          <div className="shrink-0 pt-0.5 text-right">
            <p className={`text-sm ${text}`}>
              {piece.hasPriceRange && t ? <span className={`text-xs ${muted}`}>{t.from} </span> : null}
              {piece.priceCents != null ? formatBRL(piece.priceCents) : piece.price}
            </p>
            {installments && (
              <p className={`mt-0.5 text-[0.72rem] ${muted}`}>
                {installments.count}x {formatBRL(installments.eachCents)}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
