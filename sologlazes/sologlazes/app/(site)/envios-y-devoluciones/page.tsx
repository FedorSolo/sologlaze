import { LegalPage } from "@/components/content/legal-page";

export const metadata = {
  title: "Envío y pago",
  description: "Costos de envío en CABA y todo el país, formas de pago y política de devoluciones de SoloGlazes.",
};

export default function EnviosPage() {
  return (
    <LegalPage title="Envío y pago">
      <h2>🚚 Envío en CABA</h2>
      <p>Desde 2 kg — gratis. Menos de 2 kg — $12.000 ARS.</p>

      <h2>🚚 Fuera de CABA</h2>
      <p>El precio se acuerda con el vendedor.</p>

      <h2>🚚 Envíos a todo el país</h2>
      <p>
        Por Correo Argentino, según tarifas vigentes. El costo se calcula en base al peso total y se confirma
        con el vendedor.
      </p>

      <h2>💳 Formas de pago</h2>
      <ul>
        <li>Efectivo o transferencia (para retiro en persona)</li>
        <li>Tarjeta vía PayPal o MercadoPago</li>
        <li>Facturas disponibles a pedido</li>
      </ul>

      <h2>Devoluciones</h2>
      <p>
        Tenemos una política de devolución de 30 días desde que recibís el artículo. El producto debe estar
        sin usar y en su embalaje original, con el recibo o comprobante de compra. Si llega dañado o
        incorrecto, escribinos apenas lo recibas a{" "}
        <a href="mailto:sologlazes@gmail.com" className="text-accent">
          sologlazes@gmail.com
        </a>{" "}
        para que podamos evaluarlo y solucionarlo. Por tratarse de productos que se consumen en el proceso
        (esmaltes), esta política puede tener excepciones — consultanos por WhatsApp ante cualquier duda.
      </p>
    </LegalPage>
  );
}
