"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email/send";

export type PasswordResetState = { error?: string; success?: boolean };

const RESET_TOKEN_PREFIX = "pwreset:";
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

export async function requestPasswordResetAction(
  _prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  if (!email) return { error: "Ingresá un email válido." };

  const user = await prisma.user.findUnique({ where: { email } });

  // Respuesta idéntica exista o no el usuario, para no filtrar qué emails están registrados.
  if (!user) return { success: true };

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: `${RESET_TOKEN_PREFIX}${email}`,
      token,
      expires: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/restablecer-contrasena/${token}`;

  try {
    await sendPasswordResetEmail(email, { resetUrl });
    await prisma.emailLog.create({ data: { type: "PASSWORD_RESET", recipient: email, status: "SENT" } });
  } catch {
    await prisma.emailLog.create({ data: { type: "PASSWORD_RESET", recipient: email, status: "FAILED" } });
  }

  return { success: true };
}

export async function resetPasswordAction(
  token: string,
  _prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date() || !record.identifier.startsWith(RESET_TOKEN_PREFIX)) {
    return { error: "El enlace no es válido o ya venció. Solicitá uno nuevo." };
  }

  const email = record.identifier.slice(RESET_TOKEN_PREFIX.length);
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({ where: { email }, data: { passwordHash } });
  await prisma.verificationToken.delete({ where: { token } });

  return { success: true };
}
