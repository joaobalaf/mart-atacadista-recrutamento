import { useWizard } from "../../../store/wizardStore";
import { ErrorText, Label, Textarea } from "../../../components/ui";
import type { Errors } from "../../../lib/validation";

export function Step4Experience({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Sua experiência</h2>
      <p className="text-sm text-brand-gray-500">Conte um pouco sobre seu último trabalho.</p>

      <div>
        <Label>Qual foi sua última experiência de trabalho? *</Label>
        <Textarea
          rows={6}
          value={data.lastExperience}
          onChange={(e) => updateData({ lastExperience: e.target.value })}
          placeholder="Ex: Trabalhei como operador de caixa em um supermercado por 2 anos, cuidando do atendimento ao cliente..."
        />
        <ErrorText>{errors.lastExperience}</ErrorText>
      </div>
    </div>
  );
}
