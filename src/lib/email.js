// E-mails transacionais via Resend (API REST, sem SDK). Desligado enquanto
// RESEND_API_KEY não existir: só registra no log. Falha de e-mail NUNCA
// derruba o pedido — quem chama não precisa tratar erro.
import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { orderItems, orders } from "./db/schema";
import { COMPANY } from "./empresa";
import { newOrderAdminEmail, orderConfirmedEmail, orderShippedEmail } from "./email-templates";

const FROM = process.env.EMAIL_FROM ?? "Moikato <pedidos@moikato.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || COMPANY.serviceEmail || undefined;
// Quem recebe o aviso de pedido novo (vários: separados por vírgula).
const NOTIFY = (process.env.ORDER_NOTIFY_EMAIL ?? "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

export const emailReady = Boolean(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, replyTo = REPLY_TO }) {
  if (!emailReady) {
    console.info(`[email] desligado (sem RESEND_API_KEY): "${subject}" → ${[].concat(to).length} destinatário(s)`);
    return { skipped: true };
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [].concat(to), subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`Resend ${response.status}: ${JSON.stringify(data)}`);
    return { id: data.id };
  } catch (error) {
    console.error("[email] falha ao enviar", subject, error);
    return { error: true };
  }
}

async function loadOrder(orderId) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { order, items };
}

// Pagamento confirmado: e-mail para o cliente + aviso para a loja.
export async function notifyOrderPaid(orderId) {
  const data = await loadOrder(orderId);
  if (!data) return;
  const { order, items } = data;
  const customer = orderConfirmedEmail(order, items);
  const jobs = [sendEmail({ to: order.email, ...customer })];
  if (NOTIFY.length) {
    const admin = newOrderAdminEmail(order, items);
    jobs.push(sendEmail({ to: NOTIFY, ...admin, replyTo: order.email }));
  }
  await Promise.all(jobs);
}

// Pedido postado: e-mail com código e link de rastreio.
export async function notifyOrderShipped(orderId) {
  const data = await loadOrder(orderId);
  if (!data?.order.trackingCode) return;
  await sendEmail({ to: data.order.email, ...orderShippedEmail(data.order) });
}
