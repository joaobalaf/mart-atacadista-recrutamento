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
}

/**
 * Geocodifica um endereço via Nominatim (OpenStreetMap). Retorna null se não encontrar.
 * Respeita a política de uso (User-Agent próprio + rate limit de ~1 req/s) e usa cache
 * em memória para não repetir chamadas para o mesmo endereço normalizado.
 */
export async function geocodeAddress(addressParts: {
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  cep?: string | null;
}): Promise<GeocodeResult | null> {
  const fullAddress = [
    addressParts.street,
    addressParts.number,
    addressParts.neighborhood,
    addressParts.city,
    addressParts.state,
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  const key = normalize(fullAddress);
  if (cache.has(key)) return cache.get(key) ?? null;

  const params = new URLSearchParams({
    q: fullAddress,
    format: "jsonv2",
    limit: "1",
    countrycodes: "br",
  });

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
