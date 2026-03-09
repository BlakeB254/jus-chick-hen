// ============================================================
// Shared TypeScript interfaces for Jus Chick-Hen
// ============================================================

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  variants: MenuVariant[] | null;
  sort_order: number;
}

export interface MenuVariant {
  label: string;
  price_cents: number;
}

export interface MenuItemWithCategory extends MenuItem {
  category_name: string;
}

export interface Customer {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "picked_up"
  | "cancelled";

export type OrderType = "pickup" | "delivery";

export interface Order {
  id: string;
  customer_id: string | null;
  status: OrderStatus;
  type: OrderType;
  subtotal_cents: number;
  delivery_fee_cents: number;
  tax_cents: number;
  total_cents: number;
  address: string | null;
  notes: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  price_cents: number;
  quantity: number;
  variant: string | null;
  notes: string | null;
}

export interface Setting {
  key: string;
  value: string;
}

export interface AuthToken {
  email: string;
  token: string;
  expires_at: string;
  used_at: string | null;
}

export interface Session {
  email: string;
  session_token: string;
  is_admin: boolean;
  expires_at: string;
}

// ── Cart (client-side) ──

export interface CartItem {
  id: string; // unique cart line ID
  menu_item_id: string;
  name: string;
  price_cents: number;
  quantity: number;
  variant: string | null;
  notes: string | null;
}

// ── API payloads ──

export interface CreateOrderPayload {
  type: OrderType;
  items: {
    menu_item_id: string;
    name: string;
    price_cents: number;
    quantity: number;
    variant?: string;
    notes?: string;
  }[];
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address?: string;
  notes?: string;
}

export interface DeliveryCheckPayload {
  address: string;
}

export interface DeliveryCheckResult {
  available: boolean;
  distance_miles: number;
  delivery_fee_cents: number;
  message: string;
}

// ── Menu grouped for display ──

export interface MenuGrouped {
  category: MenuCategory;
  items: MenuItem[];
}
