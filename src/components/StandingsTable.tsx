import type { StandingEntry } from "@/lib/football/types";

const FORM_COLORS: Record<string, string> = {
  W: "bg-emerald-600",
  D: "bg-neutral-600",
  L: "bg-red-600",
};

export default function StandingsTable({ standings }: { standings: StandingEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/60 text-left text-neutral-400">
            <th className="px-3 py-2 font-medium">#</th>
            <th className="px-3 py-2 font-medium">Squadra</th>
            <th className="px-3 py-2 text-center font-medium">PG</th>
            <th className="px-3 py-2 text-center font-medium">V</th>
            <th className="px-3 py-2 text-center font-medium">P</th>
            <th className="px-3 py-2 text-center font-medium">S</th>
            <th className="px-3 py-2 text-center font-medium">GF</th>
            <th className="px-3 py-2 text-center font-medium">GS</th>
            <th className="px-3 py-2 text-center font-medium">DR</th>
            <th className="px-3 py-2 text-center font-medium">Pt</th>
            <th className="px-3 py-2 text-center font-medium">Forma</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr key={row.team.id} className="border-b border-neutral-900 last:border-0">
              <td className="px-3 py-2 text-neutral-400">{row.position}</td>
              <td className="px-3 py-2 font-medium text-neutral-100">{row.team.name}</td>
              <td className="px-3 py-2 text-center text-neutral-400">{row.playedGames}</td>
              <td className="px-3 py-2 text-center text-neutral-400">{row.won}</td>
              <td className="px-3 py-2 text-center text-neutral-400">{row.draw}</td>
              <td className="px-3 py-2 text-center text-neutral-400">{row.lost}</td>
              <td className="px-3 py-2 text-center text-neutral-400">{row.goalsFor}</td>
              <td className="px-3 py-2 text-center text-neutral-400">{row.goalsAgainst}</td>
              <td className="px-3 py-2 text-center text-neutral-400">
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="px-3 py-2 text-center font-semibold text-neutral-100">{row.points}</td>
              <td className="px-3 py-2">
                <div className="flex justify-center gap-1">
                  {(row.form ?? "")
                    .split("")
                    .slice(0, 5)
                    .map((r, i) => (
                      <span
                        key={i}
                        className={`h-2 w-2 rounded-full ${FORM_COLORS[r] ?? "bg-neutral-700"}`}
                        title={r}
                      />
                    ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
