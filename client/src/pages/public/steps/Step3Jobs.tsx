import { useEffect, useState } from "react";
import { useWizard } from "../../../store/wizardStore";
import { ErrorText, Textarea } from "../../../components/ui";
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

  function select(value: string) {
    if (value === OTHER_VALUE) {
      updateData({ jobId: "", wantsOtherOpportunity: true });
    } else {
      updateData({ jobId: value, wantsOtherOpportunity: false, otherJobInterest: "" });
    }
  }

  const options = [...jobs.map((j) => ({ value: j.id, label: j.name })), { value: OTHER_VALUE, label: "Outras oportunidades" }];
  const selectedValue = data.wantsOtherOpportunity ? OTHER_VALUE : data.jobId;

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Qual vaga você tem interesse? *</h2>
      <p className="text-sm text-brand-gray-500">Toque na opção que mais combina com você.</p>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {options.map((opt) => {
          const active = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className={`rounded-xl border-2 px-3 py-3 text-left text-sm font-semibold transition-all cursor-pointer ${
                active
                  ? "border-brand-red-600 bg-brand-red-50 text-brand-red-700 shadow-sm"
                  : "border-brand-gray-200 text-brand-ink hover:border-brand-gray-300 hover:bg-brand-gray-50"
              }`}
            >
              <span className={`mb-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] ${
                active ? "border-brand-red-600 bg-brand-red-600 text-white" : "border-brand-gray-300 text-transparent"
              }`}>
                ✓
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
      <ErrorText>{errors.jobId}</ErrorText>

      {data.wantsOtherOpportunity && (
        <div>
          <Textarea
            rows={3}
            value={data.otherJobInterest}
            onChange={(e) => updateData({ otherJobInterest: e.target.value })}
            placeholder="Qual oportunidade você procura?"
          />
          <ErrorText>{errors.otherJobInterest}</ErrorText>
        </div>
      )}
    </div>
  );
}
