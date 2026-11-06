// Regras de preço exibidas na loja (sem dependências de servidor — usável em
// componentes client). Valores sempre em centavos.

// Maior número de parcelas sem juros respeitando a parcela mínima.
export function installmentsFor(cents, { maxInstallments, minInstallmentCents }) {
  if (!cents || maxInstallments <= 1) return null;
  const count = Math.min(maxInstallments, Math.floor(cents / Math.max(minInstallmentCents, 1)));
  if (count < 2) return null;
  return { count, eachCents: Math.ceil(cents / count) };
}

export function pixPriceFor(cents, { pixDiscountPercent }) {
  if (!cents || !pixDiscountPercent) return null;
  return Math.round(cents * (1 - pixDiscountPercent / 100));
}

// Estado de compra de uma variação.
export function stockState(variant) {
  if (variant.priceCents == null) return "unpriced";
  if (variant.stock == null) return "available"; // estoque não controlado
  if (variant.stock <= 0) return "soldout";
  if (variant.stock <= 2) return "low";
  return "available";
}
