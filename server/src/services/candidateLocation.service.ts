import { prisma } from "../db/prisma.js";
import { geocodeAddress } from "./geocoding.service.js";
import { haversineDistanceKm } from "./distance.service.js";

/**
 * Geocodifica o endereço de um candidato e (re)grava lat/lng, geocodeStatus e as
 * distâncias até as lojas. Usado tanto no cadastro público quanto no reprocessamento
 * manual pelo admin (endereços que falharam na primeira tentativa).
 */
export async function geocodeAndSaveDistances(candidateId: string, address: {
  street?: string | null;
  number?: string | null;
  city: string;
  state: string;
  cep?: string | null;
}) {
  const geocode = await geocodeAddress({
    street: address.street ? `${address.street}${address.number ? ", " + address.number : ""}` : null,
    city: address.city,
    state: address.state,
    cep: address.cep,
  });

  const geocodeStatus = geocode ? (geocode.precision === "address" ? "OK" : "APPROX") : "FAILED";

  await prisma.candidate.update({
    where: { id: candidateId },
    data: { lat: geocode?.lat ?? null, lng: geocode?.lng ?? null, geocodeStatus },
  });

  await prisma.candidateDistance.deleteMany({ where: { candidateId } });

  if (geocode) {
    const stores = await prisma.store.findMany();
    const distances = stores.map((store) => ({
      storeId: store.id,
      distanceKm: haversineDistanceKm(geocode, { lat: store.lat, lng: store.lng }),
    }));
    const nearest = distances.reduce((min, d) => (d.distanceKm < min.distanceKm ? d : min), distances[0]);

    await prisma.candidateDistance.createMany({
      data: distances.map((d) => ({
        candidateId,
        storeId: d.storeId,
        distanceKm: d.distanceKm,
        isNearest: d.storeId === nearest.storeId,
      })),
    });
  }

  return geocodeStatus;
}
