import { z } from "zod";

export const createCandidateSchema = z
  .object({
    // Dados básicos
    fullName: z.string().min(3, "Informe o nome completo."),
    phone: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length >= 10 && v.length <= 11, "Telefone inválido."),

    // Endereço
    city: z.string().min(1, "Informe a cidade."),
    state: z.string().min(2, "Informe o estado.").max(2),
    cep: z.string().min(8, "Informe o CEP."),
    street: z.string().min(1, "Informe o endereço."),
    number: z.string().min(1, "Informe o número da casa."),

    // Vaga
    jobIds: z.array(z.string()).default([]),
    otherJobInterest: z.string().optional().nullable(),

    // Experiência e perfil (texto livre)
    lastExperience: z.string().min(1, "Conte um pouco sobre sua última experiência de trabalho."),
    aboutYou: z.string().min(1, "Fale um pouco sobre você."),

    // LGPD
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "É necessário aceitar o termo de privacidade." }),
    }),
  })
  .refine((data) => data.jobIds.length > 0 || !!data.otherJobInterest?.trim(), {
    message: "Selecione a vaga de seu interesse.",
    path: ["jobIds"],
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
