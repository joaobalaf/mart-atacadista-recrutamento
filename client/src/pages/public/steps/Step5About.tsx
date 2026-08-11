import { useWizard } from "../../../store/wizardStore";
import { ErrorText, Label, Textarea } from "../../../components/ui";
import type { Errors } from "../../../lib/validation";

export function Step5About({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Fale sobre você</h2>
      <p className="text-sm text-brand-gray-500">
        Conte um pouco sobre como você é no trabalho em equipe e quais são suas metas e
        objetivos.
      </p>

      <div>
        <Label>Sobre você *</Label>
        <Textarea
          rows={6}
          value={data.aboutYou}
          onChange={(e) => updateData({ aboutYou: e.target.value })}
          placeholder="Ex: Sou uma pessoa comunicativa, gosto de trabalhar em equipe e meu objetivo é crescer dentro da empresa..."
        />
        <ErrorText>{errors.aboutYou}</ErrorText>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-gray-300 p-4 text-sm">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-brand-red-600"
          checked={data.termsAccepted}
          onChange={(e) => updateData({ termsAccepted: e.target.checked })}
        />
        <span className="text-brand-gray-600">
          Declaro que as informações fornecidas são verdadeiras e autorizo o MART Atacadista a
          utilizar meus dados para fins de recrutamento e seleção.
        </span>
      </label>
      <ErrorText>{errors.termsAccepted}</ErrorText>
    </div>
  );
}
