// Webhook do Asaas: confirma pagamento (baixa estoque) ou libera a reserva.
// Autenticado pelo token configurado no painel do Asaas (ASAAS_WEBHOOK_TOKEN).
import { revalidatePath } from "next/cache";
import { db } from "../../../../lib/db";
import { webhookEvents } from "../../../../lib/db/schema";
import { expireOrder, findOrderByCheckout, markOrderPaid } from "../../../../lib/orders";

export async function POST(request) {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!expected || request.headers.get("asaas-access-token") !== expected) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload?.event) return Response.json({ error: "bad request" }, { status: 400 });

  // Idempotência: o Asaas reenvia eventos.
  const eventId = String(payload.id ?? `${payload.event}:${payload.checkout?.id ?? payload.payment?.id}`);
  const inserted = await db
    .insert(webhookEvents)
    .values({ id: eventId, provider: "asaas", payload })
    .onConflictDoNothing()
    .returning({ id: webhookEvents.id });
  if (inserted.length === 0) return Response.json({ ok: true, duplicate: true });

  const checkoutId = payload.checkout?.id ?? payload.payment?.checkoutSession;
  const order = checkoutId ? await findOrderByCheckout(checkoutId) : null;
  if (!order) return Response.json({ ok: true, ignored: true });

  if (payload.event === "CHECKOUT_PAID") {
    if (await markOrderPaid(order.id, payload.payment?.id)) revalidatePath("/[lang]", "layout");
  } else if (payload.event === "CHECKOUT_EXPIRED") {
    await expireOrder(order.id, "expired");
  } else if (payload.event === "CHECKOUT_CANCELED") {
    await expireOrder(order.id, "cancelled");
  }

  return Response.json({ ok: true });
}
