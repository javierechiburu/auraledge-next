"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { apiPost, ApiError } from "@/lib/http";
import { Customer, MPPreferenceResponse } from "@/lib/types";
import CartSummary from "@/components/checkout/CartSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import MercadoPagoNotice from "@/components/checkout/MercadoPagoNotice";

export default function CheckoutPage() {
  const { items, total, setQty, removeItem } = useCart();
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const { init_point } = await apiPost<MPPreferenceResponse>(
        "/api/checkout",
        {
          items,
          customer,
        },
      );
      window.location.href = init_point;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo iniciar el pago. Intenta nuevamente.",
      );
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black pb-20 pt-40 text-center">
        <div className="mx-auto max-w-160 px-6">
          <h1 className="font-display text-3xl normal-case">
            Tu carrito está vacío
          </h1>
          <p className="mt-3 text-muted">
            Explora la colección y agrega tus beats favoritos.
          </p>
          <Link href="/beats" className="btn btn-primary mt-8 inline-flex">
            Ver beats
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pb-24 pt-32">
      <div className="mx-auto max-w-290 px-6">
        <div className="mb-12">
          <h1 className="font-display text-[clamp(30px,4vw,46px)] normal-case">
            Checkout
          </h1>
          <p className="mt-3 max-w-lg text-[15px] text-muted">
            Revisa tu pedido y completa tus datos de contacto para pagar de
            forma segura con Mercado Pago.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <CartSummary
            items={items}
            total={total}
            onQtyChange={setQty}
            onRemove={removeItem}
          />

          <div className="space-y-6">
            <CheckoutForm
              customer={customer}
              onChange={setCustomer}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              disabled={!customer.name || !customer.email}
            />
            <MercadoPagoNotice />
          </div>
        </div>
      </div>
    </main>
  );
}
