// Cupons: validação e cálculo do desconto. Usado na prévia do checkout e de
// novo, no servidor, na hora de criar o pedido (o navegador só manda o código).
import "server-only";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { coupons } from "./db/schema";

export const MIN_TOTAL_CENTS = 100; // a InfinitePay não cobra menos de R$ 1,00

export const normalizeCode = (code) =>
  String(code ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .slice(0, 40);

export async function findCoupon(code) {
  const normalized = normalizeCode(code);
  if (!normalized) return null;
  const [coupon] = await db.select().from(coupons).where(eq(coupons.code, normalized));
  return coupon ?? null;
}

// Retorna { ok: true, code, discountCents, freeShipping } ou { ok: false, reason, minSubtotalCents? }.
// O desconto vale sobre o subtotal das peças; "free_shipping" zera o frete.
export function evaluateCoupon(coupon, { subtotalCents, shippingCents = 0, now = new Date() }) {
  if (!coupon || !coupon.active) return { ok: false, reason: "invalid" };
  if (coupon.startsAt && now < coupon.startsAt) return { ok: false, reason: "invalid" };
  if (coupon.endsAt && now > coupon.endsAt) return { ok: false, reason: "expired" };
  if (coupon.maxUses != null && coupon.usesCount >= coupon.maxUses) return { ok: false, reason: "usedUp" };
  if (coupon.minSubtotalCents != null && subtotalCents < coupon.minSubtotalCents) {
    return { ok: false, reason: "min", minSubtotalCents: coupon.minSubtotalCents };
  }

  if (coupon.type === "free_shipping") return { ok: true, code: coupon.code, discountCents: 0, freeShipping: true };

  let discountCents = coupon.type === "percent" ? Math.round((subtotalCents * coupon.value) / 100) : coupon.value;
  // Vale só sobre as peças (nunca sobre o frete) e deixa ao menos R$ 1,00 nelas,
  // o mínimo que a InfinitePay cobra.
  discountCents = Math.max(0, Math.min(discountCents, subtotalCents - MIN_TOTAL_CENTS));
  return { ok: true, code: coupon.code, discountCents, freeShipping: false };
}

// Conta o uso só quando o pagamento é confirmado.
export async function registerCouponUse(code) {
  if (!code) return;
  await db
    .update(coupons)
    .set({ usesCount: sql`${coupons.usesCount} + 1` })
    .where(eq(coupons.code, normalizeCode(code)));
}

// Espalha o desconto entre as linhas (proporcional ao valor de cada uma), para
// o link de pagamento somar exatamente o total do pedido. Cada linha vira
// quantidade 1 com o valor da linha ("2× Brinco Hélia").
export function distributeDiscount(lines, discountCents) {
  if (!discountCents) return lines.map((line) => ({ name: line.name, qty: line.qty, unitPriceCents: line.unitPriceCents }));
  const totals = lines.map((line) => line.unitPriceCents * line.qty);
  const subtotal = totals.reduce((sum, value) => sum + value, 0);
  const shares = totals.map((value) => Math.floor((value * discountCents) / subtotal));
  // Centavos que sobram do arredondamento vão para a linha mais cara.
  const largest = totals.indexOf(Math.max(...totals));
  shares[largest] += discountCents - shares.reduce((sum, value) => sum + value, 0);
  return lines
    .map((line, index) => ({
      name: line.qty > 1 ? `${line.qty}× ${line.name}` : line.name,
      qty: 1,
      unitPriceCents: totals[index] - shares[index],
    }))
    .filter((item) => item.unitPriceCents > 0);
}
