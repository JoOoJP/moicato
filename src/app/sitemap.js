import { SITE_URL } from "../lib/site";
import { getActiveSlugs } from "../lib/products";

// Sitemap com as duas versões de idioma e hreflang recíproco.
export default async function sitemap() {
  const languages = {
    "pt-BR": `${SITE_URL}/pt-BR`,
    "en-GB": `${SITE_URL}/en`,
  };
  const lastModified = new Date();
  const mainPages = [
    {
      url: `${SITE_URL}/pt-BR`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/pt-BR/catalogo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-BR/catalogo`,
          "en-GB": `${SITE_URL}/en/catalogo`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/catalogo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-BR/catalogo`,
          "en-GB": `${SITE_URL}/en/catalogo`,
        },
      },
    },
  ];

  const slugs = await getActiveSlugs();
  const products = slugs.flatMap((slug) => {
    const productLanguages = {
      "pt-BR": `${SITE_URL}/pt-BR/catalogo/${slug}`,
      "en-GB": `${SITE_URL}/en/catalogo/${slug}`,
    };

    return [
      {
        url: productLanguages["pt-BR"],
        lastModified,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: { languages: productLanguages },
      },
      {
        url: productLanguages["en-GB"],
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: productLanguages },
      },
    ];
  });

  return [...mainPages, ...products];
}
