import { HomeView, homeMetadata } from "@/components/pages/home-view";

export const revalidate = 60;
export const metadata = homeMetadata("es");

export default function HomePage() {
  return <HomeView lang="es" />;
}
