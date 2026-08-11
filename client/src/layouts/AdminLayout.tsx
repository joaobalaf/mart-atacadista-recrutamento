import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../store/authStore";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/candidatos", label: "Candidatos" },
  { to: "/admin/vagas", label: "Vagas" },
  { to: "/admin/lojas", label: "Lojas" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-brand-gray-50">
      <aside className="flex w-64 shrink-0 flex-col bg-brand-ink text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-red-600 text-white"
                    : "text-brand-gray-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-sm font-semibold">{admin?.name}</p>
          <p className="truncate text-xs text-brand-gray-400">{admin?.email}</p>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </aside>
      <div className="flex-1">
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
