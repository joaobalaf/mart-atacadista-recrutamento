export function shortStoreName(name: string) {
  return name.replace("MART Atacadista — ", "");
}

const COLORS = [
  "bg-red-50 text-brand-red-700 ring-red-200",
  "bg-blue-50 text-blue-700 ring-blue-200",
  "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "bg-purple-50 text-purple-700 ring-purple-200",
  "bg-amber-50 text-amber-700 ring-amber-200",
];

export function storeColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return COLORS[hash % COLORS.length];
}
