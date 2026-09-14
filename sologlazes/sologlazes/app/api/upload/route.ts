import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Esta fase SÍ viene del navegador del admin — acá exigimos sesión + rol.
        const session = await auth();
        if (!session?.user?.id) {
          throw new Error("No autorizado — iniciá sesión como administrador.");
        }
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (user?.role !== "ADMIN") {
          throw new Error("Solo administradores pueden subir archivos.");
        }
        return {
          allowedContentTypes: ["image/*", "video/*"],
          maximumSizeInBytes: 80 * 1024 * 1024, // 80MB — suficiente para fotos y videos cortos de producto
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Esta fase la llama el propio servidor de Vercel Blob (sin cookies de sesión) — no exigir auth acá.
        console.log("Blob upload completed:", blob.url);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
