import { useEffect, useState } from "react";

const loadingSteps = [
  {
    title: "Analisando a solicitação",
    description: "Lyra está interpretando a intenção e o escopo do problema.",
  },
  {
    title: "Selecionando agentes",
    description: "Os especialistas mais adequados estão sendo escolhidos.",
  },
  {
    title: "Coordenando contribuições",
    description: "Os agentes estão colaborando e refinando a resposta.",
  },
  {
    title: "Supervisão final",
    description: "A melhor síntese está sendo consolidada pela Lyra.",
  },
];

export default function OrchestrationLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
      <div className="relative w-[92%] max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_30%)]" />

        <div className="relative">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-400">
            Lyra Orchestration Engine
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Coordenando inteligência em tempo real
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            A Lyra está analisando o problema, selecionando agentes especializados
            e consolidando a melhor resposta possível.
          </p>

          <div className="mt-8 space-y-4">
            {loadingSteps.map((step, index) => {
              const isActive = index === activeStep;
              const isDone = index < activeStep;

              return (
                <div
                  key={step.title}
                  className={`rounded-2xl border p-4 transition-all duration-500 ${
                    isActive
                      ? "border-blue-500 bg-blue-600/10 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
                      : isDone
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isDone ? "✓" : index + 1}
                    </div>

                    <div>
                      <h3
                        className={`text-sm font-semibold md:text-base ${
                          isActive
                            ? "text-white"
                            : isDone
                            ? "text-emerald-300"
                            : "text-slate-300"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-blue-400" />
            <p className="text-sm text-slate-400">
              Processo em execução. Aguarde a resposta final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}