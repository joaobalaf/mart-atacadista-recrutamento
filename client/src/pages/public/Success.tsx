import { useNavigate } from "react-router-dom";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Button } from "../../components/ui";

export function Success() {
  const navigate = useNavigate();
  return (
    <PublicLayout>
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
          ✓
        </div>
        <h1 className="mt-6 text-2xl font-black text-brand-ink">Cadastro realizado com sucesso!</h1>
        <p className="mt-3 text-brand-gray-600">
          Obrigado pelo seu interesse em fazer parte do MART Atacadista. Se o seu perfil estiver de
          acordo com uma de nossas oportunidades, nossa equipe poderá entrar em contato.
        </p>
        <Button className="mt-8" variant="secondary" onClick={() => navigate("/")}>
          Voltar para o início
        </Button>
      </div>
    </PublicLayout>
  );
}
