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
    <div className="flex min-h-screen bg-slate-50/60">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white text-slate-800 shadow-xs">
        <div className="border-b border-slate-100 px-6 py-5">
          <Logo size="md" />
        </div>
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-red-50 text-brand-red-600 border border-red-100 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red-600 text-sm font-bold text-white shadow-xs">
              {admin?.name ? admin.name[0].toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold text-slate-900">{admin?.name}</p>
              <p className="truncate text-xs text-slate-500">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 shadow-xs cursor-pointer"
          >
            Sair
          </button>
        </div>
      </aside>
      <div className="flex-1">
        <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
