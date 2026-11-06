import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../../lib/auth/admin";
import { getOrderForAdmin } from "../../../../../lib/admin-products";
import { formatBRL } from "../../../../../lib/money";
import ShipOrderForm from "../../../../../components/admin/ShipOrderForm";
import { ORDER_STATUS } from "../../../../../lib/order-status";

export const metadata = { title: "Pedido" };

const formatCpf = (cpf) => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

export default async function OrderDetailPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) notFound();
  const order = await getOrderForAdmin(orderId);
  if (!order) notFound();
  const status = ORDER_STATUS[order.status];
  const a = order.address ?? {};

  return (
    <>
      <Link href="/admin/pedidos" className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60 hover:text-verdemoikato">
        ← Pedidos
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-4xl font-light text-verdemoikato">Pedido #{order.id}</h1>
        <span className={`px-2 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] ${status.className}`}>{status.label}</span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="border border-verdemoikato/15 bg-white/50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Itens</h2>
          <ul className="mt-3 divide-y divide-verdemoikato/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-2 text-sm">
                <span>
                  {item.qty}× {item.nameSnapshot}
                  {item.labelSnapshot && <span className="text-verdemoikato/55"> · {item.labelSnapshot}</span>}
                </span>
                <span>{formatBRL(item.unitPriceCents * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-verdemoikato/15 pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-verdemoikato/60">Subtotal</dt><dd>{formatBRL(order.subtotalCents)}</dd></div>
            <div className="flex justify-between"><dt className="text-verdemoikato/60">Frete ({order.shippingService})</dt><dd>{formatBRL(order.shippingCents)}</dd></div>
            <div className="flex justify-between font-medium"><dt>Total</dt><dd>{formatBRL(order.totalCents)}</dd></div>
          </dl>
          {order.giftWrap && (
            <p className="mt-4 border-l-2 border-amarelomoikato bg-amarelomoikato/10 px-3 py-2 text-sm">
              <strong>Embalar para presente</strong> (caixa Moikato com laço e cartão)
            </p>
          )}
          {order.giftMessage && (
            <p className="mt-4 border-l-2 border-amarelomoikato bg-amarelomoikato/10 px-3 py-2 text-sm">
              <strong>Mensagem para presente:</strong> {order.giftMessage}
            </p>
          )}
        </section>

        <div className="space-y-5">
          <section className="border border-verdemoikato/15 bg-white/50 p-5 text-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Cliente</h2>
            <p className="mt-3 font-medium">{order.customerName}</p>
            <p>{order.email}</p>
            {order.phone && <p>{order.phone}</p>}
            <p className="text-verdemoikato/60">CPF {formatCpf(order.cpf)}</p>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60">Entrega</h3>
            <p className="mt-1">
              {a.street}, {a.number}
              {a.complement && ` — ${a.complement}`}
              <br />
              {a.district} · {a.city}/{a.uf}
              <br />
              CEP {a.cep}
            </p>
          </section>
          {["paid", "shipped"].includes(order.status) && <ShipOrderForm orderId={order.id} trackingCode={order.trackingCode} />}
        </div>
      </div>
    </>
  );
}
