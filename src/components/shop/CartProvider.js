"use client";

// Sacola no navegador (localStorage). Guarda um retrato do item só para exibir;
// preço e estoque de verdade são relidos no servidor no checkout.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "moikato-cart-v1";
const CartContext = createContext(null);

function readStorage() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item?.variantId && item?.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children, lang, labels }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    // Hidrata do localStorage depois da montagem (evita divergência com o HTML do servidor).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStorage());
    setReady(true);
    const onStorage = (event) => event.key === STORAGE_KEY && setItems(readStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // modo privado / storage bloqueado: a sacola vive só nesta aba
    }
  }, [items, ready]);

  const add = useCallback((item, qty = 1) => {
    setItems((current) => {
      const existing = current.find((line) => line.variantId === item.variantId);
      const max = item.maxQty ?? 20;
      if (existing) {
        return current.map((line) =>
          line.variantId === item.variantId ? { ...line, ...item, qty: Math.min(line.qty + qty, max) } : line
        );
      }
      return [...current, { ...item, qty: Math.min(qty, max) }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((variantId, qty) => {
    setItems((current) =>
      current
        .map((line) => (line.variantId === variantId ? { ...line, qty: Math.min(qty, line.maxQty ?? 20) } : line))
        .filter((line) => line.qty > 0)
    );
  }, []);

  const remove = useCallback((variantId) => {
    setItems((current) => current.filter((line) => line.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      lang,
      labels,
      count: items.reduce((sum, line) => sum + line.qty, 0),
      subtotalCents: items.reduce((sum, line) => sum + line.priceCents * line.qty, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, ready, lang, labels, isOpen, add, setQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart fora do CartProvider");
  return context;
}
