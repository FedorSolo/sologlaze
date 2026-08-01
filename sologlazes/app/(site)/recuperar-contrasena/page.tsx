"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthCard, AuthField, AuthSubmit } from "@/components/auth/auth-card";
import { requestPasswordResetAction, type PasswordResetState } from "@/lib/actions/password-reset";

const initialState: PasswordResetState = {};

export default function RecuperarContrasenaPage() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  if (state.success) {
    return (
      <AuthCard title="Revisá tu email" footer={<Link href="/ingresar" className="text-accent">Volver a ingresar</Link>}>
        <p className="text-sm text-text-secondary">
          Si existe una cuenta con ese email, te enviamos un enlace para restablecer la contraseña. El enlace vence en 1 hora.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Recuperar contraseña"
      subtitle="Te enviamos un email con instrucciones para restablecerla."
      footer={<Link href="/ingresar" className="text-accent">Volver a ingresar</Link>}
    >
      <form action={formAction} className="space-y-1">
        <AuthField label="Email" name="email" type="email" />
        {state.error && <p className="mb-4 text-sm text-status-error">{state.error}</p>}
        <div className="h-2" />
        <AuthSubmit>{pending ? "Enviando..." : "Enviar instrucciones"}</AuthSubmit>
      </form>
    </AuthCard>
  );
}
