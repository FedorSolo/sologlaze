import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mlAuthUrl, mlConfigured, pkceFromState, signState } from "@/lib/mercadolibre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Открыть в браузере, войдя в админку сайта: /api/mercadolibre/connect
// → страница Mercado Libre «Разрешить» → /api/mercadolibre/callback
export async function GET(req: Request) {
  const session = await auth();
  const id = session?.user?.id;
  const user = id ? await prisma.user.findUnique({ where: { id }, select: { role: true } }) : null;
  if (user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/ingresar?callbackUrl=/api/mercadolibre/connect", req.url));
  }
  if (!mlConfigured()) {
    return new NextResponse("В Vercel не заданы ML_APP_ID и ML_SECRET_KEY (после добавления нужен Redeploy).", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const state = signState(`${id}:${Date.now()}`);
  const { challenge } = pkceFromState(state);
  return NextResponse.redirect(mlAuthUrl(state, challenge));
}
