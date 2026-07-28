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
  /** Categoría del producto (una de CATEGORIES). */
  category?: string | null;
  features: string[];
  /** Género musical (Trap, Reggaetón, Drill…). */
  genre?: string | null;
  /** Tempo en BPM. */
  bpm?: number | null;
  /** Tonalidad (Am, C#…). */
  musicalKey?: string | null;
  /** Duración total de la pista en segundos. */
  durationSeconds?: number | null;
  /** Segundos de preview permitidos (fallback si el clip no está pre-cortado). */
  previewSeconds?: number | null;
  /** URL pública del clip de preview (audio). Nunca la pista completa. */
  previewUrl?: string | null;
  bestValue?: boolean;
  highlight?: boolean;
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
  /** ISO timestamp del momento en que se envió el correo de descarga. Idempotencia. */
  fulfilledAt?: string | null;
  /** Monto neto recibido tras comisiones de Mercado Pago. */
  netAmount?: number | null;
  /** Comisión total cobrada por Mercado Pago. */
  mpFee?: number | null;
}

export interface CheckoutPayload {
  items: CartItem[];
  customer: Customer;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  /** Calculado en el servidor a partir de ADMIN_EMAILS. */
  isAdmin?: boolean;
}

/** Orden tal como se muestra en el perfil, con links de descarga si está pagada. */
export interface UserOrder {
  id: string;
  documentId?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt?: string;
  /** Presente solo si la orden está `approved`: { slug -> url firmada }. */
  downloads?: { slug: string; name: string; url: string }[];
}

export interface MPPreferenceResponse {
  orderId: string;
  init_point: string;
}

export interface SalesStats {
  grossRevenue: number;
  netRevenue: number;
  fees: number;
  salesCount: number;
  avgTicket: number;
  monthly: { month: string; revenue: number }[];
  topBeats: { slug: string; name: string; revenue: number; qty: number }[];
}
