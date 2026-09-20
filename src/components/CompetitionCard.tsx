import Link from "next/link";
import type { Competition } from "@/lib/football/types";

export default function CompetitionCard({ competition }: { competition: Competition }) {
  return (
    <Link
      href={`/competitions/${competition.code}`}
      className="group rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-neutral-600 hover:bg-neutral-900"
    >
      <div className="text-xs uppercase tracking-wide text-neutral-500">{competition.area}</div>
      <div className="mt-1 text-lg font-semibold text-neutral-100 group-hover:text-white">
        {competition.name}
      </div>
      <div className="mt-3 text-sm text-neutral-500">Classifica, calendario e confronto squadre →</div>
    </Link>
  );
}
