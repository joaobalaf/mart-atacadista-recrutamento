import { useEffect, useState } from "react";
import { useWizard } from "../../../store/wizardStore";
import { Card, ErrorText } from "../../../components/ui";
import { api } from "../../../services/api";
import type { Job } from "../../../lib/types";
import type { Errors } from "../../../lib/validation";

const STORE_LABELS: Record<string, string> = {
  CAJAMAR: "Cajamar",
  ITAPEVI: "Itapevi",
  BARUERI: "Barueri",
  QUALQUER_UMA: "Qualquer uma das lojas",
};

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-brand-gray-100 py-2 text-sm last:border-0">
      <span className="text-brand-gray-500">{label}</span>
      <span className="text-right font-medium text-brand-ink">{value}</span>
    </div>
  );
}

export function Step6Review({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.get<Job[]>("/public/jobs").then(setJobs).catch(() => setJobs([]));
  }, []);

  const jobNames = jobs.filter((j) => data.jobIds.includes(j.id)).map((j) => j.name);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Revise seus dados</h2>

      <Card>
        <Row label="Nome" value={data.fullName} />
        <Row label="Telefone" value={data.phone} />
        <Row label="E-mail" value={data.email} />
        <Row label="Cidade" value={`${data.city}${data.state ? " - " + data.state : ""}`} />
        <Row label="Endereço" value={`${data.street}${data.number ? ", " + data.number : ""}`} />
        <Row label="Vagas de interesse" value={jobNames.join(", ") || (data.wantsOtherOpportunity ? "Outras oportunidades" : "")} />
        {data.wantsOtherOpportunity && <Row label="Interesse informado" value={data.otherJobInterest} />}
        <Row label="Loja de preferência" value={STORE_LABELS[data.preferredStoreChoice] ?? ""} />
        <Row
          label="Experiência profissional"
          value={data.hasPreviousExperience ? `${data.experiences.length} experiência(s) informada(s)` : "Sem experiência anterior"}
        />
      </Card>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-gray-300 p-4 text-sm">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-brand-red-600"
          checked={data.termsAccepted}
          onChange={(e) => updateData({ termsAccepted: e.target.checked })}
        />
        <span className="text-brand-gray-600">
          Declaro que as informações fornecidas são verdadeiras e autorizo o MART Atacadista a
          utilizar meus dados para fins de recrutamento e seleção, conforme a legislação aplicável.
        </span>
      </label>
      <ErrorText>{errors.termsAccepted}</ErrorText>
    </div>
  );
}
