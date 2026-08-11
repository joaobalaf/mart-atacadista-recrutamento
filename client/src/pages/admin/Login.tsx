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
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50/40 via-white to-amber-50/30 px-4">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-red-100/40 blur-3xl pointer-events-none" />
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-slate-200/50 relative z-10">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="text-center text-xl font-extrabold text-slate-900">Painel Administrativo</h1>
        <p className="mb-6 text-center text-xs text-slate-500">Acesso exclusivo para a equipe de recrutamento</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus placeholder="seu.email@mart.com.br" />
          </div>
          <div>
            <Label>Senha</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          {error && <p className="text-sm font-semibold text-brand-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
          <Button type="submit" size="lg" className="w-full mt-2 shadow-md shadow-brand-red-600/15" disabled={loading}>
            {loading ? "Entrando..." : "Acessar Painel"}
          </Button>
        </form>
      </div>
    </div>
  );
}
