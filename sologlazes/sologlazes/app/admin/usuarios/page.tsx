import { prisma } from "@/lib/prisma";

export default async function AdminUsuariosPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-h1">Usuarios</h1>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-text-secondary">
          <tr>
            <th className="py-2 font-medium">Nombre</th>
            <th className="py-2 font-medium">Email</th>
            <th className="py-2 font-medium">Rol</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="py-3">{u.name ?? "—"}</td>
              <td className="py-3 text-text-secondary">{u.email}</td>
              <td className="py-3">
                <span className={`rounded-full px-2 py-1 text-xs ${u.role === "ADMIN" ? "bg-accent-soft text-accent" : "bg-surface-muted text-text-secondary"}`}>
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
