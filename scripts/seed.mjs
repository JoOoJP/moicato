// Migra o catálogo atual (dicionários + src/lib/catalog.js) para o Neon.
// Idempotente: pode rodar de novo — atualiza pelo slug, não duplica.
// Uso: npm run db:seed
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import ptBR from "../src/dictionaries/pt-BR.js";
import en from "../src/dictionaries/en.js";
import { CATALOG_ITEMS } from "../src/lib/catalog.js";
import {
  productImages,
  productTranslations,
  products,
  productVariants,
} from "../src/lib/db/schema.js";

try {
  process.loadEnvFile(".env.local");
} catch {
  // Sem .env.local — usa as variáveis do ambiente.
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL não definida.");
  process.exit(1);
}

const db = drizzle(neon(process.env.DATABASE_URL));
const ptPieces = ptBR.collection.pieces;
const enPieces = en.collection.pieces;

if (ptPieces.length !== CATALOG_ITEMS.length || enPieces.length !== CATALOG_ITEMS.length) {
  console.error("Dicionários e CATALOG_ITEMS com tamanhos diferentes — abortando.");
  process.exit(1);
}

for (const [index, item] of CATALOG_ITEMS.entries()) {
  const pt = ptPieces[index];
  const enPiece = enPieces[index];

  const [product] = await db
    .insert(products)
    .values({ slug: item.slug, category: item.category, status: "active", sortOrder: index })
    .onConflictDoUpdate({
      target: products.slug,
      set: { category: item.category, sortOrder: index },
    })
    .returning({ id: products.id });

  for (const [locale, piece] of [["pt-BR", pt], ["en", enPiece]]) {
    const values = {
      name: piece.name,
      description: piece.description ?? null,
      legacyPriceLabel: piece.price ?? null,
      legacyPriceNote: piece.priceNote ?? null,
    };
    await db
      .insert(productTranslations)
      .values({ productId: product.id, locale, ...values })
      .onConflictDoUpdate({
        target: [productTranslations.productId, productTranslations.locale],
        set: values,
      });
  }

  // Variação padrão: preço em R$ e estoque ficam null até serem definidos.
  await db
    .insert(productVariants)
    .values({ productId: product.id, sku: `MK-${item.slug.toUpperCase()}` })
    .onConflictDoNothing({ target: productVariants.sku });

  await db.delete(productImages).where(eq(productImages.productId, product.id));
  await db.insert(productImages).values({
    productId: product.id,
    url: pt.image,
    objectPosition: pt.imagePosition ?? null,
    altPt: pt.imageAlt ?? null,
    altEn: enPiece.imageAlt ?? null,
    position: 0,
  });

  console.log(`✓ ${item.slug}`);
}

console.log(`\n${CATALOG_ITEMS.length} peças sincronizadas.`);
