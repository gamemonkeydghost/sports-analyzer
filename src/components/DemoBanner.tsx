import type { DataSourceMode } from "@/lib/football/types";

export default function DemoBanner({ mode }: { mode: DataSourceMode }) {
  if (mode === "live") return null;

  return (
    <div className="mb-6 rounded-lg border border-amber-700/50 bg-amber-900/20 px-4 py-3 text-sm text-amber-200">
      Stai vedendo dati demo. Imposta la variabile d&apos;ambiente{" "}
      <code className="rounded bg-amber-950/60 px-1.5 py-0.5">FOOTBALL_DATA_API_KEY</code> (chiave
      gratuita su{" "}
      <a
        href="https://www.football-data.org/client/register"
        target="_blank"
        rel="noreferrer"
        className="underline hover:text-amber-100"
      >
        football-data.org
      </a>
      ) per collegare dati live.
    </div>
  );
}
