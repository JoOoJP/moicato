// Acesso do cliente aos próprios pedidos, sem senha: link mágico por e-mail.
// O token é o e-mail + validade, assinados com HMAC (nada guardado no banco).
// O link abre /api/minha-conta/entrar, que grava um cookie httpOnly assinado.
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const CUSTOMER_COOKIE = "moikato_cliente";
const LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000; // link do e-mail
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // sessão no navegador

function secret() {
  const value = process.env.CUSTOMER_LINK_SECRET;
  if (!value || value.length < 32) throw new Error("CUSTOMER_LINK_SECRET ausente ou curto");
  return value;
}

const b64 = (value) => Buffer.from(value).toString("base64url");
const sign = (payload) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function createToken(email, ttlMs = LINK_TTL_MS) {
  const payload = b64(JSON.stringify({ e: String(email).trim().toLowerCase(), x: Date.now() + ttlMs }));
  return `${payload}.${sign(payload)}`;
}

// Retorna o e-mail se o token for válido e não expirado; senão null.
export function verifyToken(token) {
  const [payload, signature] = String(token ?? "").split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof e === "string" && Number(x) > Date.now() ? e : null;
  } catch {
    return null;
  }
}

export function accessUrl(siteUrl, lang, email) {
  return `${siteUrl}/api/minha-conta/entrar?lang=${encodeURIComponent(lang)}&token=${encodeURIComponent(createToken(email))}`;
}

export const sessionToken = (email) => createToken(email, SESSION_TTL_MS);
export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000;

// E-mail do cliente logado (cookie), ou null.
export async function getCustomerEmail() {
  const store = await cookies();
  return verifyToken(store.get(CUSTOMER_COOKIE)?.value);
}
