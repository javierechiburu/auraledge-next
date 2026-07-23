import { Product, Testimonial } from "./types";

// Datos de respaldo: se usan cuando Strapi no está disponible,
// de modo que la web funcione en desarrollo sin backend levantado.
export const mockProducts: Product[] = [
  {
    id: 1,
    slug: "auraledge-pro-x",
    name: "AuralEdge Pro X",
    subtitle: "Studio grade precision for audiophiles",
    description:
      "Experience audio grade sound with dual dynamic drivers and Hi-Res Audio. Designed for precision, deep bass and all day comfort.",
    price: 349.99,
    compareAtPrice: 499.99,
    tag: "Best Seller",
    badge: "-30%",
    features: ["40h Battery", "Dual Drivers", "Hi-Res Audio"],
    batteryHours: 40,
    noiseCancelling: 99,
    bestValue: true,
    highlight: true,
    image: null,
  },
  {
    id: 2,
    slug: "auraledge-studio",
    name: "AuralEdge Studio",
    subtitle: "Reference sound for creators",
    description:
      "Reference-grade planar magnetic drivers tuned for mixing and mastering. Flat response, zero coloration.",
    price: 279.99,
    compareAtPrice: 369.99,
    tag: "Pro",
    badge: "-25%",
    features: ["50h Battery", "Planar Magnetic", "USB-C DAC"],
    batteryHours: 50,
    noiseCancelling: 96,
    bestValue: true,
    highlight: false,
    image: null,
  },
  {
    id: 3,
    slug: "auraledge-one",
    name: "AuralEdge One",
    subtitle: "Premium wireless for daily use",
    description:
      "Everyday premium wireless with adaptive noise cancellation and fast charging for life on the move.",
    price: 199.99,
    compareAtPrice: null,
    tag: "Best Seller",
    badge: null,
    features: ["ANC", "30h", "Fast Charge"],
    batteryHours: 30,
    noiseCancelling: 94,
    bestValue: false,
    highlight: false,
    image: null,
  },
  {
    id: 4,
    slug: "auraledge-two",
    name: "AuralEdge Two",
    subtitle: "Premium wireless for daily use",
    description:
      "Hi-Res certified with multipoint pairing and 40 hours of playback for uninterrupted listening.",
    price: 229.99,
    compareAtPrice: null,
    tag: "New",
    badge: null,
    features: ["Hi-Res", "40h", "Multipoint"],
    batteryHours: 40,
    noiseCancelling: 95,
    bestValue: false,
    highlight: false,
    image: null,
  },
  {
    id: 5,
    slug: "auraledge-air",
    name: "AuralEdge Air",
    subtitle: "Ultra-light everyday comfort",
    description:
      "Featherweight design with Bluetooth 5.4 and 35 hours of battery — comfort you forget you're wearing.",
    price: 159.99,
    compareAtPrice: 189.99,
    tag: "Popular",
    badge: "-15%",
    features: ["Lightweight", "35h", "BT 5.4"],
    batteryHours: 35,
    noiseCancelling: 90,
    bestValue: true,
    highlight: false,
    image: null,
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sofia P.",
    role: "Producer",
    rating: 5,
    quote:
      "These are hands down the best headphones I've ever owned. The soundstage feels massive, and every detail comes through crystal clear.",
    avatar: null,
  },
  {
    id: 2,
    name: "Kevin R.",
    role: "Music Editor",
    rating: 5,
    quote:
      "The noise cancellation is incredible. I wear them all day at the studio and the comfort never gets old. Worth every cent.",
    avatar: null,
  },
  {
    id: 3,
    name: "Aria L.",
    role: "DJ / Creator",
    rating: 5,
    quote:
      "Battery life is unreal — I charge them once a week. The bass is deep without being muddy. Absolutely love them.",
    avatar: null,
  },
  {
    id: 4,
    name: "Marco T.",
    role: "Audiophile",
    rating: 5,
    quote:
      "Elegant design and pure sound. AuralEdge nailed the balance between style and performance. Highly recommended.",
    avatar: null,
  },
  {
    id: 5,
    name: "Elena V.",
    role: "Podcaster",
    rating: 5,
    quote:
      "Switching between my laptop and phone is seamless. Build quality feels premium and the fit is perfect for long sessions.",
    avatar: null,
  },
  {
    id: 6,
    name: "James H.",
    role: "Traveler",
    rating: 5,
    quote:
      "I travel constantly and these block out everything. The clarity on calls and music is next level. A total game changer.",
    avatar: null,
  },
];
