// Configuração de site centralizada (URL de produção, locales p/ SEO).
// Domínio de produção: moikato.com (override via env NEXT_PUBLIC_SITE_URL).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moikato.com"
).replace(/\/$/, "");

// lang do URL -> og:locale
export const OG_LOCALE = { "pt-BR": "pt_BR", en: "en_GB" };

// Imagem de compartilhamento (Open Graph / Twitter). Trocar por uma OG dedicada
// 1200x630 com logo quando houver; por ora, a foto-ícone do capim dourado.
export const OG_IMAGE = "/story-nasce.jpg";
