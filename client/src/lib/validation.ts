import { isValidCpf } from "./masks";
import type { CandidateFormData } from "./types";

export type Errors = Record<string, string>;

export function validateStep1(data: CandidateFormData): Errors {
  const errors: Errors = {};
  if (data.fullName.trim().length < 3) errors.fullName = "Informe o nome completo.";
  if (!isValidCpf(data.cpf)) errors.cpf = "CPF inválido.";
  if (!data.birthDate) errors.birthDate = "Informe a data de nascimento.";
  else {
    const age = (Date.now() - new Date(data.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 16 || age > 100) errors.birthDate = "Data de nascimento inválida.";
  }
  const phoneDigits = data.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) errors.phone = "Telefone inválido.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "E-mail inválido.";
  return errors;
}

export function validateStep2(data: CandidateFormData): Errors {
  const errors: Errors = {};
  if (!data.city.trim()) errors.city = "Informe a cidade.";
  if (!data.state.trim()) errors.state = "Informe o estado.";
  if (!data.street.trim()) errors.street = "Informe o endereço.";
  return errors;
}

export function validateStep3(data: CandidateFormData): Errors {
  const errors: Errors = {};
  if (data.jobIds.length === 0 && !data.wantsOtherOpportunity) {
    errors.jobIds = "Selecione ao menos uma vaga ou marque outras oportunidades.";
  }
  if (data.wantsOtherOpportunity && !data.otherJobInterest.trim()) {
    errors.otherJobInterest = "Descreva a oportunidade de seu interesse.";
  }
  return errors;
}

export function validateStep4(data: CandidateFormData): Errors {
  const errors: Errors = {};
  if (data.hasPreviousExperience && data.experiences.length === 0) {
    errors.experiences = "Adicione ao menos uma experiência ou marque que não possui experiência.";
  }
  return errors;
}

export function validateStep5(data: CandidateFormData): Errors {
  const errors: Errors = {};
  const hasPeriod =
    data.availableMorning || data.availableAfternoon || data.availableNight || data.availableAnytime;
  if (!hasPeriod) errors.availability = "Selecione ao menos um período de disponibilidade.";
  if (!data.weekendAvailability) errors.weekendAvailability = "Informe sua disponibilidade para finais de semana.";
  if (!data.transportMode) errors.transportMode = "Informe como pretende ir ao trabalho.";
  if (!data.preferredStoreChoice) errors.preferredStoreChoice = "Informe a região de preferência.";
  return errors;
}

export function validateStep6(data: CandidateFormData): Errors {
  const errors: Errors = {};
  if (!data.termsAccepted) errors.termsAccepted = "É necessário aceitar o termo para continuar.";
  return errors;
}
