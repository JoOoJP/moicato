import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import AccessForm from "../../../components/shop/AccessForm";
import { getCustomerEmail } from "../../../lib/customer-access";
import { listCustomerOrders } from "../../../lib/customer-orders";
import { formatBRL } from "../../../lib/money";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.account.metaTitle, robots: { index: false, follow: false } };
}

export default async function AccountPage({ params, searchParams }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ link }, dict, email] = await Promise.all([searchParams, getDictionary(lang), getCustomerEmail()]);
  const t = dict.account;
  const orders = email ? await listCustomerOrders(email) : [];
  const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" });

  return (
    <>
      <Header dict={dict.header} lang={lang} alwaysSolid />
      <main id="topo" className="flex-1 bg-osso pt-[60px] md:pt-20">
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:pt-16">
          <p className="text-[0.72rem] tracking-[0.14em] text-amarelomoikato-700">{t.eyebrow.toUpperCase()}</p>
          <h1 className="mt-3 font-display text-[2.6rem] font-light leading-none text-verdemoikato sm:text-5xl">{t.title}</h1>

          {!email ? (
            <div className="mt-8 max-w-md">
              {link === "invalido" && (
                <p role="alert" className="mb-5 border-l-2 border-terra bg-terra-50 px-4 py-3 text-sm text-terra-700">
                  {t.invalidLink}
                </p>
              )}
              <p className="mb-6 text-[0.95rem] leading-relaxed text-verdemoikato/70">{t.intro}</p>
              <AccessForm lang={lang} t={t} />
            </div>
          ) : (
            <>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-verdemoikato/15 pb-5">
                <p className="text-sm text-verdemoikato/65">{t.signedInAs.replace("{email}", email)}</p>
                <form action={`/api/minha-conta/sair?lang=${lang}`} method="post">
                  <button type="submit" className="min-h-11 text-xs uppercase tracking-[0.12em] text-verdemoikato/60 underline-offset-4 hover:text-verdemoikato hover:underline">
                    {t.logout}
                  </button>
                </form>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-verdemoikato/65">{t.empty}</p>
                  <Link href={`/${lang}/catalogo`} className="mt-6 inline-block text-[0.78rem] tracking-[0.14em] text-verdemoikato underline underline-offset-[6px]">
                    {t.toShop.toUpperCase()}
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-verdemoikato/10">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <Link href={`/${lang}/minha-conta/${order.id}`} className="grid gap-1 py-5 transition-colors hover:bg-verdemoikato/[0.03] sm:grid-cols-[1fr_auto] sm:items-center sm:px-2">
                        <div className="min-w-0">
                          <p className="font-display text-xl text-verdemoikato">{t.order.replace("{id}", order.id)}</p>
                          <p className="mt-0.5 truncate text-sm text-verdemoikato/60">
                            {order.items.map((item) => (item.qty > 1 ? `${item.qty}× ${item.name}` : item.name)).join(", ")}
                          </p>
                          <p className="mt-0.5 text-xs text-verdemoikato/45">{t.placedOn.replace("{date}", date.format(order.createdAt))}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-sm text-verdemoikato">{formatBRL(order.totalCents)}</p>
                          <p className="mt-0.5 text-xs text-amarelomoikato-700">{t.statuses[order.status] ?? order.status}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-10 text-sm text-verdemoikato/55">{t.help}</p>
            </>
          )}
        </div>
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
