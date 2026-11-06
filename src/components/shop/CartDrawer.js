"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatBRL } from "../../lib/money";
import { useCart } from "./CartProvider";

export function QtyStepper({ qty, max, onChange, labels, size = "sm" }) {
  const box = size === "sm" ? "h-9 w-9" : "h-12 w-11";
  return (
    <div className="inline-flex items-center border border-verdemoikato/20 text-verdemoikato">
      <button type="button" aria-label={labels.decrease} onClick={() => onChange(qty - 1)} className={`${box} text-base hover:bg-verdemoikato/5`}>
        −
      </button>
      <span className="min-w-7 text-center text-sm tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        aria-label={labels.increase}
        onClick={() => onChange(qty + 1)}
        disabled={max != null && qty >= max}
        className={`${box} text-base hover:bg-verdemoikato/5 disabled:opacity-25`}
      >
        +
      </button>
    </div>
  );
}

function FreeShippingBar({ subtotalCents, thresholdCents, labels }) {
  if (thresholdCents == null) return null;
  const reached = subtotalCents >= thresholdCents;
  const pct = Math.min(100, Math.round((subtotalCents / thresholdCents) * 100));
  return (
    <div className="border-b border-verdemoikato/10 px-6 py-4">
      <p className="text-[0.82rem] text-verdemoikato/75">
        {reached ? labels.freeShippingReached : labels.freeShippingLeft.replace("{value}", formatBRL(thresholdCents - subtotalCents))}
      </p>
      <div className="mt-2 h-px bg-verdemoikato/15">
        <div className="h-px bg-amarelomoikato-700 transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotalCents, labels, config, gift, setGift, lang, count } = useCart();
  const panel = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <div className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-floresta-900/30 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        className={`absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-osso outline-none transition-transform duration-500 ease-out motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 pb-4 pt-6">
          <h2 className="font-display text-[1.75rem] font-light text-verdemoikato">
            {labels.title}
            {count > 0 && <span className="ml-2 align-middle font-sans text-sm text-verdemoikato/45">{count}</span>}
          </h2>
          <button type="button" onClick={close} aria-label={labels.close} className="grid size-11 place-items-center text-2xl font-light text-verdemoikato/70 hover:text-verdemoikato">
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-display text-xl text-verdemoikato/70">{labels.empty}</p>
            <Link
              href={`/${lang}/catalogo`}
              onClick={close}
              className="text-[0.78rem] tracking-[0.14em] text-verdemoikato underline underline-offset-[6px]"
            >
              {labels.continue.toUpperCase()}
            </Link>
          </div>
        ) : (
          <>
            <FreeShippingBar subtotalCents={subtotalCents} thresholdCents={config?.freeShippingCents} labels={labels} />

            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-verdemoikato/10 px-6">
                {items.map((line) => (
                  <li key={line.variantId} className="grid grid-cols-[84px_1fr] gap-4 py-5">
                    <Link href={`/${lang}/catalogo/${line.slug}`} onClick={close} className="relative aspect-[4/5] overflow-hidden bg-areia-100">
                      {line.image && <Image src={line.image} alt="" fill sizes="84px" className="object-cover" />}
                    </Link>
                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-lg leading-tight text-verdemoikato">{line.name}</p>
                          {line.label && <p className="mt-0.5 text-[0.78rem] text-verdemoikato/55">{line.label}</p>}
                        </div>
                        <p className="shrink-0 text-sm text-verdemoikato">{formatBRL(line.priceCents * line.qty)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <QtyStepper qty={line.qty} max={line.maxQty} onChange={(qty) => setQty(line.variantId, qty)} labels={labels} />
                        <button
                          type="button"
                          onClick={() => remove(line.variantId)}
                          className="min-h-11 text-[0.78rem] text-verdemoikato/50 underline-offset-4 hover:text-verdemoikato hover:underline"
                        >
                          {labels.remove}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {config?.giftWrapEnabled && (
                <div className="mx-6 mb-6 border-t border-verdemoikato/10 pt-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={gift.wrap}
                      onChange={(e) => setGift({ ...gift, wrap: e.target.checked })}
                      className="mt-1 size-4 accent-verdemoikato"
                    />
                    <span>
                      <span className="block text-[0.9rem] text-verdemoikato">{labels.gift.wrap}</span>
                      <span className="block text-[0.78rem] text-verdemoikato/55">{labels.gift.note}</span>
                    </span>
                  </label>
                  {gift.wrap && (
                    <label className="mt-3 block">
                      <span className="sr-only">{labels.gift.message}</span>
                      <textarea
                        value={gift.message}
                        onChange={(e) => setGift({ ...gift, message: e.target.value.slice(0, 300) })}
                        rows={3}
                        placeholder={labels.gift.placeholder}
                        className="block w-full border border-verdemoikato/20 bg-white/60 px-3 py-2 font-display text-base italic text-verdemoikato placeholder:text-verdemoikato/35 focus:border-verdemoikato focus:outline-none"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            <footer className="border-t border-verdemoikato/10 px-6 pb-6 pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.85rem] text-verdemoikato/70">{labels.subtotal}</span>
                <span className="font-display text-2xl text-verdemoikato">{formatBRL(subtotalCents)}</span>
              </div>
              <p className="mt-1 text-[0.75rem] text-verdemoikato/50">{labels.shippingNote}</p>
              <Link
                href={`/${lang}/checkout`}
                onClick={close}
                className="mt-5 flex min-h-12 w-full items-center justify-center bg-floresta text-[0.78rem] tracking-[0.14em] text-osso transition-colors hover:bg-verdemoikato"
              >
                {labels.checkout.toUpperCase()}
              </Link>
              <button type="button" onClick={close} className="mt-2 min-h-11 w-full text-[0.78rem] text-verdemoikato/55 hover:text-verdemoikato">
                {labels.continue}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
