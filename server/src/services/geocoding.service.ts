const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const MIN_INTERVAL_MS = 1100; // Nominatim usage policy: max ~1 req/s

let lastRequestAt = 0;
const cache = new Map<string, { lat: number; lng: number } | null>();

function normalize(address: string) {
  return address.trim().toLowerCase().replace(/\s+/g, " ");
}

async function throttle() {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS - elapsed));
  }
  lastRequestAt = Date.now();
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  precision: "address" | "city";
}

const UF_CODES = new Set([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]);

async function queryNominatim(q: string): Promise<{ lat: number; lng: number } | null> {
  const key = normalize(q);
  if (cache.has(key)) return cache.get(key) ?? null;

  const params = new URLSearchParams({ q, format: "jsonv2", limit: "1", countrycodes: "br" });
  await throttle();

  try {
    const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": process.env.NOMINATIM_USER_AGENT || "mart-atacadista-recrutamento/1.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      cache.set(key, null);
      return null;
    }

    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data.length) {
      cache.set(key, null);
      return null;
    }

    const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    cache.set(key, result);
    return result;
  } catch {
    cache.set(key, null);
    return null;
  }
}

/**
 * Geocodifica um endereço via Nominatim (OpenStreetMap). Retorna null se não encontrar.
 * Tenta primeiro o endereço completo (rua + número); se não encontrar (rua com erro de
 * digitação, por exemplo), cai para geocodificação por cidade/estado, para pelo menos
 * localizar uma distância aproximada em vez de nenhuma. Respeita a política de uso
 * (User-Agent próprio + rate limit de ~1 req/s) e usa cache em memória.
 */
export async function geocodeAddress(addressParts: {
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  cep?: string | null;
}): Promise<GeocodeResult | null> {
  const state = UF_CODES.has(addressParts.state.toUpperCase()) ? addressParts.state.toUpperCase() : "";

  const fullAddress = [
    addressParts.street,
    addressParts.number,
    addressParts.neighborhood,
    addressParts.city,
    state,
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  const precise = await queryNominatim(fullAddress);
  if (precise) return { ...precise, precision: "address" };

  const cityAddress = [addressParts.city, state, "Brasil"].filter(Boolean).join(", ");
  if (!cityAddress) return null;
  const approx = await queryNominatim(cityAddress);
  if (approx) return { ...approx, precision: "city" };

  return null;
}
