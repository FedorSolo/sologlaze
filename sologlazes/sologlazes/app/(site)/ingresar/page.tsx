import { Suspense } from "react";
import { LoginFormClient } from "@/components/auth/login-form-client";

export const metadata = { title: "Ingresar" };

export default function IngresarPage() {
  return (
    <Suspense>
      <LoginFormClient />
    </Suspense>
  );
}
