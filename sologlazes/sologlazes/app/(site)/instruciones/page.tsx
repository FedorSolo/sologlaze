import { redirect } from "next/navigation";

// Enlace corto para compartir: lleva directo a las proporciones de la guía.
export const metadata = { robots: { index: false, follow: true } };

export default function Page() {
  redirect("/guia#proporciones");
}
