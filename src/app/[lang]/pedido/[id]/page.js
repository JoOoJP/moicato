import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDictionary, hasLocale } from "../../dictionaries";
import Header from "../../../../components/Header";
import OrderStatusClient from "../../../../components/shop/OrderStatusClient";
import { db } from "../../../../lib/db";
import { orders } from "../../../../lib/db/schema";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.order.metaTitle, robots: { index: false, follow: false } };
}

// Página de retorno do pagamento. Mostra só número e status — nenhum dado
// pessoal, já que o id do pedido aparece na URL.
export default async function OrderPage({ params }) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) notFound();

  const [dict, [order]] = await Promise.all([
    getDictionary(lang),
    db.select({ id: orders.id, status: orders.status }).from(orders).where(eq(orders.id, orderId)),
  ]);
  if (!order) notFound();
  const t = dict.order;

  return (
    <>
      <Header dict={dict.header} lang={lang} alwaysSolid />
      <main id="topo" className="flex-1 bg-osso pt-[60px] md:pt-20">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:py-24">
          <p className="eyebrow text-amarelomoikato-700">Moikato</p>
          <h1 className="mt-3 font-display text-5xl font-light text-verdemoikato">{t.title.replace("{id}", order.id)}</h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-verdemoikato/75">{t[order.status] ?? t.pending}</p>
          <OrderStatusClient status={order.status} />
          <Link
            href={`/${lang}/catalogo`}
            className="mt-10 inline-flex min-h-12 items-center bg-verdemoikato px-6 text-xs font-semibold uppercase tracking-[0.13em] text-osso hover:bg-floresta"
          >
            {t.backToShop}
          </Link>
        </div>
      </main>
    </>
  );
}
