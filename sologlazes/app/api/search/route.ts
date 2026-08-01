import { NextRequest, NextResponse } from "next/server";
import { searchProductCards } from "@/lib/queries/products";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const results = await searchProductCards(q);
  return NextResponse.json({ results });
}
