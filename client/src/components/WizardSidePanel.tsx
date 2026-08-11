import { Logo } from "./Logo";

const STEPS = ["Seus dados", "Endereço", "Vaga de interesse", "Sua experiência", "Sobre você"];

const HIGHLIGHTS = [
  "Vagas em Cajamar, Itapevi e Barueri",
  "Cadastro rápido e 100% online",
  "Seus dados usados só para recrutamento",
];

export function WizardSidePanel({ step }: { step: number }) {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-brand-ink px-10 py-12 text-white lg:flex">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative">
        <Logo />
        <h1 className="mt-12 text-3xl font-black leading-tight">
          Sua próxima vaga pode estar aqui.
        </h1>
        <p className="mt-3 max-w-xs text-sm text-brand-gray-400">
          Leva poucos minutos. Preencha seus dados e fique disponível para as oportunidades do
          MART Atacadista.
        </p>

        <ol className="mt-12 space-y-1">
          {STEPS.map((label, i) => {
            const index = i + 1;
            const done = index < step;
            const active = index === step;
            return (
              <li key={label} className="flex items-start gap-3 py-2">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                      done
                        ? "bg-brand-gold-500 text-brand-ink"
                        : active
                          ? "bg-brand-red-600 text-white ring-4 ring-brand-red-600/25"
                          : "bg-white/10 text-brand-gray-400"
                    }`}
                  >
                    {done ? "✓" : index}
                  </div>
                  {index < STEPS.length && (
                    <div className={`mt-1 h-6 w-px ${done ? "bg-brand-gold-500" : "bg-white/10"}`} />
                  )}
                </div>
                <span
                  className={`pt-0.5 text-sm font-medium transition ${
                    active ? "text-white" : done ? "text-brand-gray-300" : "text-brand-gray-500"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="relative space-y-2.5 border-t border-white/10 pt-6">
        {HIGHLIGHTS.map((h) => (
          <div key={h} className="flex items-center gap-2 text-sm text-brand-gray-300">
            <span className="text-brand-gold-500">✓</span>
            {h}
          </div>
        ))}
      </div>
    </div>
  );
}
