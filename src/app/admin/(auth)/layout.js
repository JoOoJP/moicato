import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/pt-BR" className="font-display text-3xl text-verdemoikato">
          Moikato
        </Link>
        <p className="eyebrow mt-1 text-amarelomoikato-700">Painel</p>
        <div className="mt-8 border-t border-verdemoikato/20 pt-8">{children}</div>
      </div>
    </main>
  );
}
