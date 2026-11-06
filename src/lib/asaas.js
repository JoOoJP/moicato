// Pagamento via Asaas Checkout (página hospedada: Pix e cartão parcelado).
// Desligado enquanto ASAAS_API_KEY não existir.
// Ref.: POST /v3/checkouts — https://docs.asaas.com/reference/create-new-checkout
// Ainda NÃO testado contra a API real — validar no sandbox quando a conta existir.
import "server-only";

const BASE = process.env.ASAAS_ENV === "production" ? "https://api.asaas.com" : "https://api-sandbox.asaas.com";

// O Asaas exige imagem (base64) em cada item. Usa a foto da peça; se falhar, o logo.
async function imageBase64(url, siteUrl) {
  for (const candidate of [url, "/logo-moikato-header.png"]) {
    if (!candidate) continue;
    try {
      const absolute = candidate.startsWith("http") ? candidate : `${siteUrl}${candidate}`;
      const response = await fetch(absolute);
      if (response.ok) return Buffer.from(await response.arrayBuffer()).toString("base64");
    } catch {
      // tenta o próximo
    }
  }
  return "";
}

// order: { id, items: [{ name, qty, unitPriceCents, image }], shippingCents, customer, address }
export async function createCheckout({ order, siteUrl, lang, maxInstallments }) {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error("Pagamento não configurado");

  const items = await Promise.all(
    order.items.map(async (item) => ({
      // Asaas aceita no máximo 30 caracteres.
      name: item.name.length > 30 ? `${item.name.slice(0, 29).trimEnd()}…` : item.name,
      quantity: item.qty,
      value: item.unitPriceCents / 100,
      imageBase64: await imageBase64(item.image, siteUrl),
    }))
  );
  if (order.shippingCents > 0) {
    items.push({
      name: "Frete",
      quantity: 1,
      value: order.shippingCents / 100,
      imageBase64: await imageBase64(null, siteUrl),
    });
  }

  const back = `${siteUrl}/${lang}/pedido/${order.id}`;
  const response = await fetch(`${BASE}/v3/checkouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", access_token: apiKey },
    body: JSON.stringify({
      billingTypes: ["PIX", "CREDIT_CARD"],
      chargeTypes: maxInstallments > 1 ? ["DETACHED", "INSTALLMENT"] : ["DETACHED"],
      ...(maxInstallments > 1 ? { installment: { maxInstallmentCount: maxInstallments } } : {}),
      minutesToExpire: 60,
      externalReference: String(order.id),
      callback: { successUrl: back, cancelUrl: `${siteUrl}/${lang}/checkout`, expiredUrl: back },
      items,
      customerData: {
        name: order.customer.name,
        cpfCnpj: order.customer.cpf,
        email: order.customer.email,
        phone: order.customer.phone ?? undefined,
        address: order.address.street,
        addressNumber: Number.parseInt(order.address.number, 10) || undefined,
        complement: order.address.complement || undefined,
        postalCode: order.address.cep,
        province: order.address.district,
      },
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.id) {
    throw new Error(`Asaas ${response.status}: ${JSON.stringify(data.errors ?? data)}`);
  }
  return { id: data.id, link: data.link };
}
