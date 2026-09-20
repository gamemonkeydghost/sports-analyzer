import CompetitionCard from "@/components/CompetitionCard";
import DemoBanner from "@/components/DemoBanner";
import { getCompetitions, getDataSourceMode } from "@/lib/football/service";

export default async function Home() {
  const [competitions, mode] = await Promise.all([getCompetitions(), Promise.resolve(getDataSourceMode())]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-100">Dashboard campionati</h1>
        <p className="mt-1 text-neutral-500">
          Classifiche, calendario e confronto squadre per i principali campionati europei.
        </p>
      </div>

      <DemoBanner mode={mode} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {competitions.map((competition) => (
          <CompetitionCard key={competition.code} competition={competition} />
        ))}
      </div>
    </div>
  );
}
