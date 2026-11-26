// Link mágico do e-mail → valida o token, grava a sessão (cookie httpOnly
// assinado, 30 dias) e leva para "Meus pedidos".
import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE, SESSION_MAX_AGE, sessionToken, verifyToken } from "../../../../lib/customer-access";

export async function GET(request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "pt-BR";
  const email = verifyToken(url.searchParams.get("token"));
  const target = new URL(`/${lang}/minha-conta${email ? "" : "?link=invalido"}`, url.origin);
  const response = NextResponse.redirect(target);
  if (email) {
    response.cookies.set(CUSTOMER_COOKIE, sessionToken(email), {
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }
  return response;
}
