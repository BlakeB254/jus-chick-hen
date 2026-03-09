// ============================================================
// Shared constants for Jus Chick-Hen
// ============================================================

export const AUTH_CONFIG = {
  MAGIC_LINK_EXPIRY_MINUTES: 15,
  SESSION_EXPIRY_DAYS: 30,
  ADMIN_SESSION_EXPIRY_HOURS: 8,
  ADMIN_PASSWORD_ENV: "ADMIN_PASSWORD",
} as const;

export const DELIVERY_DEFAULTS = {
  RADIUS_MILES: 3,
  FEE_CENTS: 399,
  MIN_ORDER_CENTS: 1500,
} as const;

export const TAX_RATE = 0.1075; // Chicago combined sales tax

export const RESTAURANT_COORDS = {
  lat: 41.8584,
  lng: -87.7148,
} as const;

export const ORDER_STATUS_FLOW = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "picked_up",
  "cancelled",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  picked_up: "Picked Up",
  cancelled: "Cancelled",
};

export const COOKIE_NAMES = {
  CUSTOMER: "jch_session",
  ADMIN: "jch_admin_session",
} as const;

export const SETTINGS_KEYS = {
  DELIVERY_RADIUS_MILES: "delivery_radius_miles",
  DELIVERY_FEE_CENTS: "delivery_fee_cents",
  TAX_RATE: "tax_rate",
  MIN_ORDER_CENTS: "min_order_cents",
  STORE_OPEN: "store_open",
} as const;
