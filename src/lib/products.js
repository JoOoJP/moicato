// Leitura do catálogo no Neon, no mesmo formato que os componentes já usavam
// (name, price, priceNote, description, image, imagePosition, imageAlt…).
import "server-only";
import { cache } from "react";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { productImages, productTranslations, products, productVariants } from "./db/schema";
import { formatBRL } from "./money";
import { stockState } from "./pricing";

// Preço em R$ (quando definido) tem prioridade; senão cai no texto legado.
function toOffer(variant, legacyLabel) {
  if (variant?.priceCents != null) {
    return { price: (variant.priceCents / 100).toFixed(2), currency: "BRL" };
  }
  const legacy = legacyLabel?.replace(/[^0-9.]/g, "");
  return legacy ? { price: legacy, currency: "GBP" } : null;
}

export const getCatalogPieces = cache(async (lang) => {
  const rows = await db
    .select({ product: products, t: productTranslations })
    .from(products)
    .innerJoin(
      productTranslations,
      and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, lang))
    )
    .where(eq(products.status, "active"))
    .orderBy(asc(products.sortOrder), asc(products.id));

  if (rows.length === 0) return [];
  const ids = rows.map(({ product }) => product.id);

  const [images, variants] = await Promise.all([
    db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, ids))
      .orderBy(asc(productImages.position)),
    db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, ids))
      .orderBy(asc(productVariants.position), asc(productVariants.id)),
  ]);

  const isEn = lang === "en";

  return rows.map(({ product, t }) => {
    const pieceImages = images
      .filter((image) => image.productId === product.id)
      .map((image) => ({
        src: image.url,
        alt: (isEn ? image.altEn : image.altPt) ?? t.name,
        position: image.objectPosition ?? "center",
      }));
    const pieceVariants = variants
      .filter((variant) => variant.productId === product.id)
      .map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        label: (isEn ? variant.labelEn : variant.labelPt) ?? variant.labelPt ?? null,
        priceCents: variant.priceCents,
        stock: variant.stock,
        state: stockState(variant),
      }));
    const main = pieceImages[0];
    const firstVariant = pieceVariants[0];
    const prices = pieceVariants.map((v) => v.priceCents).filter((cents) => cents != null);
    const buyable = pieceVariants.filter((v) => v.state === "available" || v.state === "low");

    return {
      slug: product.slug,
      category: product.category,
      name: t.name,
      description: t.description,
      // Texto de preço: R$ (menor preço) quando definido, senão o legado (£).
      price: prices.length ? formatBRL(Math.min(...prices)) : t.legacyPriceLabel ?? "",
      priceNote: prices.length ? undefined : t.legacyPriceNote ?? undefined,
      offer: toOffer(firstVariant, t.legacyPriceLabel),
      image: main?.src,
      imageAlt: main?.alt,
      imagePosition: main?.position,
      images: pieceImages,
      variants: pieceVariants,
      details: t.details,
      care: t.care,
      // Menor preço em R$ (null = ainda só preço legado).
      priceCents: prices.length ? Math.min(...prices) : null,
      hasPriceRange: new Set(prices).size > 1,
      soldOut: prices.length > 0 && buyable.length === 0 && pieceVariants.every((v) => v.state !== "unpriced"),
      isUnique: product.isUnique,
      madeToOrder: product.madeToOrder,
      packageId: product.packageId,
      weightG: product.weightG,
    };
  });
});

export async function getPieceBySlug(lang, slug) {
  const pieces = await getCatalogPieces(lang);
  return pieces.find((piece) => piece.slug === slug);
}

export async function getRelatedPieces(lang, piece, limit = 3) {
  const pieces = await getCatalogPieces(lang);
  return pieces
    .filter((candidate) => candidate.slug !== piece.slug)
    .sort((a, b) => Number(b.category === piece.category) - Number(a.category === piece.category))
    .slice(0, limit);
}

export async function getActiveSlugs() {
  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.status, "active"))
    .orderBy(asc(products.sortOrder));
  return rows.map(({ slug }) => slug);
}
