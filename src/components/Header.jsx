import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="flex h-20 items-center justify-between px-6 md:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-blue-400">
            Lyra Control Center
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Painel Operacional
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Controle completo da arquitetura da Lyra
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 backdrop-blur-xl">
            {user ? `Olá, ${user.name}` : "Sessão ativa"}
          </div>

          <button
            onClick={logout}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}