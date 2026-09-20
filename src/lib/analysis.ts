import type { StandingEntry } from "./football/types";

export type TeamAnalysis = {
  team: StandingEntry;
  pointsPerGame: number;
  goalsForPerGame: number;
  goalsAgainstPerGame: number;
  formPoints: number; // 0-15, points earned across last 5 results
};

export type MatchupAnalysis = {
  home: TeamAnalysis;
  away: TeamAnalysis;
  winProbability: { home: number; draw: number; away: number };
};

const HOME_ADVANTAGE = 0.12;

function analyzeTeam(entry: StandingEntry): TeamAnalysis {
  const played = Math.max(entry.playedGames, 1);
  const formPoints = (entry.form ?? "")
    .split("")
    .reduce((sum, r) => sum + (r === "W" ? 3 : r === "D" ? 1 : 0), 0);

  return {
    team: entry,
    pointsPerGame: entry.points / played,
    goalsForPerGame: entry.goalsFor / played,
    goalsAgainstPerGame: entry.goalsAgainst / played,
    formPoints,
  };
}

/**
 * Simple heuristic win-probability model (not a statistical/ML prediction):
 * blends season points-per-game with recent form, applies a fixed home-advantage
 * bump, then normalizes into a 3-way distribution. Useful as a quick directional
 * read, not a betting signal.
 */
export function analyzeMatchup(homeEntry: StandingEntry, awayEntry: StandingEntry): MatchupAnalysis {
  const home = analyzeTeam(homeEntry);
  const away = analyzeTeam(awayEntry);

  const homeStrength = home.pointsPerGame * 0.7 + (home.formPoints / 15) * 0.3 + HOME_ADVANTAGE;
  const awayStrength = away.pointsPerGame * 0.7 + (away.formPoints / 15) * 0.3;

  const diff = homeStrength - awayStrength;
  // Logistic-ish squashing so a small strength gap doesn't produce near-certain outcomes.
  const homeWinRaw = 1 / (1 + Math.exp(-diff * 3));
  const drawRaw = 0.28 - Math.abs(diff) * 0.15;
  const drawShare = Math.max(0.12, Math.min(0.32, drawRaw));

  const homeShare = homeWinRaw * (1 - drawShare);
  const awayShare = (1 - homeWinRaw) * (1 - drawShare);

  return {
    home,
    away,
    winProbability: {
      home: round1(homeShare * 100),
      draw: round1(drawShare * 100),
      away: round1(awayShare * 100),
    },
  };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
