import { LegalPage } from "@/components/content/legal-page";

export const metadata = { title: "Términos del servicio" };

// Texto real de sologlazes.com.ar/policies/terms-of-service (plantilla estándar de Shopify,
// completada por el comerciante). Los campos [INSERTAR ...] quedaron sin completar en el
// sitio original — señalados acá para que el cliente los complete antes del lanzamiento.
export default function TerminosPage() {
  return (
    <LegalPage title="Términos del servicio">
      <h2>Descripción general</h2>
      <p>
        Le damos la bienvenida a SoloGlazes. SoloGlazes opera esta tienda y sitio web, incluida toda la
        información, el contenido, las funciones, las herramientas, los productos y los servicios para
        brindarle a usted, el cliente, una experiencia de compra seleccionada (los &quot;Servicios&quot;).
      </p>
      <p>
        Al ver nuestros Servicios, interactuar con ellos o utilizarlos, acepta cumplir con estos Términos del
        servicio y nuestra Política de privacidad. Si no acepta estos Términos, no debe utilizar nuestros
        Servicios.
      </p>

      <h2>1. Acceso y cuenta</h2>
      <p>
        Al aceptar estos Términos, usted declara tener al menos la mayoría de edad prevista en su
        jurisdicción. Usted es exclusivamente responsable de preservar la seguridad de las credenciales de su
        cuenta y de toda la actividad de esta.
      </p>

      <h2>2. Nuestros productos</h2>
      <p>
        Los colores o el aspecto del producto pueden diferir de cómo se ven en su pantalla debido al
        dispositivo utilizado. No garantizamos que el aspecto de los productos que adquiera será idéntico al
        mostrado en la tienda online. Todas las descripciones de productos están sujetas a cambios sin previo
        aviso.
      </p>

      <h2>3. Pedidos</h2>
      <p>
        Al hacer un pedido, usted realiza una oferta de compra. SoloGlazes se reserva el derecho de aceptar o
        rechazar su pedido por cualquier motivo. Sus compras están sujetas a devoluciones o cambio únicamente
        conforme a nuestra Política de reembolso.
      </p>

      <h2>4. Precios y facturación</h2>
      <p>
        Los precios, descuentos y promociones están sujetos a cambios sin previo aviso. A menos que se
        determine algo diferente, los precios publicados no incluyen cargos por impuestos, envío ni gestión
        de pedidos.
      </p>

      <h2>5. Envío y entrega</h2>
      <p>
        No nos responsabilizamos por demoras en envíos y entregas. Todos los tiempos de entrega son
        estimaciones y no se garantizan. Una vez entregados los productos a la empresa de transporte, la
        titularidad y el riesgo pasan a estar en manos del comprador.
      </p>

      <h2>6. Propiedad intelectual</h2>
      <p>
        Nuestros Servicios —marcas, texto, imágenes, gráficos, reseñas, diseño— son propiedad de SoloGlazes,
        sus afiliados o licenciantes, y están protegidos por legislación de derechos de autor y propiedad
        intelectual. Se permite el uso de los Servicios únicamente con fines personales y no comerciales.
      </p>

      <h2>7–8. Herramientas opcionales y enlaces de terceros</h2>
      <p>
        Es posible que se brinde acceso a herramientas o enlaces de terceros sobre los que no ejercemos
        supervisión ni control. El uso de dichas herramientas o enlaces queda bajo su cuenta y riesgo.
      </p>

      <h2>9. Relación con Shopify</h2>
      <p>
        SoloGlazes cuenta con tecnología de Shopify para brindar los Servicios. Cualquier venta se realiza
        directamente con SoloGlazes; Shopify no se responsabiliza por las ventas entre usted y SoloGlazes.
      </p>

      <h2>10. Política de privacidad</h2>
      <p>
        Toda la información personal recopilada a través de los Servicios está sujeta a nuestra{" "}
        <a href="/privacidad" className="text-accent">
          Política de privacidad
        </a>
        .
      </p>

      <h2>11. Comentarios</h2>
      <p>
        Si envía ideas, sugerencias o reseñas, nos otorga una licencia perpetua y libre de regalías para
        utilizarlas en cualquier medio y con cualquier propósito, incluido el uso comercial.
      </p>

      <h2>12–13. Errores y usos prohibidos</h2>
      <p>
        Nos reservamos el derecho de corregir errores, imprecisiones u omisiones, y de cancelar pedidos ante
        cualquier inexactitud, en cualquier momento. Está prohibido usar los Servicios con fines ilegales,
        para infringir derechos de terceros, transmitir información falsa, o cargar código malicioso.
      </p>

      <h2>14–20. Rescisión, garantías, responsabilidad e indemnización</h2>
      <p>
        Podemos rescindir el acceso a los Servicios en cualquier momento. Los Servicios se proporcionan
        &quot;tal como están&quot;, sin garantías de ningún tipo. En la medida permitida por la ley,
        SoloGlazes no será responsable por daños indirectos, incidentales o resultantes derivados del uso de
        los Servicios. Usted acepta indemnizar a SoloGlazes ante reclamos de terceros derivados de su
        incumplimiento de estos Términos.
      </p>

      <h2>21. Legislación vigente</h2>
      <p>
        Estos Términos se rigen por los tribunales correspondientes a la jurisdicción de SoloGlazes (Buenos
        Aires, Argentina).
      </p>

      <h2>23. Cambios en los Términos del servicio</h2>
      <p>
        Podemos actualizar estos Términos publicando la versión modificada en este sitio web. El uso
        continuado de los Servicios después de una modificación implica su aceptación.
      </p>

      <h2>24. Información de contacto</h2>
      <p>
        Cualquier pregunta sobre estos Términos puede enviarse a{" "}
        <a href="mailto:sologlazes@gmail.com" className="text-accent">
          sologlazes@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
