export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container py-10 lg:py-14">
      <h1 className="mb-8 text-h1 lg:text-h1-lg">{title}</h1>
      <div className="max-w-2xl space-y-4 text-body text-text-secondary [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-h3 [&_h2]:text-text-primary">
        {children}
      </div>
    </div>
  );
}
