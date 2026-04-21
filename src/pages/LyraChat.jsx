import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { speak } from "../utils/speak";

const quickActions = [
  {
    title: "Criar imagem",
    description: "Visualizar qualquer coisa",
    icon: "✦",
  },
  {
    title: "Investigar",
    description: "Obter um relatório detalhado",
    icon: "⌕",
  },
  {
    title: "Busca na web",
    description: "Buscar notícias e informações em tempo real",
    icon: "◎",
  },
  {
    title: "Modo agente",
    description: "Automatizar tarefas",
    icon: "▣",
  },
  {
    title: "Adicionar arquivos",
    description: "Analisar ou resumir",
    icon: "⌂",
  },
  {
    title: "Questionários",
    description: "Criar questionários para testar conhecimento",
    icon: "◫",
  },
  {
    title: "Explorar aplicativos",
    description: "Converse com aplicativos na Lyra",
    icon: "◌",
  },
];

export default function LyraChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ shouldSpeakReply, setShouldSpeakReply ] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  async function loadHistory() {
    try {
      const res = await api.get("/lyra/chat/history");
      const history = res.data.messages || [];

      if (history.length === 0) {
        setMessages([
          {
            role: "assistant",
            content:
              "Oi. Eu sou a Lyra. Me fala o que você quer construir, resolver ou entender.",
          },
        ]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error(error);
      setMessages([
        {
          role: "assistant",
          content:
            "Oi. Eu sou a Lyra. Me fala o que você quer construir, resolver ou entender.",
        },
      ]);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setShowActions(false);
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (showActions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showActions]);

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
      setShouldSpeakReply(true);
        }
      };

    recognitionRef.current = recognition;
  }, []);

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

  const newUserMessage = {
    role: "user",
    content: userText,
  };

  setMessages((prev) => [...prev, newUserMessage]);
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

    const lyraText = res.data.lyra_response;

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: lyraText,
      },
    ]);

    if (shouldSpeakReply) {
      speak(lyraText);
      setShouldSpeakReply(false);
    }
  } catch (error) {
    console.error(error);

    const fallbackText =
      "Tive um problema ao responder agora, mas continuo aqui com você.";

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: fallbackText,
      },
    ]);

    if (shouldSpeakReply) {
      speak(fallbackText);
      setShouldSpeakReply(false);
    }
  } finally {
    setLoading(false);
  }
}

  async function handleClearChat() {
    try {
      await api.delete("/lyra/chat/history");
      setMessages([
        {
          role: "assistant",
          content: "Conversa limpa. Podemos recomeçar do zero.",
        },
      ]);
    } catch (error) {
      console.error(error);
      alert("Não consegui limpar o histórico agora.");
    }
  }

  function handleActionClick(actionTitle) {
    setShowActions(false);

    const suggestions = {
      "Criar imagem": "Quero criar uma imagem com a Lyra.",
      Investigar: "Quero investigar um tema com mais profundidade.",
      "Busca na web": "Pesquise isso na web para mim.",
      "Modo agente": "Ative o modo agente para esta tarefa.",
      "Adicionar arquivos": "Quero adicionar arquivos para análise.",
      Questionários: "Crie um questionário sobre este tema.",
      "Explorar aplicativos": "Quero explorar aplicativos integrados.",
    };

    setInput(suggestions[actionTitle] || "");
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_28%)]" />

        <div className="relative flex h-[calc(100vh-8.5rem)] flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-blue-400">
                Lyra Chat
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Converse com a Lyra
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Um canal direto com a inteligência central da plataforma, com
                memória, orquestração e apoio contextual.
              </p>
            </div>

            <button
              onClick={handleClearChat}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
            >
              Limpar chat
            </button>
          </div>

          <div className="relative flex-1 space-y-5 overflow-y-auto bg-slate-950/40 px-6 py-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-3xl rounded-3xl px-5 py-4 text-sm leading-7 shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition-all duration-300 ${
                  msg.role === "user"
                    ? "ml-auto border border-blue-500/20 bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                    : "mr-auto border border-white/10 bg-white/5 text-slate-100 backdrop-blur-xl"
                }`}
              >
                <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/60">
                  {msg.role === "user" ? "Você" : "Lyra"}
                </p>
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="mr-auto max-w-sm rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300 backdrop-blur-xl">
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
            className="border-t border-white/10 bg-slate-950/70 px-6 py-5"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowActions(true)}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl text-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition hover:scale-[1.03] hover:bg-white/10"
                title="Abrir ações"
              >
                +
              </button>

              <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mensagem Minha Primeira IA..."
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
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] transition hover:scale-[1.03] hover:bg-blue-500 disabled:opacity-60"
                title="Enviar"
              >
                ✦
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-slate-400 backdrop-blur-xl">
              Ao utilizar a Lyra, você concorda com nossa{" "}
              <a
                href="/privacy"
                className="text-blue-400 underline hover:text-blue-300"
              >
                Política de Privacidade
              </a>{" "}
              e{" "}
              <a
                href="/ai-policy"
                className="text-blue-400 underline hover:text-blue-300"
              >
                uso de IA
              </a>
              .
            </div>
          </form>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${
          showActions
            ? "pointer-events-auto bg-black/60 opacity-100 backdrop-blur-sm"
            : "pointer-events-none bg-black/0 opacity-0"
        }`}
        onClick={() => setShowActions(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-3xl rounded-t-[2.2rem] border border-white/10 bg-slate-950/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition-all duration-300 ${
            showActions
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-white/20" />

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Lyra</h2>
              <p className="mt-1 text-sm text-slate-400">
                Expanda a experiência com ferramentas e modos inteligentes
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowActions(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-3xl text-slate-300">
              📷
            </div>

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-blue-500/20 bg-blue-500/10 text-center text-xs text-slate-300 shadow-[0_0_25px_rgba(59,130,246,0.18)]">
              Mensagem
              <br />
              Lyra
            </div>

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-center text-xs text-slate-300">
              Código
              <br />
              Lyra
            </div>

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-center text-xs text-slate-300">
              Web
              <br />
              Search
            </div>
          </div>

          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.title}
                type="button"
                onClick={() => handleActionClick(action.title)}
                className="group flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition-all duration-300 hover:scale-[1.01] hover:bg-white/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-lg text-white transition group-hover:border-blue-500/20 group-hover:bg-blue-500/10">
                  {action.icon}
                </div>

                <div>
                  <p className="text-base font-medium text-white">
                    {action.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-slate-400">
            Toque fora da janela, pressione <span className="text-white">ESC</span> ou use o <span className="text-white">✕</span> para fechar.
          </div>
        </div>
      </div>
    </>
  );
}