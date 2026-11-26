// Pagamento via InfinitePay Checkout (link hospedado: Pix e cartão).
// Ref.: https://www.infinitepay.io/checkout-documentacao
// - POST /links cria o link; POST /payment_check confirma o pagamento.
// - O webhook NÃO tem assinatura: todo aviso é confirmado no /payment_check.
// - Sem sandbox: teste final é com transação real (mínimo R$ 1,00).
import "server-only";

const API = "https://api.checkout.infinitepay.io";
const HANDLE = process.env.INFINITEPAY_HANDLE; // InfiniteTag sem o "$"
const API_KEY = process.env.INFINITEPAY_API_KEY; // inchk_… (necessária para as `options`)
export const RESERVATION_MINUTES = 60;

function headers() {
  return { "Content-Type": "application/json", ...(API_KEY ? { "X-Api-Key": API_KEY } : {}) };
}

const digits = (value) => String(value ?? "").replace(/\D/g, "");

// order: { id, items: [{ name, qty, unitPriceCents }], shippingCents, customer, address }
// settings: { maxInstallments, pixDiscountPercent }
export async function createPaymentLink({ order, siteUrl, lang, settings }) {
  if (!HANDLE && !API_KEY) throw new Error("Pagamento não configurado");

  const items = order.items.map((item) => ({
    quantity: item.qty,
    price: item.unitPriceCents,
    description: item.name.slice(0, 120),
  }));
  if (order.shippingCents > 0) items.push({ quantity: 1, price: order.shippingCents, description: "Frete" });

  const phone = digits(order.customer.phone);
  const webhookToken = process.env.INFINITEPAY_WEBHOOK_TOKEN;
  const body = {
    ...(HANDLE ? { handle: HANDLE } : {}),
    items,
    order_nsu: String(order.id),
    redirect_url: `${siteUrl}/${lang}/pedido/${order.id}`,
    ...(webhookToken
      ? {
          webhook: {
            url: `${siteUrl}/api/infinitepay/webhook?token=${encodeURIComponent(webhookToken)}`,
            events: ["paid", "canceled", "refunded"],
          },
        }
      : {}),
    customer: {
      name: order.customer.name,
      email: order.customer.email,
      ...(phone ? { phone_number: `+55${phone}` } : {}),
    },
    address: {
      cep: digits(order.address.cep),
      street: order.address.street,
      number: order.address.number,
      neighborhood: order.address.district,
      city: order.address.city,
      state: order.address.uf,
      ...(order.address.complement ? { complement: order.address.complement } : {}),
    },
    // `options` exigem a chave de API: link de uso único, expirando junto com a
    // reserva de estoque, parcelas sem juros (taxa absorvida) e desconto no Pix.
    ...(API_KEY
      ? {
          options: {
            single_payment: true,
            valid_until: new Date(Date.now() + RESERVATION_MINUTES * 60_000).toISOString(),
            payment_methods_enabled: ["credit_card", "pix"],
            assured_installments: Math.min(Math.max(settings.maxInstallments ?? 1, 0), 12),
            ...(settings.pixDiscountPercent > 0 ? { discounts: { pix: settings.pixDiscountPercent } } : {}),
          },
        }
      : {}),
  };

  const response = await fetch(`${API}/links`, { method: "POST", headers: headers(), body: JSON.stringify(body), cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.url) throw new Error(`InfinitePay ${response.status}: ${JSON.stringify(data)}`);
  // A resposta traz só a URL; o código do link é o último trecho dela.
  return { url: data.url, slug: data.slug ?? new URL(data.url).pathname.split("/").filter(Boolean).pop() ?? null };
}

// Confirma na InfinitePay se o pedido foi pago. Retorna null se não conferir.
export async function checkPayment({ orderNsu, transactionNsu, slug }) {
  const response = await fetch(`${API}/payment_check`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      ...(HANDLE ? { handle: HANDLE } : {}),
      order_nsu: String(orderNsu),
      transaction_nsu: transactionNsu,
      slug,
    }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) return null;
  return {
    paid: Boolean(data.paid),
    amountCents: data.amount,
    paidAmountCents: data.paid_amount,
    installments: data.installments,
    method: data.capture_method, // "pix" | "credit_card"
  };
}
