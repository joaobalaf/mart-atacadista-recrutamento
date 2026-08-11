import { useEffect, useState } from "react";
import { useWizard } from "../../../store/wizardStore";
import { Checkbox, ErrorText, Label, Textarea } from "../../../components/ui";
import { api } from "../../../services/api";
import type { Job } from "../../../lib/types";
import type { Errors } from "../../../lib/validation";

export function Step3Jobs({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.get<Job[]>("/public/jobs").then(setJobs).catch(() => setJobs([]));
  }, []);

  function toggleJob(jobId: string, checked: boolean) {
    updateData({
      jobIds: checked ? [...data.jobIds, jobId] : data.jobIds.filter((id) => id !== jobId),
    });
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Qual vaga você tem interesse?</h2>
      <p className="text-sm text-brand-gray-500">Você pode selecionar mais de uma opção.</p>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {jobs.map((job) => (
          <Checkbox
            key={job.id}
            label={job.name}
            checked={data.jobIds.includes(job.id)}
            onChange={(checked) => toggleJob(job.id, checked)}
          />
        ))}
      </div>

      <Checkbox
        label="Tenho interesse em outras oportunidades"
        checked={data.wantsOtherOpportunity}
        onChange={(checked) => updateData({ wantsOtherOpportunity: checked })}
      />

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

      <ErrorText>{errors.jobIds}</ErrorText>
    </div>
  );
}
