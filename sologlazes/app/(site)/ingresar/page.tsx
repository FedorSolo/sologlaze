"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthCard, AuthField, AuthSubmit } from "@/components/auth/auth-card";

export default function IngresarPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/cuenta";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos.");
      setPending(false);
      return;
    }
    router.push(callbackUrl);
  };

  return (
    <AuthCard
      title="Ingresar"
      subtitle="Accedé a tu cuenta para ver tus pedidos y direcciones."
      footer={
        <>
          ¿No tenés cuenta? <Link href="/registrarse" className="text-accent">Registrate</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-1">
        <AuthField label="Email" name="email" type="email" />
        <AuthField label="Contraseña" name="password" type="password" />
        <div className="mb-4 text-right text-sm">
          <Link href="/recuperar-contrasena" className="text-accent">¿Olvidaste tu contraseña?</Link>
        </div>
        {error && <p className="mb-4 text-sm text-status-error">{error}</p>}
        <AuthSubmit>{pending ? "Ingresando..." : "Ingresar"}</AuthSubmit>
      </form>
    </AuthCard>
  );
}
