// football-data.org's free tier caps requests at 10/minute per API token.
// This throttles outgoing calls with a buffer below that cap. It's an
// in-memory sliding window, so it only protects a single warm server
// instance — good enough for local dev / a single Vercel instance, not a
// substitute for a shared store under real multi-instance traffic.

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;

const requestTimestamps: number[] = [];

export async function throttleFootballApiRequest(): Promise<void> {
  const now = Date.now();
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
