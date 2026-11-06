"use client";

import { useState } from "react";
import { formatBRL } from "../../lib/money";
import { installmentsFor, pixPriceFor } from "../../lib/pricing";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./CartDrawer";
import ShippingEstimator from "./ShippingEstimator";

const BUYABLE = new Set(["available", "low"]);

function stockLabel(variant, piece, t) {
  if (variant.state === "soldout") return { text: t.soldOut, tone: "text-terra-700" };
  if (piece.madeToOrder) return { text: t.madeToOrder, tone: "text-verdemoikato/70" };
  if (piece.isUnique || variant.stock === 1) return { text: piece.isUnique ? t.uniquePiece : t.lastUnit, tone: "text-amarelomoikato-700" };
  if (variant.state === "low") return { text: t.lowStock.replace("{n}", variant.stock), tone: "text-amarelomoikato-700" };
  if (variant.stock != null) return { text: t.inStock, tone: "text-verdemoikato/70" };
  return null;
}

export default function ProductPurchase({ piece, pricing, salesLive, shippingReady, t }) {
  const { add, labels: cartLabels } = useCart();
  const initial = piece.variants.find((v) => BUYABLE.has(v.state)) ?? piece.variants[0];
  const [variantId, setVariantId] = useState(initial?.id);
  const [qty, setQty] = useState(1);
  const variant = piece.variants.find((v) => v.id === variantId) ?? initial;
  if (!variant) return null;

  const maxQty = piece.isUnique ? 1 : variant.stock ?? 10;
  const priced = variant.priceCents != null;
  const installments = priced ? installmentsFor(variant.priceCents, pricing) : null;
  const pix = priced ? pixPriceFor(variant.priceCents, pricing) : null;
  const stock = priced ? stockLabel(variant, piece, t) : null;
  const canBuy = salesLive && BUYABLE.has(variant.state);

  let cta = t.addToCart;
  if (!priced) cta = t.comingSoon;
  else if (variant.state === "soldout") cta = t.soldOut;
  else if (!salesLive) cta = t.salesSoon;

  function addToCart() {
    add(
      {
        variantId: variant.id,
        slug: piece.slug,
        name: piece.name,
        label: piece.variants.length > 1 ? variant.label : null,
        image: piece.image,
        priceCents: variant.priceCents,
        maxQty,
      },
      qty
    );
  }

  return (
    <div>
      {/* Preço */}
      <div className="mt-4">
        {priced ? (
          <>
            <p className="font-display text-3xl text-verdemoikato sm:text-4xl">{formatBRL(variant.priceCents)}</p>
            {installments && (
              <p className="mt-1 text-sm text-verdemoikato/70">
                {t.installments.replace("{count}", installments.count).replace("{each}", formatBRL(installments.eachCents))}
              </p>
            )}
            {pix && (
              <p className="mt-0.5 text-sm text-verdemoikato/70">
                {t.pix.replace("{price}", formatBRL(pix))}{" "}
                <span className="font-semibold text-amarelomoikato-700">{t.pixOff.replace("{pct}", pricing.pixDiscountPercent)}</span>
              </p>
            )}
          </>
        ) : (
          <>
            <p className="font-display text-3xl text-verdemoikato sm:text-4xl">{piece.price}</p>
            {piece.priceNote && <p className="mt-1 text-sm text-verdemoikato/60">{piece.priceNote}</p>}
          </>
        )}
      </div>

      {/* Variações */}
      {piece.variants.length > 1 && (
        <fieldset className="mt-6">
          <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60">{t.option}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {piece.variants.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setVariantId(option.id);
                  setQty(1);
                }}
                aria-pressed={option.id === variant.id}
                className={`min-h-11 border px-4 text-sm transition-colors ${
                  option.id === variant.id
                    ? "border-verdemoikato bg-verdemoikato text-osso"
                    : "border-verdemoikato/25 text-verdemoikato hover:border-verdemoikato"
                } ${option.state === "soldout" ? "line-through opacity-50" : ""}`}
              >
                {option.label ?? option.sku}
                {option.priceCents != null && option.priceCents !== piece.priceCents && (
                  <span className="ml-2 opacity-70">{formatBRL(option.priceCents)}</span>
                )}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {stock && <p className={`mt-5 text-sm font-medium ${stock.tone}`}>● {stock.text}</p>}

      {/* Compra */}
      <div className="mt-5 flex gap-3">
        {canBuy && maxQty > 1 && (
          <QtyStepper qty={qty} max={maxQty} onChange={(next) => setQty(Math.max(1, next))} labels={cartLabels} size="lg" />
        )}
        <button
          type="button"
          onClick={addToCart}
          disabled={!canBuy}
          className="flex min-h-12 flex-1 items-center justify-center bg-verdemoikato px-6 text-sm font-semibold uppercase tracking-[0.13em] text-osso transition-colors hover:bg-floresta disabled:cursor-not-allowed disabled:bg-verdemoikato/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarelomoikato focus-visible:ring-offset-2"
        >
          {cta}
        </button>
      </div>
      {priced && !salesLive && variant.state !== "soldout" && <p className="mt-3 text-sm text-verdemoikato/60">{t.salesSoonNote}</p>}
      {pricing.freeShippingCents != null && priced && (
        <p className="mt-3 text-sm text-verdemoikato/70">{t.freeShippingFrom.replace("{value}", formatBRL(pricing.freeShippingCents))}</p>
      )}

      {shippingReady && priced && <ShippingEstimator items={[{ variantId: variant.id, qty }]} labels={t.shipping} />}
    </div>
  );
}
