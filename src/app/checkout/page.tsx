"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiPost, ApiError } from "@/lib/http";
import { customerSchema, firstError } from "@/lib/validation";
import { Customer, MPPreferenceResponse } from "@/lib/types";
import CartSummary from "@/components/checkout/CartSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import MercadoPagoNotice from "@/components/checkout/MercadoPagoNotice";

export default function CheckoutPage() {
  const { items, total, setQty, removeItem } = useCart();
  const { user } = useAuth();
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Precompleta el correo con el de la sesión (si el usuario no lo cambió).
  useEffect(() => {
    if (user?.email) {
      setCustomer((c) => (c.email ? c : { ...c, email: user.email }));
    }
  }, [user]);

  async function handleSubmit() {
    setError(null);
    // Validación cliente con el MISMO esquema zod del servidor.
    const err = firstError(customerSchema, customer);
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
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
      <main className="min-h-screen bg-bg pb-20 pt-40 text-center">
        <div className="mx-auto max-w-160 px-6">
          <h1 className="text-3xl font-orbitron font-extrabold leading-[0.9] tracking-tighter text-ink">
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
    <main className="min-h-screen bg-bg pb-24 pt-32">
      <div className="mx-auto max-w-290 px-6">
        <div className="mb-12">
          <h1 className="text-[clamp(28px,3.4vw,40px)] font-orbitron font-extrabold leading-[0.9] tracking-tighter text-ink">
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
