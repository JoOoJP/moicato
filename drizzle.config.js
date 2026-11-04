import { defineConfig } from "drizzle-kit";

// drizzle-kit não lê o .env.local do Next; carregamos aqui (Node ≥ 21.7).
try {
  process.loadEnvFile(".env.local");
} catch {
  // Sem .env.local (ex.: CI) — usa as variáveis do ambiente.
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.js",
  out: "./drizzle",
  // Migrations usam a conexão direta; o app usa a pooled (DATABASE_URL).
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "" },
});
