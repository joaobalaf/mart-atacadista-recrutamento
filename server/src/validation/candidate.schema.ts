import { z } from "zod";

const experienceSchema = z.object({
  company: z.string().min(1, "Informe a empresa."),
  role: z.string().min(1, "Informe o cargo/função."),
  startDate: z.string().min(1, "Informe o período de entrada."),
  endDate: z.string().optional().nullable(),
  activities: z.string().optional().nullable(),
});

export const createCandidateSchema = z.object({
  // Dados pessoais
  fullName: z.string().min(3, "Informe o nome completo."),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 11, "CPF inválido."),
  birthDate: z.coerce.date({ errorMap: () => ({ message: "Data de nascimento inválida." }) }),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 11, "Telefone inválido."),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")).nullable(),
  gender: z.string().optional().nullable(),

  // Endereço
  city: z.string().min(1, "Informe a cidade."),
  state: z.string().min(2, "Informe o estado.").max(2),
  cep: z.string().optional().nullable(),
  street: z.string().min(1, "Informe o endereço."),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),

  // Vagas
  jobIds: z.array(z.string()).default([]),
  otherJobInterest: z.string().optional().nullable(),

  // Experiência
  hasPreviousExperience: z.boolean().default(false),
  experiences: z.array(experienceSchema).default([]),

  // Disponibilidade
  availableMorning: z.boolean().default(false),
  availableAfternoon: z.boolean().default(false),
  availableNight: z.boolean().default(false),
  availableAnytime: z.boolean().default(false),
  weekendAvailability: z.enum(["SIM", "NAO", "DEPENDENDO_DA_ESCALA"]).optional().nullable(),
  availableScale6x1: z.boolean().optional().nullable(),

  // Transporte
  transportMode: z
    .enum(["TRANSPORTE_PUBLICO", "CARRO", "MOTO", "BICICLETA", "A_PE", "OUTRO"])
    .optional()
    .nullable(),
  transportModeOther: z.string().optional().nullable(),
  hasPublicTransportAccess: z.boolean().optional().nullable(),

  // Loja preferida
  preferredStoreChoice: z.enum(["CAJAMAR", "ITAPEVI", "BARUERI", "QUALQUER_UMA"]).optional().nullable(),

  // LGPD
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "É necessário aceitar o termo de privacidade." }),
  }),
});

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;

export const updateStatusSchema = z.object({
  status: z.enum([
    "NOVO",
    "EM_ANALISE",
    "CONTATO_REALIZADO",
    "ENTREVISTA",
    "APROVADO",
    "REPROVADO",
    "CONTRATADO",
    "BANCO_DE_TALENTOS",
  ]),
});

export const createNoteSchema = z.object({
  text: z.string().min(1, "A observação não pode ficar vazia."),
});
