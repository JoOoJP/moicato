// Schema do banco (Neon Postgres) — fonte de verdade de produtos, estoque e
// pedidos. Textos institucionais continuam nos dicionários; aqui só dado de
// produto e de venda. Valores monetários sempre em centavos (inteiro).
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const productCategory = pgEnum("product_category", ["joias", "moda", "home"]);
export const productStatus = pgEnum("product_status", ["draft", "active", "archived"]);
// Tipo da peça — usado nos filtros do catálogo (rótulos em src/lib/kinds.js).
export const productKind = pgEnum("product_kind", [
  "brinco",
  "colar",
  "anel",
  "conjunto",
  "bolsa",
  "cabelo",
  "mesa",
  "decoracao",
]);
export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "expired",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

// Embalagens cadastradas uma vez e reutilizadas pelas peças. Frete usa as
// medidas da embalagem + peso da peça + peso da embalagem.
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  lengthCm: integer("length_cm").notNull(),
  widthCm: integer("width_cm").notNull(),
  heightCm: integer("height_cm").notNull(),
  weightG: integer("weight_g").default(0).notNull(), // embalagem vazia
  ...timestamps,
});

// Configurações da loja (linha única, id = 1), editáveis no painel.
export const storeSettings = pgTable("store_settings", {
  id: integer("id").primaryKey().default(1),
  salesOpen: boolean("sales_open").default(false).notNull(),
  // Desconto no Pix exibido na loja — só ative se o pagamento aplicar de fato (CDC).
  pixDiscountPercent: integer("pix_discount_percent").default(0).notNull(),
  maxInstallments: integer("max_installments").default(3).notNull(),
  minInstallmentCents: integer("min_installment_cents").default(5000).notNull(),
  freeShippingCents: integer("free_shipping_cents"), // null = sem frete grátis
  giftWrapEnabled: boolean("gift_wrap_enabled").default(true).notNull(),
  // Dias úteis entre o pagamento e a postagem; somados ao prazo da transportadora.
  handlingDays: integer("handling_days").default(5).notNull(),
  ...timestamps,
});

// Coleções com nome e conceito (ex.: Solaris, Origem). Editáveis no painel.
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  namePt: text("name_pt").notNull(),
  nameEn: text("name_en"),
  taglinePt: text("tagline_pt"),
  taglineEn: text("tagline_en"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  ...timestamps,
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  category: productCategory("category").notNull(),
  kind: productKind("kind"),
  collectionId: integer("collection_id").references(() => collections.id, { onDelete: "set null" }),
  status: productStatus("status").default("draft").notNull(),
  isUnique: boolean("is_unique").default(false).notNull(),
  madeToOrder: boolean("made_to_order").default(false).notNull(),
  // Peso da peça (sem embalagem) e embalagem usada no envio.
  weightG: integer("weight_g"),
  packageId: integer("package_id").references(() => packages.id, { onDelete: "set null" }),
  // Obsoletas (medidas agora vêm da embalagem). Remover numa migration
  // posterior, depois que nenhum deploy as ler mais.
  lengthCm: integer("length_cm"),
  widthCm: integer("width_cm"),
  heightCm: integer("height_cm"),
  sortOrder: integer("sort_order").default(0).notNull(),
  ...timestamps,
});

export const productTranslations = pgTable(
  "product_translations",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(), // 'pt-BR' | 'en'
    name: text("name").notNull(),
    description: text("description"),
    details: text("details"),
    care: text("care"),
    // Legado: preço exibido como texto (ex.: "£50 cada"). Mantém o site
    // idêntico até a tabela em R$ existir; sai quando o checkout entrar.
    legacyPriceLabel: text("legacy_price_label"),
    legacyPriceNote: text("legacy_price_note"),
  },
  (t) => [primaryKey({ columns: [t.productId, t.locale] })]
);

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  // null = preço ainda não definido em R$ (peça não pode ir ao checkout).
  priceCents: integer("price_cents"),
  // null = estoque não controlado ainda ("disponibilidade confirmada no pedido").
  stock: integer("stock"),
  labelPt: text("label_pt"),
  labelEn: text("label_en"),
  position: integer("position").default(0).notNull(),
  ...timestamps,
});

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    // Enquadramento CSS (object-position), ex.: "44% center".
    objectPosition: text("object_position"),
    altPt: text("alt_pt"),
    altEn: text("alt_en"),
    position: integer("position").default(0).notNull(),
  },
  (t) => [index("product_images_product_idx").on(t.productId)]
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    status: orderStatus("status").default("pending").notNull(),
    customerName: text("customer_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    cpf: text("cpf").notNull(),
    // { cep, street, number, complement, district, city, uf }
    address: jsonb("address").notNull(),
    subtotalCents: integer("subtotal_cents").notNull(),
    shippingCents: integer("shipping_cents").default(0).notNull(),
    discountCents: integer("discount_cents").default(0).notNull(),
    totalCents: integer("total_cents").notNull(),
    paymentMethod: text("payment_method"), // 'pix' | 'credit_card' | 'boleto'
    installments: integer("installments"),
    asaasPaymentId: text("asaas_payment_id").unique(),
    asaasCheckoutId: text("asaas_checkout_id").unique(),
    shippingService: text("shipping_service"),
    melhorEnvioOrderId: text("melhorenvio_order_id"),
    trackingCode: text("tracking_code"),
    nfeKey: text("nfe_key"),
    giftMessage: text("gift_message"),
    giftWrap: boolean("gift_wrap").default(false).notNull(),
    locale: text("locale").default("pt-BR").notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    shippedAt: timestamp("shipped_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("orders_status_idx").on(t.status)]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    variantId: integer("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    // Snapshots: o pedido não muda se o produto for editado depois.
    nameSnapshot: text("name_snapshot").notNull(),
    labelSnapshot: text("label_snapshot"),
    unitPriceCents: integer("unit_price_cents").notNull(),
    qty: integer("qty").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)]
);

// Reserva de estoque enquanto o pagamento está pendente (evita vender a mesma
// peça única duas vezes). Expirada → estoque volta.
export const stockReservations = pgTable(
  "stock_reservations",
  {
    id: serial("id").primaryKey(),
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    qty: integer("qty").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("stock_reservations_order_variant_idx").on(t.orderId, t.variantId)]
);

// Idempotência de webhooks: o provedor pode reenviar o mesmo evento.
export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey(), // id do evento no provedor
  provider: text("provider").notNull(), // 'asaas' | 'melhorenvio'
  payload: jsonb("payload").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
});
