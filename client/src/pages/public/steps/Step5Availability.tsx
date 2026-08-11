import { useWizard } from "../../../store/wizardStore";
import { Button, Checkbox, ErrorText, Input, Label } from "../../../components/ui";
import type { Errors } from "../../../lib/validation";

const PERIOD_OPTIONS: { key: "availableMorning" | "availableAfternoon" | "availableNight" | "availableAnytime"; label: string }[] = [
  { key: "availableMorning", label: "Manhã" },
  { key: "availableAfternoon", label: "Tarde" },
  { key: "availableNight", label: "Noite" },
  { key: "availableAnytime", label: "Qualquer horário" },
];

const WEEKEND_OPTIONS: { value: "SIM" | "NAO" | "DEPENDENDO_DA_ESCALA"; label: string }[] = [
  { value: "SIM", label: "Sim" },
  { value: "NAO", label: "Não" },
  { value: "DEPENDENDO_DA_ESCALA", label: "Dependendo da escala" },
];

const TRANSPORT_OPTIONS: { value: "TRANSPORTE_PUBLICO" | "CARRO" | "MOTO" | "BICICLETA" | "A_PE" | "OUTRO"; label: string }[] = [
  { value: "TRANSPORTE_PUBLICO", label: "Transporte público" },
  { value: "CARRO", label: "Carro" },
  { value: "MOTO", label: "Moto" },
  { value: "BICICLETA", label: "Bicicleta" },
  { value: "A_PE", label: "A pé" },
  { value: "OUTRO", label: "Outro" },
];

const STORE_OPTIONS: { value: "CAJAMAR" | "ITAPEVI" | "BARUERI" | "QUALQUER_UMA"; label: string }[] = [
  { value: "CAJAMAR", label: "Cajamar" },
  { value: "ITAPEVI", label: "Itapevi" },
  { value: "BARUERI", label: "Barueri" },
  { value: "QUALQUER_UMA", label: "Qualquer uma das lojas" },
];

export function Step5Availability({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-brand-ink">Disponibilidade</h2>
        <p className="mb-3 mt-1 text-sm text-brand-gray-500">
          Você possui disponibilidade para trabalhar em quais períodos?
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {PERIOD_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.key}
              label={opt.label}
              checked={data[opt.key]}
              onChange={(checked) => updateData({ [opt.key]: checked })}
            />
          ))}
        </div>
        <ErrorText>{errors.availability}</ErrorText>
      </div>

      <div>
        <Label>Disponibilidade para finais de semana</Label>
        <div className="flex flex-wrap gap-2.5">
          {WEEKEND_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant={data.weekendAvailability === opt.value ? "primary" : "secondary"}
              onClick={() => updateData({ weekendAvailability: opt.value })}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <ErrorText>{errors.weekendAvailability}</ErrorText>
      </div>

      <div>
        <Checkbox
          label="Possui disponibilidade para trabalhar em escala 6x1"
          checked={!!data.availableScale6x1}
          onChange={(checked) => updateData({ availableScale6x1: checked })}
        />
      </div>

      <div>
        <Label>Como você pretende ir ao trabalho?</Label>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {TRANSPORT_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={data.transportMode === opt.value}
              onChange={() => updateData({ transportMode: opt.value })}
            />
          ))}
        </div>
        {data.transportMode === "OUTRO" && (
          <Input
            className="mt-2"
            placeholder="Qual?"
            value={data.transportModeOther}
            onChange={(e) => updateData({ transportModeOther: e.target.value })}
          />
        )}
        <ErrorText>{errors.transportMode}</ErrorText>
      </div>

      <div>
        <Checkbox
          label="Possui fácil acesso a transporte público"
          checked={!!data.hasPublicTransportAccess}
          onChange={(checked) => updateData({ hasPublicTransportAccess: checked })}
        />
      </div>

      <div>
        <Label>Em qual região você prefere trabalhar?</Label>
        <div className="flex flex-wrap gap-2.5">
          {STORE_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant={data.preferredStoreChoice === opt.value ? "primary" : "secondary"}
              onClick={() => updateData({ preferredStoreChoice: opt.value })}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-brand-gray-500">
          Essa preferência não substitui o cálculo automático — indicamos a loja mais próxima com
          base no seu endereço.
        </p>
        <ErrorText>{errors.preferredStoreChoice}</ErrorText>
      </div>
    </div>
  );
}
