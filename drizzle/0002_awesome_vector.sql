CREATE TYPE "public"."product_kind" AS ENUM('brinco', 'colar', 'anel', 'conjunto', 'bolsa', 'cabelo', 'mesa', 'decoracao');--> statement-breakpoint
CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name_pt" text NOT NULL,
	"name_en" text,
	"tagline_pt" text,
	"tagline_en" text,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "gift_wrap" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "kind" "product_kind";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "collection_id" integer;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "gift_wrap_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
UPDATE "products" SET "kind" = CASE
  WHEN "slug" LIKE 'brinco-%' THEN 'brinco'::product_kind
  WHEN "slug" LIKE 'colar-%' THEN 'colar'::product_kind
  WHEN "slug" LIKE 'anel-%' THEN 'anel'::product_kind
  WHEN "slug" LIKE 'conjunto-%' THEN 'conjunto'::product_kind
  WHEN "slug" LIKE 'bolsa-%' OR "slug" LIKE 'clutch-%' THEN 'bolsa'::product_kind
  WHEN "slug" LIKE 'rabico-%' THEN 'cabelo'::product_kind
  WHEN "slug" LIKE 'centro-de-mesa-%' OR "slug" LIKE 'sousplat-%' OR "slug" LIKE 'porta-guardanapo-%' THEN 'mesa'::product_kind
  WHEN "slug" LIKE 'cesto-%' OR "slug" LIKE 'caixas-%' THEN 'decoracao'::product_kind
END WHERE "kind" IS NULL;--> statement-breakpoint
INSERT INTO "collections" ("slug", "name_pt", "name_en", "tagline_pt", "tagline_en", "sort_order") VALUES
  ('solaris', 'Solaris', 'Solaris', 'O brilho do capim dourado em formas de sol.', 'Golden grass shaped like the sun.', 1),
  ('origem', 'Origem', 'Origem', 'Onde a Moikato começou: o terço, as raízes, a essência.', 'Where Moikato began: the rosary, the roots, the essence.', 2),
  ('trama', 'Trama', 'Trama', 'Entrelaçados minuciosos, do brinco à mesa posta.', 'Intricate weaves, from earrings to the table.', 3),
  ('riviera', 'Riviera', 'Riviera', 'Bolsas e acessórios para os dias de sol.', 'Bags and accessories for sunny days.', 4)
ON CONFLICT ("slug") DO NOTHING;--> statement-breakpoint
UPDATE "products" p SET "collection_id" = c."id" FROM "collections" c
WHERE p."collection_id" IS NULL AND (
  (c."slug" = 'solaris' AND p."slug" IN ('colar-solaris', 'centro-de-mesa-solaris', 'rabico-solar', 'brinco-helia', 'brinco-aura', 'brinco-lumiere')) OR
  (c."slug" = 'origem' AND p."slug" IN ('conjunto-origem', 'brinco-arvore-da-vida', 'brinco-essencia', 'caixas-essencia', 'cesto-raizes')) OR
  (c."slug" = 'trama' AND p."slug" IN ('colar-elo', 'anel-espiral', 'brinco-entrelacos', 'brinco-serena', 'brinco-pimenta', 'sousplat-dourado', 'porta-guardanapo-dourado')) OR
  (c."slug" = 'riviera' AND p."slug" IN ('bolsa-riviera', 'bolsa-royale', 'clutch-amalfi', 'brinco-royal-pearl'))
);
