"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "../../lib/products";

const CartCtx = createContext(null);
const KEY = "brighty-cart-v1";

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((i) => i && getProduct(i.slug) && Number.isInteger(i.qty) && i.qty >= 1 && i.qty <= 99);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(load());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return; // jangan timpa localStorage sebelum load awal selesai
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch { /* mode memori */ }
  }, [lines, hydrated]);

  const value = useMemo(() => {
    const items = lines.map((l) => ({ ...getProduct(l.slug), size: l.size, color: l.color, qty: l.qty }));
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    const add = (slug, size, color, qty = 1) =>
      setLines((prev) => {
        const ix = prev.findIndex((l) => l.slug === slug && l.size === size && l.color === color);
        if (ix >= 0) {
          const next = [...prev];
          next[ix] = { ...next[ix], qty: Math.min(99, next[ix].qty + qty) };
          return next;
        }
        return [...prev, { slug, size, color, qty }];
      });
    const setQty = (slug, size, color, qty) =>
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => !(l.slug === slug && l.size === size && l.color === color))
          : prev.map((l) => (l.slug === slug && l.size === size && l.color === color ? { ...l, qty: Math.min(99, qty) } : l))
      );
    const remove = (slug, size, color) =>
      setLines((prev) => prev.filter((l) => !(l.slug === slug && l.size === size && l.color === color)));
    const clear = () => setLines([]);
    return { items, count, subtotal, add, setQty, remove, clear, open, setOpen };
  }, [lines, open]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);
