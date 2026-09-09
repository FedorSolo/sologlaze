import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contacto",
  description: "Contactate con SoloGlazes por WhatsApp, email o visitá nuestro local en Buenos Aires.",
};

export default function ContactoPage() {
  return (
    <div className="container py-10 lg:py-14">
      <h1 className="mb-3 text-h1 lg:text-h1-lg">Contacto</h1>
      <p className="mb-10 max-w-lg text-body-lg text-text-secondary">
        ¿Dudas sobre qué esmalte elegir, tu pedido o una compra por mayor? Escribinos, respondemos rápido.
      </p>

      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <a
          href="https://wa.me/5491127379589"
          className="flex flex-col items-start gap-3 rounded-lg border border-border p-6 transition-colors hover:bg-surface-muted"
        >
          <MessageCircle size={22} className="text-accent" />
          <div>
            <p className="text-sm font-medium">WhatsApp</p>
            <p className="text-sm text-text-secondary">+54 9 11 2737-9589</p>
          </div>
        </a>
        <a
          href="mailto:sologlazes@gmail.com"
          className="flex flex-col items-start gap-3 rounded-lg border border-border p-6 transition-colors hover:bg-surface-muted"
        >
          <Mail size={22} className="text-accent" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-text-secondary">sologlazes@gmail.com</p>
          </div>
        </a>
        <div className="flex flex-col items-start gap-3 rounded-lg border border-border p-6">
          <MapPin size={22} className="text-accent" />
          <div>
            <p className="text-sm font-medium">Dirección</p>
            <p className="text-sm text-text-secondary">Federico Lacroze 1658, Buenos Aires, Argentina</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 rounded-lg border border-border p-6">
          <Clock size={22} className="text-accent" />
          <div>
            <p className="text-sm font-medium">Horario de atención</p>
            <p className="text-sm text-text-secondary">Lunes a viernes — 10:00 a 18:00</p>
            <p className="text-sm text-text-secondary">Sábados — 10:00 a 14:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
