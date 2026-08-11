const STEP_LABELS = ["Dados", "Endereço", "Vaga", "Experiência", "Disponibilidade", "Revisão"];

export function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const index = i + 1;
          const done = index < step;
          const active = index === step;
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div className="flex-1">
                  {i > 0 && (
                    <div
                      className={`h-0.5 w-full ${done || active ? "bg-brand-red-500" : "bg-brand-gray-200"}`}
                    />
                  )}
                </div>
              </div>
              <div
                className={`-mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  done
                    ? "bg-brand-red-600 text-white"
                    : active
                      ? "bg-brand-gold-500 text-brand-ink"
                      : "bg-brand-gray-200 text-brand-gray-500"
                }`}
              >
                {index}
              </div>
              <span
                className={`mt-1 hidden text-[11px] font-medium sm:block ${
                  active ? "text-brand-red-600" : "text-brand-gray-500"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
