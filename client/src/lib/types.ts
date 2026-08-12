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

export interface CandidateFormData {
  fullName: string;
  phone: string;

  cep: string;
  city: string;
  state: string;
  street: string;
  number: string;

  jobId: string;
  wantsOtherOpportunity: boolean;
  otherJobInterest: string;

  lastExperience: string;
  aboutYou: string;

  termsAccepted: boolean;
}

export const emptyCandidateForm: CandidateFormData = {
  fullName: "",
  phone: "",

  cep: "",
  city: "",
  state: "",
  street: "",
  number: "",

  jobId: "",
  wantsOtherOpportunity: false,
  otherJobInterest: "",

  lastExperience: "",
  aboutYou: "",

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
  geocodeStatus: string;
}
