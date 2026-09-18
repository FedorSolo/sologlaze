import type { Metadata } from "next";
import { MessageCircle, MapPin } from "lucide-react";
import { InstagramEmbed } from "@/components/shared/instagram-embed";

export const metadata: Metadata = {
  title: "Coworking",
  description:
    "Espacio de coworking cerámico SoloGlazes en Federico Lacroze 1658, Buenos Aires. Compartí taller, hornos y comunidad con otros ceramistas.",
};

export default function CoworkingPage() {
  return (
    <div className="container py-10 lg:py-14">
      <p className="mb-1 text-h3 uppercase tracking-wide text-accent">Coworking</p>
      <h1 className="mb-4 text-h1 lg:text-h1-lg">Un espacio compartido para ceramistas</h1>
      <p className="mb-8 max-w-2xl text-body-lg text-text-secondary">
        Sumate a nuestro coworking cerámico — un lugar para trabajar, cocer tus piezas y compartir con otros
        ceramistas, en el mismo taller donde nace SoloGlazes.
      </p>

      <div className="mb-10 flex justify-center">
        <InstagramEmbed url="https://www.instagram.com/p/DRudsrIkcn9/" />
      </div>

      <div className="mx-auto max-w-md rounded-lg border border-border p-6 text-center">
        <p className="mb-2 flex items-center justify-center gap-2 text-sm text-text-secondary">
          <MapPin size={16} /> Federico Lacroze 1658, Buenos Aires
        </p>
        <p className="mb-6 text-sm text-text-secondary">
          Consultanos por disponibilidad, planes y precios — te contamos todo por WhatsApp.
        </p>
        <a
          href="https://wa.me/5491127379589?text=Hola!%20Quiero%20informaci%C3%B3n%20sobre%20el%20coworking"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <MessageCircle size={18} /> Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
