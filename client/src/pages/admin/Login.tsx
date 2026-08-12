import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo";
import { Button, Input, Label } from "../../components/ui";
import { api, ApiError, setToken } from "../../services/api";
import { useAuth } from "../../store/authStore";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ token: string; admin: { id: string; email: string; name: string } }>(
        "/auth/login",
        { email, password }
      );
      setToken(res.token);
      login(res.token, res.admin);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-red-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 sm:p-10 shadow-2xl relative z-10">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>

        <h1 className="text-center text-xl font-extrabold text-slate-900">Painel Administrativo</h1>
        <p className="mb-6 text-center text-xs text-slate-500">Acesso exclusivo para a equipe de recrutamento</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Usuário</Label>
            <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus placeholder="Usuário ou E-mail" />
          </div>
          <div>
            <Label>Senha</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          {error && <p className="text-sm font-semibold text-brand-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
          <Button type="submit" variant="dark" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? "Entrando..." : "Acessar Painel"}
          </Button>
        </form>
      </div>
    </div>
  );
}
