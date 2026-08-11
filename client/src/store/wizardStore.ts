import { createContext, useContext } from "react";
import type { CandidateFormData } from "../lib/types";

const STORAGE_KEY = "mart_cadastro_wizard";

export function loadWizardState(): { step: number; data: CandidateFormData } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveWizardState(step: number, data: CandidateFormData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
}

export function clearWizardState() {
  localStorage.removeItem(STORAGE_KEY);
}

interface WizardContextValue {
  data: CandidateFormData;
  updateData: (patch: Partial<CandidateFormData>) => void;
  step: number;
  setStep: (step: number) => void;
}

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard deve ser usado dentro de WizardContext.Provider");
  return ctx;
}
