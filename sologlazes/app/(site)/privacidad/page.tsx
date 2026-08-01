import { LegalPage } from "@/components/content/legal-page";

export const metadata = { title: "Política de privacidad" };

// Basado en sologlazes.com.ar/policies/privacy-policy (plantilla estándar de Shopify).
// Condensado por secciones — el texto completo del sitio original es mucho más extenso;
// mantener la estructura y el sentido real, no una versión inventada.
export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <p>Última actualización: 13 de octubre de 2025.</p>
      <p>
        SoloGlazes gestiona esta tienda y sitio web, con tecnología de Shopify, para ofrecerle una experiencia
        de compra seleccionada (los &quot;Servicios&quot;). Esta política describe cómo recopilamos,
        utilizamos y divulgamos su información personal cuando visita, utiliza o compra a través de los
        Servicios.
      </p>

      <h2>Información que recopilamos</h2>
      <p>
        Detalles de contacto (nombre, dirección, teléfono, email), información financiera relacionada con el
        pago, información de la cuenta, historial de transacciones, comunicaciones con nosotros, e
        información técnica de su dispositivo y su uso del sitio.
      </p>

      <h2>Cómo la usamos</h2>
      <p>
        Para prestar y mejorar los Servicios (procesar pagos, gestionar pedidos, envíos, devoluciones), para
        marketing y comunicaciones promocionales, para seguridad y prevención de fraude, para atención al
        cliente, y para cumplir con obligaciones legales.
      </p>

      <h2>Con quién la compartimos</h2>
      <p>
        Con Shopify y proveedores que prestan servicios en nuestro nombre (pagos, envíos, análisis), con
        partners de marketing cuando corresponde, y cuando la legislación aplicable lo exija.
      </p>

      <h2>Relación con Shopify</h2>
      <p>
        Los Servicios están alojados en Shopify, que también procesa información personal vinculada a su uso
        del sitio. Más información en la{" "}
        <a
          href="https://www.shopify.com/legal/privacy/app-users"
          target="_blank"
          rel="noreferrer"
          className="text-accent"
        >
          Política de privacidad del consumidor de Shopify
        </a>
        .
      </p>

      <h2>Datos de menores</h2>
      <p>
        Los Servicios no están destinados a menores de edad; no recopilamos conscientemente información
        personal de menores según la legislación aplicable.
      </p>

      <h2>Sus derechos</h2>
      <p>
        Según su jurisdicción, puede tener derecho de acceso, supresión, rectificación y portabilidad de su
        información personal, así como a gestionar sus preferencias de comunicación (cancelar suscripción a
        emails promocionales).
      </p>

      <h2>Transferencias internacionales</h2>
      <p>
        Su información puede transferirse, almacenarse y procesarse fuera del país en el que reside, con los
        mecanismos de protección correspondientes.
      </p>

      <h2>Contacto</h2>
      <p>
        Para preguntas sobre esta política o para ejercer sus derechos, escribinos a{" "}
        <a href="mailto:sologlazes@gmail.com" className="text-accent">
          sologlazes@gmail.com
        </a>{" "}
        o a nuestra dirección en Buenos Aires, Argentina.
      </p>
    </LegalPage>
  );
}
