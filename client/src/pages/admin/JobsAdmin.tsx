import { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Card } from "../../components/ui";
import { api } from "../../services/api";
import type { Job } from "../../lib/types";

export function JobsAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.get<Job[]>("/admin/jobs", true).then(setJobs);
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black text-brand-ink">Vagas</h1>
      <p className="mt-1 text-sm text-brand-gray-500">
        Vagas disponíveis para os candidatos selecionarem no cadastro.
      </p>

      <Card className="mt-6 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-gray-50 text-xs uppercase text-brand-gray-500">
            <tr>
              <th className="px-4 py-3">Vaga</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-100">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-3 font-medium text-brand-ink">{job.name}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${job.active ? "bg-emerald-100 text-emerald-700" : "bg-brand-gray-200 text-brand-gray-600"}`}>
                    {job.active ? "Ativa" : "Inativa"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  );
}
