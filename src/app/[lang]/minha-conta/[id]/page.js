import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { getCustomerEmail } from "../../../../lib/customer-access";
import { getCustomerOrder } from "../../../../lib/customer-orders";
import { trackingUrl } from "../../../../lib/email-templates";
import { formatBRL } from "../../../../lib/money";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.account.metaTitle, robots: { index: false, follow: false } };
}

const STEPS = ["pending", "paid", "shipped", "delivered"];

export default async function CustomerOrderPage({ params }) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const email = await getCustomerEmail();
  if (!email) redirect(`/${lang}/minha-conta`);
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) notFound();

  // Só encontra pedidos do e-mail logado.
  const [dict, order] = await Promise.all([getDictionary(lang), getCustomerOrder(orderId, email)]);
  if (!order) notFound();
  const t = dict.account;
  const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" });
  const stepIndex = STEPS.indexOf(order.status);
  const a = order.address ?? {};

  return (
    <>
      <Header dict={dict.header} lang={lang} alwaysSolid />
      <main id="topo" className="flex-1 bg-osso pt-[60px] md:pt-20">
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:pt-16">
          <Link href={`/${lang}/minha-conta`} className="text-xs uppercase tracking-[0.12em] text-verdemoikato/55 hover:text-verdemoikato">
            ← {t.back}
          </Link>
          <h1 className="mt-3 font-display text-[2.6rem] font-light leading-none text-verdemoikato sm:text-5xl">{t.order.replace("{id}", order.id)}</h1>
          <p className="mt-2 text-sm text-verdemoikato/55">{t.placedOn.replace("{date}", date.format(order.createdAt))}</p>

          {/* Linha do tempo */}
          {stepIndex >= 0 ? (
            <ol className="mt-8 grid grid-cols-4 gap-2">
              {STEPS.map((step, index) => {
                const done = index <= stepIndex;
                return (
                  <li key={step}>
                    <div className={`h-[3px] ${done ? "bg-verdemoikato" : "bg-verdemoikato/15"}`} />
                    <p className={`mt-2 text-[0.75rem] leading-snug ${index === stepIndex ? "font-medium text-verdemoikato" : done ? "text-verdemoikato/70" : "text-verdemoikato/40"}`}>
                      {t.statuses[step]}
                    </p>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-8 border-l-2 border-verdemoikato/30 bg-verdemoikato/5 px-4 py-3 text-sm text-verdemoikato/75">{t.statuses[order.status]}</p>
          )}

          {order.trackingCode && (
            <section className="mt-8 border border-verdemoikato/15 bg-white/50 p-5">
              <p className="text-[0.72rem] tracking-[0.14em] text-amarelomoikato-700">{t.tracking.toUpperCase()}</p>
              <p className="mt-1 font-mono text-lg text-verdemoikato">{order.trackingCode}</p>
              {order.shippingService && <p className="text-sm text-verdemoikato/55">{order.shippingService}</p>}
              <a
                href={trackingUrl(order.trackingCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center bg-floresta px-5 text-[0.75rem] tracking-[0.14em] text-osso hover:bg-verdemoikato"
              >
                {t.track.toUpperCase()} ↗
              </a>
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-display text-2xl text-verdemoikato">{t.items}</h2>
            <ul className="mt-3 divide-y divide-verdemoikato/10 border-y border-verdemoikato/10">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-3 text-[0.95rem]">
                  <span className="text-verdemoikato">
                    {item.qty > 1 && `${item.qty}× `}
                    {item.nameSnapshot}
                    {item.labelSnapshot && <span className="text-verdemoikato/55"> · {item.labelSnapshot}</span>}
                  </span>
                  <span className="shrink-0 text-verdemoikato">{formatBRL(item.unitPriceCents * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-verdemoikato/70"><dt>{t.subtotal}</dt><dd>{formatBRL(order.subtotalCents)}</dd></div>
              <div className="flex justify-between text-verdemoikato/70">
                <dt>{t.shipping}{order.shippingService ? ` (${order.shippingService})` : ""}</dt>
                <dd>{formatBRL(order.shippingCents)}</dd>
              </div>
              {order.discountCents > 0 && (
                <div className="flex justify-between text-amarelomoikato-700">
                  <dt>{t.discount}{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
                  <dd>− {formatBRL(order.discountCents)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-verdemoikato/15 pt-2 font-display text-xl text-verdemoikato"><dt>{t.total}</dt><dd>{formatBRL(order.totalCents)}</dd></div>
            </dl>
          </section>

          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-[0.72rem] tracking-[0.14em] text-amarelomoikato-700">{t.deliverTo.toUpperCase()}</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-verdemoikato/80">
                {order.customerName}
                <br />
                {a.street}, {a.number}
                {a.complement && ` — ${a.complement}`}
                <br />
                {a.district} · {a.city}/{a.uf} · CEP {a.cep}
              </p>
            </div>
            {(order.giftWrap || order.giftMessage) && (
              <div>
                <h2 className="text-[0.72rem] tracking-[0.14em] text-amarelomoikato-700">{t.gift.toUpperCase()}</h2>
                {order.giftMessage && (
                  <p className="mt-2 font-display text-lg italic text-verdemoikato/80">
                    “{order.giftMessage}”
                  </p>
                )}
              </div>
            )}
          </section>

          <p className="mt-12 text-sm text-verdemoikato/55">{t.help}</p>
        </div>
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
