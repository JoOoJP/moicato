import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Reveal from "../../components/Reveal";
import Values from "../../components/Values";
import CollectionPrelude from "../../components/CollectionPrelude";
import Story from "../../components/Story";
import Catalog from "../../components/Catalog";
import About from "../../components/About";
import Footer from "../../components/Footer";

export default async function Home({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  // Dados estruturados da coleção (JSON-LD ItemList) para rich results.
  const catalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dict.catalog.title,
    itemListElement: dict.catalog.pieces.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        material: p.material,
        category: lang === "en" ? "Handmade bio-jewellery" : "Biojoia artesanal",
        brand: { "@type": "Brand", name: "Moikato" },
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
        {/* Banner cinematográfico (campo de capim dourado) */}
        <Hero dict={dict.hero} />

        {/* Manifesto rápido — valores */}
        <Reveal>
          <Values dict={dict.values} />
        </Reveal>

        {/* A peça vem antes da narrativa: desejo primeiro, contexto depois. */}
        <Reveal>
          <CollectionPrelude dict={dict.catalog} />
        </Reveal>

        {/* Do Cerrado à joia — história única (material + jornada + Moikato).
            Sem <Reveal>: tem sticky + IntersectionObserver próprios. */}
        <Story dict={dict.story} />

        {/* As peças — coleção */}
        <Reveal>
          <Catalog dict={dict.catalog} />
        </Reveal>

        {/* Sustentabilidade & processo */}
        <Reveal>
          <About dict={dict.about} />
        </Reveal>
      </main>

      {/* Contato */}
      <Reveal>
        <Footer dict={dict.footer} />
      </Reveal>
    </>
  );
}
