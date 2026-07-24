import type { Metadata } from "next";
import { Manrope, Luckiest_Guy } from "next/font/google";
import localFont from "next/font/local";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import IntroOverlay from "@/components/IntroOverlay";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-luckiest-guy",
  display: "swap",
});

const clashDisplay = localFont({
  src: [
    { path: "../fonts/clash-display/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/clash-display/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/clash-display/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/clash-display/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Genio Music",
  description: "Venta de beats premium.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${luckiestGuy.variable} ${clashDisplay.variable}`}
    >
      <body>
        <CartProvider>
          <IntroOverlay />
          <Navbar />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
