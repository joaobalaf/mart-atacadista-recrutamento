import type { ReactNode } from "react";
import { Logo } from "../components/Logo";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-brand-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">TRABALHE CONOSCO</p>
            <p className="text-xs text-brand-gray-400">Venha fazer parte do nosso time</p>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-brand-red-600 via-brand-red-500 to-brand-gold-500" />
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-brand-gray-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-brand-gray-500 sm:px-6">
          © {new Date().getFullYear()} MART Atacadista — Recrutamento e Seleção
        </div>
      </footer>
    </div>
  );
}
