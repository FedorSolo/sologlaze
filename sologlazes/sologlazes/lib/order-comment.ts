// Los pedidos de invitados guardan el contacto y las elecciones del pack dentro de `customerComment`
// como texto plano. Acá se separa en campos para mostrarlo ordenado en el admin.
//
// Formato que escribe el checkout:
//   Nombre: X · Tel: Y · Email: Z
//
//   Pack Prueba 5x200g: Cristalina — Cristalina "Gris", Floating — Floating "Verde", ...
//
//   <comentario del cliente / aviso de envío>

export type ParsedPack = { product: string; picks: { series: string; name: string }[] };

export type ParsedComment = {
  name?: string;
  phone?: string;
  email?: string;
  quickOrder: boolean;
  packs: ParsedPack[];
  notes: string[]; // todo lo demás, un párrafo por elemento
};

function cleanPick(raw: string) {
  const [seriesRaw, nameRaw] = raw.includes(" — ") ? raw.split(" — ") : ["", raw];
  const series = seriesRaw.trim();
  let name = (nameRaw ?? "").trim();
  if (series && name.toLowerCase().startsWith(series.toLowerCase())) name = name.slice(series.length).trim();
  name = name.replace(/^["“”']+|["“”']+$/g, "").trim();
  return { series, name: name || raw.trim() };
}

export function parseOrderComment(comment?: string | null): ParsedComment {
  const out: ParsedComment = { quickOrder: false, packs: [], notes: [] };
  if (!comment) return out;

  for (const block of comment.split(/\n\s*\n/)) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const rest: string[] = [];

    for (const line of lines) {
      // Datos de contacto
      if (/^Nombre:/i.test(line)) {
        out.name = line.match(/Nombre:\s*([^·]+?)\s*(?:·|$)/i)?.[1]?.trim() || out.name;
        out.phone = line.match(/Tel:\s*([^·]+?)\s*(?:·|$)/i)?.[1]?.trim() || out.phone;
        out.email = line.match(/Email:\s*([^\s·]+@[^\s·]+)/i)?.[1] || out.email;
        continue;
      }
      // Pedido rápido (sin checkout)
      const quick = line.match(/PEDIDO R[ÁA]PIDO.*WhatsApp:\s*(.+)$/i);
      if (quick) {
        out.quickOrder = true;
        out.phone = quick[1].trim();
        continue;
      }
      // Elección de glaseados del pack: "Producto: Serie — Nombre, Serie — Nombre"
      const pack = line.match(/^([^:]+):\s*(.+)$/);
      if (pack && pack[2].includes(" — ")) {
        out.packs.push({ product: pack[1].trim(), picks: pack[2].split(/,\s+(?=[^,]+ — )/).map(cleanPick) });
        continue;
      }
      rest.push(line);
    }
    if (rest.length) out.notes.push(rest.join("\n"));
  }
  return out;
}

// Número listo para wa.me (Argentina: 54 + 9 + área + número, sin 0 ni 15).
export function whatsappNumber(phone?: string | null) {
  if (!phone) return null;
  let d = phone.replace(/\D/g, "");
  if (d.length < 8) return null;
  d = d.replace(/^0+/, "");
  if (d.startsWith("54")) return d.startsWith("549") ? d : `549${d.slice(2)}`;
  return `549${d}`;
}
