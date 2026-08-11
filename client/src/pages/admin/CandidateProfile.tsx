import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Button, Card, CardTitle, Select, Textarea } from "../../components/ui";
import { StatusBadge } from "../../components/StatusBadge";
import { api } from "../../services/api";
import { STATUS_LABELS, type CandidateStatus } from "../../lib/types";

interface Distance {
  id: string;
  distanceKm: number;
  isNearest: boolean;
  method: string;
  store: { id: string; name: string; city: string };
}

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  activities: string | null;
}

interface Note {
  id: string;
  text: string;
  createdAt: string;
  author: { name: string };
}

interface CandidateDetail {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string | null;
  gender: string | null;
  city: string;
  state: string;
  cep: string | null;
  street: string;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  otherJobInterest: string | null;
  hasPreviousExperience: boolean;
  availableMorning: boolean;
  availableAfternoon: boolean;
  availableNight: boolean;
  availableAnytime: boolean;
  weekendAvailability: string | null;
  availableScale6x1: boolean | null;
  transportMode: string | null;
  transportModeOther: string | null;
  hasPublicTransportAccess: boolean | null;
  preferredStoreChoice: string | null;
  status: CandidateStatus;
  createdAt: string;
  geocodeStatus: string;
  jobs: { job: { id: string; name: string } }[];
  distances: Distance[];
  experiences: Experience[];
  notes: Note[];
  duplicate: { id: string; fullName: string; phone: string; createdAt: string } | null;
}

const TRANSPORT_LABELS: Record<string, string> = {
  TRANSPORTE_PUBLICO: "Transporte público",
  CARRO: "Carro",
  MOTO: "Moto",
  BICICLETA: "Bicicleta",
  A_PE: "A pé",
  OUTRO: "Outro",
};

const WEEKEND_LABELS: Record<string, string> = {
  SIM: "Sim",
  NAO: "Não",
  DEPENDENDO_DA_ESCALA: "Dependendo da escala",
};

const STORE_CHOICE_LABELS: Record<string, string> = {
  CAJAMAR: "Cajamar",
  ITAPEVI: "Itapevi",
  BARUERI: "Barueri",
  QUALQUER_UMA: "Qualquer uma das lojas",
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-brand-gray-100 py-2 text-sm last:border-0">
      <span className="text-brand-gray-500">{label}</span>
      <span className="text-right font-medium text-brand-ink">{value || "—"}</span>
    </div>
  );
}

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  function load() {
    if (!id) return;
    api.get<CandidateDetail>(`/admin/candidates/${id}`, true).then(setCandidate);
  }

  useEffect(load, [id]);

  async function handleStatusChange(status: string) {
    if (!id) return;
    setUpdatingStatus(true);
    try {
      await api.patch(`/admin/candidates/${id}/status`, { status }, true);
      load();
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleAddNote() {
    if (!id || !noteText.trim()) return;
    setSavingNote(true);
    try {
      await api.post(`/admin/candidates/${id}/notes`, { text: noteText }, true);
      setNoteText("");
      load();
    } finally {
      setSavingNote(false);
    }
  }

  if (!candidate) {
    return (
      <AdminLayout>
        <p className="text-sm text-brand-gray-500">Carregando...</p>
      </AdminLayout>
    );
  }

  const whatsappNumber = candidate.phone.replace(/\D/g, "");
  const sortedDistances = [...candidate.distances].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-ink">{candidate.fullName}</h1>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={candidate.status} />
            <span className="text-xs text-brand-gray-500">
              Cadastrado em {new Date(candidate.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
        <Select
          value={candidate.status}
          disabled={updatingStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-56"
        >
          {(Object.keys(STATUS_LABELS) as CandidateStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </Select>
      </div>

      {candidate.duplicate && (
        <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 ring-1 ring-amber-200">
          Possível candidato já cadastrado: {candidate.duplicate.fullName} ({candidate.duplicate.phone}) em{" "}
          {new Date(candidate.duplicate.createdAt).toLocaleDateString("pt-BR")}.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2.5">
        <a href={`https://wa.me/55${whatsappNumber}`} target="_blank" rel="noreferrer">
          <Button variant="primary">WhatsApp</Button>
        </a>
        <a href={`tel:${whatsappNumber}`}>
          <Button variant="secondary">Ligar</Button>
        </a>
        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(candidate.phone)}>
          Copiar telefone
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Dados pessoais</CardTitle>
          <InfoRow label="CPF" value={candidate.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")} />
          <InfoRow label="Nascimento" value={new Date(candidate.birthDate).toLocaleDateString("pt-BR")} />
          <InfoRow label="Sexo" value={candidate.gender} />
        </Card>

        <Card>
          <CardTitle>Contato</CardTitle>
          <InfoRow label="Telefone" value={candidate.phone} />
          <InfoRow label="E-mail" value={candidate.email} />
        </Card>

        <Card>
          <CardTitle>Endereço</CardTitle>
          <InfoRow label="Endereço" value={`${candidate.street}${candidate.number ? ", " + candidate.number : ""}`} />
          <InfoRow label="Bairro" value={candidate.neighborhood} />
          <InfoRow label="Cidade" value={`${candidate.city}/${candidate.state}`} />
          <InfoRow label="CEP" value={candidate.cep} />
        </Card>

        <Card>
          <CardTitle>Vagas de interesse</CardTitle>
          <p className="text-sm text-brand-ink">
            {candidate.jobs.map((j) => j.job.name).join(", ") || "—"}
          </p>
          {candidate.otherJobInterest && (
            <p className="mt-2 text-sm text-brand-gray-600">
              Outra oportunidade: {candidate.otherJobInterest}
            </p>
          )}
        </Card>

        <Card>
          <CardTitle>Disponibilidade</CardTitle>
          <InfoRow
            label="Períodos"
            value={
              [
                candidate.availableMorning && "Manhã",
                candidate.availableAfternoon && "Tarde",
                candidate.availableNight && "Noite",
                candidate.availableAnytime && "Qualquer horário",
              ]
                .filter(Boolean)
                .join(", ") || "—"
            }
          />
          <InfoRow label="Finais de semana" value={candidate.weekendAvailability ? WEEKEND_LABELS[candidate.weekendAvailability] : null} />
          <InfoRow label="Escala 6x1" value={candidate.availableScale6x1 == null ? null : candidate.availableScale6x1 ? "Sim" : "Não"} />
          <InfoRow label="Transporte" value={candidate.transportMode ? TRANSPORT_LABELS[candidate.transportMode] : null} />
          <InfoRow label="Acesso a transporte público" value={candidate.hasPublicTransportAccess == null ? null : candidate.hasPublicTransportAccess ? "Sim" : "Não"} />
          <InfoRow label="Preferência de loja" value={candidate.preferredStoreChoice ? STORE_CHOICE_LABELS[candidate.preferredStoreChoice] : null} />
        </Card>

        <Card>
          <CardTitle>Distância das lojas</CardTitle>
          <p className="mb-3 text-xs text-brand-gray-500">
            Distância estimada em linha reta (Haversine) a partir do endereço informado.
          </p>
          <div className="space-y-2">
            {sortedDistances.map((d) => (
              <div
                key={d.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  d.isNearest ? "bg-brand-red-50 font-semibold text-brand-red-700" : "text-brand-ink"
                }`}
              >
                <span>
                  {d.isNearest && "⭐ "}
                  {d.store.name.replace("MART Atacadista — ", "")}
                </span>
                <span>{d.distanceKm.toFixed(1)} km</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {candidate.hasPreviousExperience && candidate.experiences.length > 0 && (
        <Card className="mt-5">
          <CardTitle>Experiência profissional</CardTitle>
          <div className="space-y-4">
            {candidate.experiences.map((exp) => (
              <div key={exp.id} className="rounded-xl border border-brand-gray-100 p-3">
                <p className="text-sm font-semibold text-brand-ink">{exp.role} — {exp.company}</p>
                <p className="text-xs text-brand-gray-500">
                  {exp.startDate} até {exp.endDate || "atual"}
                </p>
                {exp.activities && <p className="mt-1 text-sm text-brand-gray-600">{exp.activities}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-5">
        <CardTitle>Observações internas</CardTitle>
        <div className="mb-4 space-y-3">
          {candidate.notes.length === 0 && <p className="text-sm text-brand-gray-500">Nenhuma observação ainda.</p>}
          {candidate.notes.map((note) => (
            <div key={note.id} className="rounded-lg bg-brand-gray-50 p-3 text-sm">
              <p className="text-brand-ink">{note.text}</p>
              <p className="mt-1 text-xs text-brand-gray-500">
                {note.author.name} — {new Date(note.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
        <Textarea
          rows={3}
          placeholder="Adicionar observação interna (não visível ao candidato)..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <Button className="mt-2" onClick={handleAddNote} disabled={savingNote || !noteText.trim()}>
          {savingNote ? "Salvando..." : "Adicionar observação"}
        </Button>
      </Card>
    </AdminLayout>
  );
}
