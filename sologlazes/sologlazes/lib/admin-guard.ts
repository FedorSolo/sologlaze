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
