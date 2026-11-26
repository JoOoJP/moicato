// Webhook da InfinitePay. O aviso NÃO tem assinatura: autentica pelo token
// secreto na URL e confere todo pagamento na API (/payment_check) antes de
// marcar o pedido como pago. Resposta precisa sair em ~1 s; e-mails vão no after().
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "../../../../lib/db";
import { webhookEvents } from "../../../../lib/db/schema";
import { confirmPayment } from "../../../../lib/payments";
import { notifyOrderPaid } from "../../../../lib/email";

export async function POST(request) {
  const expected = process.env.INFINITEPAY_WEBHOOK_TOKEN;
  const token = new URL(request.url).searchParams.get("token");
  if (!expected || token !== expected) return Response.json({ error: "unauthorized" }, { status: 401 });

  const payload = await request.json().catch(() => null);
  const orderId = Number(payload?.order_nsu);
  if (!Number.isInteger(orderId) || orderId <= 0) return Response.json({ error: "bad request" }, { status: 400 });

  // Idempotência: a InfinitePay reenvia enquanto não recebe 2xx.
  const eventId = `infinitepay:${payload.transaction_nsu ?? payload.invoice_slug ?? orderId}`;
  await db.insert(webhookEvents).values({ id: eventId, provider: "infinitepay", payload }).onConflictDoNothing();

  const result = await confirmPayment(orderId, { transactionNsu: payload.transaction_nsu, slug: payload.invoice_slug });
  if (result === "paid" || result === "already") revalidatePath("/[lang]", "layout");
  if (result === "paid") after(() => notifyOrderPaid(orderId));

  return Response.json({ ok: true, result: result ?? "ignored" });
}
