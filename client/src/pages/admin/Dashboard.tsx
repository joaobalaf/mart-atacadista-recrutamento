import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Card } from "../../components/ui";
import { StoreBadge } from "../../components/StoreBadge";
import { api } from "../../services/api";
import { STATUS_LABELS, type CandidateStatus } from "../../lib/types";

interface StoreCount {
  id: string;
  name: string;
  city: string;
  count: number;
  percent: number;
}

interface Stats {
  total: number;
  today: number;
  byStatus: Partial<Record<CandidateStatus, number>>;
  byStore: StoreCount[];
  noLocation: number;
}

function KpiCard({ label, value, accent, sub }: { label: string; value: string | number; accent: string; sub?: string }) {
  return (
    <Card className="relative overflow-hidden border-slate-200 shadow-xs">
      <div className={`absolute top-0 left-0 h-1 w-full ${accent}`} />
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </Card>
  );
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reprocessing, setReprocessing] = useState(false);
  const [reprocessResult, setReprocessResult] = useState<string | null>(null);

  function load() {
    api.get<Stats>("/admin/stats", true).then(setStats).catch(() => setStats(null));
  }

  useEffect(load, []);

  async function handleReprocess() {
    setReprocessing(true);
    setReprocessResult(null);
    try {
      const res = await api.post<{ processed: number; fixed: number }>("/admin/candidates/regeocode-pending", {}, true);
      setReprocessResult(`${res.fixed} de ${res.processed} endereço(s) localizado(s) agora.`);
      load();
    } finally {
      setReprocessing(false);
    }
  }

  const maxCount = Math.max(1, ...(stats?.byStore.map((s) => s.count) ?? [1]));

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard de Recrutamento</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Visão geral e métricas em tempo real do banco de talentos MART Atacadista.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Sistema Ativo
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total de Candidatos" value={stats?.total ?? "—"} accent="bg-slate-300" />
        <KpiCard label="Cadastros Hoje" value={stats?.today ?? "—"} accent="bg-brand-red-600" />
        <KpiCard label="Banco de Talentos" value={stats?.byStatus.BANCO_DE_TALENTOS ?? 0} accent="bg-brand-gold-500" />
        <KpiCard
          label="Endereços não localizados"
          value={stats?.noLocation ?? "—"}
          accent={stats && stats.noLocation > 0 ? "bg-amber-500" : "bg-emerald-500"}
          sub={stats && stats.noLocation > 0 ? "Sem distância até as lojas" : "Todos localizados"}
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Pessoas com fácil acesso a cada loja
        </h2>
        <Link to="/admin/candidatos" className="text-xs font-semibold text-brand-red-600 hover:underline">
          Ver candidatos →
        </Link>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Quantidade de candidatos cujo endereço está mais próximo de cada unidade (menor distância estimada em linha reta).
      </p>
      <Card className="mt-4 border-slate-200 shadow-xs">
        <div className="space-y-5">
          {stats?.byStore.map((s) => (
            <div key={s.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StoreBadge name={s.name} />
                  <span className="text-xs text-slate-400">{s.city}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {s.count} <span className="font-normal text-slate-400">({s.percent}%)</span>
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900"
                  style={{ width: `${(s.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {!stats && <p className="text-sm text-slate-500">Carregando...</p>}
        </div>
      </Card>

      {stats && stats.noLocation > 0 && (
        <Card className="mt-5 border-amber-200 bg-amber-50/60 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-amber-800">
                {stats.noLocation} candidato(s) sem endereço localizado
              </p>
              <p className="mt-0.5 text-xs text-amber-700">
                Geralmente por erro de digitação no endereço. Não aparecem na comparação de lojas até serem reprocessados.
              </p>
              {reprocessResult && <p className="mt-1 text-xs font-semibold text-emerald-700">{reprocessResult}</p>}
            </div>
            <button
              onClick={handleReprocess}
              disabled={reprocessing}
              className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700 disabled:opacity-60 cursor-pointer"
            >
              {reprocessing ? "Reprocessando..." : "Reprocessar endereços"}
            </button>
          </div>
        </Card>
      )}

      <h2 className="mt-10 text-xs font-extrabold uppercase tracking-wider text-slate-400">Status dos Processos Seletivos</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(Object.keys(STATUS_LABELS) as CandidateStatus[]).map((status) => (
          <Card key={status} className="p-5 border-slate-200 hover:border-slate-300 transition shadow-xs">
            <p className="text-xs font-semibold text-slate-500">{STATUS_LABELS[status]}</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">{stats?.byStatus[status] ?? 0}</p>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
