import type { CandidateStatus } from "../lib/types";
import { STATUS_LABELS } from "../lib/types";

const STATUS_STYLES: Record<CandidateStatus, string> = {
  NOVO: "bg-brand-red-100 text-brand-red-700 ring-brand-red-200",
  EM_ANALISE: "bg-amber-100 text-amber-800 ring-amber-200",
  CONTATO_REALIZADO: "bg-sky-100 text-sky-800 ring-sky-200",
  ENTREVISTA: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  APROVADO: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  REPROVADO: "bg-brand-gray-200 text-brand-gray-600 ring-brand-gray-300",
  CONTRATADO: "bg-emerald-600 text-white ring-emerald-700",
  BANCO_DE_TALENTOS: "bg-purple-100 text-purple-800 ring-purple-200",
};

export function StatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
