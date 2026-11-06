"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Peças", match: (p) => p === "/admin" || p.startsWith("/admin/produtos") },
  { href: "/admin/colecoes", label: "Coleções", match: (p) => p.startsWith("/admin/colecoes") },
  { href: "/admin/pedidos", label: "Pedidos", match: (p) => p.startsWith("/admin/pedidos") },
  { href: "/admin/embalagens", label: "Embalagens", match: (p) => p.startsWith("/admin/embalagens") },
  { href: "/admin/configuracoes", label: "Configurações", match: (p) => p.startsWith("/admin/configuracoes") },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 shrink-0 items-center px-3 text-sm transition-colors ${
              active ? "bg-verdemoikato text-osso" : "text-verdemoikato/75 hover:bg-verdemoikato/5 hover:text-verdemoikato"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
