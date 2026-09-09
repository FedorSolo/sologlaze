import { AccountNav } from "@/components/account/account-nav";

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-10 lg:py-14">
      <h1 className="mb-8 text-h1 lg:text-h1-lg">Mi cuenta</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountNav />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
