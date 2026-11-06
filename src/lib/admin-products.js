// Leituras do painel (todas as peças, qualquer status). Só use em páginas do
// /admin, que já passaram por requireAdmin().
import "server-only";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { orderItems, orders, packages, productImages, productTranslations, products, productVariants } from "./db/schema";

export async function listProductsForAdmin() {
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id));
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);

  const [names, variants, images] = await Promise.all([
    db
      .select({ productId: productTranslations.productId, name: productTranslations.name })
      .from(productTranslations)
      .where(and(inArray(productTranslations.productId, ids), eq(productTranslations.locale, "pt-BR"))),
    db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, ids))
      .orderBy(asc(productVariants.position), asc(productVariants.id)),
    db
      .select({ productId: productImages.productId, url: productImages.url })
      .from(productImages)
      .where(inArray(productImages.productId, ids))
      .orderBy(asc(productImages.position), asc(productImages.id)),
  ]);

  return rows.map((product) => {
    const own = variants.filter((v) => v.productId === product.id);
    const tracked = own.filter((v) => v.stock != null);
    return {
      ...product,
      name: names.find((t) => t.productId === product.id)?.name ?? product.slug,
      thumbnail: images.find((image) => image.productId === product.id)?.url ?? null,
      variants: own,
      priceMissing: own.length === 0 || own.some((v) => v.priceCents == null),
      // null = estoque não controlado em nenhuma variação.
      stockTotal: tracked.length ? tracked.reduce((sum, v) => sum + v.stock, 0) : null,
    };
  });
}

export async function getProductForAdmin(id) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) return null;

  const [translations, variants, images] = await Promise.all([
    db.select().from(productTranslations).where(eq(productTranslations.productId, id)),
    db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, id))
      .orderBy(asc(productVariants.position), asc(productVariants.id)),
    db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id))
      .orderBy(asc(productImages.position), asc(productImages.id)),
  ]);

  return {
    ...product,
    pt: translations.find((t) => t.locale === "pt-BR") ?? {},
    en: translations.find((t) => t.locale === "en") ?? {},
    variants,
    images,
  };
}

export async function listPackages() {
  return db.select().from(packages).orderBy(asc(packages.name));
}

export async function listOrdersForAdmin(limit = 100) {
  return db
    .select({
      id: orders.id,
      status: orders.status,
      customerName: orders.customerName,
      totalCents: orders.totalCents,
      createdAt: orders.createdAt,
      paidAt: orders.paidAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}

export async function getOrderForAdmin(id) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { ...order, items };
}
