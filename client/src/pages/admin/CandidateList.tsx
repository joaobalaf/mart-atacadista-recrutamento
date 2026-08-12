import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Card, Input, Select } from "../../components/ui";
import { StatusBadge } from "../../components/StatusBadge";
import { StoreBadge } from "../../components/StoreBadge";
import { shortStoreName, storeColor } from "../../lib/storeColors";
import { api } from "../../services/api";
import type { CandidateListItem, Job, StoreSummary } from "../../lib/types";
import { STATUS_LABELS, type CandidateStatus } from "../../lib/types";

interface StoreCount {
  id: string;
  name: string;
  count: number;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-red-100 text-brand-red-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-slate-200 text-slate-700",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function CandidateList() {
  const [params, setParams] = useSearchParams();
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stores, setStores] = useState<StoreSummary[]>([]);
  const [storeCounts, setStoreCounts] = useState<StoreCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [reprocessing, setReprocessing] = useState<string | null>(null);

  const [q, setQ] = useState(params.get("q") ?? "");
  const [jobId, setJobId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [status, setStatus] = useState("");
  const [sortByDistance, setSortByDistance] = useState(false);
  const [onlyMissingLocation, setOnlyMissingLocation] = useState(false);

  useEffect(() => {
    api.get<Job[]>("/admin/jobs", true).then(setJobs).catch(() => {});
    api.get<StoreSummary[]>("/admin/stores", true).then(setStores).catch(() => {});
    api
      .get<{ byStore: StoreCount[] }>("/admin/stats", true)
      .then((s) => setStoreCounts(s.byStore))
      .catch(() => {});
  }, []);

  function reload() {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (jobId) p.set("jobId", jobId);
    if (storeId) p.set("storeId", storeId);
    if (maxDistance) p.set("maxDistanceKm", maxDistance);
    if (status) p.set("status", status);
    if (sortByDistance) p.set("sort", "distance");

    setLoading(true);
    api
      .get<CandidateListItem[]>(`/admin/candidates?${p.toString()}`, true)
      .then(setCandidates)
      .finally(() => setLoading(false));
  }

  useEffect(reload, [q, jobId, storeId, maxDistance, status, sortByDistance]);

  useEffect(() => {
    const urlQ = params.get("q") ?? "";
    if (urlQ !== q) setQ(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function handleRegeocode(id: string) {
    setReprocessing(id);
    try {
      await api.post(`/admin/candidates/${id}/regeocode`, {}, true);
      reload();
    } finally {
      setReprocessing(null);
    }
  }

  const jobOptions = useMemo(() => jobs, [jobs]);
  const visibleCandidates = onlyMissingLocation
    ? candidates.filter((c) => c.geocodeStatus === "FAILED")
    : candidates;
  const missingCount = candidates.filter((c) => c.geocodeStatus === "FAILED").length;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Banco de Candidatos</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {candidates.length} candidato(s) cadastrado(s) no sistema.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <p className="mr-1 self-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          Melhor loja por candidato:
        </p>
        <button
          type="button"
          onClick={() => setStoreId("")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition cursor-pointer ${
            storeId === "" ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50"
          }`}
        >
          Todas ({storeCounts.reduce((sum, s) => sum + s.count, 0)})
        </button>
        {storeCounts.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStoreId(s.id === storeId ? "" : s.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition cursor-pointer ${
              storeId === s.id ? "ring-2 ring-offset-1" : "hover:opacity-80"
            } ${storeColor(s.name)}`}
          >
            {shortStoreName(s.name)} ({s.count})
          </button>
        ))}
        {missingCount > 0 && (
          <button
            type="button"
            onClick={() => setOnlyMissingLocation((v) => !v)}
            className={`ml-auto rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition cursor-pointer ${
              onlyMissingLocation
                ? "bg-amber-500 text-white ring-amber-500"
                : "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100"
            }`}
          >
            ⚠ Sem localização ({missingCount})
          </button>
        )}
      </div>

      <Card className="mt-4 border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Input
            placeholder="Nome, telefone, cidade..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setParams(e.target.value ? { q: e.target.value } : {});
            }}
            className="lg:col-span-2"
          />
          <Select value={jobId} onChange={(e) => setJobId(e.target.value)}>
            <option value="">Todas as vagas</option>
            {jobOptions.map((j) => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </Select>
          <Select value={storeId} onChange={(e) => setStoreId(e.target.value)}>
            <option value="">Loja mais próxima (todas)</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos os status</option>
            {(Object.keys(STATUS_LABELS) as CandidateStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </Select>
          <Input
            type="number"
            placeholder="Distância máx. (km)"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
          />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 accent-brand-red-600" checked={sortByDistance} onChange={(e) => setSortByDistance(e.target.checked)} />
          Ordenar por mais próximos primeiro
        </label>
      </Card>

      <Card className="mt-6 overflow-x-auto p-0">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Candidato</th>
              <th className="px-4 py-3 font-semibold">Telefone</th>
              <th className="px-4 py-3 font-semibold">Cidade</th>
              <th className="px-4 py-3 font-semibold">Vaga(s)</th>
              <th className="px-4 py-3 font-semibold">Melhor loja</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!loading && visibleCandidates.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <Link to={`/admin/candidatos/${c.id}`} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(c.fullName)}`}>
                      {initials(c.fullName)}
                    </div>
                    <span className="font-semibold text-slate-900 hover:text-brand-red-700">{c.fullName}</span>
                  </Link>
                  {c.possibleDuplicateOfId && (
                    <span className="ml-11 mt-0.5 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                      possível duplicado
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{c.phone}</td>
                <td className="px-4 py-3 text-slate-600">{c.city}/{c.state}</td>
                <td className="px-4 py-3 text-slate-600">{c.jobs.join(", ") || "—"}</td>
                <td className="px-4 py-3">
                  {c.nearestStore ? (
                    <StoreBadge name={c.nearestStore.name} distanceKm={c.nearestStore.distanceKm} approx={c.geocodeStatus === "APPROX"} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                        Sem localização
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRegeocode(c.id)}
                        disabled={reprocessing === c.id}
                        className="text-xs font-semibold text-brand-red-600 hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        {reprocessing === c.id ? "..." : "Tentar de novo"}
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-slate-500">{new Date(c.createdAt).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-6 text-center text-sm text-slate-500">Carregando...</p>}
        {!loading && visibleCandidates.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">Nenhum candidato encontrado com esses filtros.</p>
        )}
      </Card>
    </AdminLayout>
  );
}
