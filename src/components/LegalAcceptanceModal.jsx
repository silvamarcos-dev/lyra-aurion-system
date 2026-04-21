import { useEffect, useState } from "react";
import api from "../services/api";

export default function LegalAcceptanceModal({ onAccepted }) {
  const [documents, setDocuments] = useState([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const res = await api.get("/legal/documents");
        setDocuments(res.data.documents || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  async function handleAccept() {
    if (!checked || documents.length === 0) return;

    setSubmitting(true);

    try {
      await api.post("/legal/accept", {
        document_ids: documents.map((doc) => doc.id),
      });

      onAccepted();
    } catch (error) {
      console.error(error);
      const detail = error?.response?.data?.detail || "Não foi possível registrar o aceite legal.";
      alert(detail);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_20px_100px_rgba(0,0,0,0.55)]">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
          Compliance
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white">
          Aceite legal obrigatório
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Para continuar utilizando a Lyra, você precisa concordar com nossa Política de Privacidade, Termos de Uso e Política de Uso de IA.
        </p>

        <div className="mt-6 max-h-[320px] space-y-4 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-4">
          {loading ? (
            <p className="text-sm text-slate-400">Carregando documentos legais...</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl border border-white/10 bg-slate-900/80 p-4"
              >
                <p className="text-base font-semibold text-white">{doc.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-400">
                  {doc.document_type} • versão {doc.version}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {doc.content}
                </p>
              </div>
            ))
          )}
        </div>

        <label className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950"
          />
          <span>
            Li e concordo com a Política de Privacidade, os Termos de Uso e a Política de Uso de IA da Lyra.
          </span>
        </label>

        <button
          type="button"
          onClick={handleAccept}
          disabled={!checked || submitting || loading}
          className="mt-5 w-full rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
        >
          {submitting ? "Registrando aceite..." : "Aceitar e continuar"}
        </button>
      </div>
    </div>
  );
}