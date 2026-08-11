import { useWizard } from "../../../store/wizardStore";
import { Input, Label, ErrorText } from "../../../components/ui";
import { maskPhone } from "../../../lib/masks";
import type { Errors } from "../../../lib/validation";

export function Step1PersonalData({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Vamos começar</h2>
      <p className="text-sm text-brand-gray-500">É rápido — leva só um minuto.</p>

      <div>
        <Label>Nome completo *</Label>
        <Input
          name="fullName"
          autoComplete="name"
          autoFocus
          value={data.fullName}
          onChange={(e) => updateData({ fullName: e.target.value })}
          placeholder="Seu nome completo"
        />
        <ErrorText>{errors.fullName}</ErrorText>
      </div>

      <div>
        <Label>Telefone / WhatsApp *</Label>
        <Input
          name="phone"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => updateData({ phone: maskPhone(e.target.value) })}
          placeholder="(11) 90000-0000"
          inputMode="numeric"
        />
        <ErrorText>{errors.phone}</ErrorText>
      </div>
    </div>
  );
}
