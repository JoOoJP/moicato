// Tipos de peça (enum product_kind) — ordem e rótulos dos filtros do catálogo.
export const KINDS = [
  { id: "brinco", pt: "Brincos", en: "Earrings", onePt: "Brinco", oneEn: "Earrings", slugPt: "brincos", slugEn: "earrings" },
  { id: "colar", pt: "Colares", en: "Necklaces", onePt: "Colar", oneEn: "Necklace", slugPt: "colares", slugEn: "necklaces" },
  { id: "anel", pt: "Anéis", en: "Rings", onePt: "Anel", oneEn: "Ring", slugPt: "aneis", slugEn: "rings" },
  { id: "conjunto", pt: "Conjuntos", en: "Sets", onePt: "Conjunto", oneEn: "Set", slugPt: "conjuntos", slugEn: "sets" },
  { id: "bolsa", pt: "Bolsas", en: "Bags", onePt: "Bolsa", oneEn: "Bag", slugPt: "bolsas", slugEn: "bags" },
  { id: "cabelo", pt: "Cabelo", en: "Hair", onePt: "Acessório de cabelo", oneEn: "Hair accessory", slugPt: "cabelo", slugEn: "hair" },
  { id: "mesa", pt: "Mesa posta", en: "Tableware", onePt: "Mesa posta", oneEn: "Tableware", slugPt: "mesa", slugEn: "tableware" },
  { id: "decoracao", pt: "Decoração", en: "Decor", onePt: "Decoração", oneEn: "Decor", slugPt: "decoracao", slugEn: "decor" },
];

export const KIND_IDS = KINDS.map((kind) => kind.id);

export function kindLabel(id, lang) {
  const kind = KINDS.find((k) => k.id === id);
  return kind ? (lang === "en" ? kind.en : kind.pt) : null;
}

// Singular (ex.: "Colar") — usado embaixo do nome da peça.
export function kindName(id, lang) {
  const kind = KINDS.find((k) => k.id === id);
  return kind ? (lang === "en" ? kind.oneEn : kind.onePt) : null;
}
