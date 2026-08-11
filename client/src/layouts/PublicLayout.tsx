import type { ReactNode } from "react";
import { Logo } from "../components/Logo";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between">
      <div>
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
            <Logo size="md" />
            <div className="hidden text-right sm:block">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-brand-red-600 border border-red-100">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-500" />
                TRABALHE CONOSCO
              </span>
            </div>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-brand-red-600 via-brand-red-500 to-brand-gold-500" />
        </header>
        <main>{children}</main>
      </div>
      <footer className="border-t border-slate-100 bg-slate-50/50 py-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 sm:px-6">
          <Logo size="sm" />
          <p>© {new Date().getFullYear()} MART Atacadista — Todos os direitos reservados. Portal de Recrutamento & Seleção.</p>
        </div>
      </footer>
    </div>
  );
}
