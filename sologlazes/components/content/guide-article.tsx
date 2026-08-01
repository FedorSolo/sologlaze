import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function GuideArticle({
  title,
  crumb,
  children,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  crumb: string;
  children: React.ReactNode;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        <Link href="/">Inicio</Link> / <Link href="/guia">Guía</Link> / {crumb}
      </nav>
      <article className="max-w-2xl">
        <h1 className="mb-6 text-h1 lg:text-h1-lg">{title}</h1>
        <div className="prose-guide space-y-4 text-body text-text-secondary [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-h3 [&_h2]:text-text-primary [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
        <Link
          href={ctaHref}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          {ctaLabel} <ArrowRight size={16} />
        </Link>
      </article>
    </div>
  );
}
