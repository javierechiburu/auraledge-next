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

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar?: StrapiImage | null;
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image?: string | null;
  qty: number;
}
