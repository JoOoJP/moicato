// Pedidos vistos pelo próprio cliente — SEMPRE filtrados pelo e-mail da sessão.
import "server-only";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { db } from "./db";
import { orderItems, orders } from "./db/schema";

export async function listCustomerOrders(email) {
  const rows = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalCents: orders.totalCents,
      createdAt: orders.createdAt,
      trackingCode: orders.trackingCode,
    })
    .from(orders)
    // Pedidos que nunca chegaram a gerar pagamento (falha no checkout) não aparecem.
    .where(and(eq(orders.email, email), ne(orders.status, "cancelled")))
    .orderBy(desc(orders.createdAt))
    .limit(50);
  if (rows.length === 0) return [];
  const items = await db
    .select({ orderId: orderItems.orderId, name: orderItems.nameSnapshot, qty: orderItems.qty })
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((order) => order.id)));
  return rows.map((order) => ({ ...order, items: items.filter((item) => item.orderId === order.id) }));
}

export async function getCustomerOrder(id, email) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.email, email)));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { ...order, items };
}

export async function hasOrders(email) {
  const [row] = await db.select({ id: orders.id }).from(orders).where(eq(orders.email, email)).limit(1);
  return Boolean(row);
}
