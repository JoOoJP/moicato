// Ordem das categorias na vitrine. Os produtos em si vivem no Neon
// (src/lib/products.js).
export const CATEGORY_ORDER = ["joias", "moda", "home"];

// Fonte do seed inicial (scripts/seed.mjs), casada por índice com
// dict.collection.pieces. Sai junto com as peças dos dicionários quando o
// admin passar a ser a única forma de cadastrar produtos.
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
