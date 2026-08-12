import { shortStoreName, storeColor } from "../lib/storeColors";

export function StoreBadge({ name, distanceKm, approx }: { name: string; distanceKm?: number; approx?: boolean }) {
  return (
    <span
      title={approx ? "Distância aproximada (endereço exato não encontrado, usamos o centro da cidade)" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${storeColor(name)}`}
    >
      {shortStoreName(name)}
      {distanceKm != null && (
        <span className="font-normal opacity-70">
          · {approx ? "~" : ""}{distanceKm.toFixed(1)} km
        </span>
      )}
    </span>
  );
}
