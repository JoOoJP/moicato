import Link from "next/link";
import { requireAdmin } from "../../../../lib/auth/admin";
import { listOrdersForAdmin } from "../../../../lib/admin-products";
import { formatBRL } from "../../../../lib/money";
import { ORDER_STATUS } from "../../../../lib/order-status";

export const metadata = { title: "Pedidos" };


const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

export default async function OrdersPage() {
  await requireAdmin();
  const list = await listOrdersForAdmin();

  return (
    <>
      <h1 className="font-display text-4xl font-light text-verdemoikato sm:text-5xl">Pedidos</h1>
      {list.length === 0 ? (
        <div className="mt-6 border border-dashed border-verdemoikato/25 px-6 py-14 text-center text-sm text-verdemoikato/60">
          Nenhum pedido ainda. Eles aparecem aqui assim que as vendas abrirem.
        </div>
      ) : (
        <div className="mt-6 divide-y divide-verdemoikato/10 border border-verdemoikato/15 bg-white/50">
          {list.map((order) => {
            const status = ORDER_STATUS[order.status];
            return (
              <Link key={order.id} href={`/admin/pedidos/${order.id}`} className="grid grid-cols-[70px_1fr_auto] items-center gap-4 px-4 py-3 hover:bg-verdemoikato/[0.03] sm:grid-cols-[70px_1fr_180px_120px_110px]">
                <span className="font-mono text-sm">#{order.id}</span>
                <span className="truncate">{order.customerName}</span>
                <span className={`w-fit px-2 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] ${status.className}`}>{status.label}</span>
                <span className="hidden text-sm sm:block">{formatBRL(order.totalCents)}</span>
                <span className="hidden text-xs text-verdemoikato/55 sm:block">{date.format(order.createdAt)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
