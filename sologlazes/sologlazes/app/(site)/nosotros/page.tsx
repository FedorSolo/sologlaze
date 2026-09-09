export const metadata = {
  title: "Nosotros",
  description:
    "Anna Sologubova y Fedor Sologubov — la pareja de artesanos detrás de SoloGlazes, esmaltes cerámicos de alta temperatura hechos en Buenos Aires.",
};

const points = [
  { title: "Durabilidad", desc: "Los esmaltes de alta temperatura son más resistentes a las grietas, rayas y la corrosión." },
  { title: "Seguridad", desc: "Perfectos para uso en vajilla y alimentos, no liberan sustancias nocivas." },
  { title: "Color y profundidad", desc: "Los colores se desarrollan con más intensidad y efectos únicos a 1200 °C." },
  { title: "Estabilidad", desc: "Soportan lavavajillas y cambios de temperatura sin deterioro." },
];

export default function NosotrosPage() {
  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        Inicio / Nosotros
      </nav>

      <div className="max-w-2xl">
        <h1 className="mb-6 text-h1 lg:text-h1-lg">Quiénes somos</h1>
        <p className="mb-6 text-body-lg text-text-secondary">
          ¡Hola! Somos <strong className="text-text-primary">Anna Sologubova</strong> y{" "}
          <strong className="text-text-primary">Fedor Sologubov</strong>, una pareja de artesanos que vive en
          Buenos Aires y produce esmaltes cerámicos de alta temperatura para vajilla y gres bajo la marca
          SoloGlazes.
        </p>

        <h2 className="mb-2 mt-8 text-h3">Sobre Anna</h2>
        <p className="mb-4 text-body text-text-secondary">
          Soy artista ceramista con más de diez años de experiencia. Enseño química de esmaltes cerámicos y
          dicto cursos online para ceramistas de Rusia y Latinoamérica. Todas las recetas de nuestros esmaltes
          son desarrolladas por mí desde cero, probadas en múltiples hornadas y totalmente seguras para uso
          alimenticio.
        </p>

        <h2 className="mb-2 mt-8 text-h3">Sobre Fedor</h2>
        <p className="mb-4 text-body text-text-secondary">
          Me encargo de la parte técnica y logística: la producción, mezclas, envasado, envíos y comunicación
          con nuestros clientes. Cada lote se prepara manualmente para garantizar la calidad y consistencia de
          cada esmalte.
        </p>

        <h2 className="mb-4 mt-8 text-h3">Por qué trabajamos con esmaltes de alta temperatura</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title} className="rounded-md border border-border p-4">
              <p className="mb-1 text-sm font-medium">{p.title}</p>
              <p className="text-sm text-text-secondary">{p.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-body text-text-secondary">
          Hoy contamos con una colección de esmaltes cerámicos de alta temperatura en Argentina, y seguimos
          ampliando nuestra línea con nuevos tonos y efectos para los ceramistas que buscan calidad, belleza y
          fiabilidad.
        </p>
      </div>
    </div>
  );
}
