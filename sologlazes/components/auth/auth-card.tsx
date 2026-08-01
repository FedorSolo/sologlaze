import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-h2">{title}</h1>
        {subtitle && <p className="mb-6 text-sm text-text-secondary">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
        {footer && <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>}
      </div>
    </div>
  );
}

export function AuthField({ label, type = "text", name, required = true }: { label: string; type?: string; name: string; required?: boolean }) {
  return (
    <label className="mb-4 block text-sm">
      <span className="mb-1 block text-text-secondary">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent"
      />
    </label>
  );
}

export function AuthSubmit({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
    >
      {children}
    </button>
  );
}

export { Link };
