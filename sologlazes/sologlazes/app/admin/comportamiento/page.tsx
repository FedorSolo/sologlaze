import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const ID = process.env.CLARITY_ID ?? process.env.NEXT_PUBLIC_CLARITY_ID;

const LINKS = [
  { key: "dashboard", title: "Panel general", text: "Resumen: sesiones, páginas vistas, profundidad de scroll, tiempo activo y alertas automáticas de problemas.", icon: "dashboard" },
  { key: "recordings", title: "Grabaciones de visitas", text: "Ves, como un video, cómo se mueve cada persona: dónde hace clic, dónde duda, dónde se va. Filtrá por «Rage clicks» o «Dead clicks» para ir directo a los problemas.", icon: "recordings" },
  { key: "heatmaps", title: "Mapas de calor", text: "Dónde hacen clic y hasta dónde bajan en cada página (inicio, catálogo, producto, carrito). Elegí la página y el dispositivo.", icon: "heatmaps" },
];

const SIGNALS = [
  { name: "Rage clicks (clics de enojo)", text: "La persona hace clic muchas veces seguidas en el mismo lugar: algo no responde o parece un botón y no lo es." },
  { name: "Dead clicks (clics muertos)", text: "Hace clic y no pasa nada: un texto o una imagen que parece enlace, o un botón roto." },
  { name: "Quick backs (vuelta rápida)", text: "Entra a una página y vuelve atrás enseguida: no era lo que esperaba." },
  { name: "Excessive scrolling", text: "Sube y baja sin parar: no encuentra lo que busca (precio, envío, cómo comprar)." },
  { name: "Javascript errors", text: "Errores técnicos que la persona sufrió en su celular o navegador." },
];

export default function ComportamientoPage() {
  const base = ID ? `https://clarity.microsoft.com/projects/view/${ID}` : null;

  return (
    <div>
      <h1 className="mb-1 text-h1">Comportamiento de visitantes</h1>
      <p className="mb-6 max-w-2xl text-text-secondary">
        Cómo usa la gente el sitio: grabaciones, mapas de calor y los lugares donde se traba. Lo hace Microsoft Clarity (gratis, sin límite de visitas). Los números de ventas y orígenes siguen en «Analítica».
      </p>

      {!base ? (
        <div className="mb-8 max-w-2xl space-y-3 rounded-lg border border-border p-6 text-sm">
          <p className="text-body font-medium">Activar Clarity (5 minutos)</p>
          <ol className="list-decimal space-y-2 pl-5 text-text-secondary">
            <li>
              Entrá a <a className="text-accent underline" href="https://clarity.microsoft.com" target="_blank" rel="noreferrer">clarity.microsoft.com</a> con tu cuenta de Google o Microsoft y creá un proyecto: nombre «SoloGlazes», sitio <b>https://sologlazes.com.ar</b>.
            </li>
            <li>
              En el proyecto, «Settings» → «Overview»: copiá el <b>Project ID</b> (10 letras y números, por ejemplo <code className="rounded bg-surface-muted px-1">abc1de2fgh</code>).
            </li>
            <li>
              En Vercel → Settings → Environment Variables creá <code className="rounded bg-surface-muted px-1">CLARITY_ID</code> con ese valor y hacé Redeploy.
            </li>
            <li>Al cabo de unos minutos de visitas ya aparecen las primeras grabaciones. Esta página va a mostrar los accesos directos.</li>
          </ol>
        </div>
      ) : (
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {LINKS.map((l) => (
            <a key={l.key} href={`${base}/${l.icon}`} target="_blank" rel="noreferrer" className="group rounded-lg border border-border p-4 transition-shadow hover:shadow-md">
              <p className="mb-1 flex items-center gap-2 text-body font-medium">
                {l.title} <ExternalLink size={14} className="text-text-secondary transition-transform group-hover:translate-x-0.5" />
              </p>
              <p className="text-sm text-text-secondary">{l.text}</p>
            </a>
          ))}
        </div>
      )}

      <div className="mb-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-border p-5">
          <h2 className="mb-3 text-h3">Dónde se traba la gente</h2>
          <p className="mb-3 text-xs text-text-secondary">Clarity los marca solo en cada grabación. Filtrá por estas señales:</p>
          <ul className="space-y-3 text-sm">
            {SIGNALS.map((s) => (
              <li key={s.name}>
                <p className="font-medium">{s.name}</p>
                <p className="text-text-secondary">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border p-5">
          <h2 className="mb-3 text-h3">Qué mirar primero</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-text-secondary">
            <li>Mapa de calor de la <b>página de producto</b> en celular: ¿hacen clic en las fotos, en las variantes o en «Agregar al carrito»? ¿Bajan hasta la descripción?</li>
            <li>Grabaciones filtradas por <b>Rage / Dead clicks</b> en el <b>carrito y checkout</b>: ahí se pierden las ventas.</li>
            <li>Mapa de calor del <b>inicio</b>: ¿tocan las tarjetas de las líneas o se quedan en la imagen?</li>
            <li>Grabaciones de visitas que <b>llegaron y se fueron</b> en menos de 10 segundos: ¿qué vieron?</li>
          </ol>
          <p className="mt-4 text-xs text-text-secondary">
            Tus propias visitas no se graban: el navegador donde abrís el panel de administración queda marcado como «del dueño». Si no querés grabar a alguien que usa «No rastrear», Clarity ya lo respeta aquí.
          </p>
        </div>
      </div>

      <div className="rounded-md bg-surface-muted p-4 text-sm text-text-secondary">
        <b className="text-text-primary">Privacidad.</b> Clarity oculta automáticamente los campos de contraseña y datos de pago, y podés activar en su panel «Masking» más estricto (Settings → Masking). Conviene mencionar el uso de herramientas de analítica en la política de privacidad del sitio.
      </div>
    </div>
  );
}
