"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthCard, AuthField, AuthSubmit } from "@/components/auth/auth-card";
import { registerAction, type RegisterState } from "@/lib/actions/auth";

const initialState: RegisterState = {};

export default function RegistrarsePage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/ingresar?registered=1");
    }
  }, [state.success, router]);

  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Guardá tus direcciones y repetí pedidos más rápido."
      footer={
        <>
          ¿Ya tenés cuenta? <Link href="/ingresar" className="text-accent">Ingresá</Link>
        </>
      }
    >
      <form action={formAction} className="space-y-1">
        <AuthField label="Nombre y apellido" name="name" />
        <AuthField label="Email" name="email" type="email" />
        <AuthField label="Contraseña (mínimo 8 caracteres)" name="password" type="password" />
        {state.error && <p className="mb-4 text-sm text-status-error">{state.error}</p>}
        <div className="h-2" />
        <AuthSubmit>{pending ? "Creando cuenta..." : "Crear cuenta"}</AuthSubmit>
      </form>
    </AuthCard>
  );
}
