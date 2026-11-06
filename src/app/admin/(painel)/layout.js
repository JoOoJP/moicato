import Link from "next/link";
import { requireAdmin } from "../../../lib/auth/admin";
import { signOutAction } from "../actions";
import AdminNav from "../../../components/admin/AdminNav";

export default async function PanelLayout({ children }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[220px_1fr]">
      <aside className="sticky top-0 z-30 border-b border-verdemoikato/15 bg-osso-100 px-4 py-3 lg:h-screen lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Link href="/admin" className="font-display text-2xl text-verdemoikato">
            Moikato <span className="font-sans text-xs uppercase tracking-[0.14em] text-verdemoikato/50">painel</span>
          </Link>
          <Link
            href="/pt-BR/catalogo"
            target="_blank"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-amarelomoikato-700 hover:underline lg:mt-2 lg:block"
          >
            Ver loja ↗
          </Link>
        </div>
        <div className="mt-3 lg:mt-8">
          <AdminNav />
        </div>
        <form action={signOutAction} className="mt-8 hidden border-t border-verdemoikato/15 pt-4 text-xs text-verdemoikato/55 lg:block">
          <p className="truncate">{admin.email}</p>
          <button type="submit" className="mt-2 min-h-9 font-semibold uppercase tracking-[0.12em] hover:text-verdemoikato">
            Sair
          </button>
        </form>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
        <form action={signOutAction} className="mt-12 text-center text-xs text-verdemoikato/55 lg:hidden">
          <span>{admin.email} · </span>
          <button type="submit" className="min-h-11 font-semibold uppercase tracking-[0.12em]">
            Sair
          </button>
        </form>
      </main>
    </div>
  );
}
