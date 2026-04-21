import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function AgentDetails() {
  const { agentName } = useParams();
  const decodedAgentName = decodeURIComponent(agentName);

  const [agent, setAgent] = useState(null);
  const [memory, setMemory] = useState([]);
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState({});
  const [objectives, setObjectives] = useState({});
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  async function loadAgentData() {
    try {
      const [agentRes, memoryRes, summaryRes, tagsRes, objectivesRes] =
        await Promise.all([
          api.get(`/agents/${encodeURIComponent(decodedAgentName)}`),
          api.get(`/agents/${encodeURIComponent(decodedAgentName)}/memory`),
          api.get(`/agents/${encodeURIComponent(decodedAgentName)}/memory/summary`),
          api.get(`/agents/${encodeURIComponent(decodedAgentName)}/memory/tags`),
          api.get(`/agents/${encodeURIComponent(decodedAgentName)}/objectives`),
        ]);

      setAgent(agentRes.data);
      setMemory(memoryRes.data.messages || []);
      setSummary(summaryRes.data.summary || "");
      setTags(tagsRes.data.tags || {});
      setObjectives(objectivesRes.data.objectives || {});
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadAgentData();
  }, [decodedAgentName]);

  async function handleChat(e) {
    e.preventDefault();

    try {
      const res = await api.post(`/agents/${encodeURIComponent(decodedAgentName)}/chat`, {
        message,
      });

      setResponse(res.data.agent_response || "");
      setMessage("");
      loadAgentData();
    } catch (error) {
      console.error(error);
      alert("Erro ao conversar com o agente.");
    }
  }

  if (!agent) {
    return <div className="text-slate-400">Carregando agente...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold">{agent.name}</h1>
        <p className="mt-2 text-blue-400">{agent.role}</p>
        <p className="mt-4 text-slate-300">{agent.description}</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
            <p className="text-slate-400">Especialidade</p>
            <p className="mt-2">{agent.specialty}</p>
          </div>
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
            <p className="text-slate-400">Objetivo</p>
            <p className="mt-2">{agent.goal}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold mb-4">Conversar com o agente</h2>

        <form onSubmit={handleChat} className="space-y-4">
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite uma mensagem para este agente..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none"
          />
          <button className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 transition">
            Enviar mensagem
          </button>
        </form>

        {response && (
          <div className="mt-6 rounded-xl bg-slate-950 border border-slate-800 p-4">
            <p className="text-sm text-slate-400 mb-2">Resposta</p>
            <p className="text-slate-200 whitespace-pre-wrap">{response}</p>
          </div>
        )}
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

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold mb-4">Memória bruta</h3>

        <div className="space-y-3 max-h-[420px] overflow-y-auto">
          {memory.length === 0 ? (
            <p className="text-slate-400">Sem memória registrada.</p>
          ) : (
            memory.map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-slate-950 border border-slate-800 p-4"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {item.role}
                </p>
                <p className="mt-2 text-sm text-slate-200 whitespace-pre-wrap">
                  {item.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}