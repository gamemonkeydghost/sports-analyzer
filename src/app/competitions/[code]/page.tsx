import Link from "next/link";
import { notFound } from "next/navigation";
import DemoBanner from "@/components/DemoBanner";
import MatchList from "@/components/MatchList";
import MatchupAnalyzer from "@/components/MatchupAnalyzer";
import StandingsTable from "@/components/StandingsTable";
import { getCompetitionDetail, getDataSourceMode } from "@/lib/football/service";

export default async function CompetitionPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const detail = await getCompetitionDetail(code.toUpperCase());
  const mode = getDataSourceMode();

  if (!detail) notFound();

  return (
    <div>
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-300">
        ← Tutti i campionati
      </Link>

      <div className="mt-2 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">{detail.competition.name}</h1>
        <p className="mt-1 text-neutral-500">{detail.competition.area}</p>
      </div>

      <DemoBanner mode={mode} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-neutral-100">Classifica</h2>
          <StandingsTable standings={detail.standings} />
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-neutral-100">Prossime partite</h2>
          <MatchList matches={detail.upcoming} />
        </section>
      </div>

      <section className="mt-8">
        <MatchupAnalyzer standings={detail.standings} />
      </section>
    </div>
  );
}
