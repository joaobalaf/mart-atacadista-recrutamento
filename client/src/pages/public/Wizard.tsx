import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WizardSidePanel } from "../../components/WizardSidePanel";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/ui";
import { WizardContext, loadFormState, saveFormState, clearFormState } from "../../store/wizardStore";
import { emptyCandidateForm, type CandidateFormData } from "../../lib/types";
import { validateStep1, validateStep2, validateStep3, validateStep4, validateStep5 } from "../../lib/validation";
import { Step1PersonalData } from "./steps/Step1PersonalData";
import { Step2Address } from "./steps/Step2Address";
import { Step3Jobs } from "./steps/Step3Jobs";
import { Step4Experience } from "./steps/Step4Experience";
import { Step5About } from "./steps/Step5About";
import { api, ApiError } from "../../services/api";

const VALIDATORS = [validateStep1, validateStep2, validateStep3, validateStep4, validateStep5];

export function Wizard() {
  const [data, setData] = useState<CandidateFormData>(loadFormState() ?? emptyCandidateForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  function updateData(patch: Partial<CandidateFormData>) {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveFormState(next);
      return next;
    });
  }

  async function handleSubmit() {
    const allErrors = VALIDATORS.reduce((acc, validate) => ({ ...acc, ...validate(data) }), {});
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      document.getElementById("cadastro-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post("/public/candidates", {
        fullName: data.fullName,
        phone: data.phone,
        city: data.city,
        state: data.state,
        cep: data.cep || undefined,
        street: data.street,
        number: data.number || undefined,
        jobIds: data.jobId ? [data.jobId] : [],
        otherJobInterest: data.wantsOtherOpportunity ? data.otherJobInterest : undefined,
        lastExperience: data.lastExperience || undefined,
        aboutYou: data.aboutYou || undefined,
        termsAccepted: data.termsAccepted,
      });
      clearFormState();
      navigate("/cadastro/sucesso");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Não foi possível enviar seu cadastro. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <WizardContext.Provider value={{ data, updateData }}>
      <div className="grid min-h-screen bg-slate-50/50 lg:grid-cols-[420px_1fr]">
        <WizardSidePanel />

        <div className="flex flex-col">
          <div className="border-b border-slate-100 bg-white/90 backdrop-blur-md px-6 py-4 lg:hidden sticky top-0 z-30">
            <Link to="/" className="inline-block">
              <Logo size="md" />
            </Link>
          </div>

          <div className="flex flex-1 items-start justify-center px-4 py-8 sm:px-8 sm:py-14">
            <div className="w-full max-w-2xl">
              <div className="mb-8 hidden sm:block">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                  Formulário de Inscrição
                </span>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                  Cadastre seu Currículo
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Preencha as informações abaixo para concorrer às vagas das nossas unidades.
                </p>
              </div>

              <div
                id="cadastro-form"
                className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/40 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-brand-red-600 via-brand-red-500 to-brand-gold-500" />

                <Step1PersonalData errors={errors} />
                <hr className="border-slate-100" />
                <Step2Address errors={errors} />
                <hr className="border-slate-100" />
                <Step3Jobs errors={errors} />
                <hr className="border-slate-100" />
                <Step4Experience errors={errors} />
                <hr className="border-slate-100" />
                <Step5About errors={errors} />

                {submitError && (
                  <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-brand-red-600 border border-red-100 shadow-xs">
                    ⚠️ {submitError}
                  </p>
                )}

                <Button type="button" size="lg" className="w-full shadow-md shadow-brand-red-600/15" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Enviando seus dados..." : "Finalizar e Enviar Cadastro →"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WizardContext.Provider>
  );
}
