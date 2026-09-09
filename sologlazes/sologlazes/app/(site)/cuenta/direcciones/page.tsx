import { Plus, Pencil, Trash2 } from "lucide-react";

const addresses = [
  { id: "1", label: "Casa", street: "Av. Corrientes 1234", city: "CABA", isDefault: true },
  { id: "2", label: "Taller", street: "Ruta 9 km 1580", city: "Salta", isDefault: false },
];

export default function DireccionesPage() {
  return (
    <div>
      <div className="mb-6 space-y-3">
        {addresses.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-md border border-border p-4">
            <div>
              <p className="text-sm font-medium">
                {a.label} {a.isDefault && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">Predeterminada</span>}
              </p>
              <p className="text-sm text-text-secondary">{a.street}, {a.city}</p>
            </div>
            <div className="flex gap-2 text-text-secondary">
              <button aria-label="Editar"><Pencil size={16} /></button>
              <button aria-label="Eliminar"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      <button className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm">
        <Plus size={16} /> Agregar dirección
      </button>
    </div>
  );
}
