import { MessageCircle } from "lucide-react";

export function WhatsappFloat() {
  return (
    <a
      href="https://wa.me/5491127379589?text=Hola!%20Tengo%20una%20consulta"
      target="_blank"
      rel="noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <MessageCircle size={28} fill="white" className="text-[#25D366]" />
    </a>
  );
}
