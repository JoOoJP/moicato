import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "../../dictionaries";
import Header from "../../../../components/Header";
import ProductDetail from "../../../../components/ProductDetail";
import Footer from "../../../../components/Footer";
import { CATALOG_ITEMS, getPieceBySlug, getRelatedPieces } from "../../../../lib/catalog";
import { SITE_URL } from "../../../../lib/site";

export function generateStaticParams() {
  return locales.flatMap((lang) => CATALOG_ITEMS.map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const piece = getPieceBySlug(dict, slug);
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
  const piece = getPieceBySlug(dict, slug);
  if (!piece) notFound();
  const related = getRelatedPieces(dict, piece);
  const numericPrice = piece.price.replace(/[^0-9.]/g, "");

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.name,
    description: piece.description,
    image: `${SITE_URL}${piece.image}`,
    brand: { "@type": "Brand", name: "Moikato" },
    ...(numericPrice
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "GBP",
            price: numericPrice,
            availability: "https://schema.org/LimitedAvailability",
            url: `${SITE_URL}/${lang}/catalogo/${slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Header dict={dict.header} lang={lang} alwaysSolid />
      <ProductDetail piece={piece} related={related} dict={dict} lang={lang} />
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
