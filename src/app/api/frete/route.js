// Cotação de frete para a página de produto e o checkout.
// POST { cep, items: [{ variantId, qty }] } → { options: [...], freeShippingCents }
import { loadCartLines } from "../../../lib/orders";
import { quoteShipping } from "../../../lib/melhorenvio";
import { getStoreSettings, shippingReady } from "../../../lib/settings";

export async function POST(request) {
  if (!shippingReady) return Response.json({ error: "unavailable" }, { status: 503 });

  const body = await request.json().catch(() => null);
  const lines = (await loadCartLines(body?.items, "pt-BR")).filter((line) => line.unitPriceCents != null);
  if (lines.length === 0) return Response.json({ error: "empty" }, { status: 400 });

  try {
    const [options, settings] = await Promise.all([
      quoteShipping(
        body?.cep,
        lines.map((line) => ({ weightG: line.weightG, packageId: line.packageId, priceCents: line.unitPriceCents, qty: line.qty }))
      ),
      getStoreSettings(),
    ]);
    const subtotal = lines.reduce((sum, line) => sum + line.unitPriceCents * line.qty, 0);
    const free = settings.freeShippingCents != null && subtotal >= settings.freeShippingCents;
    return Response.json({
      options: options.map((option, index) => ({ ...option, priceCents: free && index === 0 ? 0 : option.priceCents })),
    });
  } catch (error) {
    const invalid = String(error?.message).includes("CEP");
    return Response.json({ error: invalid ? "invalid" : "failed" }, { status: invalid ? 400 : 502 });
  }
}
