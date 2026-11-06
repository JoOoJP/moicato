"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatBRL } from "../../lib/money";
import { installmentsFor, pixPriceFor } from "../../lib/pricing";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./CartDrawer";
import ShippingEstimator from "./ShippingEstimator";

const BUYABLE = new Set(["available", "low"]);

function stockLabel(variant, piece, t) {
  if (variant.state === "soldout") return t.soldOut;
  if (piece.madeToOrder) return t.madeToOrder;
  if (piece.isUnique) return t.uniquePiece;
  if (variant.stock === 1) return t.lastUnit;
  if (variant.state === "low") return t.lowStock.replace("{n}", variant.stock);
  return null;
}

export default function ProductPurchase({ piece, pricing, salesLive, shippingReady, giftWrapEnabled, t }) {
  const { add, open, lastAdded, labels: cartLabels } = useCart();
  const initial = piece.variants.find((v) => BUYABLE.has(v.state)) ?? piece.variants[0];
  const [variantId, setVariantId] = useState(initial?.id);
  const [qty, setQty] = useState(1);
  const [ctaVisible, setCtaVisible] = useState(true);
  const [confirmation, setConfirmation] = useState(null);
  const ctaRef = useRef(null);
  const variant = piece.variants.find((v) => v.id === variantId) ?? initial;

  // Barra fixa no celular quando o botão principal sai da tela.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Confirmação discreta quando ESTA peça entra na sacola; some sozinha.
  useEffect(() => {
    if (!lastAdded || lastAdded.slug !== piece.slug) return;
    setConfirmation(lastAdded);
    const timer = setTimeout(() => setConfirmation(null), 7000);
    return () => clearTimeout(timer);
  }, [lastAdded, piece.slug]);

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

  const button = (extra = "") => (
    <button
      type="button"
      onClick={addToCart}
      disabled={!canBuy}
      className={`flex min-h-12 items-center justify-center bg-floresta px-6 text-[0.78rem] tracking-[0.14em] text-osso transition-colors hover:bg-verdemoikato disabled:cursor-not-allowed disabled:bg-verdemoikato/25 disabled:text-verdemoikato/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarelomoikato focus-visible:ring-offset-2 ${extra}`}
    >
      {cta.toUpperCase()}
    </button>
  );

  return (
    <div>
      {/* Preço */}
      <div className="mt-5">
        {priced ? (
          <>
            <p className="font-display text-[1.9rem] leading-none text-verdemoikato">{formatBRL(variant.priceCents)}</p>
            <p className="mt-2 text-[0.85rem] text-verdemoikato/60">
              {installments && t.installments.replace("{count}", installments.count).replace("{each}", formatBRL(installments.eachCents))}
              {pix && (
                <>
                  {installments ? " · " : ""}
                  {t.pix.replace("{price}", formatBRL(pix))} ({t.pixOff.replace("{pct}", pricing.pixDiscountPercent)})
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <p className="font-display text-[1.9rem] leading-none text-verdemoikato">{piece.price}</p>
            {piece.priceNote && <p className="mt-2 text-[0.85rem] text-verdemoikato/55">{piece.priceNote}</p>}
          </>
        )}
      </div>

      {/* Opções */}
      {piece.variants.length > 1 && (
        <fieldset className="mt-7">
          <legend className="text-[0.78rem] text-verdemoikato/60">{t.option}</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {piece.variants.map((option) => {
              const selected = option.id === variant.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setVariantId(option.id);
                    setQty(1);
                  }}
                  aria-pressed={selected}
                  className={`min-h-11 border px-4 text-[0.85rem] transition-colors ${
                    selected ? "border-verdemoikato text-verdemoikato" : "border-verdemoikato/20 text-verdemoikato/70 hover:border-verdemoikato/60"
                  } ${option.state === "soldout" ? "line-through opacity-50" : ""}`}
                >
                  {option.label ?? option.sku}
                  {option.priceCents != null && option.priceCents !== piece.priceCents && (
                    <span className="ml-2 text-verdemoikato/50">{formatBRL(option.priceCents)}</span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {stock && <p className="mt-6 text-[0.82rem] text-amarelomoikato-700">{stock}</p>}

      {/* Compra */}
      <div ref={ctaRef} className={`flex gap-3 ${stock ? "mt-3" : "mt-7"}`}>
        {canBuy && maxQty > 1 && <QtyStepper qty={qty} max={maxQty} onChange={(next) => setQty(Math.max(1, next))} labels={cartLabels} size="lg" />}
        {button("flex-1")}
      </div>

      {confirmation && (
        <div role="status" className="mt-4 flex items-center gap-3 border border-verdemoikato/15 bg-white/60 p-3 motion-safe:animate-[pageEnter_300ms_ease-out]">
          {confirmation.image && (
            <div className="relative size-12 shrink-0 overflow-hidden bg-areia-100">
              <Image src={confirmation.image} alt="" fill sizes="48px" className="object-cover" />
            </div>
          )}
          <p className="flex-1 text-[0.85rem] text-verdemoikato">{t.addedTitle}</p>
          <button type="button" onClick={open} className="min-h-11 text-[0.82rem] text-verdemoikato underline underline-offset-4 hover:text-floresta">
            {t.viewBag}
          </button>
        </div>
      )}

      {priced && !salesLive && variant.state !== "soldout" && <p className="mt-3 text-[0.82rem] text-verdemoikato/55">{t.salesSoonNote}</p>}

      <ul className="mt-6 space-y-1.5 text-[0.82rem] text-verdemoikato/65">
        {pricing.freeShippingCents != null && priced && <li>{t.freeShippingFrom.replace("{value}", formatBRL(pricing.freeShippingCents))}</li>}
        {giftWrapEnabled && <li>{t.giftWrapNote}</li>}
      </ul>

      {shippingReady && priced && <ShippingEstimator items={[{ variantId: variant.id, qty }]} labels={t.shipping} />}

      {/* Barra fixa no celular */}
      <div
        aria-hidden={ctaVisible}
        inert={ctaVisible}
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-verdemoikato/15 bg-osso/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 min-[900px]:hidden ${
          ctaVisible ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base leading-tight text-verdemoikato">{piece.name}</p>
          <p className="text-[0.8rem] text-verdemoikato/65">{priced ? formatBRL(variant.priceCents) : piece.price}</p>
        </div>
        {button("shrink-0")}
      </div>
    </div>
  );
}
