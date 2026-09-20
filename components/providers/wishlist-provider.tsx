"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "rise.wishlist.v1";

type WishlistContextValue = {
  ids: Set<string>;
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/wishlist")
        .then((res) => (res.ok ? res.json() : { data: [] }))
        .then((body) => setIds(new Set((body.data ?? []).map((item: { productId: string }) => item.productId))))
        .catch(() => undefined);
      return;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(new Set(JSON.parse(raw)));
    } catch {
      // ignore corrupt local storage
    }
  }, [isAuthenticated]);

  const persistLocal = useCallback((next: Set<string>) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // ignore storage failure
    }
  }, []);

  const toggle = useCallback(
    (productId: string) => {
      setIds((current) => {
        const next = new Set(current);
        const adding = !next.has(productId);
        if (adding) next.add(productId);
        else next.delete(productId);

        if (isAuthenticated) {
          fetch("/api/wishlist", {
            method: adding ? "POST" : "DELETE",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ productId }),
          }).catch(() => undefined);
        } else {
          persistLocal(next);
        }

        return next;
      });
    },
    [isAuthenticated, persistLocal],
  );

  const isWishlisted = useCallback((productId: string) => ids.has(productId), [ids]);

  const value = useMemo(() => ({ ids, toggle, isWishlisted }), [ids, toggle, isWishlisted]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
