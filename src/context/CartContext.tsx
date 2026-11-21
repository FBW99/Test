import React, { createContext, useContext, useEffect, useState } from "react";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/src/services/storage";
import type { Product } from "@/src/types";

export interface CartEntry {
  productId: string;
  quantity: number;
}

export interface HydratedCartItem {
  product: Product;
  quantity: number;
  lineTotalETB: number;
}

interface CartContextValue {
  entries: CartEntry[];
  totalItemsCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  hydrateCart: (products: Product[]) => HydratedCartItem[];
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>(() =>
    readStorage<CartEntry[]>(STORAGE_KEYS.CART, [])
  );

  useEffect(() => {
    writeStorage(STORAGE_KEYS.CART, entries);
  }, [entries]);

  const totalItemsCount = entries.reduce((sum, e) => sum + e.quantity, 0);

  const addToCart = (productId: string, quantity = 1) => {
    setEntries((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setEntries((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setEntries((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setEntries([]);
  };

  const hydrateCart = (products: Product[]): HydratedCartItem[] => {
    return entries
      .map((entry) => {
        const product = products.find(
          (p) => p.id === entry.productId && p.status === "approved"
        );
        if (!product) return null;
        return {
          product,
          quantity: entry.quantity,
          lineTotalETB: product.priceETB * entry.quantity,
        };
      })
      .filter((x): x is HydratedCartItem => x !== null);
  };

  return (
    <CartContext.Provider
      value={{
        entries,
        totalItemsCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        hydrateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
