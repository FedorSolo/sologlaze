import type { Metadata } from "next";
import { MessageCircle, MapPin, Package, CircleDot, Ruler, Flame, Layers, Coffee, Percent } from "lucide-react";
import { InstagramEmbed } from "@/components/shared/instagram-embed";

export const metadata: Metadata = {
  title: "Coworking",
  description:
    "Espacio de coworking cerámico SoloGlazes en Federico Lacroze y Av. Libertador, Las Cañitas, Buenos Aires. Dos lugares de taller disponibles para ceramistas con experiencia.",
};

const amenities = [
  { icon: Package, text: "Estante personal para herramientas, arcilla y piezas terminadas" },
  { icon: CircleDot, text: "Torno alfarero" },
  { icon: Ruler, text: "Mesa amplia para modelado" },
  { icon: Flame, text: "Horno de 70 litros, con las horneadas incluidas en el precio" },
  { icon: Layers, text: "Laminadora para arcilla" },
  { icon: Coffee, text: "Pequeña zona de descanso" },
  { icon: Percent, text: "15% de descuento en esmaltes SoloGlazes para las residentes del taller" },
];

const monthlyPlans = [
  { visits: "4 visitas (1 vez por semana)", price: "230.000" },
  { visits: "8 visitas (2 veces por semana)", price: "370.000" },
  { visits: "12 visitas (3 veces por semana)", price: "470.000" },
];

const timedPlans = [
  { visits: "4 visitas (1 vez por semana)", price: "130.000" },
  { visits: "8 visitas (2 veces por semana)", price: "220.000" },
  { visits: "12 visitas (3 veces por semana)", price: "280.000" },
];

export default function CoworkingPage() {
  return (
    <div className="container py-10 lg:py-14">
      <p className="mb-1 text-h3 uppercase tracking-wide text-accent">Coworking</p>
      <h1 className="mb-4 text-h1 lg:text-h1-lg">Un espacio compartido para ceramistas</h1>
      <p className="mb-2 max-w-2xl text-body-lg text-text-secondary">
        ¡Hola, queridxs ceramistas! En nuestro taller tranquilo y acogedor en Las Cañitas se liberan dos espacios
        de trabajo para ceramistas con experiencia.
      </p>
      <p className="mb-8 max-w-2xl text-sm text-text-secondary">
        Máximo 4 personas trabajando al mismo tiempo, así que siempre hay lugar y tranquilidad para concentrarte
        en tu proceso.
      </p>

      <div className="mb-4 rounded-md border border-status-warning/30 bg-status-warning/10 p-4 text-sm text-text-primary/80">
        <strong>El espacio es solo para trabajo individual de taller.</strong> No es apto para dictar clases ni
        realizar workshops o masterclasses.
      </div>

      <p className="mb-10 max-w-2xl text-sm text-text-secondary">
        Acceso al taller de lunes a sábado, de 11:00 a 20:00.
      </p>

      <div className="mb-10 flex justify-center">
        <InstagramEmbed url="https://www.instagram.com/p/DRudsrIkcn9/" />
      </div>

      <h2 className="mb-4 text-h2">Qué ofrecemos</h2>
      <ul className="mb-14 grid max-w-2xl gap-3 sm:grid-cols-2">
        {amenities.map((a) => (
          <li key={a.text} className="flex items-start gap-3 rounded-md border border-border p-3 text-sm">
            <a.icon size={18} className="mt-0.5 shrink-0 text-accent" />
            <span className="text-text-primary/80">{a.text}</span>
          </li>
        ))}
      </ul>

      <h2 className="mb-6 text-h2">Precios</h2>
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border p-6">
          <h3 className="mb-1 text-h3">Abonos mensuales</h3>
          <p className="mb-4 text-xs uppercase tracking-wide text-text-secondary">Sin límite de tiempo</p>
          <ul className="mb-3 space-y-2 text-sm">
            {monthlyPlans.map((p) => (
              <li key={p.visits} className="flex justify-between gap-4">
                <span className="text-text-primary/80">{p.visits}</span>
                <span className="whitespace-nowrap font-medium">$ {p.price}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-status-success">La cocción está incluida en el abono.</p>
        </div>

        <div className="rounded-lg border border-border p-6">
          <h3 className="mb-1 text-h3">Por franja horaria</h3>
          <p className="mb-4 text-xs uppercase tracking-wide text-text-secondary">4 horas por día — 12:00–16:00 o 16:00–20:00</p>
          <ul className="mb-3 space-y-2 text-sm">
            {timedPlans.map((p) => (
              <li key={p.visits} className="flex justify-between gap-4">
                <span className="text-text-primary/80">{p.visits}</span>
                <span className="whitespace-nowrap font-medium">$ {p.price}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-text-secondary">
            La cocción NO está incluida: bizcocho (horno completo) $ 40.000 · esmalte (horno completo) $ 50.000
          </p>
        </div>
      </div>

      <div className="mb-14 max-w-sm rounded-lg border border-border p-6">
        <h3 className="mb-1 text-h3">Visita única</h3>
        <p className="mb-4 text-xs uppercase tracking-wide text-text-secondary">4 horas</p>
        <div className="flex justify-between text-sm">
          <span className="text-text-primary/80">Visita única</span>
          <span className="font-medium">$ 40.000</span>
        </div>
      </div>

      <div className="mx-auto max-w-md rounded-lg border border-border p-6 text-center">
        <p className="mb-2 flex items-center justify-center gap-2 text-sm text-text-secondary">
          <MapPin size={16} /> Federico Lacroze y Av. Libertador, Las Cañitas, Buenos Aires
        </p>
        <p className="mb-6 text-sm text-text-secondary">
          Consultanos por disponibilidad y reservá tu lugar por WhatsApp.
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
