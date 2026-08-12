import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { createCandidateSchema } from "../validation/candidate.schema.js";
import { geocodeAndSaveDistances } from "../services/candidateLocation.service.js";
import { findPossibleDuplicate } from "../services/duplicate.service.js";

export const publicRouter = Router();

publicRouter.get("/jobs", async (_req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

publicRouter.get("/stores", async (_req, res, next) => {
  try {
    const stores = await prisma.store.findMany({
      select: { id: true, name: true, city: true },
      orderBy: { name: "asc" },
    });
    res.json(stores);
  } catch (err) {
    next(err);
  }
});

publicRouter.post("/candidates", async (req, res, next) => {
  try {
    const input = createCandidateSchema.parse(req.body);

    const duplicate = await findPossibleDuplicate(input.phone);

    const candidate = await prisma.candidate.create({
      data: {
        fullName: input.fullName,
        phone: input.phone,
        city: input.city,
        state: input.state.toUpperCase(),
        cep: input.cep,
        street: input.street,
        number: input.number,
        geocodeStatus: "PENDING",
        otherJobInterest: input.otherJobInterest,
        lastExperience: input.lastExperience,
        aboutYou: input.aboutYou,
        termsAcceptedAt: new Date(),
        possibleDuplicateOfId: duplicate?.id,
        jobs: {
          create: input.jobIds.map((jobId) => ({ job: { connect: { id: jobId } } })),
        },
        statusHistory: {
          create: { status: "NOVO" },
        },
      },
    });

    await geocodeAndSaveDistances(candidate.id, {
      street: input.street,
      number: input.number,
      city: input.city,
      state: input.state,
      cep: input.cep,
    });

    res.status(201).json({
      id: candidate.id,
      message: "Cadastro realizado com sucesso.",
    });
  } catch (err) {
    next(err);
  }
});
