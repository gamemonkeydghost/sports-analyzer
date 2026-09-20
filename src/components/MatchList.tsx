import type { Match } from "@/lib/football/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MatchList({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return <p className="text-sm text-neutral-500">Nessuna partita in programma.</p>;
  }

  return (
    <ul className="divide-y divide-neutral-900 rounded-xl border border-neutral-800">
      {matches.map((match) => (
        <li key={match.id} className="flex items-center justify-between px-4 py-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-medium text-neutral-100">{match.homeTeam.name}</span>
            <span className="text-neutral-600">vs</span>
            <span className="font-medium text-neutral-100">{match.awayTeam.name}</span>
          </div>
          <span className="text-neutral-500">{formatDate(match.utcDate)}</span>
        </li>
      ))}
    </ul>
  );
}
