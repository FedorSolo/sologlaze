// Se muestra de inmediato mientras carga la ficha del producto, para que la navegación
// nunca se sienta "colgada" entre el clic y la página final.
export default function Loading() {
  return (
    <div className="container animate-pulse py-10 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="aspect-[4/5] w-full rounded-lg bg-surface-muted" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-surface-muted" />
          <div className="h-8 w-3/4 rounded bg-surface-muted" />
          <div className="h-5 w-1/2 rounded bg-surface-muted" />
          <div className="h-10 w-40 rounded bg-surface-muted" />
          <div className="mt-6 h-12 w-full rounded-full bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}
