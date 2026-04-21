import { Link } from "react-router-dom";

export default function AgentCard({ agent }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{agent.name}</h3>
          <p className="text-sm text-blue-400 mt-1">{agent.role}</p>
        </div>

        <Link
          to={`/agents/${encodeURIComponent(agent.name)}`}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 transition"
        >
          Ver mais
        </Link>
      </div>

      <p className="mt-4 text-sm text-slate-300">{agent.description}</p>

      <div className="mt-4 space-y-2 text-sm">
        <p className="text-slate-400">
          <span className="text-slate-200 font-medium">Especialidade:</span>{" "}
          {agent.specialty}
        </p>
        <p className="text-slate-400">
          <span className="text-slate-200 font-medium">Objetivo:</span>{" "}
          {agent.goal}
        </p>
      </div>
    </div>
  );
}