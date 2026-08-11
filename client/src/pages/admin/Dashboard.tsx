import { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Card } from "../../components/ui";
import { api } from "../../services/api";
import { STATUS_LABELS, type CandidateStatus } from "../../lib/types";

interface Stats {
  total: number;
  today: number;
  byStatus: Partial<Record<CandidateStatus, number>>;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<Stats>("/admin/stats", true).then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black text-brand-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-brand-gray-500">Visão geral do banco de talentos MART Atacadista.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase text-brand-gray-500">Total de candidatos</p>
          <p className="mt-2 text-3xl font-black text-brand-ink">{stats?.total ?? "—"}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase text-brand-gray-500">Cadastros hoje</p>
          <p className="mt-2 text-3xl font-black text-brand-red-600">{stats?.today ?? "—"}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase text-brand-gray-500">Banco de talentos</p>
          <p className="mt-2 text-3xl font-black text-brand-ink">
            {stats?.byStatus.BANCO_DE_TALENTOS ?? 0}
          </p>
        </Card>
      </div>

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-brand-gray-500">Candidatos por status</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(STATUS_LABELS) as CandidateStatus[]).map((status) => (
          <Card key={status} className="p-4">
            <p className="text-xs text-brand-gray-500">{STATUS_LABELS[status]}</p>
            <p className="mt-1 text-xl font-bold text-brand-ink">{stats?.byStatus[status] ?? 0}</p>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
