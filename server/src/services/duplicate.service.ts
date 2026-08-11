import { prisma } from "../db/prisma.js";

/**
 * Procura um candidato existente com o mesmo telefone.
 * Não bloqueia o cadastro — apenas sinaliza para o recrutador revisar.
 */
export async function findPossibleDuplicate(phone: string) {
  return prisma.candidate.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });
}
