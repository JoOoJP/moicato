CREATE TABLE "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"length_cm" integer NOT NULL,
	"width_cm" integer NOT NULL,
	"height_cm" integer NOT NULL,
	"weight_g" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"sales_open" boolean DEFAULT false NOT NULL,
	"pix_discount_percent" integer DEFAULT 0 NOT NULL,
	"max_installments" integer DEFAULT 3 NOT NULL,
	"min_installment_cents" integer DEFAULT 5000 NOT NULL,
	"free_shipping_cents" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "package_id" integer;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
INSERT INTO "store_settings" ("id") VALUES (1) ON CONFLICT DO NOTHING;--> statement-breakpoint
INSERT INTO "packages" ("name", "length_cm", "width_cm", "height_cm", "weight_g") VALUES
  ('Caixinha de joia', 12, 8, 4, 60),
  ('Caixa média (acessórios)', 25, 20, 10, 250),
  ('Caixa grande (bolsas e casa)', 40, 30, 20, 500);
