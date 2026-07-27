"use client";

import { ArrowUpRight } from "lucide-react";
import { Customer } from "@/lib/types";

interface CheckoutFormProps {
  customer: Customer;
  onChange: (customer: Customer) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  disabled: boolean;
}

export default function CheckoutForm({
  customer,
  onChange,
  onSubmit,
  loading,
  error,
  disabled,
}: CheckoutFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6 border border-line bg-card p-8"
    >
      <h2 className="text-lg font-semibold text-ink">Datos de contacto</h2>

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Nombre completo
        </label>
        <input
          id="name"
          required
          value={customer.name}
          onChange={(e) => onChange({ ...customer, name: e.target.value })}
          className="w-full rounded-md border border-line bg-panel px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-white/30"
          placeholder="Juan Pérez"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={customer.email}
          onChange={(e) => onChange({ ...customer, email: e.target.value })}
          className="w-full rounded-md border border-line bg-panel px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-white/30"
          placeholder="juan@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Teléfono (opcional)
        </label>
        <input
          id="phone"
          value={customer.phone ?? ""}
          onChange={(e) => onChange({ ...customer, phone: e.target.value })}
          className="w-full rounded-md border border-line bg-panel px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-white/30"
          placeholder="+56 9 1234 5678"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={disabled || loading}
        className="btn btn-primary w-full justify-center py-4 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Redirigiendo…" : "Pagar con Mercado Pago"}
        {!loading && <ArrowUpRight size={18} />}
      </button>
    </form>
  );
}
