// Configuração de site centralizada (URL de produção, locales p/ SEO).
// O domínio real pode ser definido via env NEXT_PUBLIC_SITE_URL sem mexer no código.
// TODO: confirmar o domínio de produção (assumido: moikato.com.br).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moikato.com.br"
).replace(/\/$/, "");

// lang do URL -> og:locale
export const OG_LOCALE = { "pt-BR": "pt_BR", en: "en_GB" };

// Imagem de compartilhamento (Open Graph / Twitter). Trocar por uma OG dedicada
// 1200x630 com logo quando houver; por ora, a foto-ícone do capim dourado.
export const OG_IMAGE = "/story-nasce.jpg";
