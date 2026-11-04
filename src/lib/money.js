// Dinheiro sempre em centavos (inteiro) no banco; formatação só na borda.
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatBRL(cents) {
  return brl.format(cents / 100);
}

// "89,90" · "1.234,56" · "89.9" · "R$ 120" → centavos. Vazio → null. Inválido → NaN.
export function parseBRLToCents(input) {
  const raw = String(input ?? "").replace(/R\$|\s/g, "");
  if (raw === "") return null;
  // Com vírgula: padrão brasileiro (ponto = milhar). Sem vírgula: ponto = decimal.
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return NaN;
  return Math.round(Number(normalized) * 100);
}

// Valor para preencher um input de preço a partir de centavos.
export function centsToInput(cents) {
  return cents == null ? "" : (cents / 100).toFixed(2).replace(".", ",");
}
