import { Geist, Fraunces } from "next/font/google";
import "../globals.css";
import { getDictionary, hasLocale, htmlLang, locales } from "./dictionaries";
import { SITE_URL, OG_LOCALE, OG_IMAGE } from "../../lib/site";
import { INSTAGRAM_URL, EMAIL } from "../../lib/contato";
import LivingBackground from "../../components/LivingBackground";
import GoldenThread from "../../components/GoldenThread";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Serifada quente e orgânica para títulos — clima artesanal/editorial
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Prerenderiza os dois idiomas estaticamente
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// hreflang recíproco entre pt-BR e en; x-default = pt-BR (idioma padrão do proxy).
const LANG_ALTERNATES = {
  "pt-BR": "/pt-BR",
  "en-GB": "/en",
  "x-default": "/pt-BR",
};

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const path = `/${lang}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    applicationName: "Moikato",
    alternates: { canonical: path, languages: LANG_ALTERNATES },
    openGraph: {
      type: "website",
      siteName: "Moikato",
      title: dict.meta.title,
      description: dict.meta.description,
      url: path,
      locale: OG_LOCALE[lang] ?? "pt_BR",
      images: [
        { url: OG_IMAGE, width: 1600, height: 1063, alt: dict.meta.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const skip = lang === "en" ? "Skip to content" : "Pular para o conteúdo";
  const dict = await getDictionary(hasLocale(lang) ? lang : "pt-BR");

  // Dados estruturados da marca (JSON-LD Organization) — entidade + rich results.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Moikato",
    url: SITE_URL,
    description: dict.meta.description,
    email: EMAIL,
    sameAs: [INSTAGRAM_URL],
  };

  return (
    <html
      lang={htmlLang[lang] ?? "pt-BR"}
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Skip-link (acessibilidade / WCAG 2.4.1) */}
        <a
          href="#topo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-verdemoikato focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          {skip}
        </a>

        {/* Sistemas "vivos" (Campo Vivo) — leves, com fallback reduced-motion */}
        <LivingBackground />
        <GoldenThread />

        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
