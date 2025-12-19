"use client";

import { useMemo, useState } from "react";
import type { Deal, DealSnapshot, DealsSummary } from "@/lib/deals";
import { formatCurrency, summarizeDeals } from "@/lib/deals";

type Filter = "all" | "flight" | "cruise";

interface DealsBoardProps {
  initialSnapshot: DealSnapshot;
}

export function DealsBoard({ initialSnapshot }: DealsBoardProps) {
  const [snapshot, setSnapshot] = useState<DealSnapshot>(initialSnapshot);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredDeals = useMemo(() => {
    if (filter === "all") return snapshot.deals;
    return snapshot.deals.filter((deal) => deal.type === filter);
  }, [snapshot.deals, filter]);

  const summary = useMemo<DealsSummary>(
    () => summarizeDeals(filteredDeals),
    [filteredDeals]
  );

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/deals", { cache: "no-store" });
      if (!response.ok) throw new Error("Falha ao atualizar");
      const payload: DealSnapshot = await response.json();
      setSnapshot(payload);
    } catch (err) {
      setError("Nao foi possivel atualizar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 space-y-5 rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-emerald-500/10 backdrop-blur">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.18em] text-emerald-300/80">
            Monitoramento ao vivo
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Ofertas validadas para voos e cruzeiros
          </h2>
          <p className="text-sm text-slate-300">
            Sem loops automaticos: atualizacao sob demanda, sempre a partir de fontes oficiais.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <span className="rounded-full bg-white/5 px-4 py-2">
            Ultima leitura: {formatTime(snapshot.refreshedAt)}
          </span>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/70 bg-emerald-500/10 px-4 py-2 text-emerald-100 transition hover:border-emerald-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Atualizando..." : "Atualizar agora"}
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Ofertas em exibicao" value={summary.total} />
        <StatCard label="Media de desconto" value={`${summary.avgDiscount}%`} />
        <StatCard
          label="Aprovadas"
          value={summary.valid}
          hint="Passaram por todas as checagens"
        />
        <StatCard
          label="Em revisao"
          value={summary.failing}
          hint="Bloqueadas por alguma regra"
          tone="amber"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
        <p className="text-slate-300">Filtrar:</p>
        <FilterButton label="Tudo" active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterButton
          label="Voos"
          active={filter === "flight"}
          onClick={() => setFilter("flight")}
        />
        <FilterButton
          label="Cruzeiros"
          active={filter === "cruise"}
          onClick={() => setFilter("cruise")}
        />
        <span className="ml-auto rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
          Regras: fonte oficial, https, desconto real e checagem {"<"} 6h
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {filteredDeals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-200">
            Nenhuma oferta para este filtro agora.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const statusTone =
    deal.validation.status === "valid"
      ? "text-emerald-200 bg-emerald-500/10 border-emerald-400/30"
      : "text-amber-200 bg-amber-500/10 border-amber-400/30";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-950 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-[2px] hover:border-emerald-400/30 hover:shadow-emerald-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-200">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
          {deal.type === "flight" ? "Aereo" : "Cruzeiro"}
        </span>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-200">
          {deal.sourceType.replace("-", " ")}
        </span>
        <span className={`rounded-full border px-3 py-1 text-[11px] ${statusTone}`}>
          {deal.validation.status === "valid" ? "Validado" : "Revisar"}
        </span>
      </div>

      <div className="relative mt-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">{deal.title}</h3>
          <p className="text-sm text-slate-300">{deal.route}</p>
          {deal.badge ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              {deal.badge}
            </span>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold text-emerald-200">
            {formatCurrency(deal.price, deal.currency)}
          </p>
          <p className="text-sm text-slate-400 line-through">
            {formatCurrency(deal.originalPrice, deal.currency)}
          </p>
          <span className="mt-1 inline-flex justify-end rounded-full bg-white/10 px-3 py-1 text-xs text-emerald-200">
            {deal.discount}% OFF
          </span>
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-slate-100">
        <div className="space-y-1">
          <p className="text-slate-300">Fonte verificada</p>
          <p className="font-semibold text-white">{deal.source}</p>
          {deal.notes ? <p className="text-slate-400">{deal.notes}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          {deal.expiresAt ? (
            <p className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-slate-200">
              Expira {formatTime(deal.expiresAt)}
            </p>
          ) : null}
          <p className="text-slate-300">Ultima checagem {formatTime(deal.lastCheckedAt)}</p>
          <a
            href={deal.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
          >
            Abrir oferta oficial
            <span aria-hidden>&rarr;</span>
          </a>
        </div>
      </div>

      <div className="relative mt-3 grid gap-2 text-sm text-slate-200">
        {deal.validation.checks.map((check) => (
          <div
            key={check.id}
            className={`flex items-start gap-3 rounded-xl border border-white/5 px-3 py-2 ${
              check.status === "passed"
                ? "bg-emerald-500/5 text-emerald-100"
                : check.status === "warning"
                  ? "bg-amber-500/5 text-amber-100"
                  : "bg-rose-500/5 text-rose-100"
            }`}
          >
            <span
              className={`mt-1 h-2.5 w-2.5 rounded-full ${
                check.status === "passed"
                  ? "bg-emerald-400"
                  : check.status === "warning"
                    ? "bg-amber-400"
                    : "bg-rose-400"
              }`}
              aria-hidden
            />
            <div>
              <p className="font-semibold">{check.label}</p>
              <p className="text-xs opacity-80">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone = "emerald",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "emerald" | "cyan" | "amber";
}) {
  const bg =
    tone === "emerald"
      ? "from-emerald-500/15 to-emerald-400/5"
      : tone === "cyan"
        ? "from-cyan-500/15 to-cyan-400/5"
        : "from-amber-500/15 to-amber-400/5";

  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${bg} p-4`}>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {hint ? <p className="text-sm text-slate-400">{hint}</p> : null}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 transition ${
        active
          ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100"
          : "border-white/10 bg-white/5 text-slate-200 hover:border-emerald-400/40 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
