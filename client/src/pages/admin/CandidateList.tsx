import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Card, Input, Select } from "../../components/ui";
import { StatusBadge } from "../../components/StatusBadge";
import { api } from "../../services/api";
import type { CandidateListItem, Job, StoreSummary } from "../../lib/types";
import { STATUS_LABELS, type CandidateStatus } from "../../lib/types";

export function CandidateList() {
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stores, setStores] = useState<StoreSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [jobId, setJobId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [status, setStatus] = useState("");
  const [sortByDistance, setSortByDistance] = useState(false);

  useEffect(() => {
    api.get<Job[]>("/admin/jobs", true).then(setJobs).catch(() => {});
    api.get<StoreSummary[]>("/admin/stores", true).then(setStores).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (jobId) params.set("jobId", jobId);
    if (storeId) params.set("storeId", storeId);
    if (maxDistance) params.set("maxDistanceKm", maxDistance);
    if (status) params.set("status", status);
    if (sortByDistance) params.set("sort", "distance");

    setLoading(true);
    api
      .get<CandidateListItem[]>(`/admin/candidates?${params.toString()}`, true)
      .then(setCandidates)
      .finally(() => setLoading(false));
  }, [q, jobId, storeId, maxDistance, status, sortByDistance]);

  const jobOptions = useMemo(() => jobs, [jobs]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-ink">Candidatos</h1>
          <p className="mt-1 text-sm text-brand-gray-500">{candidates.length} candidato(s) encontrado(s)</p>
        </div>
      </div>

      <Card className="mt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Input placeholder="Nome, telefone, cidade..." value={q} onChange={(e) => setQ(e.target.value)} className="lg:col-span-2" />
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
        <label className="mt-3 flex items-center gap-2 text-sm text-brand-gray-600">
          <input type="checkbox" className="h-4 w-4 accent-brand-red-600" checked={sortByDistance} onChange={(e) => setSortByDistance(e.target.checked)} />
          Ordenar por mais próximos primeiro
        </label>
      </Card>

      <Card className="mt-6 overflow-x-auto p-0">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-brand-gray-50 text-xs uppercase text-brand-gray-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Cidade</th>
              <th className="px-4 py-3">Vaga(s)</th>
              <th className="px-4 py-3">Loja mais próxima</th>
              <th className="px-4 py-3">Distância</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-100">
            {!loading && candidates.map((c) => (
              <tr key={c.id} className="cursor-pointer hover:bg-brand-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/admin/candidatos/${c.id}`} className="font-semibold text-brand-red-700 hover:underline">
                    {c.fullName}
                  </Link>
                  {c.possibleDuplicateOfId && (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                      possível duplicado
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-gray-600">{c.phone}</td>
                <td className="px-4 py-3 text-brand-gray-600">{c.city}/{c.state}</td>
                <td className="px-4 py-3 text-brand-gray-600">{c.jobs.join(", ") || "—"}</td>
                <td className="px-4 py-3 text-brand-gray-600">{c.nearestStore?.name.replace("MART Atacadista — ", "") ?? "—"}</td>
                <td className="px-4 py-3 font-medium text-brand-ink">
                  {c.nearestStore ? `${c.nearestStore.distanceKm.toFixed(1)} km` : "—"}
                </td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-brand-gray-500">{new Date(c.createdAt).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-6 text-center text-sm text-brand-gray-500">Carregando...</p>}
        {!loading && candidates.length === 0 && (
          <p className="p-6 text-center text-sm text-brand-gray-500">Nenhum candidato encontrado com esses filtros.</p>
        )}
      </Card>
    </AdminLayout>
  );
}
