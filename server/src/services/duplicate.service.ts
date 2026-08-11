import { prisma } from "../db/prisma.js";

/**
 * Procura um candidato existente com o mesmo CPF ou telefone.
 * Não bloqueia o cadastro — apenas sinaliza para o recrutador revisar.
 */
export async function findPossibleDuplicate(cpf: string, phone: string) {
  return prisma.candidate.findFirst({
    where: { OR: [{ cpf }, { phone }] },
    orderBy: { createdAt: "desc" },
  });
}
