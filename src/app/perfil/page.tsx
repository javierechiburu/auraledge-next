"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserOrder } from "@/lib/types";

const STATUS_LABEL: Record<UserOrder["status"], { text: string; cls: string }> = {
  approved: { text: "Pagada", cls: "bg-green-500/15 text-green-400" },
  pending: { text: "Pendiente", cls: "bg-amber/15 text-amber" },
  rejected: { text: "Rechazada", cls: "bg-red-500/15 text-red-400" },
  cancelled: { text: "Cancelada", cls: "bg-white/10 text-muted" },
};

function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}

export default function ProfilePage() {
  const { user, loading, logout, openAuth } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<UserOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/auth/orders", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error ?? "Error");
        setOrders(json.orders ?? []);
      })
      .catch(() => setError("No se pudieron cargar tus compras."));
  }, [user]);

  if (loading) {
    return <main className="min-h-screen bg-black pt-40 text-center text-muted">Cargando…</main>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black px-6 pt-40 text-center">
        <h1 className="font-display text-3xl normal-case">Inicia sesión</h1>
        <p className="mx-auto mt-3 max-w-100 text-sm text-muted">
          Necesitas una cuenta para ver tus compras y descargas.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => openAuth("login")} className="btn btn-primary">
            Iniciar sesión
          </button>
          <button onClick={() => router.push("/beats")} className="btn btn-outline">
            Ver beats
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-32">
      <div className="mx-auto max-w-[900px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(28px,4vw,42px)] normal-case">Mi perfil</h1>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {user.isAdmin && (
              <button onClick={() => router.push("/ventas")} className="btn btn-outline">
                Ventas
              </button>
            )}
            <button onClick={() => logout().then(() => router.push("/"))} className="btn btn-outline">
              Cerrar sesión
            </button>
          </div>
        </div>

        <h2 className="mb-4 mt-12 font-display text-xl normal-case">Mis compras</h2>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {orders === null && !error && <p className="text-sm text-muted">Cargando compras…</p>}

        {orders && orders.length === 0 && (
          <div className="rounded-2xl border border-line bg-black/40 p-8 text-center">
            <p className="text-muted">Aún no tienes compras.</p>
            <Link href="/beats" className="btn btn-primary mt-6 inline-flex">
              Explorar beats
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders?.map((order) => {
            const badge = STATUS_LABEL[order.status];
            return (
              <div key={order.id} className="rounded-2xl border border-line bg-black/40 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("es-CL", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : `Orden ${order.id.slice(0, 8)}`}
                    </p>
                    <p className="mt-0.5 font-semibold">{formatCLP(order.total)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.cls}`}>
                    {badge.text}
                  </span>
                </div>

                <ul className="mt-4 divide-y divide-line/60">
                  {order.items.map((it) => {
                    const dl = order.downloads?.find((d) => d.slug === it.slug);
                    return (
                      <li key={it.slug} className="flex items-center justify-between gap-3 py-2.5">
                        <span className="min-w-0 truncate text-sm">{it.name}</span>
                        {dl ? (
                          <a
                            href={dl.url}
                            className="btn btn-primary btn-sm inline-flex shrink-0 items-center gap-1.5"
                          >
                            <Download size={15} /> Descargar
                          </a>
                        ) : (
                          <span className="shrink-0 text-xs text-muted">
                            {order.status === "pending" ? "Esperando pago" : "No disponible"}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
