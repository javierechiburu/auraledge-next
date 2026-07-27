import { NextRequest, NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/api/download-token";
import { getOrder, getTrackFullFile } from "@/lib/api/strapi";

/**
 * Descarga protegida de la pista COMPLETA.
 *
 * SEGURIDAD (defensa en profundidad):
 *  1. Requiere un token firmado y no expirado (`verifyDownloadToken`).
 *  2. El token está atado a un `orderId` + `slug`: el slug de la URL debe
 *     coincidir con el del token.
 *  3. Se re-verifica en Strapi que la orden exista, esté `approved` y contenga
 *     ese slug (no basta con tener un token válido de otra orden).
 *  4. El archivo full es un campo privado de Strapi; se obtiene con el API token
 *     del servidor y se transmite (stream) al cliente SIN exponer la URL de
 *     origen. En producción con storage S3/R2 privado, sustituir por redirect a
 *     URL presignada de corta duración.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Falta el token de descarga." }, { status: 401 });
  }

  const payload = verifyDownloadToken(token);
  if (!payload || payload.slug !== slug) {
    return NextResponse.json({ error: "Token inválido o expirado." }, { status: 403 });
  }

  const order = await getOrder(payload.orderId);
  if (!order || order.status !== "approved") {
    return NextResponse.json({ error: "La orden no está pagada." }, { status: 403 });
  }
  if (!order.items.some((i) => i.slug === slug)) {
    return NextResponse.json({ error: "La pista no pertenece a esta orden." }, { status: 403 });
  }

  const file = await getTrackFullFile(slug);
  if (!file) {
    return NextResponse.json({ error: "Archivo no disponible." }, { status: 404 });
  }

  // Stream del archivo privado a través de nuestro servidor (oculta la URL real).
  const upstream = await fetch(file.url, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "No se pudo obtener el archivo." }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": file.mime,
      "Content-Disposition": `attachment; filename="${file.name.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
