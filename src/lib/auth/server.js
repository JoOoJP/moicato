// Neon Auth (Managed Better Auth). Usuários e sessões vivem no schema
// neon_auth do próprio banco. Cadastro público está DESLIGADO no Neon: contas
// de admin são criadas por CLI (`neon neon-auth user create` + `set-role admin`).
import "server-only";
import { createNeonAuth } from "@neon/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET },
});
