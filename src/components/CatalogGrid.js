import CatalogBrowser from "./shop/CatalogBrowser";
import { getCatalogPieces, getCollections } from "../lib/products";
import { getStoreSettings, publicPricing } from "../lib/settings";

export default async function CatalogGrid({ dict, lang }) {
  const [pieces, collections, settings] = await Promise.all([getCatalogPieces(lang), getCollections(lang), getStoreSettings()]);
  const t = dict.catalogPage;

  return (
    <main id="topo" className="bg-osso pt-[60px] motion-safe:animate-[pageEnter_400ms_ease-out] md:pt-20">
      <header className="mx-auto max-w-7xl px-5 pb-8 pt-8 sm:px-8 sm:pb-12 sm:pt-14">
        <p className="text-[0.72rem] tracking-[0.14em] text-amarelomoikato-700">{t.eyebrow.toUpperCase()}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h1 className="max-w-2xl font-display text-[2.4rem] font-light leading-[1] text-verdemoikato sm:text-6xl">{t.title}</h1>
          <p className="max-w-sm text-[0.92rem] leading-relaxed text-verdemoikato/65">{t.intro}</p>
        </div>
      </header>

      <CatalogBrowser pieces={pieces} collections={collections} lang={lang} t={t} shop={dict.shop} pricing={publicPricing(settings)} />
    </main>
  );
}
