// Confirmação de pagamento — usada pelo webhook e pelo retorno do cliente à
// página do pedido. Nunca confia no aviso recebido: sempre confere na API da
// InfinitePay e compara o valor com o total do pedido.
import "server-only";
import { checkPayment } from "./infinitepay";
import { getOrder, markOrderPaid } from "./orders";

// Retorna "paid" (acabou de ser pago), "already" (já estava pago) ou null.
export async function confirmPayment(orderId, { transactionNsu, slug } = {}) {
  const order = await getOrder(orderId);
  if (!order) return null;
  if (order.status !== "pending") return order.status === "paid" ? "already" : null;

  const result = await checkPayment({ orderNsu: order.id, transactionNsu, slug: slug ?? order.paymentSlug });
  if (!result?.paid) return null;
  // O valor cobrado tem que ser o do pedido (o desconto do Pix reduz só o paid_amount).
  if (result.amountCents !== order.totalCents) {
    console.error(`[pagamento] valor divergente no pedido ${order.id}: ${result.amountCents} ≠ ${order.totalCents}`);
    return null;
  }

  const ok = await markOrderPaid(order.id, {
    transaction: transactionNsu ?? null,
    paidAmountCents: result.paidAmountCents,
    method: result.method,
    installments: result.installments,
  });
  return ok ? "paid" : "already";
}
