// Pedidos: o servidor nunca confia no navegador — relê preço e estoque no
// banco, reserva o estoque enquanto o pagamento está pendente e só baixa o
// estoque quando o Asaas confirma o pagamento (webhook).
import "server-only";
import { and, asc, eq, gt, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "./db";
import {
  orderItems,
  orders,
  productImages,
  productTranslations,
  products,
  productVariants,
  stockReservations,
} from "./db/schema";

export const RESERVATION_MINUTES = 60;

// items: [{ variantId, qty }] → linhas com preço/estoque atuais do banco.
export async function loadCartLines(items, lang) {
  const wanted = new Map();
  for (const item of items ?? []) {
    const id = Number(item?.variantId);
    const qty = Number(item?.qty);
    if (Number.isInteger(id) && id > 0 && Number.isInteger(qty) && qty > 0) {
      wanted.set(id, Math.min((wanted.get(id) ?? 0) + qty, 20));
    }
  }
  if (wanted.size === 0) return [];
  const ids = [...wanted.keys()];

  const rows = await db
    .select({ variant: productVariants, product: products, t: productTranslations })
    .from(productVariants)
    .innerJoin(products, eq(products.id, productVariants.productId))
    .innerJoin(
      productTranslations,
      and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, lang))
    )
    .where(and(inArray(productVariants.id, ids), eq(products.status, "active")));

  const productIds = [...new Set(rows.map((row) => row.product.id))];
  const [images, reserved] = await Promise.all([
    productIds.length
      ? db
          .select({ productId: productImages.productId, url: productImages.url })
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
          .orderBy(asc(productImages.position), asc(productImages.id))
      : [],
    db
      .select({ variantId: stockReservations.variantId, qty: sql`sum(${stockReservations.qty})`.mapWith(Number) })
      .from(stockReservations)
      .where(and(inArray(stockReservations.variantId, ids), gt(stockReservations.expiresAt, new Date())))
      .groupBy(stockReservations.variantId),
  ]);
  const reservedBy = new Map(reserved.map((r) => [r.variantId, r.qty]));
  const isEn = lang === "en";

  return rows.map(({ variant, product, t }) => {
    const available = variant.stock == null ? null : Math.max(variant.stock - (reservedBy.get(variant.id) ?? 0), 0);
    const qty = wanted.get(variant.id);
    return {
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      name: t.name,
      label: (isEn ? variant.labelEn : variant.labelPt) ?? variant.labelPt ?? null,
      image: images.find((image) => image.productId === product.id)?.url ?? null,
      unitPriceCents: variant.priceCents,
      qty,
      available,
      weightG: product.weightG,
      packageId: product.packageId,
      ok: variant.priceCents != null && (available == null || available >= qty),
    };
  });
}

// Cria o pedido "pending" + itens + reservas. Retorna o id.
export async function createPendingOrder({ lines, customer, address, shipping, discountCents, giftMessage, lang }) {
  const subtotalCents = lines.reduce((sum, line) => sum + line.unitPriceCents * line.qty, 0);
  const totalCents = subtotalCents + shipping.priceCents - discountCents;

  const [order] = await db
    .insert(orders)
    .values({
      status: "pending",
      customerName: customer.name,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
      address,
      subtotalCents,
      shippingCents: shipping.priceCents,
      discountCents,
      totalCents,
      shippingService: shipping.label,
      giftMessage,
      locale: lang,
    })
    .returning({ id: orders.id });

  const expiresAt = new Date(Date.now() + RESERVATION_MINUTES * 60_000);
  await db.batch([
    db.insert(orderItems).values(
      lines.map((line) => ({
        orderId: order.id,
        variantId: line.variantId,
        nameSnapshot: line.name,
        labelSnapshot: line.label,
        unitPriceCents: line.unitPriceCents,
        qty: line.qty,
      }))
    ),
    db.insert(stockReservations).values(
      lines.map((line) => ({ orderId: order.id, variantId: line.variantId, qty: line.qty, expiresAt }))
    ),
  ]);

  return { id: order.id, subtotalCents, totalCents };
}

export async function attachCheckout(orderId, checkoutId) {
  await db.update(orders).set({ asaasCheckoutId: checkoutId }).where(eq(orders.id, orderId));
}

// Falha ao gerar o pagamento: libera a reserva e cancela o pedido.
export async function cancelPendingOrder(orderId) {
  await db.batch([
    db.delete(stockReservations).where(eq(stockReservations.orderId, orderId)),
    db.update(orders).set({ status: "cancelled" }).where(and(eq(orders.id, orderId), eq(orders.status, "pending"))),
  ]);
}

// Pagamento confirmado: baixa estoque, remove reservas, marca como pago.
export async function markOrderPaid(orderId, paymentId) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order || order.status !== "pending") return false;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

  await db.batch([
    db
      .update(orders)
      .set({ status: "paid", paidAt: new Date(), ...(paymentId ? { asaasPaymentId: paymentId } : {}) })
      .where(eq(orders.id, orderId)),
    db.delete(stockReservations).where(eq(stockReservations.orderId, orderId)),
    ...items
      .filter((item) => item.variantId)
      .map((item) =>
        db
          .update(productVariants)
          .set({ stock: sql`greatest(${productVariants.stock} - ${item.qty}, 0)` })
          .where(and(eq(productVariants.id, item.variantId), isNotNull(productVariants.stock)))
      ),
  ]);
  return true;
}

export async function expireOrder(orderId, status = "expired") {
  await db.batch([
    db.delete(stockReservations).where(eq(stockReservations.orderId, orderId)),
    db.update(orders).set({ status }).where(and(eq(orders.id, orderId), eq(orders.status, "pending"))),
  ]);
}

export async function findOrderByCheckout(checkoutId) {
  const [order] = await db.select({ id: orders.id }).from(orders).where(eq(orders.asaasCheckoutId, checkoutId));
  return order ?? null;
}
