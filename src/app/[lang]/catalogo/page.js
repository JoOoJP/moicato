import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import Header from "../../../components/Header";
import CatalogGrid from "../../../components/CatalogGrid";
import Footer from "../../../components/Footer";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    title: dict.catalogPage.metaTitle,
    description: dict.catalogPage.metaDescription,
    alternates: {
      canonical: `/${lang}/catalogo`,
      languages: {
        "pt-BR": "/pt-BR/catalogo",
        "en-GB": "/en/catalogo",
        "x-default": "/pt-BR/catalogo",
      },
    },
  };
}

export default async function CatalogPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Header dict={dict.header} lang={lang} alwaysSolid />
      <CatalogGrid dict={dict} lang={lang} />
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
