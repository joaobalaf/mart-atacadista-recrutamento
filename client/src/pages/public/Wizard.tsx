import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/ProgressBar";
import { WizardSidePanel } from "../../components/WizardSidePanel";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/ui";
import { WizardContext, loadWizardState, saveWizardState, clearWizardState } from "../../store/wizardStore";
import { emptyCandidateForm, type CandidateFormData } from "../../lib/types";
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateStep6,
  type Errors,
} from "../../lib/validation";
import { Step1PersonalData } from "./steps/Step1PersonalData";
import { Step2Address } from "./steps/Step2Address";
import { Step3Jobs } from "./steps/Step3Jobs";
import { Step4Experience } from "./steps/Step4Experience";
import { Step5Availability } from "./steps/Step5Availability";
import { Step6Review } from "./steps/Step6Review";
import { api, ApiError } from "../../services/api";

const VALIDATORS = [validateStep1, validateStep2, validateStep3, validateStep4, validateStep5, validateStep6];

export function Wizard() {
  const persisted = loadWizardState();
  const [data, setData] = useState<CandidateFormData>(persisted?.data ?? emptyCandidateForm);
  const [step, setStepState] = useState(persisted?.step ?? 1);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  function updateData(patch: Partial<CandidateFormData>) {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveWizardState(step, next);
      return next;
    });
  }

  function setStep(next: number) {
    setStepState(next);
    saveWizardState(next, data);
  }

  function goNext() {
    const validate = VALIDATORS[step - 1];
    const stepErrors = validate(data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (step < 6) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      submit();
    }
  }

  function goBack() {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post("/public/candidates", {
        fullName: data.fullName,
        cpf: data.cpf,
        birthDate: data.birthDate,
        phone: data.phone,
        email: data.email || undefined,
        gender: data.gender || undefined,
        city: data.city,
        state: data.state,
        cep: data.cep || undefined,
        street: data.street,
        number: data.number || undefined,
        complement: data.complement || undefined,
        neighborhood: data.neighborhood || undefined,
        jobIds: data.jobIds,
        otherJobInterest: data.wantsOtherOpportunity ? data.otherJobInterest : undefined,
        hasPreviousExperience: data.hasPreviousExperience,
        experiences: data.experiences,
        availableMorning: data.availableMorning,
        availableAfternoon: data.availableAfternoon,
        availableNight: data.availableNight,
        availableAnytime: data.availableAnytime,
        weekendAvailability: data.weekendAvailability || undefined,
        availableScale6x1: data.availableScale6x1,
        transportMode: data.transportMode || undefined,
        transportModeOther: data.transportModeOther || undefined,
        hasPublicTransportAccess: data.hasPublicTransportAccess,
        preferredStoreChoice: data.preferredStoreChoice || undefined,
        termsAccepted: data.termsAccepted,
      });
      clearWizardState();
      navigate("/cadastro/sucesso");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Não foi possível enviar seu cadastro. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <WizardContext.Provider value={{ data, updateData, step, setStep }}>
      <div className="grid min-h-screen bg-brand-gray-50 lg:grid-cols-[400px_1fr]">
        <WizardSidePanel step={step} />

        <div className="flex flex-col">
          <div className="border-b border-brand-gray-200 bg-white px-4 py-4 sm:px-6 lg:hidden">
            <Link to="/">
              <Logo variant="dark" />
            </Link>
          </div>

          <div className="flex flex-1 items-start justify-center px-4 py-8 sm:px-6 sm:py-12">
            <div className="w-full max-w-xl">
              <div className="mb-8 lg:hidden">
                <ProgressBar step={step} />
              </div>

              <div
                key={step}
                className="animate-step-in rounded-2xl border border-brand-gray-200 bg-white p-6 shadow-sm sm:p-8"
              >
                {step === 1 && <Step1PersonalData errors={errors} />}
                {step === 2 && <Step2Address errors={errors} />}
                {step === 3 && <Step3Jobs errors={errors} />}
                {step === 4 && <Step4Experience errors={errors} />}
                {step === 5 && <Step5Availability errors={errors} />}
                {step === 6 && <Step6Review errors={errors} />}

                {submitError && (
                  <p className="mt-4 rounded-lg bg-brand-red-50 px-3 py-2 text-sm font-medium text-brand-red-700">
                    {submitError}
                  </p>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <Button type="button" variant="secondary" onClick={goBack} disabled={step === 1 || submitting}>
                    Voltar
                  </Button>
                  <Button type="button" onClick={goNext} disabled={submitting}>
                    {step === 6 ? (submitting ? "Enviando..." : "Enviar cadastro") : "Continuar"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WizardContext.Provider>
  );
}
