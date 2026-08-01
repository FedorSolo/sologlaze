export default function PerfilPage() {
  return (
    <form className="max-w-md space-y-4">
      <Field label="Nombre y apellido" defaultValue="María Fernández" />
      <Field label="Email" type="email" defaultValue="maria@example.com" />
      <Field label="Teléfono" defaultValue="+54 9 11 5555-0123" />
      <button type="submit" className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
        Guardar cambios
      </button>
    </form>
  );
}

function Field({ label, type = "text", defaultValue }: { label: string; type?: string; defaultValue?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">{label}</span>
      <input type={type} defaultValue={defaultValue} className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent" />
    </label>
  );
}
