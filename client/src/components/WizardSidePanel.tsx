import { Logo } from "./Logo";

const HIGHLIGHTS = [
  "Vagas em Cajamar, Itapevi e Barueri",
  "Cadastro rápido e 100% online",
  "Seus dados usados só para recrutamento",
];

export function WizardSidePanel() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-red-50/50 via-white to-slate-50 border-r border-slate-100 px-10 py-12 text-slate-800 lg:flex">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-red-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

      <div className="relative">
        <Logo size="lg" />
        <h1 className="mt-10 text-3xl font-black leading-tight text-slate-900">
          Sua próxima oportunidade profissional está a alguns passos.
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
          Preencha seus dados com atenção. Nosso processo é 100% digital, seguro e focado na sua melhor experiência.
        </p>
      </div>

      <div className="relative space-y-3.5 border-t border-slate-200/80 pt-8">
        {HIGHLIGHTS.map((h) => (
          <div key={h} className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-brand-red-600 text-xs font-bold">
              ✓
            </div>
            {h}
          </div>
        ))}
      </div>
    </div>
  );
}
