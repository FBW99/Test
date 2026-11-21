import React, { createContext, useContext, useEffect, useState } from "react";
import { SEED_PRODUCTS, SEED_REVIEWS } from "@/src/data/seedData";
import { DEFAULT_FINANCE_SETTINGS } from "@/src/services/calculations";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/src/services/storage";
import type {
  FinanceSettings,
  Product,
  ProductCategory,
  ProductReview,
} from "@/src/types";

interface NewProductPayload {
  sellerId: string;
  sellerWorkshopLabel: string;
  name: string;
  category: ProductCategory;
  description: string;
  priceETB: number;
  stock: number;
  imageUrl: string;
}

interface MarketplaceContextValue {
  products: Product[];
  approvedProducts: Product[];
  reviews: ProductReview[];
  financeSettings: FinanceSettings;
  addProduct: (payload: NewProductPayload) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  approveProduct: (productId: string) => void;
  rejectProduct: (productId: string, reason: string) => void;
  decrementProductStock: (productId: string, quantity: number) => void;
  addReview: (
    productId: string,
    customerName: string,
    rating: number,
    comment: string
  ) => void;
  updateFinanceSettings: (updates: Partial<FinanceSettings>) => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | undefined>(
  undefined
);

export function MarketplaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS)
  );
  const [reviews, setReviews] = useState<ProductReview[]>(() =>
    readStorage<ProductReview[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS)
  );
  const [financeSettings, setFinanceSettings] = useState<FinanceSettings>(() =>
    readStorage<FinanceSettings>(
      STORAGE_KEYS.FINANCE_SETTINGS,
      DEFAULT_FINANCE_SETTINGS
    )
  );

  useEffect(() => {
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.REVIEWS, reviews);
  }, [reviews]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.FINANCE_SETTINGS, financeSettings);
  }, [financeSettings]);

  const approvedProducts = products.filter((p) => p.status === "approved");

  const addProduct = (payload: NewProductPayload): Product => {
    const newProduct: Product = {
      ...payload,
      id: `prd-${Date.now()}`,
      status: "pending",
      featured: false,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const approveProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, status: "approved", rejectionReason: undefined }
          : p
      )
    );
  };

  const rejectProduct = (productId: string, reason: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, status: "rejected", rejectionReason: reason }
          : p
      )
    );
  };

  const decrementProductStock = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stock: Math.max(0, p.stock - quantity) }
          : p
      )
    );
  };

  const addReview = (
    productId: string,
    customerName: string,
    rating: number,
    comment: string
  ) => {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      customerName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const updateFinanceSettings = (updates: Partial<FinanceSettings>) => {
    setFinanceSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        approvedProducts,
        reviews,
        financeSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        approveProduct,
        rejectProduct,
        decrementProductStock,
        addReview,
        updateFinanceSettings,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx)
    throw new Error("useMarketplace must be used within MarketplaceProvider");
  return ctx;
}
