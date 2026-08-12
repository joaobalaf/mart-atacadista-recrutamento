import type { CandidateFormData } from "./types";

export type Errors = Record<string, string>;

export function validateStep1(data: CandidateFormData): Errors {
  const errors: Errors = {};
  if (data.fullName.trim().length < 3) errors.fullName = "Informe o nome completo.";
  const phoneDigits = data.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) errors.phone = "Telefone inválido.";
  return errors;
}

export function validateStep2(data: CandidateFormData): Errors {
  const errors: Errors = {};
  const cepDigits = data.cep.replace(/\D/g, "");
  if (cepDigits.length !== 8) errors.cep = "Informe um CEP válido.";
  if (!data.number.trim()) errors.number = "Informe o número da casa.";
  if (!data.street.trim()) errors.street = "Informe o endereço.";
  if (!data.city.trim()) errors.city = "Informe a cidade.";
  if (!data.state.trim()) errors.state = "Selecione o estado.";
  return errors;
}

export function validateStep3(data: CandidateFormData): Errors {
  const errors: Errors = {};
  if (!data.jobId && !data.wantsOtherOpportunity) {
    errors.jobId = "Selecione a vaga de seu interesse.";
  }
  if (data.wantsOtherOpportunity && !data.otherJobInterest.trim()) {
    errors.otherJobInterest = "Descreva a oportunidade de seu interesse.";
  }
  return errors;
}

export function validateStep4(data: CandidateFormData): Errors {
  const errors: Errors = {};
  if (!data.lastExperience.trim()) {
    errors.lastExperience = "Conte um pouco sobre sua última experiência de trabalho.";
  }
  return errors;
}

export function validateStep5(data: CandidateFormData): Errors {
  const errors: Errors = {};
  if (!data.aboutYou.trim()) {
    errors.aboutYou = "Fale um pouco sobre você.";
  }
  if (!data.termsAccepted) {
    errors.termsAccepted = "É necessário aceitar o termo para continuar.";
  }
  return errors;
}
