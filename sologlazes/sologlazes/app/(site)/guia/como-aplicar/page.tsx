import { permanentRedirect } from "next/navigation";

// La guía ahora vive en una sola página: /guia
export default function Page() {
  permanentRedirect("/guia#como-aplicar");
}
