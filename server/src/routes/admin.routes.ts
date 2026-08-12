import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { requireAdminAuth, type AuthedRequest } from "../middleware/auth.middleware.js";
import { updateStatusSchema, createNoteSchema } from "../validation/candidate.schema.js";
import { geocodeAndSaveDistances } from "../services/candidateLocation.service.js";

export const adminRouter = Router();
adminRouter.use(requireAdminAuth);

const candidateListInclude = {
  jobs: { include: { job: true } },
  distances: { include: { store: true } },
} as const;

function toListItem(candidate: Awaited<ReturnType<typeof fetchAll>>[number]) {
  const nearest = candidate.distances.find((d) => d.isNearest);
  return {
    id: candidate.id,
    fullName: candidate.fullName,
    phone: candidate.phone,
    city: candidate.city,
    state: candidate.state,
    jobs: candidate.jobs.map((cj) => cj.job.name),
    nearestStore: nearest ? { id: nearest.store.id, name: nearest.store.name, distanceKm: nearest.distanceKm } : null,
    status: candidate.status,
    createdAt: candidate.createdAt,
    possibleDuplicateOfId: candidate.possibleDuplicateOfId,
    geocodeStatus: candidate.geocodeStatus,
  };
}

async function fetchAll() {
  return prisma.candidate.findMany({
    include: candidateListInclude,
    orderBy: { createdAt: "desc" },
  });
}

adminRouter.get("/candidates", async (req, res, next) => {
  try {
    const { q, jobId, storeId, maxDistanceKm, status, sort } = req.query as Record<string, string | undefined>;

    let candidates = await fetchAll();

    if (q) {
      const term = q.toLowerCase();
      candidates = candidates.filter(
        (c) =>
          c.fullName.toLowerCase().includes(term) ||
          c.phone.includes(term) ||
          c.city.toLowerCase().includes(term)
      );
    }

    if (jobId) {
      candidates = candidates.filter((c) => c.jobs.some((cj) => cj.job.id === jobId));
    }

    if (status) {
      candidates = candidates.filter((c) => c.status === status);
    }

    if (storeId) {
      candidates = candidates.filter((c) => c.distances.some((d) => d.storeId === storeId));
    }

    if (maxDistanceKm) {
      const max = parseFloat(maxDistanceKm);
      candidates = candidates.filter((c) => {
        const relevant = storeId
          ? c.distances.find((d) => d.storeId === storeId)
          : c.distances.find((d) => d.isNearest);
        return relevant ? relevant.distanceKm <= max : false;
      });
    }

    if (sort === "distance") {
      candidates = [...candidates].sort((a, b) => {
        const distA = (storeId ? a.distances.find((d) => d.storeId === storeId) : a.distances.find((d) => d.isNearest))?.distanceKm;
        const distB = (storeId ? b.distances.find((d) => d.storeId === storeId) : b.distances.find((d) => d.isNearest))?.distanceKm;
        if (distA == null) return 1;
        if (distB == null) return -1;
        return distA - distB;
      });
    }

    res.json(candidates.map(toListItem));
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/candidates/:id", async (req, res, next) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: req.params.id },
      include: {
        jobs: { include: { job: true } },
        distances: { include: { store: true }, orderBy: { distanceKm: "asc" } },
        notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
        statusHistory: { include: { changedBy: true }, orderBy: { changedAt: "desc" } },
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidato não encontrado." });
    }

    let duplicate = null;
    if (candidate.possibleDuplicateOfId) {
      duplicate = await prisma.candidate.findUnique({
        where: { id: candidate.possibleDuplicateOfId },
        select: { id: true, fullName: true, phone: true, createdAt: true },
      });
    }

    res.json({ ...candidate, duplicate });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch("/candidates/:id/status", async (req: AuthedRequest, res, next) => {
  try {
    const { status } = updateStatusSchema.parse(req.body);

    const candidate = await prisma.candidate.update({
      where: { id: req.params.id },
      data: {
        status,
        statusUpdatedAt: new Date(),
        statusHistory: {
          create: { status, changedById: req.admin?.sub },
        },
      },
    });

    res.json(candidate);
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/candidates/:id/regeocode", async (req, res, next) => {
  try {
    const candidate = await prisma.candidate.findUnique({ where: { id: req.params.id } });
    if (!candidate) return res.status(404).json({ error: "Candidato não encontrado." });

    const geocodeStatus = await geocodeAndSaveDistances(candidate.id, {
      street: candidate.street,
      number: candidate.number,
      city: candidate.city,
      state: candidate.state,
      cep: candidate.cep,
    });

    res.json({ geocodeStatus });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/candidates/regeocode-pending", async (_req, res, next) => {
  try {
    const pending = await prisma.candidate.findMany({
      where: { geocodeStatus: { in: ["FAILED", "PENDING"] } },
      select: { id: true, street: true, number: true, city: true, state: true, cep: true },
    });

    let fixed = 0;
    for (const c of pending) {
      const status = await geocodeAndSaveDistances(c.id, c);
      if (status !== "FAILED") fixed++;
    }

    res.json({ processed: pending.length, fixed });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/candidates/:id/notes", async (req: AuthedRequest, res, next) => {
  try {
    const { text } = createNoteSchema.parse(req.body);

    const note = await prisma.note.create({
      data: {
        candidateId: req.params.id,
        authorId: req.admin!.sub,
        text,
      },
      include: { author: true },
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/jobs", async (_req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({ orderBy: { name: "asc" } });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/stores", async (_req, res, next) => {
  try {
    const stores = await prisma.store.findMany({ orderBy: { name: "asc" } });
    res.json(stores);
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/stats", async (_req, res, next) => {
  try {
    const [total, byStatus, todayCount, stores, byStoreRaw, noLocation] = await Promise.all([
      prisma.candidate.count(),
      prisma.candidate.groupBy({ by: ["status"], _count: true }),
      prisma.candidate.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.store.findMany({ orderBy: { name: "asc" } }),
      prisma.candidateDistance.groupBy({
        by: ["storeId"],
        where: { isNearest: true },
        _count: true,
      }),
      prisma.candidate.count({ where: { geocodeStatus: { not: "OK" } } }),
    ]);

    const byStoreCounts = new Map(byStoreRaw.map((s) => [s.storeId, s._count]));
    const totalNearest = byStoreRaw.reduce((sum, s) => sum + s._count, 0);
    const byStore = stores.map((store) => ({
      id: store.id,
      name: store.name,
      city: store.city,
      count: byStoreCounts.get(store.id) ?? 0,
      percent: totalNearest > 0 ? Math.round(((byStoreCounts.get(store.id) ?? 0) / totalNearest) * 100) : 0,
    }));

    res.json({
      total,
      today: todayCount,
      byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
      byStore,
      noLocation,
    });
  } catch (err) {
    next(err);
  }
});
