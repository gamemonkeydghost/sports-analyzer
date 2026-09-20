// football-data.org's free tier caps requests at 10/minute per API token.
// This throttles outgoing calls with a buffer below that cap. It's an
// in-memory sliding window, so it only protects a single warm server
// instance — good enough for local dev / a single Vercel instance, not a
// substitute for a shared store under real multi-instance traffic.

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const MAX_SERVER_COOLDOWN_MS = 65_000;

const requestTimestamps: number[] = [];
let serverCooldownUntil = 0;

// The API also reports its own counters in response headers
// (X-Requests-Available-Minute / X-RequestCounter-Reset). When it signals
// we're nearly out of budget, honor that directly instead of waiting to hit
// a 429 — this is on top of, not instead of, the fixed local window above.
export function registerServerCooldown(resetSeconds: number): void {
  if (!Number.isFinite(resetSeconds)) return;
  const until = Date.now() + Math.min(Math.max(resetSeconds, 0) * 1000, MAX_SERVER_COOLDOWN_MS);
  if (until > serverCooldownUntil) serverCooldownUntil = until;
}

export async function throttleFootballApiRequest(): Promise<void> {
  const now = Date.now();

  if (serverCooldownUntil > now) {
    await new Promise((resolve) => setTimeout(resolve, serverCooldownUntil - now));
    return throttleFootballApiRequest();
  }

  while (requestTimestamps.length > 0 && now - requestTimestamps[0] >= WINDOW_MS) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const waitMs = WINDOW_MS - (now - requestTimestamps[0]) + 50;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return throttleFootballApiRequest();
  }

  requestTimestamps.push(Date.now());
}
