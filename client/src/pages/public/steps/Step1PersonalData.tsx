import { useWizard } from "../../../store/wizardStore";
import { Input, Label, ErrorText, Select } from "../../../components/ui";
import { maskCpf, maskPhone } from "../../../lib/masks";
import type { Errors } from "../../../lib/validation";

export function Step1PersonalData({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Dados pessoais</h2>

      <div>
        <Label>Nome completo *</Label>
        <Input
          name="fullName"
          autoComplete="name"
          value={data.fullName}
          onChange={(e) => updateData({ fullName: e.target.value })}
          placeholder="Seu nome completo"
        />
        <ErrorText>{errors.fullName}</ErrorText>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>CPF *</Label>
          <Input
            name="cpf"
            value={data.cpf}
            onChange={(e) => updateData({ cpf: maskCpf(e.target.value) })}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
          <ErrorText>{errors.cpf}</ErrorText>
        </div>
        <div>
          <Label>Data de nascimento *</Label>
          <Input
            name="birthDate"
            type="date"
            autoComplete="bday"
            value={data.birthDate}
            onChange={(e) => updateData({ birthDate: e.target.value })}
          />
          <ErrorText>{errors.birthDate}</ErrorText>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <Label>E-mail</Label>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="seu@email.com"
          />
          <ErrorText>{errors.email}</ErrorText>
        </div>
      </div>

      <div>
        <Label>Sexo</Label>
        <Select value={data.gender} onChange={(e) => updateData({ gender: e.target.value })}>
          <option value="">Prefiro não informar</option>
          <option value="Feminino">Feminino</option>
          <option value="Masculino">Masculino</option>
          <option value="Outro">Outro</option>
        </Select>
      </div>
    </div>
  );
}
