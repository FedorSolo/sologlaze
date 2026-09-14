import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado — iniciá sesión como administrador.");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") throw new Error("Solo administradores pueden subir archivos.");
}

function sanitizeFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return `${Date.now()}-${base || "archivo"}${ext ? "." + ext : ""}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";

  // Modo simple (fotos): el navegador manda el archivo directo por FormData,
  // y acá lo subimos nosotros con put(). Probado y estable — se usa siempre que se pueda.
  if (contentType.includes("multipart/form-data")) {
    try {
      await requireAdmin();
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        return NextResponse.json({ error: "El archivo debe ser una imagen o un video" }, { status: 400 });
      }
      const blob = await put(sanitizeFilename(file.name), file, { access: "public" });
      return NextResponse.json({ url: blob.url });
    } catch (error) {
      console.error("Upload (FormData) error:", error);
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
  }

  // Modo cliente-a-Blob directo (videos grandes): necesario porque las funciones
  // serverless de Vercel tienen un límite de tamaño de request (~4.5MB en Hobby).
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        await requireAdmin();
        return {
          allowedContentTypes: ["video/*"],
          maximumSizeInBytes: 80 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Blob upload completed:", blob.url);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload (client-token) error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}