import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import FilmSection from "../../components/FilmSection";
import Worn from "../../components/Worn";
import Collection from "../../components/Collection";
import Story from "../../components/Story";
import Events from "../../components/Events";
import Resellers from "../../components/Resellers";
import EventInvitation from "../../components/EventInvitation";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import { getCatalogPieces } from "../../lib/products";

export default async function Home({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const pieces = await getCatalogPieces(lang);

  // Dados estruturados da coleção (JSON-LD ItemList) para rich results.
  const catalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dict.collection.eyebrow,
    itemListElement: pieces.map((p, i) => {
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          ...(p.description ? { description: p.description } : {}),
          ...(p.image ? { image: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://moikato.com"}${p.image}` } : {}),
          brand: { "@type": "Brand", name: "Moikato" },
          ...(p.offer
            ? {
                offers: {
                  "@type": "Offer",
                  priceCurrency: p.offer.currency,
                  price: p.offer.price,
                },
              }
            : {}),
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogJsonLd) }}
      />
      <Header dict={dict.header} lang={lang} />
      <main className="flex-1">
        {/* Hero cinematográfico */}
        <Hero dict={dict.hero} />

        {/* Manifesto + filme */}
        <Reveal>
          <FilmSection dict={dict.manifesto} />
        </Reveal>

        {/* Desenhado no Brasil / Usado pelo mundo */}
        <Reveal>
          <Worn dict={dict.worn} />
        </Reveal>

        {/* Coleção */}
        <Reveal>
          <Collection dict={dict.collection} lang={lang} />
        </Reveal>

        {/* Nossa história */}
        <Reveal>
          <Story dict={dict.story} />
        </Reveal>

        {/* Feiras e participações */}
        <Reveal>
          <Events dict={dict.events} />
        </Reveal>

        {/* Revendedores e parcerias comerciais */}
        <Reveal>
          <Resellers dict={dict.resellers} />
        </Reveal>

        {/* Convites para feiras, eventos e palestras */}
        <EventInvitation dict={dict.eventInvitation} />

      </main>

      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
