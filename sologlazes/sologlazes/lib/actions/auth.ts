"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email/send";

export type RegisterState = { error?: string; success?: boolean };

export async function registerAction(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  if (!email || password.length < 8) {
    return { error: "Email inválido o contraseña demasiado corta (mínimo 8 caracteres)." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese email." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash } });

  try {
    await sendWelcomeEmail(email, { customerName: name });
    await prisma.emailLog.create({ data: { type: "WELCOME", recipient: email, status: "SENT" } });
  } catch {
    await prisma.emailLog.create({ data: { type: "WELCOME", recipient: email, status: "FAILED" } });
  }

  return { success: true };
}
