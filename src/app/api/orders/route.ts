import { NextResponse } from "next/server";

/**
 * Endpoint deshabilitado por seguridad.
 *
 * Antes creaba órdenes en Strapi con datos totalmente controlados por el cliente
 * (incluido el precio) y sin autenticación. Las órdenes ahora se crean solo desde
 * `/api/checkout`, con precios verificados en el servidor. Se deja este handler
 * devolviendo 410 para no romper URLs cacheadas.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Endpoint no disponible. Usa /api/checkout." },
    { status: 410 }
  );
}
