/**
 * Distância em linha reta (fórmula de Haversine), em km.
 * Rotulada na UI como "distância estimada" — não é distância de rota real (ver seção 41 do spec).
 */
export function haversineDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371; // raio médio da Terra em km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return Math.round(R * c * 10) / 10;
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
