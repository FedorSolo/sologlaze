"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";

const VIDEO_ID = "P83VetAfsPI";

// Pantalla de ingreso al panel: usuario + contraseña arriba y un video abajo.
// Los navegadores solo permiten reproducir solos los videos sin sonido, por eso arranca en silencio.
export function AdminLogin({ forbidden = false }: { forbidden?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: String(fd.get("email") ?? "").trim(),
      password: fd.get("password"),
      redirect: false,
    });
    if (result?.error) {
      setError("Usuario o contraseña incorrectos.");
      setPending(false);
      return;
    }
    router.refresh(); // el panel se vuelve a cargar ya con la sesión iniciada
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 px-4 py-10 sm:py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image src="/images/logo-sologlazes.png" alt="SoloGlazes" width={220} height={49} className="h-10 w-auto" priority />
        </div>

        <div className="rounded-lg border border-border p-6 sm:p-8">
          <h1 className="mb-1 text-h2">Panel de administración</h1>
          <p className="mb-6 text-sm text-text-secondary">Ingresá con tu usuario y contraseña.</p>

          {forbidden && (
            <div className="mb-5 rounded-md bg-status-error/10 p-3 text-sm text-status-error">
              Esta cuenta no tiene permisos de administrador.{" "}
              <button type="button" onClick={() => signOut({ callbackUrl: "/admin" })} className="underline">
                Cerrar sesión
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block text-text-secondary">Usuario (email)</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                autoFocus
                className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-text-secondary">Contraseña</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent"
              />
            </label>
            {error && <p className="text-sm text-status-error">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="h-11 w-full rounded-[999px] bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {pending ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface-muted">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&playsinline=1&rel=0`}
            title="Video"
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-2 text-center text-xs text-text-secondary">El video arranca sin sonido: tocá el reproductor para activarlo.</p>
      </div>
    </main>
  );
}
