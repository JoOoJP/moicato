// Conexão com o Neon via driver HTTP (serverless, sem pool para gerenciar).
// Só use no servidor — DATABASE_URL nunca vai para o navegador.
import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida (veja .env.example).");
}

export const db = drizzle(neon(process.env.DATABASE_URL), { schema });
