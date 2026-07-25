import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/api/strapi";

export async function GET(request: NextRequest) {
  const products = await getProducts();
  const { searchParams } = request.nextUrl;

  const tag = searchParams.get("tag");
  const badge = searchParams.get("badge");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");

  let result = products;

  if (tag) result = result.filter((p) => p.tag === tag);
  if (badge) result = result.filter((p) => p.badge === badge);
  if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

  if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
  if (sort === "best-value")
    result = [...result].sort((a, b) => Number(b.bestValue) - Number(a.bestValue));

  return NextResponse.json(result);
}
