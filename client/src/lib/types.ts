export interface Job {
  id: string;
  name: string;
  active: boolean;
}

export interface StoreSummary {
  id: string;
  name: string;
  city: string;
}

export interface ExperienceForm {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  activities?: string;
}

export interface CandidateFormData {
  fullName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  gender: string;

  cep: string;
  city: string;
  state: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;

  jobIds: string[];
  wantsOtherOpportunity: boolean;
  otherJobInterest: string;

  hasPreviousExperience: boolean;
  experiences: ExperienceForm[];

  availableMorning: boolean;
  availableAfternoon: boolean;
  availableNight: boolean;
  availableAnytime: boolean;
  weekendAvailability: "SIM" | "NAO" | "DEPENDENDO_DA_ESCALA" | "";
  availableScale6x1: boolean | null;

  transportMode: "TRANSPORTE_PUBLICO" | "CARRO" | "MOTO" | "BICICLETA" | "A_PE" | "OUTRO" | "";
  transportModeOther: string;
  hasPublicTransportAccess: boolean | null;

  preferredStoreChoice: "CAJAMAR" | "ITAPEVI" | "BARUERI" | "QUALQUER_UMA" | "";

  termsAccepted: boolean;
}

export const emptyCandidateForm: CandidateFormData = {
  fullName: "",
  cpf: "",
  birthDate: "",
  phone: "",
  email: "",
  gender: "",

  cep: "",
  city: "",
  state: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",

  jobIds: [],
  wantsOtherOpportunity: false,
  otherJobInterest: "",

  hasPreviousExperience: false,
  experiences: [],

  availableMorning: false,
  availableAfternoon: false,
  availableNight: false,
  availableAnytime: false,
  weekendAvailability: "",
  availableScale6x1: null,

  transportMode: "",
  transportModeOther: "",
  hasPublicTransportAccess: null,

  preferredStoreChoice: "",

  termsAccepted: false,
};

export type CandidateStatus =
  | "NOVO"
  | "EM_ANALISE"
  | "CONTATO_REALIZADO"
  | "ENTREVISTA"
  | "APROVADO"
  | "REPROVADO"
  | "CONTRATADO"
  | "BANCO_DE_TALENTOS";

export const STATUS_LABELS: Record<CandidateStatus, string> = {
  NOVO: "Novo",
  EM_ANALISE: "Em análise",
  CONTATO_REALIZADO: "Contato realizado",
  ENTREVISTA: "Entrevista",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  CONTRATADO: "Contratado",
  BANCO_DE_TALENTOS: "Banco de talentos",
};

export interface CandidateListItem {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  jobs: string[];
  nearestStore: { id: string; name: string; distanceKm: number } | null;
  status: CandidateStatus;
  createdAt: string;
  possibleDuplicateOfId: string | null;
}
