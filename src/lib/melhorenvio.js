// Cotação de frete no Melhor Envio (Correios, Jadlog…). Desligado enquanto
// MELHORENVIO_TOKEN não existir. Docs: https://docs.melhorenvio.com.br
// Ainda NÃO testado contra a API real — validar no sandbox quando a conta existir.
import "server-only";
import { inArray } from "drizzle-orm";
import { db } from "./db";
import { packages } from "./db/schema";
import { normalizeCep } from "./cpf";

const BASE =
  process.env.MELHORENVIO_ENV === "production"
    ? "https://melhorenvio.com.br"
    : "https://sandbox.melhorenvio.com.br";

// items: [{ weightG, packageId, priceCents, qty }]
async function toVolumes(items) {
  const ids = [...new Set(items.map((item) => item.packageId).filter(Boolean))];
  const rows = ids.length ? await db.select().from(packages).where(inArray(packages.id, ids)) : [];
  const byId = new Map(rows.map((row) => [row.id, row]));
  // Peça sem embalagem cadastrada: caixinha padrão pequena.
  const fallback = { lengthCm: 16, widthCm: 11, heightCm: 6, weightG: 100 };

  return items.map((item, index) => {
    const pack = byId.get(item.packageId) ?? fallback;
    return {
      id: String(index + 1),
      length: pack.lengthCm,
      width: pack.widthCm,
      height: pack.heightCm,
      weight: Math.max(((item.weightG ?? 100) + pack.weightG) / 1000, 0.05),
      insurance_value: item.priceCents / 100,
      quantity: item.qty,
    };
  });
}

// Retorna [{ id, name, company, priceCents, days }] ordenado pelo preço.
export async function quoteShipping(cep, items) {
  const token = process.env.MELHORENVIO_TOKEN;
  const from = normalizeCep(process.env.SHIP_FROM_CEP);
  const to = normalizeCep(cep);
  if (!token || !from) throw new Error("Frete não configurado");
  if (to.length !== 8) throw new Error("CEP inválido");

  const response = await fetch(`${BASE}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": `Moikato (${process.env.MELHORENVIO_CONTACT_EMAIL ?? "contato@moikato.com.br"})`,
    },
    body: JSON.stringify({ from: { postal_code: from }, to: { postal_code: to }, products: await toVolumes(items) }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Melhor Envio ${response.status}`);

  const services = await response.json();
  return services
    .filter((service) => !service.error && service.price)
    .map((service) => ({
      id: String(service.id),
      name: service.name,
      company: service.company?.name ?? "",
      priceCents: Math.round(Number(service.custom_price ?? service.price) * 100),
      days: service.custom_delivery_time ?? service.delivery_time,
    }))
    .sort((a, b) => a.priceCents - b.priceCents);
}
