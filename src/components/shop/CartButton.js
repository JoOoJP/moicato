"use client";

import { useCart } from "./CartProvider";

export default function CartButton({ className = "" }) {
  const { count, open, labels, ready } = useCart();

  return (
    <button type="button" onClick={open} aria-label={`${labels.open}${count ? ` (${count})` : ""}`} className={`relative grid size-11 place-items-center ${className}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
        <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
      </svg>
      {ready && count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-amarelomoikato px-1 text-[0.65rem] font-semibold leading-[18px] text-verdemoikato">
          {count}
        </span>
      )}
    </button>
  );
}
