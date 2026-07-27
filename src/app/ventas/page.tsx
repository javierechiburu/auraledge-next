"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ShoppingBag, Receipt, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SalesStats } from "@/lib/types";

function clp(n: number) {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  const names = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${names[Number(m) - 1] ?? m} ${y?.slice(2)}`;
}

export default function VentasPage() {
  const { user, loading, openAuth } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetch("/api/stats/sales", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error ?? "Error");
        setStats(json);
      })
      .catch(() => setError("No se pudieron cargar las estadísticas."));
  }, [user]);

  if (loading) {
    return <main className="min-h-screen bg-bg pt-40 text-center text-muted">Cargando…</main>;
  }

  if (!user || !user.isAdmin) {
    return (
      <main className="min-h-screen bg-bg px-6 pt-40 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Acceso restringido</h1>
        <p className="mx-auto mt-3 max-w-100 text-sm text-muted">
          Esta sección es solo para administradores.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          {!user && (
            <button onClick={() => openAuth("login")} className="btn btn-primary">
              Iniciar sesión
            </button>
          )}
          <button onClick={() => router.push("/")} className="btn btn-outline">
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  const maxMonth = stats ? Math.max(1, ...stats.monthly.map((m) => m.revenue)) : 1;
  const maxBeat = stats ? Math.max(1, ...stats.topBeats.map((b) => b.revenue)) : 1;

  return (
    <main className="min-h-screen bg-bg px-6 pb-24 pt-32">
      <div className="mx-auto max-w-[1000px]">
        <h1 className="text-[clamp(26px,3.4vw,40px)] font-semibold tracking-tight text-ink">Ventas</h1>
        <p className="mt-2 text-sm text-muted">Resumen de pagos aprobados.</p>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
        {!stats && !error && <p className="mt-6 text-sm text-muted">Cargando estadísticas…</p>}

        {stats && (
          <>
            {/* Tarjetas KPI */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi icon={<TrendingUp size={18} className="text-accent" />} label="Ingresos brutos" value={clp(stats.grossRevenue)} />
              <Kpi icon={<Wallet size={18} className="text-accent" />} label="Neto (tras comisión)" value={clp(stats.netRevenue)} sub={`Comisión: ${clp(stats.fees)}`} />
              <Kpi icon={<ShoppingBag size={18} className="text-accent" />} label="Ventas" value={String(stats.salesCount)} />
              <Kpi icon={<Receipt size={18} className="text-accent" />} label="Ticket promedio" value={clp(stats.avgTicket)} />
            </div>

            {/* Ventas por mes */}
            <section className="mt-6 border border-line bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Ventas por mes</h2>
              {stats.monthly.length === 0 ? (
                <p className="mt-4 text-sm text-muted">Aún no hay ventas registradas.</p>
              ) : (
                <div className="mt-6 flex items-end gap-3" style={{ height: 180 }}>
                  {stats.monthly.map((m) => (
                    <div key={m.month} className="flex flex-1 flex-col items-center justify-end gap-2">
                      <span className="text-[11px] tabular-nums text-muted">{clp(m.revenue)}</span>
                      <div
                        className="w-full bg-white/80 transition-all"
                        style={{ height: `${(m.revenue / maxMonth) * 130}px` }}
                        title={`${m.month}: ${clp(m.revenue)}`}
                      />
                      <span className="text-[11px] text-muted">{monthLabel(m.month)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Top beats */}
            <section className="mt-6 border border-line bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Top beats</h2>
              {stats.topBeats.length === 0 ? (
                <p className="mt-4 text-sm text-muted">Sin datos todavía.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {stats.topBeats.map((b) => (
                    <li key={b.slug}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate text-ink">{b.name}</span>
                        <span className="shrink-0 tabular-nums text-muted">
                          {clp(b.revenue)} · {b.qty} vta{b.qty === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full bg-white/5">
                        <div className="h-full bg-white/60" style={{ width: `${(b.revenue / maxBeat) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="border border-line bg-card p-5">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}
