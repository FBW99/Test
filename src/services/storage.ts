export const STORAGE_KEYS = {
  USERS: "herbiz_users_v4",
  SESSION: "herbiz_session_v4",
  PRODUCTS: "herbiz_products_v4",
  REVIEWS: "herbiz_reviews_v4",
  ORDERS: "herbiz_orders_v4",
  CART: "herbiz_cart_v4",
  NOTIFICATIONS: "herbiz_notifications_v4",
  INQUIRIES: "herbiz_inquiries_v4",
  FINANCE_SETTINGS: "herbiz_finance_settings_v4",
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
