"use client";

// Sacola no navegador (localStorage). Guarda um retrato do item só para exibir;
// preço e estoque de verdade são relidos no servidor no checkout.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "moikato-cart-v1";
const GIFT_KEY = "moikato-gift-v1";
const CartContext = createContext(null);

function readStorage() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item?.variantId && item?.qty > 0) : [];
  } catch {
    return [];
  }
}

function readGift() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(GIFT_KEY) ?? "{}");
    return { wrap: Boolean(parsed.wrap), message: String(parsed.message ?? "").slice(0, 300) };
  } catch {
    return { wrap: false, message: "" };
  }
}

export function CartProvider({ children, lang, labels, config }) {
  const [items, setItems] = useState([]);
  const [gift, setGift] = useState({ wrap: false, message: "" });
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  // Último item adicionado — alimenta a confirmação discreta na página.
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    // Hidrata do localStorage depois da montagem (evita divergência com o HTML do servidor).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStorage());
    setGift(readGift());
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

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(GIFT_KEY, JSON.stringify(gift));
    } catch {
      // idem
    }
  }, [gift, ready]);

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
    // Sem abrir a gaveta: a página mostra uma confirmação discreta.
    setLastAdded({ ...item, qty, at: Date.now() });
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

  const clear = useCallback(() => {
    setItems([]);
    setGift({ wrap: false, message: "" });
  }, []);

  const value = useMemo(
    () => ({
      items,
      ready,
      lang,
      labels,
      config,
      count: items.reduce((sum, line) => sum + line.qty, 0),
      subtotalCents: items.reduce((sum, line) => sum + line.priceCents * line.qty, 0),
      isOpen,
      lastAdded,
      gift,
      setGift,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, ready, lang, labels, config, isOpen, lastAdded, gift, add, setQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart fora do CartProvider");
  return context;
}
