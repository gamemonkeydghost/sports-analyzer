import type { Competition, Match, StandingEntry } from "./types";

// Deterministic demo dataset used when no FOOTBALL_DATA_API_KEY is configured,
// so the dashboard is fully explorable out of the box.

export const DEMO_COMPETITIONS: Competition[] = [
  { id: 2021, name: "Premier League", code: "PL", area: "England" },
  { id: 2019, name: "Serie A", code: "SA", area: "Italy" },
  { id: 2014, name: "La Liga", code: "PD", area: "Spain" },
  { id: 2002, name: "Bundesliga", code: "BL1", area: "Germany" },
];

const TEAMS_BY_COMPETITION: Record<string, string[]> = {
  PL: ["Arsenal", "Liverpool", "Manchester City", "Chelsea", "Aston Villa", "Tottenham"],
  SA: ["Inter", "Juventus", "AC Milan", "Napoli", "AS Roma", "Atalanta"],
  PD: ["Real Madrid", "Barcelona", "Atletico Madrid", "Girona", "Real Sociedad", "Athletic Bilbao"],
  BL1: ["Bayer Leverkusen", "Bayern Munich", "VfB Stuttgart", "RB Leipzig", "Borussia Dortmund", "Eintracht Frankfurt"],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildStandings(code: string): StandingEntry[] {
  const teams = TEAMS_BY_COMPETITION[code] ?? [];
  const rand = seededRandom(code.charCodeAt(0) * 97 + code.length);
  const forms = ["W", "D", "L"];

  return teams
    .map((name, idx) => {
      const played = 20 + Math.floor(rand() * 6);
      const won = Math.floor(played * (0.3 + rand() * 0.4));
      const draw = Math.floor((played - won) * rand() * 0.35);
      const lost = Math.max(0, played - won - draw);
      const goalsFor = won * 2 + draw + Math.floor(rand() * 10);
      const goalsAgainst = lost * 2 + draw + Math.floor(rand() * 8);
      const form = Array.from({ length: 5 }, () => forms[Math.floor(rand() * 3)]).join("");

      return {
        position: idx + 1,
        team: { id: 1000 + idx, name, crest: undefined },
        playedGames: played,
        won,
        draw,
        lost,
        points: won * 3 + draw,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        form,
      } satisfies StandingEntry;
    })
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference)
    .map((entry, idx) => ({ ...entry, position: idx + 1 }));
}

function buildUpcoming(code: string): Match[] {
  const teams = TEAMS_BY_COMPETITION[code] ?? [];
  const now = Date.now();

  return teams.slice(0, 6).reduce<Match[]>((acc, name, idx) => {
    if (idx % 2 !== 0) return acc;
    const opponent = teams[idx + 1];
    if (!opponent) return acc;

    acc.push({
      id: 5000 + idx,
      utcDate: new Date(now + (idx + 1) * 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "SCHEDULED",
      matchday: 30,
      homeTeam: { id: 1000 + idx, name },
      awayTeam: { id: 1000 + idx + 1, name: opponent },
      score: { fullTime: { home: null, away: null } },
    });
    return acc;
  }, []);
}

export function getDemoStandings(code: string): StandingEntry[] {
  return buildStandings(code);
}

export function getDemoUpcoming(code: string): Match[] {
  return buildUpcoming(code);
}
