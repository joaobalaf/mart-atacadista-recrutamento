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
}

interface Stats {
  total: number;
  today: number;
  byStatus: Partial<Record<CandidateStatus, number>>;
  byStore: StoreCount[];
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<Stats>("/admin/stats", true).then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard de Recrutamento</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Visão geral e métricas em tempo real do banco de talentos MART Atacadista.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Sistema Ativo
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card className="relative overflow-hidden border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="absolute top-0 right-0 h-1 w-full bg-slate-300" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total de Candidatos</p>
          <p className="mt-3 text-4xl font-black text-slate-900">{stats?.total ?? "—"}</p>
        </Card>
        <Card className="relative overflow-hidden border-red-100 bg-gradient-to-br from-white via-white to-red-50/30 shadow-xs hover:shadow-md transition">
          <div className="absolute top-0 right-0 h-1 w-full bg-brand-red-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-brand-red-600">Cadastros Hoje</p>
          <p className="mt-3 text-4xl font-black text-brand-red-600">{stats?.today ?? "—"}</p>
        </Card>
        <Card className="relative overflow-hidden border-amber-100 bg-gradient-to-br from-white via-white to-amber-50/30 shadow-xs hover:shadow-md transition">
          <div className="absolute top-0 right-0 h-1 w-full bg-brand-gold-500" />
          <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-600">Banco de Talentos</p>
          <p className="mt-3 text-4xl font-black text-slate-900">
            {stats?.byStatus.BANCO_DE_TALENTOS ?? 0}
          </p>
        </Card>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Melhor loja por candidato
        </h2>
        <Link to="/admin/candidatos" className="text-xs font-semibold text-brand-red-600 hover:underline">
          Ver candidatos →
        </Link>
      </div>
      <Card className="mt-4 border-slate-200/80 shadow-xs">
        <div className="space-y-4">
          {(() => {
            const maxCount = Math.max(1, ...(stats?.byStore.map((s) => s.count) ?? [1]));
            return stats?.byStore.map((s) => (
              <div key={s.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <StoreBadge name={s.name} />
                  <span className="text-sm font-bold text-slate-900">{s.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-red-500"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ));
          })()}
          {!stats && <p className="text-sm text-slate-500">Carregando...</p>}
        </div>
      </Card>

      <h2 className="mt-10 text-xs font-extrabold uppercase tracking-wider text-slate-400">Status dos Processos Seletivos</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(Object.keys(STATUS_LABELS) as CandidateStatus[]).map((status) => (
          <Card key={status} className="p-5 border-slate-200/80 hover:border-brand-red-200 transition shadow-xs">
            <p className="text-xs font-semibold text-slate-500">{STATUS_LABELS[status]}</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">{stats?.byStatus[status] ?? 0}</p>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
