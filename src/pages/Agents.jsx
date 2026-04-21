import { useEffect, useState } from "react";
import api from "../services/api";
import AgentCard from "../components/AgentCard";

const initialForm = {
  name: "",
  role: "",
  specialty: "",
  description: "",
  goal: "",
};

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  async function fetchAgents() {
    try {
      const res = await api.get("/agents/");
      setAgents(res.data.agents || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAgents();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/agents/create", {
        goal: form.goal,
        name: form.name || undefined,
        role: form.role || undefined,
        specialty: form.specialty || undefined,
        description: form.description || undefined,
      });

      setForm(initialForm);
      fetchAgents();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar agente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Agentes</h1>
        <p className="text-slate-400 mt-2">
          Crie, visualize e gerencie os especialistas da Lyra.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold mb-5">Criar novo agente</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Nome do agente"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none"
          />
          <input
            name="role"
            placeholder="Função"
            value={form.role}
            onChange={handleChange}
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none"
          />
          <input
            name="specialty"
            placeholder="Especialidade"
            value={form.specialty}
            onChange={handleChange}
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none md:col-span-2"
          />
          <input
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none md:col-span-2"
          />
          <textarea
            name="goal"
            placeholder="Objetivo do agente"
            value={form.goal}
            onChange={handleChange}
            required
            rows={4}
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 transition disabled:opacity-60 md:col-span-2"
          >
            {loading ? "Criando..." : "Criar agente"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Todos os agentes</h2>

        {agents.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Nenhum agente cadastrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {agents.map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}