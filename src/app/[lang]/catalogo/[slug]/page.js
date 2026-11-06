import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "../../dictionaries";
import Header from "../../../../components/Header";
import ProductDetail from "../../../../components/ProductDetail";
import Footer from "../../../../components/Footer";
import { getActiveSlugs, getPieceBySlug, getRelatedPieces } from "../../../../lib/products";
import { SITE_URL } from "../../../../lib/site";
import { getStoreSettings, publicPricing, shippingReady } from "../../../../lib/settings";

export async function generateStaticParams() {
  const slugs = await getActiveSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const piece = await getPieceBySlug(lang, slug);
  if (!piece) return {};

  return {
    title: `${piece.name} | Moikato`,
    description: piece.description,
    alternates: {
      canonical: `/${lang}/catalogo/${slug}`,
      languages: {
        "pt-BR": `/pt-BR/catalogo/${slug}`,
        "en-GB": `/en/catalogo/${slug}`,
        "x-default": `/pt-BR/catalogo/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      title: `${piece.name} | Moikato`,
      description: piece.description,
      url: `/${lang}/catalogo/${slug}`,
      images: [{ url: piece.image, alt: piece.imageAlt }],
    },
  };
}

export default async function ProductPage({ params }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const piece = await getPieceBySlug(lang, slug);
  if (!piece) notFound();
  const [related, settings] = await Promise.all([getRelatedPieces(lang, piece), getStoreSettings()]);
  const availability = piece.soldOut ? "OutOfStock" : piece.priceCents != null ? "InStock" : "LimitedAvailability";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.name,
    description: piece.description,
    image: `${SITE_URL}${piece.image}`,
    brand: { "@type": "Brand", name: "Moikato" },
    ...(piece.offer
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: piece.offer.currency,
            price: piece.offer.price,
            availability: `https://schema.org/${availability}`,
            url: `${SITE_URL}/${lang}/catalogo/${slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Header dict={dict.header} lang={lang} alwaysSolid />
      <ProductDetail
        piece={piece}
        related={related}
        dict={dict}
        lang={lang}
        pricing={publicPricing(settings)}
        salesLive={settings.salesLive}
        shippingReady={shippingReady}
      />
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
