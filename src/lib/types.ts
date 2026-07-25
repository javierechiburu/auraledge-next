export interface StrapiImage {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

export interface Product {
  id: number;
  documentId?: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  tag?: string | null;
  badge?: string | null;
  features: string[];
  batteryHours?: number | null;
  noiseCancelling?: number | null;
  bestValue?: boolean;
  highlight?: boolean;
  image?: StrapiImage | null;
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image?: string | null;
  qty: number;
}

export interface Customer {
  name: string;
  email: string;
  phone?: string;
}

export type OrderStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  customer: Customer;
  total: number;
  status: OrderStatus;
  mpPreferenceId?: string | null;
  mpPaymentId?: string | null;
}

export interface CheckoutPayload {
  items: CartItem[];
  customer: Customer;
}

export interface MPPreferenceResponse {
  orderId: string;
  init_point: string;
}
