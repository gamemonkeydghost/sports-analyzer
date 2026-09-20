import { throttleFootballApiRequest } from "./rateLimiter";
import type { Competition, Match, StandingEntry } from "./types";

const API_BASE = "https://api.football-data.org/v4";

// Competitions available on football-data.org's free tier.
const SUPPORTED_CODES = ["PL", "SA", "PD", "BL1", "FL1", "DED", "PPL", "CL"];

function apiKey() {
  return process.env.FOOTBALL_DATA_API_KEY?.trim() || null;
}

export function isLiveDataConfigured() {
  return apiKey() !== null;
}

class FootballApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "FootballApiError";
  }
}

async function apiFetch<T>(path: string, revalidateSeconds: number): Promise<T> {
  const key = apiKey();
  if (!key) throw new FootballApiError("No API key configured");

  await throttleFootballApiRequest();

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "X-Auth-Token": key },
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new FootballApiError(`football-data.org request failed: ${res.status}`, res.status);
  }

  return res.json() as Promise<T>;
}

type CompetitionsResponse = {
  competitions: Array<{
    id: number;
    name: string;
    code: string;
    area: { name: string };
    emblem?: string;
  }>;
};

export async function fetchCompetitions(): Promise<Competition[]> {
  const data = await apiFetch<CompetitionsResponse>("/competitions", 60 * 60);
  return data.competitions
    .filter((c) => SUPPORTED_CODES.includes(c.code))
    .map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      area: c.area.name,
      emblem: c.emblem,
    }));
}

type StandingsResponse = {
  standings: Array<{
    type: string;
    table: Array<{
      position: number;
      team: { id: number; name: string; shortName?: string; crest?: string };
      playedGames: number;
      won: number;
      draw: number;
      lost: number;
      points: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
      form: string | null;
    }>;
  }>;
};

export async function fetchStandings(code: string): Promise<StandingEntry[]> {
  const data = await apiFetch<StandingsResponse>(`/competitions/${code}/standings`, 60 * 15);
  const overall = data.standings.find((s) => s.type === "TOTAL") ?? data.standings[0];
  if (!overall) return [];

  return overall.table.map((row) => ({
    position: row.position,
    team: {
      id: row.team.id,
      name: row.team.name,
      shortName: row.team.shortName,
      crest: row.team.crest,
    },
    playedGames: row.playedGames,
    won: row.won,
    draw: row.draw,
    lost: row.lost,
    points: row.points,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    goalDifference: row.goalDifference,
    form: row.form,
  }));
}

type MatchesResponse = {
  matches: Array<{
    id: number;
    utcDate: string;
    status: Match["status"];
    matchday: number | null;
    homeTeam: { id: number; name: string; crest?: string };
    awayTeam: { id: number; name: string; crest?: string };
    score: { fullTime: { home: number | null; away: number | null } };
  }>;
};

export async function fetchUpcomingMatches(code: string): Promise<Match[]> {
  const data = await apiFetch<MatchesResponse>(
    `/competitions/${code}/matches?status=SCHEDULED`,
    60 * 10,
  );
  return data.matches.slice(0, 12).map((m) => ({
    id: m.id,
    utcDate: m.utcDate,
    status: m.status,
    matchday: m.matchday,
    homeTeam: m.homeTeam,
    awayTeam: m.awayTeam,
    score: m.score,
  }));
}

export async function fetchRecentForm(teamId: number, limit = 5): Promise<Match[]> {
  const data = await apiFetch<MatchesResponse>(
    `/teams/${teamId}/matches?status=FINISHED&limit=${limit}`,
    60 * 15,
  );
  return data.matches.map((m) => ({
    id: m.id,
    utcDate: m.utcDate,
    status: m.status,
    matchday: m.matchday,
    homeTeam: m.homeTeam,
    awayTeam: m.awayTeam,
    score: m.score,
  }));
}

export { FootballApiError };
