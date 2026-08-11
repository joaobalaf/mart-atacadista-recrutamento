import { useEffect, useState } from "react";
import { useWizard } from "../../../store/wizardStore";
import { ErrorText, Label, Select, Textarea } from "../../../components/ui";
import { api } from "../../../services/api";
import type { Job } from "../../../lib/types";
import type { Errors } from "../../../lib/validation";

const OTHER_VALUE = "__OUTRA__";

export function Step3Jobs({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.get<Job[]>("/public/jobs").then(setJobs).catch(() => setJobs([]));
  }, []);

  function handleChange(value: string) {
    if (value === OTHER_VALUE) {
      updateData({ jobId: "", wantsOtherOpportunity: true });
    } else {
      updateData({ jobId: value, wantsOtherOpportunity: false, otherJobInterest: "" });
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Qual vaga você tem interesse?</h2>
      <p className="text-sm text-brand-gray-500">Escolha a opção que mais combina com você.</p>

      <div>
        <Label>Vaga de interesse *</Label>
        <Select
          value={data.wantsOtherOpportunity ? OTHER_VALUE : data.jobId}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="">Selecione uma vaga</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.name}
            </option>
          ))}
          <option value={OTHER_VALUE}>Outras oportunidades</option>
        </Select>
        <ErrorText>{errors.jobId}</ErrorText>
      </div>

      {data.wantsOtherOpportunity && (
        <div>
          <Label>Qual oportunidade você procura?</Label>
          <Textarea
            rows={3}
            value={data.otherJobInterest}
            onChange={(e) => updateData({ otherJobInterest: e.target.value })}
          />
          <ErrorText>{errors.otherJobInterest}</ErrorText>
        </div>
      )}
    </div>
  );
}
