import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  title: "",
  description: "",
  remind_at: "",
  channel: "in_app",
};

export default function Reminders() {
  const [form, setForm] = useState(initialForm);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  async function fetchReminders() {
    try {
      const res = await api.get("/reminders/");
      setReminders(res.data.reminders || []);
    } catch (error) {
      console.error(error);
      alert("Não foi possível carregar os lembretes.");
    }
  }

  useEffect(() => {
    fetchReminders();
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
      await api.post("/reminders/", {
        title: form.title,
        description: form.description || null,
        remind_at: form.remind_at,
        channel: form.channel,
      });

      setForm(initialForm);
      fetchReminders();
      alert("Lembrete criado com sucesso.");
    } catch (error) {
      console.error(error);
      const detail = error?.response?.data?.detail || "Não foi possível criar o lembrete.";
      alert(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  }

  async function handleDispatch() {
    setDispatching(true);

    try {
      const res = await api.post("/reminders/dispatch");
      fetchReminders();

      alert(
        `Dispatcher executado.\nProcessados: ${res.data.processed_count}`
      );
    } catch (error) {
      console.error(error);
      const detail = error?.response?.data?.detail || "Não foi possível disparar os lembretes.";
      alert(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setDispatching(false);
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
          Integrações
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Reminder Center
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Crie lembretes, teste o dispatcher e prepare a Lyra para WhatsApp, agenda e automações.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Novo lembrete</h2>
            <p className="mt-1 text-sm text-slate-400">
              Crie um lembrete para testar a automação da Lyra.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDispatch}
            disabled={dispatching}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
          >
            {dispatching ? "Disparando..." : "Disparar reminders"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            name="title"
            placeholder="Título do lembrete"
            value={form.title}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            required
          />

          <select
            name="channel"
            value={form.channel}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          >
            <option value="in_app" className="bg-slate-900">In App</option>
            <option value="whatsapp" className="bg-slate-900">WhatsApp</option>
            <option value="voice" className="bg-slate-900">Voice</option>
          </select>

          <input
            type="datetime-local"
            name="remind_at"
            value={form.remind_at}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2"
            required
          />

          <textarea
            name="description"
            placeholder="Descrição do lembrete"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:opacity-60 md:col-span-2"
          >
            {loading ? "Criando..." : "Criar lembrete"}
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <h2 className="text-xl font-semibold text-white">Seus lembretes</h2>
        <p className="mt-1 text-sm text-slate-400">
          Aqui você acompanha os reminders criados e o status do disparo.
        </p>

        <div className="mt-6 space-y-4">
          {reminders.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
              Nenhum lembrete criado ainda.
            </div>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {reminder.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {reminder.description || "Sem descrição."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-300">
                      {reminder.channel}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                      {reminder.status}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                        reminder.sent
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                      }`}
                    >
                      {reminder.sent ? "Enviado" : "Pendente"}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  Disparar em: {new Date(reminder.remind_at).toLocaleString("pt-BR")}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}