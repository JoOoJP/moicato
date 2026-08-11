export const CATALOG_ITEMS = [
  { slug: "bolsa-royale", category: "moda" },
  { slug: "bolsa-riviera", category: "moda" },
  { slug: "centro-de-mesa-solaris", category: "home" },
  { slug: "sousplat-dourado", category: "home" },
  { slug: "porta-guardanapo-dourado", category: "home" },
  { slug: "cesto-raizes", category: "home" },
  { slug: "caixas-essencia", category: "home" },
  { slug: "conjunto-origem", category: "joias" },
  { slug: "colar-elo", category: "joias" },
  { slug: "colar-solaris", category: "joias" },
  { slug: "anel-espiral", category: "joias" },
  { slug: "brinco-entrelacos", category: "joias" },
  { slug: "brinco-serena", category: "joias" },
  { slug: "brinco-lumiere", category: "joias" },
  { slug: "brinco-aura", category: "joias" },
  { slug: "brinco-arvore-da-vida", category: "joias" },
  { slug: "brinco-essencia", category: "joias" },
  { slug: "brinco-pimenta", category: "joias" },
  { slug: "brinco-royal-pearl", category: "joias" },
  { slug: "brinco-helia", category: "joias" },
  { slug: "clutch-amalfi", category: "moda" },
  { slug: "rabico-solar", category: "moda" },
];

export const CATEGORY_ORDER = ["joias", "moda", "home"];

export function getCatalogPieces(dict) {
  return dict.collection.pieces.map((piece, index) => ({
    ...piece,
    ...CATALOG_ITEMS[index],
  }));
}

export function getPieceBySlug(dict, slug) {
  return getCatalogPieces(dict).find((piece) => piece.slug === slug);
}

export function getRelatedPieces(dict, piece, limit = 3) {
  return getCatalogPieces(dict)
    .filter((candidate) => candidate.slug !== piece.slug)
    .sort((a, b) => Number(b.category === piece.category) - Number(a.category === piece.category))
    .slice(0, limit);
}
