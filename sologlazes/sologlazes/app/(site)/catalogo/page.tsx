import { CatalogView, catalogMetadata } from "@/components/pages/catalog-view";

export const metadata = catalogMetadata("es");
export const revalidate = 60;

export default function CatalogoPage() {
  return <CatalogView lang="es" />;
}
