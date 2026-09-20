"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, CartProduct } from "@/lib/types";

const STORAGE_KEY = "rise.cart.v1";

type CartContextValue = {
  lines: CartLine[];
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  addItem: (product: CartProduct, size: string, quantity?: number) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  removeItem: (id: string, size: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt local storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage may be unavailable (private mode) - fail silently
    }
  }, [lines, hydrated]);

  const addItem = useCallback((product: CartProduct, size: string, quantity = 1) => {
    setLines((current) => {
      const match = current.find((line) => line.id === product.id && line.size === size);
      if (match) {
        return current.map((line) =>
          line.id === product.id && line.size === size
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }
      return [...current, { ...product, size, quantity }];
    });
    setBagOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, size: string, delta: number) => {
    setLines((current) =>
      current
        .map((line) => (line.id === id && line.size === size ? { ...line, quantity: line.quantity + delta } : line))
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    setLines((current) => current.filter((line) => !(line.id === id && line.size === size)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + line.price * line.quantity, 0), [lines]);

  const value = useMemo(
    () => ({ lines, bagOpen, setBagOpen, addItem, updateQuantity, removeItem, clear, count, subtotal }),
    [lines, bagOpen, addItem, updateQuantity, removeItem, clear, count, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
