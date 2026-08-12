import { useState } from "react";
import { useWizard } from "../../../store/wizardStore";
import { Input, Label, ErrorText, Select } from "../../../components/ui";
import { maskCep } from "../../../lib/masks";
import { UF_OPTIONS } from "../../../lib/ufs";
import type { Errors } from "../../../lib/validation";

interface ViaCepResponse {
  logradouro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export function Step2Address({ errors }: { errors: Errors }) {
  const { data, updateData } = useWizard();
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleCepBlur() {
    const digits = data.cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setCepStatus("loading");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const json: ViaCepResponse = await res.json();
      if (json.erro) {
        setCepStatus("error");
        return;
      }
      updateData({
        street: json.logradouro || data.street,
        city: json.localidade || data.city,
        state: json.uf || data.state,
      });
      setCepStatus("done");
    } catch {
      setCepStatus("error");
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-brand-ink">Onde você mora</h2>
      <p className="text-sm text-brand-gray-500">
        Usamos seu endereço para calcular a distância até nossas lojas e indicar a mais próxima
        de você.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>CEP *</Label>
          <Input
            name="cep"
            autoComplete="postal-code"
            value={data.cep}
            onChange={(e) => updateData({ cep: maskCep(e.target.value) })}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            inputMode="numeric"
          />
          {cepStatus === "loading" && <p className="mt-1 text-xs text-brand-gray-500">Buscando endereço...</p>}
          {cepStatus === "done" && data.city && (
            <p className="mt-1 text-xs text-emerald-600">{data.city}/{data.state}</p>
          )}
          {cepStatus === "error" && (
            <p className="mt-1 text-xs text-brand-red-600">CEP não encontrado, preencha manualmente abaixo.</p>
          )}
          <ErrorText>{errors.cep}</ErrorText>
        </div>
        <div>
          <Label>Número da casa *</Label>
          <Input
            name="number"
            inputMode="numeric"
            value={data.number}
            onChange={(e) => updateData({ number: e.target.value })}
            placeholder="Ex: 123"
          />
          <ErrorText>{errors.number}</ErrorText>
        </div>
      </div>

      <div>
        <Label>Endereço (rua, avenida...) *</Label>
        <Input
          name="street"
          autoComplete="address-line1"
          value={data.street}
          onChange={(e) => updateData({ street: e.target.value })}
          placeholder="Rua, avenida..."
        />
        <ErrorText>{errors.street}</ErrorText>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label>Cidade *</Label>
          <Input
            name="city"
            autoComplete="address-level2"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
          />
          <ErrorText>{errors.city}</ErrorText>
        </div>
        <div>
          <Label>Estado *</Label>
          <Select name="state" value={data.state} onChange={(e) => updateData({ state: e.target.value })}>
            <option value="">UF</option>
            {UF_OPTIONS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </Select>
          <ErrorText>{errors.state}</ErrorText>
        </div>
      </div>
    </div>
  );
}
