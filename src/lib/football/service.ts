import { fetchCompetitions, fetchStandings, fetchUpcomingMatches, isLiveDataConfigured } from "./client";
import { DEMO_COMPETITIONS, getDemoStandings, getDemoUpcoming } from "./mock";
import type { Competition, CompetitionDetail, DataSourceMode, Match, StandingEntry } from "./types";

export function getDataSourceMode(): DataSourceMode {
  return isLiveDataConfigured() ? "live" : "demo";
}

export async function getCompetitions(): Promise<Competition[]> {
  if (!isLiveDataConfigured()) return DEMO_COMPETITIONS;

  try {
    const live = await fetchCompetitions();
    return live.length > 0 ? live : DEMO_COMPETITIONS;
  } catch {
    return DEMO_COMPETITIONS;
  }
}

export async function getStandings(code: string): Promise<StandingEntry[]> {
  if (!isLiveDataConfigured()) return getDemoStandings(code);

  try {
    return await fetchStandings(code);
  } catch {
    return getDemoStandings(code);
  }
}

export async function getUpcomingMatches(code: string): Promise<Match[]> {
  if (!isLiveDataConfigured()) return getDemoUpcoming(code);

  try {
    return await fetchUpcomingMatches(code);
  } catch {
    return getDemoUpcoming(code);
  }
}

export async function getCompetitionDetail(code: string): Promise<CompetitionDetail | null> {
  const competitions = await getCompetitions();
  const competition = competitions.find((c) => c.code === code);
  if (!competition) return null;

  const [standings, upcoming] = await Promise.all([getStandings(code), getUpcomingMatches(code)]);

  return { competition, standings, upcoming };
}
