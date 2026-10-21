import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Deja pasar solo a usuarios con role = ADMIN. Si no hay sesión va al ingreso; si no es admin, a la home.
export async function requireAdmin() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/ingresar");
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (user?.role !== "ADMIN") redirect("/");
}

// Para server actions: lanza un error si quien llama no es administrador (no redirige).
export async function assertAdmin() {
  const session = await auth();
  const id = session?.user?.id;
  const user = id ? await prisma.user.findUnique({ where: { id }, select: { role: true } }) : null;
  if (user?.role !== "ADMIN") throw new Error("Solo administradores.");
}
