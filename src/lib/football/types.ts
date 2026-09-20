export type Team = {
  id: number;
  name: string;
  shortName?: string;
  crest?: string;
};

export type Competition = {
  id: number;
  name: string;
  code: string;
  area: string;
  emblem?: string;
};

export type StandingEntry = {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: string | null;
};

export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED";

export type Match = {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    fullTime: { home: number | null; away: number | null };
  };
};

export type CompetitionDetail = {
  competition: Competition;
  standings: StandingEntry[];
  upcoming: Match[];
};

export type DataSourceMode = "live" | "demo";
