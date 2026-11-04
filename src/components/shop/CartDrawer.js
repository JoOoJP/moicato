"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatBRL } from "../../lib/money";
import { useCart } from "./CartProvider";

export function QtyStepper({ qty, max, onChange, labels, size = "sm" }) {
  const box = size === "sm" ? "h-9 w-9" : "h-12 w-12";
  return (
    <div className="inline-flex items-center border border-verdemoikato/25">
      <button type="button" aria-label={labels.decrease} onClick={() => onChange(qty - 1)} className={`${box} text-lg hover:bg-verdemoikato/5`}>
        −
      </button>
      <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        aria-label={labels.increase}
        onClick={() => onChange(qty + 1)}
        disabled={max != null && qty >= max}
        className={`${box} text-lg hover:bg-verdemoikato/5 disabled:opacity-30`}
      >
        +
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotalCents, labels, lang, count } = useCart();
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
    <div className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-floresta-900/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-osso shadow-2xl outline-none transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-verdemoikato/15 px-5 py-4">
          <h2 className="font-display text-2xl text-verdemoikato">
            {labels.title} {count > 0 && <span className="text-base text-verdemoikato/50">({count})</span>}
          </h2>
          <button type="button" onClick={close} aria-label={labels.close} className="grid size-11 place-items-center text-2xl text-verdemoikato">
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-verdemoikato/70">{labels.empty}</p>
            <Link
              href={`/${lang}/catalogo`}
              onClick={close}
              className="inline-flex min-h-12 items-center bg-verdemoikato px-6 text-xs font-semibold uppercase tracking-[0.13em] text-osso hover:bg-floresta"
            >
              {labels.continue}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-verdemoikato/10 overflow-y-auto px-5">
              {items.map((line) => (
                <li key={line.variantId} className="grid grid-cols-[80px_1fr] gap-4 py-5">
                  <Link href={`/${lang}/catalogo/${line.slug}`} onClick={close} className="relative aspect-[4/5] overflow-hidden bg-areia-200">
                    {line.image && <Image src={line.image} alt="" fill sizes="80px" className="object-cover" />}
                  </Link>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-lg leading-tight text-verdemoikato">{line.name}</p>
                        {line.label && <p className="mt-0.5 text-xs text-verdemoikato/55">{line.label}</p>}
                      </div>
                      <p className="shrink-0 text-sm text-verdemoikato">{formatBRL(line.priceCents * line.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyStepper qty={line.qty} max={line.maxQty} onChange={(qty) => setQty(line.variantId, qty)} labels={labels} />
                      <button
                        type="button"
                        onClick={() => remove(line.variantId)}
                        className="min-h-11 text-xs uppercase tracking-[0.12em] text-verdemoikato/55 underline-offset-4 hover:underline"
                      >
                        {labels.remove}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="border-t border-verdemoikato/15 px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm uppercase tracking-[0.12em] text-verdemoikato/70">{labels.subtotal}</span>
                <span className="font-display text-2xl text-verdemoikato">{formatBRL(subtotalCents)}</span>
              </div>
              <p className="mt-1 text-xs text-verdemoikato/55">{labels.shippingNote}</p>
              <Link
                href={`/${lang}/checkout`}
                onClick={close}
                className="mt-4 flex min-h-14 w-full items-center justify-center bg-verdemoikato text-sm font-semibold uppercase tracking-[0.13em] text-osso hover:bg-floresta"
              >
                {labels.checkout}
              </Link>
              <button type="button" onClick={close} className="mt-2 min-h-11 w-full text-xs uppercase tracking-[0.12em] text-verdemoikato/60 hover:text-verdemoikato">
                {labels.continue}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
