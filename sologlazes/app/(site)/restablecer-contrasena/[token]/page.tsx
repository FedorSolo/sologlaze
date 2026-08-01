"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthCard, AuthField, AuthSubmit } from "@/components/auth/auth-card";
import { resetPasswordAction, type PasswordResetState } from "@/lib/actions/password-reset";

const initialState: PasswordResetState = {};

export default function RestablecerContrasenaPage({ params }: { params: { token: string } }) {
  const boundAction = resetPasswordAction.bind(null, params.token);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  if (state.success) {
    return (
      <AuthCard title="¡Listo!" footer={<Link href="/ingresar" className="text-accent">Ingresar</Link>}>
        <p className="text-sm text-text-secondary">Tu contraseña se actualizó. Ya podés ingresar con la nueva.</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Elegir nueva contraseña">
      <form action={formAction} className="space-y-1">
        <AuthField label="Nueva contraseña (mínimo 8 caracteres)" name="password" type="password" />
        {state.error && <p className="mb-4 text-sm text-status-error">{state.error}</p>}
        <div className="h-2" />
        <AuthSubmit>{pending ? "Guardando..." : "Guardar contraseña"}</AuthSubmit>
      </form>
    </AuthCard>
  );
}
