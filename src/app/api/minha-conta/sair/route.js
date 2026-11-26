import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE } from "../../../../lib/customer-access";

export async function POST(request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "pt-BR";
  const response = NextResponse.redirect(new URL(`/${lang}/minha-conta`, url.origin), 303);
  response.cookies.delete(CUSTOMER_COOKIE);
  return response;
}
