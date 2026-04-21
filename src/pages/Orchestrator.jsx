import { useState } from "react";
import api from "../services/api";
import OrchestrationLoader from "../components/OrchestrationLoader";

const modes = [
  { key: "chat", label: "Chat simples", description: "Lyra escolhe um agente" },
  { key: "collaborative", label: "Colaborativo", description: "Múltiplos agentes contribuem" },
  { key: "team-chat", label: "Team chat", description: "Agentes colaboram em sequência" },
  { key: "dynamic-team", label: "Equipe dinâmica", description: "Lyra monta a equipe ideal" },
];

export default function Orchestrator() {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("chat");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

async function handleRun(e) {
  e.preventDefault();
  setLoading(true);
  setResult(null);

  try {
    const res = await api.post(`/orchestrator/${mode}`, { message });
    setResult(res.data);
  } catch (error) {
    console.error("ERRO COMPLETO:", error);
    console.error("Response:", error.response);
    console.error("Data:", error.response?.data);
    alert(error.response?.data?.detail || error.message || "Erro ao executar a orquestração.");
  } finally {
    setLoading(false);
  }
}

  const agentsUsed = result?.agents_used || [];
  const steps = result?.steps || [];
  const evaluation = result?.evaluation || null;
  const finalResponse = result?.final_response || result?.agent_response || null;

  return (
    <div className="space-y-8">
      {loading && <OrchestrationLoader />}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_28%)]" />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Orchestration Layer</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Orquestração Inteligente da Lyra
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-300 md:text-lg">
            Envie uma solicitação para a Lyra selecionar agentes, montar equipes,
            supervisionar conflitos e gerar uma resposta final consolidada.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Executar orquestração</h2>
            <p className="mt-2 text-sm text-slate-400">
              Escolha o modo de decisão e envie uma demanda para a Lyra.
            </p>
          </div>

          <form onSubmit={handleRun} className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {modes.map((item) => {
                const active = mode === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setMode(item.key)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-blue-500 bg-blue-600/15 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          active ? "bg-blue-400" : "bg-slate-600"
                        }`}
                      />
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Solicitação para a Lyra
              </label>
              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Quero melhorar o atendimento da imobiliária, revisar contratos e definir uma estratégia de crescimento."
                className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4 text-slate-100 outline-none transition focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Executando..." : "Executar orquestração"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <h3 className="text-xl font-semibold">Equipe acionada</h3>
            <p className="mt-2 text-sm text-slate-400">
              Agentes utilizados na execução atual.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {agentsUsed.length > 0 ? (
                agentsUsed.map((agent) => (
                  <span
                    key={agent}
                    className="rounded-full border border-blue-500/30 bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-300"
                  >
                    {agent}
                  </span>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-4 text-sm text-slate-500">
                  Nenhuma equipe executada ainda.
                </div>
              )}
            </div>

            {result?.team_strategy && (
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Estratégia da equipe
                </p>
                <p className="mt-3 text-sm text-slate-300">{result.team_strategy}</p>
              </div>
            )}

            {result?.selection_reason && (
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Motivo da seleção
                </p>
                <p className="mt-3 text-sm text-slate-300">{result.selection_reason}</p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <h3 className="text-xl font-semibold">Estado da execução</h3>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Modo</p>
                <p className="mt-2 text-lg font-semibold text-white">{mode}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Status</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {loading ? "Processando" : result ? "Concluído" : "Aguardando"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Timeline dos agentes</h2>
            <p className="mt-2 text-sm text-slate-400">
              Cada agente atuando em sequência dentro da cadeia de decisão.
            </p>
          </div>

          <div className="space-y-5">
            {steps.map((step) => (
              <div
                key={`${step.stage}-${step.agent_name}`}
                className="relative rounded-3xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/15 text-sm font-bold text-blue-300">
                  {step.stage}
                </div>

                <div className="pl-14">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{step.agent_name}</h3>
                      <p className="text-sm text-blue-400">{step.agent_role}</p>
                    </div>
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                      {step.agent_specialty}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                      {step.response}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {evaluation && (
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-400">Supervisor</p>
            <h2 className="mt-3 text-2xl font-semibold">Avaliação inteligente</h2>
            <p className="mt-2 text-sm text-slate-400">
              Arbitragem entre agentes, conflitos e qualidade de contribuição.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Melhor agente
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white">
                  {evaluation.best_agent || "Não definido"}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Conflitos detectados
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white">
                  {evaluation.conflicts_found ? "Sim" : "Não"}
                </h3>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Análise</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {evaluation.analysis}
              </p>
            </div>
          </div>

          {evaluation.scores?.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {evaluation.scores.map((score) => (
                <div
                  key={score.agent_name}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-white">{score.agent_name}</h4>
                    <span className="rounded-full bg-violet-600/15 px-3 py-1 text-sm font-semibold text-violet-300">
                      {score.score}/10
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">{score.reason}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {finalResponse && (
        <section className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.08)]">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Final Output</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Resposta final da Lyra</h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <p className="whitespace-pre-wrap text-base leading-8 text-slate-200">
              {finalResponse}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}