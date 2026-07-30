import { NextResponse } from "next/server";
import { getOrder } from "@/lib/api/strapi";
import { downloadUrl } from "@/lib/api/fulfillment";

/**
 * Links de descarga de una orden, para la pantalla de agradecimiento tras el
 * pago. Solo devuelve los links si la orden está `approved` (verificado contra
 * Strapi con el API token del servidor). Mientras el webhook aún no confirma el
 * pago, responde con el estado actual para que el cliente haga polling.
 *
 * El archivo en sí sigue protegido por el token firmado + orden aprobada
 * (ver /api/download/[slug]); aquí solo se listan los links.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  if (order.status !== "approved") {
    // pending / rejected / cancelled → el cliente sigue esperando o muestra aviso.
    return NextResponse.json({ status: order.status });
  }

  const downloads = order.items.map((it) => ({
    slug: it.slug,
    name: it.name,
    url: downloadUrl(id, it.slug),
  }));

  return NextResponse.json({ status: "approved", downloads });
}
