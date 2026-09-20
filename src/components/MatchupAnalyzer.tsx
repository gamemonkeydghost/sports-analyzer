"use client";

import { useMemo, useState } from "react";
import { analyzeMatchup } from "@/lib/analysis";
import type { StandingEntry } from "@/lib/football/types";

export default function MatchupAnalyzer({ standings }: { standings: StandingEntry[] }) {
  const [homeId, setHomeId] = useState<number | undefined>(standings[0]?.team.id);
  const [awayId, setAwayId] = useState<number | undefined>(standings[1]?.team.id);

  const analysis = useMemo(() => {
    const home = standings.find((s) => s.team.id === homeId);
    const away = standings.find((s) => s.team.id === awayId);
    if (!home || !away || home.team.id === away.team.id) return null;
    return analyzeMatchup(home, away);
  }, [standings, homeId, awayId]);

  if (standings.length < 2) return null;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
      <h2 className="text-lg font-semibold text-neutral-100">Confronto squadre</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Stima euristica basata su punti per partita e forma recente. Non è una predizione statistica.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TeamSelect label="Casa" standings={standings} value={homeId} onChange={setHomeId} />
        <TeamSelect label="Trasferta" standings={standings} value={awayId} onChange={setAwayId} />
      </div>

      {analysis && (
        <div className="mt-6 space-y-4">
          <ProbabilityBar
            homeLabel={analysis.home.team.team.name}
            awayLabel={analysis.away.team.team.name}
            probability={analysis.winProbability}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatsCard title={analysis.home.team.team.name} stats={analysis.home} />
            <StatsCard title={analysis.away.team.team.name} stats={analysis.away} />
          </div>
        </div>
      )}

      {!analysis && (
        <p className="mt-4 text-sm text-neutral-500">Seleziona due squadre diverse per vedere l&apos;analisi.</p>
      )}
    </div>
  );
}

function TeamSelect({
  label,
  standings,
  value,
  onChange,
}: {
  label: string;
  standings: StandingEntry[];
  value: number | undefined;
  onChange: (id: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="text-neutral-400">{label}</span>
      <select
        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 outline-none focus:border-neutral-500"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {standings.map((s) => (
          <option key={s.team.id} value={s.team.id}>
            {s.team.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProbabilityBar({
  homeLabel,
  awayLabel,
  probability,
}: {
  homeLabel: string;
  awayLabel: string;
  probability: { home: number; draw: number; away: number };
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-neutral-400">
        <span>
          {homeLabel} <span className="text-neutral-100 font-semibold">{probability.home}%</span>
        </span>
        <span>
          Pareggio <span className="text-neutral-100 font-semibold">{probability.draw}%</span>
        </span>
        <span>
          {awayLabel} <span className="text-neutral-100 font-semibold">{probability.away}%</span>
        </span>
      </div>
      <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-neutral-800">
        <div className="bg-emerald-500" style={{ width: `${probability.home}%` }} />
        <div className="bg-neutral-500" style={{ width: `${probability.draw}%` }} />
        <div className="bg-sky-500" style={{ width: `${probability.away}%` }} />
      </div>
    </div>
  );
}

function StatsCard({
  title,
  stats,
}: {
  title: string;
  stats: ReturnType<typeof analyzeMatchup>["home"];
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
      <div className="font-medium text-neutral-100">{title}</div>
      <dl className="mt-2 space-y-1 text-sm text-neutral-400">
        <Row label="Punti/partita" value={stats.pointsPerGame.toFixed(2)} />
        <Row label="Gol fatti/partita" value={stats.goalsForPerGame.toFixed(2)} />
        <Row label="Gol subiti/partita" value={stats.goalsAgainstPerGame.toFixed(2)} />
        <Row label="Forma (ultime 5)" value={`${stats.formPoints}/15 pt`} />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="text-neutral-200">{value}</dd>
    </div>
  );
}
