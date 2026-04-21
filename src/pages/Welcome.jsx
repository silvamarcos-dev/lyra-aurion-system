import { useEffect, useRef, useState } from "react";
import api from "../services/api";

const quickExamples = [
  "Tenho uma reunião amanhã às 14h com um cliente.",
  "O que tenho hoje?",
  "Minha agenda amanhã.",
];

export default function Welcome() {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [checkingGoogle, setCheckingGoogle] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Oi. Eu sou a Lyra. Nesta versão Pré-Release, posso ajudar com sua agenda, compromissos e rotina.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setInput(transcript);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    async function checkGoogleConnection() {
      try {
        await api.get("/calendar/events");
        setGoogleConnected(true);
      } catch {
        setGoogleConnected(false);
      } finally {
        setCheckingGoogle(false);
      }
    }

    checkGoogleConnection();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleVoiceInput() {
    if (!recognitionRef.current) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Não foi possível iniciar o microfone:", error);
    }
  }

  async function handleSend(e) {
    e.preventDefault();

    if (!input.trim()) return;

    const userText = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userText,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const historyForApi = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const res = await api.post("/lyra/chat", {
        message: userText,
        conversation_history: historyForApi,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.lyra_response,
        },
      ]);
    } catch (error) {
      console.error(error);

      const detail =
        error?.response?.data?.detail ||
        "Não consegui responder agora. Verifique a conexão da Lyra e tente novamente.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            typeof detail === "string"
              ? detail
              : "Não consegui responder agora. Verifique a conexão da Lyra e tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function useExample(text) {
    setInput(text);
  }

  function handleConnectGoogle() {
    window.location.href = "http://localhost:8000/calendar/connect";
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-8%] h-[320px] w-[320px] rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-8%] h-[320px] w-[320px] rounded-full bg-violet-500/20 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.42em] text-blue-400">
            Aurion System
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              v0.1 Pré-Release
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Conheça a <span className="text-blue-400">Lyra</span>, sua agenda inteligente com IA
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">
            Converse em linguagem natural, organize compromissos e valide a experiência
            central da primeira versão pública da Lyra.
          </p>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Google Agenda</p>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${
                  checkingGoogle
                    ? "border border-white/10 bg-white/5 text-slate-300"
                    : googleConnected
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border border-red-500/20 bg-red-500/10 text-red-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    checkingGoogle
                      ? "bg-slate-400"
                      : googleConnected
                      ? "bg-emerald-400"
                      : "bg-red-400"
                  }`}
                />
                {checkingGoogle
                  ? "Verificando"
                  : googleConnected
                  ? "Conectada"
                  : "Desconectada"}
              </div>
            </div>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              {checkingGoogle
                ? "Verificando a conexão com sua agenda..."
                : googleConnected
                ? "Sua agenda está pronta para uso nesta demonstração."
                : "Conecte sua agenda para testar os recursos completos."}
            </p>

            <button
              onClick={handleConnectGoogle}
              className="mt-5 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              {googleConnected ? "Reconectar agenda" : "Conectar agenda"}
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <p className="text-sm font-semibold text-white">O que a Lyra faz</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                Entende mensagens em linguagem natural
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                Ajuda a organizar compromissos
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                Consulta agenda e rotina
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <p className="text-sm font-semibold text-white">Exemplos rápidos</p>
            <div className="mt-4 space-y-3">
              {quickExamples.map((example) => (
                <button
                  key={example}
                  onClick={() => useExample(example)}
                  className="block w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-left text-sm leading-7 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs uppercase tracking-[0.32em] text-blue-400">
              Lyra Demo
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Demonstração em tempo real
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              Esta é a experiência principal da v0.1. Fale com a Lyra diretamente aqui.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-950/30 px-6 py-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-[1.6rem] px-5 py-4 text-sm leading-7 shadow-[0_8px_30px_rgba(0,0,0,0.22)] ${
                  msg.role === "user"
                    ? "ml-auto border border-blue-500/20 bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                    : "mr-auto border border-white/10 bg-slate-900/80 text-slate-100"
                }`}
              >
                <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/60">
                  {msg.role === "user" ? "Você" : "Lyra"}
                </p>
                <p>{msg.content}</p>
              </div>
            ))}

            {loading && (
              <div className="mr-auto max-w-sm rounded-[1.6rem] border border-white/10 bg-slate-900/80 px-5 py-4 text-sm text-slate-300">
                <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-blue-400">
                  Lyra
                </p>
                <div className="flex items-center gap-2">
                  <span>Lyra está pensando</span>
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-white/10 bg-slate-950/60 px-6 py-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ex: Tenho uma reunião amanhã às 14h"
                  className="flex-1 bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`text-2xl transition ${
                    isListening ? "text-red-400" : "text-slate-400 hover:text-white"
                  }`}
                  title={isListening ? "Ouvindo..." : "Microfone"}
                >
                  🎙
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-xl text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] transition hover:scale-[1.03] disabled:opacity-60"
              >
                ✦
              </button>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Pré-Release: a Lyra está em evolução contínua. Esta tela representa a
              experiência principal da v0.1.
            </p>
          </form>
        </section>

        <footer className="mt-8 text-center text-sm text-slate-500">
          ©️ {new Date().getFullYear()} Lyra • Desenvolvido por{" "}
          <span className="font-medium text-slate-300">Aurion System</span> •
          Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
}