import { NavLink } from "react-router-dom";

const navItemClass = ({ isActive }) =>
  `group relative block overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
    isActive
      ? "border border-blue-500/20 bg-blue-500/15 text-white shadow-[0_0_30px_rgba(59,130,246,0.15)]"
      : "border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
  }`;

export default function Sidebar() {
  return (
    <aside className="hidden w-80 border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl md:flex md:flex-col">
      <div className="border-b border-white/10 p-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.32em] text-blue-400">
            Aurion System
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
            Lyra Core
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            O núcleo de IA da Lyra está em desenvolvimento e será lançado em breve. Fique atento para atualizações emocionantes!
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Núcleo ativo
          </div>
        </div>
      </div>

      <nav className="space-y-3 p-4">
        <NavLink to="/" className={navItemClass}>
          Dashboard
        </NavLink>

        <NavLink to="/lyra-chat" className={navItemClass}>
          Lyra Chat
        </NavLink>

        <NavLink to="/calendar" className={navItemClass}>
          Google Agenda
        </NavLink>
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="text-sm font-medium text-white">IA em desenvolvimento</p>
          <p className="mt-3 text-xs leading-6 text-slate-400">
            O núcleo de IA da Lyra está em desenvolvimento e será lançado em breve. Fique atento para atualizações emocionantes!
          </p>
        </div>
      </div>
    </aside>
  );
}