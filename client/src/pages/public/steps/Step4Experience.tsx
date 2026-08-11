import { useWizard } from "../../../store/wizardStore";
import { Button, ErrorText, Input, Label, Textarea } from "../../../components/ui";
import type { ExperienceForm } from "../../../lib/types";
import type { Errors } from "../../../lib/validation";

const emptyExperience: ExperienceForm = { company: "", role: "", startDate: "", endDate: "", activities: "" };

export function Step4Experience({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();

  function setHasExperience(value: boolean) {
    updateData({
      hasPreviousExperience: value,
      experiences: value ? data.experiences.length ? data.experiences : [emptyExperience] : [],
    });
  }

  function updateExperience(index: number, patch: Partial<ExperienceForm>) {
    const next = data.experiences.map((exp, i) => (i === index ? { ...exp, ...patch } : exp));
    updateData({ experiences: next });
  }

  function addExperience() {
    updateData({ experiences: [...data.experiences, emptyExperience] });
  }

  function removeExperience(index: number) {
    updateData({ experiences: data.experiences.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Experiência profissional</h2>
      <p className="text-sm text-brand-gray-500">Você já trabalhou anteriormente?</p>

      <div className="flex gap-3">
        <Button
          type="button"
          variant={data.hasPreviousExperience ? "primary" : "secondary"}
          onClick={() => setHasExperience(true)}
        >
          Sim
        </Button>
        <Button
          type="button"
          variant={!data.hasPreviousExperience ? "primary" : "secondary"}
          onClick={() => setHasExperience(false)}
        >
          Não
        </Button>
      </div>

      {data.hasPreviousExperience && (
        <div className="space-y-4">
          {data.experiences.map((exp, index) => (
            <div key={index} className="rounded-xl border border-brand-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-ink">Experiência {index + 1}</p>
                {data.experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-xs font-medium text-brand-red-600 hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Empresa</Label>
                  <Input value={exp.company} onChange={(e) => updateExperience(index, { company: e.target.value })} />
                </div>
                <div>
                  <Label>Cargo / função</Label>
                  <Input value={exp.role} onChange={(e) => updateExperience(index, { role: e.target.value })} />
                </div>
                <div>
                  <Label>Período de entrada</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, { startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Período de saída</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, { endDate: e.target.value })}
                    placeholder="Deixe em branco se atual"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Label>Principais atividades realizadas</Label>
                <Textarea
                  rows={2}
                  value={exp.activities}
                  onChange={(e) => updateExperience(index, { activities: e.target.value })}
                />
              </div>
            </div>
          ))}

          <Button type="button" variant="ghost" onClick={addExperience}>
            + Adicionar experiência
          </Button>
        </div>
      )}

      <ErrorText>{errors.experiences}</ErrorText>
    </div>
  );
}
