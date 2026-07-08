import { SITE_URL } from "../lib/site";

// Sitemap com as duas versões de idioma e hreflang recíproco.
export default function sitemap() {
  const languages = {
    "pt-BR": `${SITE_URL}/pt-BR`,
    "en-GB": `${SITE_URL}/en`,
  };
  const lastModified = new Date();
  return [
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
  ];
}
