export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Política de Privacidade</h1>

        <p className="mt-6 text-slate-400">
          Última atualização: Abril de 2026
        </p>

        <div className="mt-10 space-y-6 text-slate-300 leading-7">
          <p>
            A Lyra, desenvolvida pela Aurion System, respeita sua privacidade e
            protege seus dados.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            1. Dados coletados
          </h2>
          <p>
            Podemos coletar informações como:
            - Mensagens enviadas no chat  
            - Dados de autenticação  
            - Informações de calendário (com sua autorização)
          </p>

          <h2 className="text-2xl font-semibold text-white">
            2. Uso das informações
          </h2>
          <p>
            Os dados são utilizados para:
            - Melhorar a experiência da Lyra  
            - Executar automações (como agenda)  
            - Aprimorar respostas e contexto
          </p>

          <h2 className="text-2xl font-semibold text-white">
            3. Compartilhamento
          </h2>
          <p>
            Seus dados não são vendidos. Integrações externas (como Google
            Agenda) só são usadas com sua permissão.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            4. Segurança
          </h2>
          <p>
            Implementamos medidas para proteger seus dados, mas nenhum sistema é
            100% invulnerável.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            5. Seus direitos
          </h2>
          <p>
            Você pode solicitar exclusão de dados e interromper o uso a qualquer
            momento.
          </p>
        </div>
      </div>
    </div>
  );
}