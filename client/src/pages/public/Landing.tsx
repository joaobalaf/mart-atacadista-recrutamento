import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Button } from "../../components/ui";
import { api } from "../../services/api";
import type { Job } from "../../lib/types";

export function Landing() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<Job[]>("/public/jobs").then(setJobs).catch(() => setJobs([]));
  }, []);

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-brand-ink">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold-500">
            Estamos contratando
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Faça seu cadastro
          </h1>
          <p className="mt-4 max-w-xl text-brand-gray-300">
            Quer fazer parte do nosso time? Cadastre seus dados e fique disponível para as
            oportunidades do MART Atacadista em Cajamar, Itapevi e Barueri.
          </p>
          <Button className="mt-8" onClick={() => navigate("/cadastro")}>
            Fazer meu cadastro
          </Button>
        </div>
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-red-600 via-brand-red-500 to-brand-gold-500" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-xl font-bold text-brand-ink">Oportunidades disponíveis</h2>
        <p className="mt-1 text-sm text-brand-gray-500">
          Confira nossas vagas e faça seu cadastro para concorrer.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-brand-gray-200 bg-white px-4 py-5 text-center shadow-sm transition hover:border-brand-red-300 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-brand-ink">{job.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-brand-red-50 p-6 text-center">
          <p className="font-semibold text-brand-red-700">
            Não encontrou a vaga ideal? Você também pode se cadastrar para outras oportunidades.
          </p>
          <Button className="mt-4" onClick={() => navigate("/cadastro")}>
            Preencher meus dados
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
