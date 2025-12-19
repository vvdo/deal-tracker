import { DealsBoard } from "@/components/deals-board";
import { getDealsSnapshot } from "@/lib/deals";

export default function Home() {
  const snapshot = getDealsSnapshot();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(8,47,73,0.4),transparent_40%)]"
        aria-hidden
      />
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-slate-900/60 p-10 shadow-2xl shadow-emerald-500/10 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">
                Radar de ofertas reais
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
                Rastreie voos e cruzeiros com checagem anti-fake e sem loops que travam o PC
              </h1>
              <p className="max-w-2xl text-lg text-slate-200">
                Trabalhamos apenas com fontes oficiais e regras de validacao claras: desconto real,
                link seguro, disponibilidade e logs. Atualizacao sob demanda para nao saturar seu
                ambiente de execucao.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-100">
                  Foco em passagens aereas e cruzeiros
                </span>
                <span className="rounded-full bg-white/5 px-4 py-2">Validacao automatica + manual</span>
                <span className="rounded-full bg-white/5 px-4 py-2">Atualizacao sob demanda</span>
              </div>
            </div>
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-lg shadow-emerald-500/10">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Status de integridade</p>
              <div className="mt-4 space-y-3 text-slate-100">
                <div className="flex items-center justify-between">
                  <span>Total em exibicao</span>
                  <strong className="text-2xl text-white">{snapshot.summary.total}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Aprovadas</span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-100">
                    {snapshot.summary.valid} ok
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Em revisao</span>
                  <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-100">
                    {snapshot.summary.failing} pendentes
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Media de desconto</span>
                  <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-100">
                    {snapshot.summary.avgDiscount}% OFF
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Ultima leitura:{" "}
                  {new Date(snapshot.refreshedAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">
                  {pillar.tag}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">{pillar.title}</h3>
                <p className="text-slate-300">{pillar.body}</p>
              </div>
            ))}
          </div>
        </header>

        <DealsBoard initialSnapshot={snapshot} />

        <section className="relative z-10 grid gap-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-emerald-500/10 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">Como garantimos autenticidade</p>
            <h2 className="text-2xl font-semibold text-white">Checklist de validacao</h2>
            <p className="text-slate-200">
              Cada item passa por validacao automatica e revisao manual quando necessario. Nada e publicado sem
              bater nas regras abaixo.
            </p>
            <ul className="space-y-2 text-sm text-slate-100">
              {validationChecklist.map((item) => (
                <li key={item} className="flex gap-2 rounded-xl bg-white/5 px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">Automacoes sem loop infinito</p>
            <div className="space-y-3">
              {automationSteps.map((step, index) => (
                <div key={step.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">#{index + 1}</p>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-slate-200">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-emerald-500/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">
                Proximos passos
              </p>
              <h2 className="text-2xl font-semibold text-white">Suba em producao com seguranca</h2>
              <p className="text-slate-200">
                Ligue suas fontes reais (APIs de companhias aereas, GDS, sites oficiais de cruzeiros) e mantenha a
                validacao ativa. Logs e historico evitam falsos positivos.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 text-emerald-100 transition hover:border-emerald-200 hover:text-white"
                href="https://vercel.com/new"
                target="_blank"
                rel="noreferrer"
              >
                Deploy imediato na Vercel &rarr;
              </a>
              <a
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100 transition hover:border-emerald-400/40 hover:text-white"
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noreferrer"
              >
                Ler documentacao do app &rarr;
              </a>
            </div>
          </div>
          <div className="mt-6 grid gap-3 text-sm text-slate-100 lg:grid-cols-3">
            {rollout.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">{item.tag}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-slate-200">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const validationChecklist = [
  "Fonte oficial ou agente autorizado (IATA, companhia aerea, armadora de cruzeiro)",
  "Link seguro (https) e rastreavel",
  "Preco original comparado ao preco atual",
  "Desconto real entre 45% e 90%",
  "Checagem de expiracao, disponibilidade e tarifa",
  "Registro da ultima verificacao e proxima varredura",
];

const pillars = [
  {
    tag: "Legitimidade",
    title: "Somente canais oficiais",
    body: "Companhias aereas, agencias IATA e cruzeiros com inventario validado. Nada fora desse escopo e exibido.",
  },
  {
    tag: "Conferencia",
    title: "Validacao de desconto",
    body: "Preco original capturado do fornecedor e comparado automaticamente ao preco atual.",
  },
  {
    tag: "Monitoramento",
    title: "Atualizacao controlada",
    body: "Sem intervalos infinitos: apenas quando solicitado ou em janelas configuradas.",
  },
];

const automationSteps = [
  {
    title: "Coleta segura",
    body: "Conecte APIs oficiais (GDS, companhia aerea, operadora de cruzeiro) e normalize para o modelo de oferta.",
  },
  {
    title: "Validacao obrigatoria",
    body: "Checagem de desconto real, HTTPS, origem permitida e timestamp de ultima confirmacao.",
  },
  {
    title: "Publicacao auditavel",
    body: "So publica depois de passar em todas as etapas, com log e link oficial.",
  },
];

const rollout = [
  {
    tag: "Fontes",
    title: "Fontes",
    body: "Conecte motores oficiais (APIs de cias aereas, GDS, motores de cruzeiro). Evite qualquer fonte nao oficial.",
  },
  {
    tag: "Validacao",
    title: "Validacao",
    body: "Checagem de desconto, link https, horario de expiracao e revalide a cada varredura.",
  },
  {
    tag: "Operacao",
    title: "Operacao",
    body: "Use cron jobs ou tarefas programadas para agendar varreduras e manter logs de auditoria.",
  },
];
