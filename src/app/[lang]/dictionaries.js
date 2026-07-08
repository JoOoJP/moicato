import "server-only";

const dictionaries = {
  "pt-BR": () => import("../../dictionaries/pt-BR.js").then((m) => m.default),
  en: () => import("../../dictionaries/en.js").then((m) => m.default),
};

export const locales = ["pt-BR", "en"];
export const defaultLocale = "pt-BR";

// lang do URL -> valor do atributo <html lang="...">
export const htmlLang = { "pt-BR": "pt-BR", en: "en-GB" };

export const hasLocale = (locale) => locale in dictionaries;

export const getDictionary = (locale) =>
  dictionaries[hasLocale(locale) ? locale : defaultLocale]();
