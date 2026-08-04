"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Download, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Lottie usa APIs del navegador → carga solo en cliente (evita errores de SSR).
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface DownloadItem {
  slug: string;
  name: string;
  url: string;
}

type View = "loading" | "ready" | "pending" | "failure";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 20; // ~40s esperando la confirmación del webhook

/**
 * Pantalla de retorno tras pagar en Mercado Pago.
 * - status=success → hace polling a /api/orders/[id]/downloads hasta que la orden
 *   quede `approved` (el webhook puede tardar unos segundos), y muestra los links.
 * - status=pending/failure → mensaje correspondiente.
 * En cualquier retorno de pago (success/pending) se VACÍA el carrito.
 */
export default function CheckoutResult({
  status,
  orderId,
  paymentId,
}: {
  status: string;
  orderId: string | null;
  paymentId: string | null;
}) {
  const { clear } = useCart();
  const [view, setView] = useState<View>(
    status === "failure"
      ? "failure"
      : status === "pending"
        ? "pending"
        : "loading",
  );
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [anim, setAnim] = useState<object | null>(null);
  const clearedRef = useRef(false);

  // Carga el Lottie (public/assets/music.json) para la pantalla de loading.
  useEffect(() => {
    fetch("/assets/music_3.json")
      .then((r) => r.json())
      .then(setAnim)
      .catch(() => setAnim(null));
  }, []);

  // Vaciar el carrito al volver de un pago (ya se envió a Mercado Pago).
  useEffect(() => {
    if (!clearedRef.current && (status === "success" || status === "pending")) {
      clear();
      clearedRef.current = true;
    }
  }, [status, clear]);

  // Polling de la orden (solo en éxito y con orderId).
  useEffect(() => {
    if (status !== "success" || !orderId) return;
    let active = true;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch(
          `/api/orders/${encodeURIComponent(orderId!)}/downloads` +
            (paymentId ? `?payment_id=${encodeURIComponent(paymentId)}` : ""),
          { cache: "no-store" },
        );
        const data = (await res.json()) as {
          status?: string;
          downloads?: DownloadItem[];
        };
        if (!active) return;
        if (data.status === "approved" && data.downloads?.length) {
          setDownloads(data.downloads);
          setView("ready");
          return;
        }
        if (data.status === "rejected" || data.status === "cancelled") {
          setView("failure");
          return;
        }
      } catch {
        /* reintenta */
      }
      if (!active) return;
      if (attempts >= MAX_ATTEMPTS) {
        setView("pending"); // el webhook aún no confirma → respaldo por email
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      active = false;
    };
  }, [status, orderId]);

  return (
    // Overlay a pantalla completa: cubre el navbar (z-50) y ocupa todo el
    // viewport, sin header ni footer. Scrolleable si el contenido es alto.
    <main className="fixed inset-0 z-200 overflow-y-auto bg-gray-900">
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-160 text-center">
          {view === "loading" && (
            <div className="relative inline-block">
              {/* Lottie flotando JUSTO por encima del texto, sin ocupar espacio.
                  `bottom-full` lo pone sobre el texto; `translate-y-*` regula
                  cuánto se superpone a las letras (más valor = baja más). */}
              {anim && (
                <Lottie
                  animationData={anim}
                  loop
                  className="pointer-events-none absolute bottom-full left-1/2 h-100 w-96 -translate-x-1/2 translate-y-44"
                />
              )}
              <h1 className="font-orbitron text-2xl font-extrabold tracking-tighter text-ink mt-8">
                Confirmando tu pago…
              </h1>
              <p className="mt-3 text-muted">
                Esto toma unos segundos. No cierres esta ventana.
              </p>
            </div>
          )}

          {view === "ready" && (
            <>
              <CheckCircle2 className="mx-auto mb-6 h-14 w-14 text-green-400" />
              <h1 className="font-orbitron text-3xl font-extrabold tracking-tighter text-ink">
                ¡Gracias por tu compra!
              </h1>
              <p className="mt-3 text-muted">
                Descarga tus productos abajo. También te enviamos los enlaces
                por correo.
              </p>

              <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
                {downloads.map((d) => (
                  <li key={d.slug}>
                    <a
                      href={d.url}
                      className="flex items-center justify-between gap-3 border border-line bg-card px-4 py-3 transition-colors hover:border-accent"
                    >
                      <span className="truncate font-medium text-ink">
                        {d.name}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent">
                        <Download size={16} /> Descargar
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-xs text-muted">
                Los enlaces son personales y expiran en 7 días.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link href="/perfil" className="btn btn-outline">
                  Ver mis compras
                </Link>
                <Link href="/beats" className="btn btn-primary">
                  Seguir explorando
                </Link>
              </div>
            </>
          )}

          {view === "pending" && (
            <>
              <Clock className="mx-auto mb-6 h-14 w-14 text-amber-400" />
              <h1 className="font-orbitron text-2xl font-extrabold tracking-tighter text-ink">
                Estamos procesando tu pago
              </h1>
              <p className="mt-3 text-muted">
                En cuanto se confirme, te enviaremos los enlaces de descarga por
                correo. También los verás en tu perfil.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link href="/perfil" className="btn btn-primary">
                  Ir a mis compras
                </Link>
                <Link href="/beats" className="btn btn-outline">
                  Volver a la tienda
                </Link>
              </div>
            </>
          )}

          {view === "failure" && (
            <>
              <XCircle className="mx-auto mb-6 h-14 w-14 text-red-400" />
              <h1 className="font-orbitron text-2xl font-extrabold tracking-tighter text-ink">
                El pago no se completó
              </h1>
              <p className="mt-3 text-muted">
                No se realizó ningún cargo. Puedes intentarlo de nuevo cuando
                quieras.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link href="/checkout" className="btn btn-primary">
                  Reintentar
                </Link>
                <Link href="/beats" className="btn btn-outline">
                  Volver a la tienda
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
