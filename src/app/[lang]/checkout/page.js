import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import Header from "../../../components/Header";
import CheckoutForm from "../../../components/shop/CheckoutForm";
import { getStoreSettings } from "../../../lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.checkout.metaTitle, robots: { index: false, follow: false } };
}

export default async function CheckoutPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, settings] = await Promise.all([getDictionary(lang), getStoreSettings()]);
  const cartLabels = {
    ...dict.cart,
    gift: { wrap: dict.shop.giftWrap, note: dict.shop.giftWrapNote, placeholder: dict.shop.giftMessagePlaceholder },
  };

  return (
    <>
      <Header dict={dict.header} lang={lang} alwaysSolid />
      <main id="topo" className="flex-1 bg-osso pt-[60px] md:pt-20">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8 sm:pt-10">
          <Link href={`/${lang}/catalogo`} className="text-xs uppercase tracking-[0.12em] text-verdemoikato/55 hover:text-verdemoikato">
            ← {dict.cart.continue}
          </Link>
          <h1 className="mt-3 font-display text-5xl font-light text-verdemoikato">{dict.checkout.title}</h1>
          <div className="mt-8">
            <CheckoutForm lang={lang} t={dict.checkout} cartLabels={cartLabels}
              shippingLabels={dict.shop.shipping}
              salesLive={settings.salesLive}
              giftWrapEnabled={settings.giftWrapEnabled}
            />
          </div>
        </div>
      </main>
    </>
  );
}
