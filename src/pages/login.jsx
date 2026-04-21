import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
      await login(form.email, form.password);
      navigate("/welcome");
    } catch (error) {
      console.error(error);
      const detail = error?.response?.data?.detail || "Não foi possível fazer login.";
      alert(detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_30%)]" />

      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.32em] text-blue-400">
          Aurion System
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">Entrar na Lyra</h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Acesse seu núcleo de inteligência com segurança.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Sua senha"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Ainda não tem conta?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Criar conta
          </Link>
        </p>

        {loading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
    <div className="flex flex-col items-center gap-4">
      
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

      <p className="text-sm text-slate-300">
        Conectando com a Lyra...
      </p>

    </div>
  </div>
)}

      </div>
    </div>
  );
}