import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/services/auth.service.js";
import { geocodeAddress } from "../src/services/geocoding.service.js";
import { haversineDistanceKm } from "../src/services/distance.service.js";

const prisma = new PrismaClient();

const JOBS = [
  "Faxineira",
  "Reposição",
  "Balconista de Padaria",
  "Açougue",
  "Operador(a) de Caixa",
  "Depositor(a)",
  "Cartazista",
  "Televendas",
];

// Coordenadas aproximadas dos centros das cidades, usadas como fallback caso a
// geocodificação via Nominatim não esteja disponível no momento do seed.
const CITY_FALLBACK: Record<string, { lat: number; lng: number }> = {
  Cajamar: { lat: -23.3053, lng: -46.8763 },
  Itapevi: { lat: -23.5489, lng: -46.9339 },
  Barueri: { lat: -23.5106, lng: -46.8761 },
  Jandira: { lat: -23.5275, lng: -46.9039 },
  Osasco: { lat: -23.5325, lng: -46.7917 },
  "Santana de Parnaíba": { lat: -23.4517, lng: -46.9181 },
};

async function resolveCoords(street: string, number: string, city: string, state: string) {
  const geocoded = await geocodeAddress({ street, number, city, state });
  if (geocoded) return geocoded;
  return CITY_FALLBACK[city] ?? { lat: -23.5, lng: -46.9 };
}

async function main() {
  console.log("Seed: lojas...");
  const storesData = [
    { name: "MART Atacadista — Cajamar", address: "Av. Tenente Marques, 2386", city: "Cajamar", state: "SP" },
    { name: "MART Atacadista — Itapevi", address: "Avenida Pedro Paulino, 688", city: "Itapevi", state: "SP" },
    { name: "MART Atacadista — Barueri", address: "Estrada dos Romeiros, 2830", city: "Barueri", state: "SP" },
  ];

  const stores = [];
  for (const s of storesData) {
    const coords = await resolveCoords(s.address, "", s.city, s.state);
    const store = await prisma.store.upsert({
      where: { name: s.name },
      update: {},
      create: { name: s.name, address: s.address, city: s.city, lat: coords.lat, lng: coords.lng },
    });
    stores.push(store);
    console.log(`  ${s.name} -> ${coords.lat}, ${coords.lng}`);
  }

  console.log("Seed: vagas...");
  for (const name of JOBS) {
    await prisma.job.upsert({ where: { name }, update: {}, create: { name } });
  }
  const allJobs = await prisma.job.findMany();

  console.log("Seed: usuário admin...");
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@martatacadista.com.br";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "MartAtacadista@2026";
  const adminName = process.env.ADMIN_SEED_NAME || "Administrador MART";
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: adminName, passwordHash: await hashPassword(adminPassword) },
  });
  console.log(`  login: ${adminEmail} / senha definida em .env`);

  console.log("Seed: candidatos fictícios de demonstração...");
  const demoCandidates = [
    {
      fullName: "Ana Exemplo Souza",
      cpf: "11111111111",
      phone: "11999990001",
      city: "Jandira",
      street: "Rua das Flores",
      number: "120",
      jobNames: ["Operador(a) de Caixa", "Reposição"],
    },
    {
      fullName: "João Teste Oliveira",
      cpf: "22222222222",
      phone: "11999990002",
      city: "Cajamar",
      street: "Rua Brasil",
      number: "45",
      jobNames: ["Depositor(a)"],
    },
    {
      fullName: "Carlos Modelo Pereira",
      cpf: "33333333333",
      phone: "11999990003",
      city: "Barueri",
      street: "Rua Guaporé",
      number: "300",
      jobNames: ["Açougue"],
    },
    {
      fullName: "Marina Amostra Lima",
      cpf: "44444444444",
      phone: "11999990004",
      city: "Itapevi",
      street: "Rua São Paulo",
      number: "78",
      jobNames: ["Balconista de Padaria", "Cartazista"],
    },
    {
      fullName: "Pedro Fictício Costa",
      cpf: "55555555555",
      phone: "11999990005",
      city: "Osasco",
      street: "Rua Antônio Agu",
      number: "512",
      jobNames: ["Televendas"],
    },
    {
      fullName: "Beatriz Modelo Fernandes",
      cpf: "66666666666",
      phone: "11999990006",
      city: "Santana de Parnaíba",
      street: "Alameda Rio Negro",
      number: "900",
      jobNames: ["Faxineira", "Reposição"],
    },
  ];

  for (const c of demoCandidates) {
    const existing = await prisma.candidate.findFirst({ where: { cpf: c.cpf } }).catch(() => null);
    if (existing) continue;

    const coords = await resolveCoords(c.street, c.number, c.city, "SP");
    const jobs = allJobs.filter((j) => c.jobNames.includes(j.name));

    const candidate = await prisma.candidate.create({
      data: {
        fullName: c.fullName,
        cpf: c.cpf,
        birthDate: new Date("1998-05-15"),
        phone: c.phone,
        email: null,
        city: c.city,
        state: "SP",
        street: c.street,
        number: c.number,
        lat: coords.lat,
        lng: coords.lng,
        geocodeStatus: "OK",
        hasPreviousExperience: false,
        availableMorning: true,
        availableAfternoon: true,
        weekendAvailability: "DEPENDENDO_DA_ESCALA",
        transportMode: "TRANSPORTE_PUBLICO",
        hasPublicTransportAccess: true,
        preferredStoreChoice: "QUALQUER_UMA",
        termsAcceptedAt: new Date(),
        status: "NOVO",
        jobs: { create: jobs.map((job) => ({ job: { connect: { id: job.id } } })) },
        statusHistory: { create: { status: "NOVO" } },
      },
    });

    const distances = stores.map((store) => ({
      storeId: store.id,
      distanceKm: haversineDistanceKm(coords, { lat: store.lat, lng: store.lng }),
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

    console.log(`  ${c.fullName} (${c.city}) -> mais próxima: ${nearest.distanceKm.toFixed(1)} km`);
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
