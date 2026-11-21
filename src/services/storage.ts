export const STORAGE_KEYS = {
  USERS: "herbiz_users_v3",
  SESSION: "herbiz_session_v3",
  PRODUCTS: "herbiz_products_v3",
  REVIEWS: "herbiz_reviews_v3",
  ORDERS: "herbiz_orders_v3",
  CART: "herbiz_cart_v3",
  NOTIFICATIONS: "herbiz_notifications_v3",
  INQUIRIES: "herbiz_inquiries_v3",
  FINANCE_SETTINGS: "herbiz_finance_settings_v3",
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in demo mode
  }
}

export function clearAllMarketplaceStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  });
}
