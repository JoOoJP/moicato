ALTER TABLE "orders" ADD COLUMN "payment_slug" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_transaction" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paid_amount_cents" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_slug_unique" UNIQUE("payment_slug");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_transaction_unique" UNIQUE("payment_transaction");