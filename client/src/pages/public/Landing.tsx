import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Button } from "../../components/ui";
import { api } from "../../services/api";
import type { Job } from "../../lib/types";

const STORES = ["Cajamar", "Itapevi", "Barueri"];

export function Landing() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<Job[]>("/public/jobs").then(setJobs).catch(() => setJobs([]));
  }, []);

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-brand-ink">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-brand-red-500), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold-500">
            Estamos contratando
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Faça seu cadastro e venha crescer com a gente
          </h1>
          <p className="mt-4 max-w-xl text-brand-gray-300">
            Quer fazer parte do nosso time? Cadastre seus dados e fique disponível para as
            oportunidades do MART Atacadista. É rápido, 100% online e leva poucos minutos.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {STORES.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-gray-300"
              >
                Loja {s}
              </span>
            ))}
          </div>

          <Button className="mt-8" onClick={() => navigate("/cadastro")}>
            Fazer meu cadastro
            <span aria-hidden>→</span>
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
              className="group cursor-pointer rounded-2xl border border-brand-gray-200 bg-white px-4 py-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-red-300 hover:shadow-lg"
              onClick={() => navigate("/cadastro")}
            >
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-red-50 text-brand-red-600 transition group-hover:bg-brand-red-600 group-hover:text-white">
                <span className="h-2 w-2 rounded-full bg-current" />
              </div>
              <p className="text-sm font-semibold text-brand-ink">{job.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl bg-brand-red-50 p-8 text-center">
          <p className="text-lg font-semibold text-brand-red-700">
            Não encontrou a vaga ideal?
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-brand-red-700/80">
            Você também pode se cadastrar para outras oportunidades e entrar no nosso banco de
            talentos.
          </p>
          <Button className="mt-5" onClick={() => navigate("/cadastro")}>
            Preencher meus dados
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
