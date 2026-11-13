"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ProductLite } from "@/lib/product";

export type CartLine = { slug: string; name: string; sku: string; price: number; image?: string; qty: number };

type Cart = {
  lines: CartLine[];
  /** False until the saved cart has been read from this browser. */
  ready: boolean;
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: ProductLite, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  /** Applies current catalog prices; drops lines whose product is no longer sold. */
  reprice: (prices: Record<string, number>) => void;
};

const Ctx = createContext<Cart | null>(null);
const KEY = "sarumadi-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) setLines(saved.filter(isLine));
    } catch {
      // corrupt storage: start with an empty cart
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((p: ProductLite, qty = 1) => {
    setLines((ls) => {
      const hit = ls.find((l) => l.slug === p.slug);
      if (hit) return ls.map((l) => (l === hit ? { ...l, qty: Math.min(999, l.qty + qty) } : l));
      return [...ls, { slug: p.slug, name: p.name, sku: p.sku, price: p.price, image: p.images[0], qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.slug !== slug) : ls.map((l) => (l.slug === slug ? { ...l, qty: Math.min(999, qty) } : l))));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const reprice = useCallback((prices: Record<string, number>) => {
    setLines((ls) => {
      const next = ls.filter((l) => l.slug in prices).map((l) => (prices[l.slug] === l.price ? l : { ...l, price: prices[l.slug] }));
      return next.length === ls.length && next.every((l, i) => l === ls[i]) ? ls : next;
    });
  }, []);

  const value = useMemo<Cart>(
    () => ({
      lines,
      ready,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * l.price, 0),
      open,
      setOpen,
      add,
      setQty,
      clear,
      reprice,
    }),
    [lines, ready, open, add, setQty, clear, reprice],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const isLine = (l: unknown): l is CartLine => {
  const o = l as CartLine;
  return !!o && typeof o.slug === "string" && typeof o.name === "string" && typeof o.sku === "string" && Number.isFinite(o.price) && Number.isInteger(o.qty) && o.qty > 0;
};

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
