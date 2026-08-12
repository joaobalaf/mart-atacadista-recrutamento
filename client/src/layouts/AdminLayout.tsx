import type { ReactNode } from "react";
import { useState, type FormEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../store/authStore";

function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" />
      <path d="M16 4.2c1.7.4 3 2 3 3.8s-1.3 3.4-3 3.8" />
      <path d="M21 20c0-3-2-5.3-4.7-5.9" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M3 9.5 4.5 4h15L21 9.5" />
      <path d="M4 9.5v10.5h16V9.5" />
      <path d="M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  );
}

const NAV_GROUPS = [
  {
    label: "Visão geral",
    items: [{ to: "/admin", label: "Dashboard", end: true, icon: IconDashboard }],
  },
  {
    label: "Recrutamento",
    items: [
      { to: "/admin/candidatos", label: "Candidatos", end: false, icon: IconUsers },
      { to: "/admin/vagas", label: "Vagas", end: false, icon: IconBriefcase },
      { to: "/admin/lojas", label: "Lojas", end: false, icon: IconStore },
    ],
  },
];

const PAGE_TITLES: Record<string, { section: string; title: string }> = {
  "/admin": { section: "VISÃO GERAL", title: "Dashboard" },
  "/admin/candidatos": { section: "RECRUTAMENTO", title: "Candidatos" },
  "/admin/vagas": { section: "RECRUTAMENTO", title: "Vagas" },
  "/admin/lojas": { section: "RECRUTAMENTO", title: "Lojas" },
};

function useBreadcrumb() {
  const { pathname } = useLocation();
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/admin/candidatos/")) return { section: "RECRUTAMENTO", title: "Perfil do candidato" };
  return { section: "PAINEL", title: "MART Atacadista" };
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = useAuth();
  const { section, title } = useBreadcrumb();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/admin/candidatos?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center border-b border-slate-100 px-5">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{group.label}</p>
              <div className="mt-2 space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    <item.icon />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red-600 text-xs font-bold text-white">
              {admin?.name ? admin.name[0].toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900">{admin?.name}</p>
              <p className="truncate text-[11px] text-slate-500">{admin?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sair"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-8 backdrop-blur">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <span className="uppercase tracking-wider">{section}</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">{title}</span>
          </div>
          <form onSubmit={handleSearch} className="hidden w-72 sm:block">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 transition focus-within:border-slate-300 focus-within:bg-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar candidato por nome ou telefone..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </form>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
