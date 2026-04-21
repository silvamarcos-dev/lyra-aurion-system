import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import AgentCard from "../components/AgentCard";

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [status, setStatus] = useState("Carregando...");
  const [version, setVersion] = useState("-");

  useEffect(() => {
    async function loadData() {
      try {
        const [rootRes, agentsRes] = await Promise.all([
          api.get("/"),
          api.get("/agents/"),
        ]);

        setStatus(rootRes.data.status || "running");
        setVersion(rootRes.data.version || "-");
        setAgents(agentsRes.data.agents || []);
      } catch (error) {
        console.error(error);
        setStatus("erro");
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard da Lyra</h1>
        <p className="text-slate-400 mt-2">
          Visão geral do ecossistema multiagente.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Status do Core"
          value={status}
          subtitle="Saúde geral do backend"
        />
        <StatCard
          title="Versão"
          value={version}
          subtitle="Versão atual da API"
        />
        <StatCard
          title="Agentes cadastrados"
          value={agents.length}
          subtitle="Especialistas disponíveis"
        />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Agentes recentes</h2>

        {agents.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Nenhum agente encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {agents.slice(0, 4).map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}