import Link from "next/link";
import { requireAdmin } from "../../../lib/auth/admin";
import { signOutAction } from "../actions";

export default async function PanelLayout({ children }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-verdemoikato/15 bg-osso/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
          <div className="flex items-baseline gap-5">
            <Link href="/admin" className="font-display text-2xl">
              Moikato <span className="text-sm font-sans text-verdemoikato/50">painel</span>
            </Link>
            <nav className="flex gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/70">
              <Link href="/admin" className="min-h-11 content-center hover:text-verdemoikato">
                Peças
              </Link>
              <Link href="/pt-BR/catalogo" target="_blank" className="min-h-11 content-center hover:text-verdemoikato">
                Ver loja ↗
              </Link>
            </nav>
          </div>
          <form action={signOutAction} className="flex items-center gap-3 text-sm text-verdemoikato/60">
            <span className="hidden sm:inline">{admin.email}</span>
            <button type="submit" className="min-h-11 text-xs font-semibold uppercase tracking-[0.12em] hover:text-verdemoikato">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">{children}</main>
    </div>
  );
}
