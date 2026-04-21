import { useEffect, useState } from "react";
import api from "../services/api";

export default function MemoryCenter() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState({});
  const [objectives, setObjectives] = useState({});

  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await api.get("/agents/");
        const list = res.data.agents || [];
        setAgents(list);

        if (list.length > 0) {
          setSelectedAgent(list[0].name);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadAgents();
  }, []);

  useEffect(() => {
    if (!selectedAgent) return;

    async function loadMemory() {
      try {
        const [summaryRes, tagsRes, objectivesRes] = await Promise.all([
          api.get(`/agents/${encodeURIComponent(selectedAgent)}/memory/summary`),
          api.get(`/agents/${encodeURIComponent(selectedAgent)}/memory/tags`),
          api.get(`/agents/${encodeURIComponent(selectedAgent)}/objectives`),
        ]);

        setSummary(summaryRes.data.summary || "");
        setTags(tagsRes.data.tags || {});
        setObjectives(objectivesRes.data.objectives || {});
      } catch (error) {
        console.error(error);
      }
    }

    loadMemory();
  }, [selectedAgent]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Central de Memória</h1>
        <p className="text-slate-400 mt-2">
          Visualize a camada cognitiva persistente dos agentes.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <label className="text-sm text-slate-400 block mb-3">Selecione um agente</label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full md:w-96 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none"
        >
          {agents.map((agent) => (
            <option key={agent.name} value={agent.name}>
              {agent.name}
            </option>
          ))}
        </select>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold mb-4">Resumo</h3>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">
            {summary || "Sem resumo disponível."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap">
            {JSON.stringify(tags, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold mb-4">Objetivos</h3>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap">
            {JSON.stringify(objectives, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  );
}