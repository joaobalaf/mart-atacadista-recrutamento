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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/40 via-white to-white py-16 sm:py-24">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-red-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-3.5 py-1 text-xs font-semibold text-brand-red-600 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand-gold-500 animate-pulse" />
            <span>Estamos Contratando</span>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Sua carreira no <span className="text-brand-red-600">MART Atacadista</span> começa aqui.
          </h1>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Faça parte de uma das redes que mais crescem. Cadastre seu currículo online em poucos minutos e encontre a oportunidade ideal nas nossas lojas.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {STORES.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-500" />
                Loja {s}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button size="lg" className="shadow-md shadow-brand-red-600/15" onClick={() => navigate("/cadastro")}>
              Fazer meu cadastro agora
              <span aria-hidden className="ml-1 text-lg">→</span>
            </Button>
            <a
              href="#vagas"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100/80 transition"
            >
              Ver vagas disponíveis
            </a>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="vagas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-600">Oportunidades</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Vagas em Destaque</h2>
          </div>
          <p className="mt-2 sm:mt-0 text-xs sm:text-sm text-slate-500">
            Selecione uma vaga para iniciar a sua candidatura
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate("/cadastro")}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:border-brand-red-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-brand-red-500 to-brand-gold-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-brand-red-600 group-hover:bg-brand-red-600 group-hover:text-white transition duration-300">
                  <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-brand-gold-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                  Disponível
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-brand-red-600 transition">
                {job.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">Clique para se candidatar</p>
            </div>
          ))}
        </div>

        {/* Talent Bank Banner */}
        <div className="mt-12 relative overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-r from-red-50/80 via-white to-amber-50/50 p-8 sm:p-10 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-gold-600 border border-amber-200 shadow-xs mb-2">
              ✨ Banco de Talentos
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Não encontrou a vaga que procura?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Cadastre seus dados mesmo assim! Nosso time analisa frequentemente perfis para novas vagas e oportunidades futuras.
            </p>
          </div>
          <Button size="lg" className="shrink-0 shadow-md" onClick={() => navigate("/cadastro")}>
            Cadastrar meu Currículo
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
