import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import FilmSection from "../../components/FilmSection";
import Worn from "../../components/Worn";
import Collection from "../../components/Collection";
import Story from "../../components/Story";
import Events from "../../components/Events";
import WorldMap from "../../components/WorldMap";
import EventInvitation from "../../components/EventInvitation";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";

export default async function Home({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  // Dados estruturados da coleção (JSON-LD ItemList) para rich results.
  const catalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dict.collection.eyebrow,
    itemListElement: dict.collection.pieces.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        brand: { "@type": "Brand", name: "Moikato" },
        offers: {
          "@type": "Offer",
          priceCurrency: "GBP",
          price: p.price.replace(/[^0-9.]/g, ""),
        },
      },
    })),
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
          <Collection dict={dict.collection} />
        </Reveal>

        {/* Nossa história */}
        <Reveal>
          <Story dict={dict.story} />
        </Reveal>

        {/* Feiras e participações */}
        <Reveal>
          <Events dict={dict.events} />
        </Reveal>

        {/* Encontrados pelo mundo */}
        <Reveal>
          <WorldMap dict={dict.world} />
        </Reveal>

        {/* Convites para feiras, eventos e palestras */}
        <EventInvitation dict={dict.eventInvitation} />

      </main>

      <Footer dict={dict.footer} />
    </>
  );
}
