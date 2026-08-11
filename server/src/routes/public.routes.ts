import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../db/prisma.js";
import { createCandidateSchema } from "../validation/candidate.schema.js";
import { geocodeAddress } from "../services/geocoding.service.js";
import { haversineDistanceKm } from "../services/distance.service.js";
import { findPossibleDuplicate } from "../services/duplicate.service.js";

export const publicRouter = Router();

const candidateSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { error: "Muitas tentativas de cadastro. Tente novamente mais tarde." },
});

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

publicRouter.post("/candidates", candidateSubmitLimiter, async (req, res, next) => {
  try {
    const input = createCandidateSchema.parse(req.body);

    const duplicate = await findPossibleDuplicate(input.phone);

    const geocode = await geocodeAddress({
      street: `${input.street}${input.number ? ", " + input.number : ""}`,
      city: input.city,
      state: input.state,
      cep: input.cep,
    });

    const candidate = await prisma.candidate.create({
      data: {
        fullName: input.fullName,
        phone: input.phone,
        city: input.city,
        state: input.state.toUpperCase(),
        cep: input.cep,
        street: input.street,
        number: input.number,
        lat: geocode?.lat ?? null,
        lng: geocode?.lng ?? null,
        geocodeStatus: geocode ? "OK" : "FAILED",
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

    if (geocode) {
      const stores = await prisma.store.findMany();
      const distances = stores.map((store) => ({
        storeId: store.id,
        distanceKm: haversineDistanceKm(geocode, { lat: store.lat, lng: store.lng }),
      }));
      const nearest = distances.reduce((min, d) => (d.distanceKm < min.distanceKm ? d : min), distances[0]);

      await prisma.candidateDistance.createMany({
        data: distances.map((d) => ({
          candidateId: candidate.id,
          storeId: d.storeId,
          distanceKm: d.distanceKm,
          isNearest: d.storeId === nearest.storeId,
        })),
      });
    }

    res.status(201).json({
      id: candidate.id,
      message: "Cadastro realizado com sucesso.",
    });
  } catch (err) {
    next(err);
  }
});
