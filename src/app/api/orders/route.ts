import { NextResponse } from "next/server";
import { createOrder } from "@/lib/api/strapi";
import { CheckoutPayload } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;

  if (!body?.items?.length || !body.customer?.name || !body.customer?.email) {
    return NextResponse.json({ error: "Payload de orden inválido" }, { status: 400 });
  }

  const order = await createOrder(body.items, body.customer);
  return NextResponse.json(order);
}
