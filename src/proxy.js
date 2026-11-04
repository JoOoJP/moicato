import { NextResponse } from "next/server";
import { auth } from "./lib/auth/server";

const locales = ["pt-BR", "en"];
const defaultLocale = "pt-BR";

// Detecta o idioma: 1) cookie (escolha explícita) → 2) Accept-Language → 3) padrão.
function getLocale(request) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  const accept = request.headers.get("accept-language") || "";
  const ranked = accept
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith("pt")) return "pt-BR";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}

// Painel: renova a sessão e manda quem não está logado para o login. A
// autorização (papel "admin") é checada de novo em cada página/ação.
const adminGuard = auth.middleware({
  loginUrl: "/admin/entrar",
  publicRoutes: ["/admin/entrar", "/admin/recuperar"],
});

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // /admin é só pt-BR e fica fora do prefixo de idioma.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminGuard(request);
  }

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // O destino do redirect varia por idioma/cookie — avisa caches intermediários
  // pra não servirem o locale errado.
  const response = NextResponse.redirect(request.nextUrl);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // Roda em todas as rotas, exceto internas (_next), a API e arquivos com
  // extensão (ex.: /img-campo.svg, /favicon.ico) — que não devem ser prefixados.
  matcher: ["/((?!_next|api|.*\\.).*)"],
};
