import "server-only";
import githubSnapshot from "@/data/github.json";
import leetcodeSnapshot from "@/data/leetcode.json";
import deepmlSnapshot from "@/data/deepml.json";

export type Day = { date: string; count: number; level: number };
export type Stat = { label: string; value: number; suffix?: string };
export type ContributionSet = {
  key: "github" | "leetcode" | "deepml";
  label: string;
  href: string;
  days: Day[];
  total: number;
  totalLabel: string;
  stats: Stat[];
  live: boolean;
  note?: string;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Build a full trailing-year range so every calendar has the same width. */
function fillYear(counts: Map<string, number>, end = new Date()): Day[] {
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364);
  const values = [...counts.values()].filter((v) => v > 0).sort((a, b) => a - b);
  const q = (p: number) => values[Math.min(values.length - 1, Math.floor(p * values.length))] ?? 1;
  const [t1, t2, t3] = [q(0.25), q(0.5), q(0.8)];
  const days: Day[] = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const key = iso(d);
    const count = counts.get(key) ?? 0;
    const level = count === 0 ? 0 : count <= t1 ? 1 : count <= t2 ? 2 : count <= t3 ? 3 : 4;
    days.push({ date: key, count, level });
  }
  return days;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return (await res.json()) as T;
}

type GithubPayload = { total: { lastYear: number }; contributions: Day[] };

async function github(): Promise<ContributionSet> {
  let data = githubSnapshot as GithubPayload;
  let live = false;
  try {
    data = await fetchJson<GithubPayload>("https://github-contributions-api.jogruber.de/v4/drizzy765?y=last");
    live = true;
  } catch {}
  const counts = new Map(data.contributions.map((c) => [c.date, c.count]));
  const days = fillYear(counts);
  const active = days.filter((d) => d.count > 0).length;
  const best = Math.max(...days.map((d) => d.count));
  return {
    key: "github",
    label: "GitHub",
    href: "https://github.com/drizzy765",
    days,
    total: data.total.lastYear,
    totalLabel: "contributions in the last year",
    stats: [
      { label: "Contributions", value: data.total.lastYear },
      { label: "Active days", value: active },
      { label: "Best day", value: best },
      { label: "Longest streak", value: longestStreak(days), suffix: "d" },
    ],
    live,
  };
}

type LeetPayload = typeof leetcodeSnapshot;
const LEET_QUERY = `query($u:String!){matchedUser(username:$u){username submitStats{acSubmissionNum{difficulty count}} userCalendar{activeYears streak totalActiveDays submissionCalendar}}}`;

async function leetcode(): Promise<ContributionSet> {
  let data = leetcodeSnapshot as LeetPayload;
  let live = false;
  try {
    const fresh = await fetchJson<LeetPayload>("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", referer: "https://leetcode.com", "user-agent": "Mozilla/5.0" },
      body: JSON.stringify({ query: LEET_QUERY, variables: { u: "drizzy765" } }),
    });
    if (fresh?.data?.matchedUser?.userCalendar) {
      data = { ...data, data: { ...data.data, matchedUser: { ...data.data.matchedUser, ...fresh.data.matchedUser } } };
      live = true;
    }
  } catch {}
  const u = data.data.matchedUser;
  const cal = JSON.parse(u.userCalendar.submissionCalendar) as Record<string, number>;
  const counts = new Map<string, number>();
  for (const [ts, n] of Object.entries(cal)) {
    const k = iso(new Date(Number(ts) * 1000));
    counts.set(k, (counts.get(k) ?? 0) + n);
  }
  const ac = Object.fromEntries(u.submitStats.acSubmissionNum.map((s) => [s.difficulty, s.count]));
  const days = fillYear(counts);
  return {
    key: "leetcode",
    label: "LeetCode",
    href: "https://leetcode.com/u/drizzy765/",
    days,
    total: days.reduce((a, d) => a + d.count, 0),
    totalLabel: "submissions in the last year",
    stats: [
      { label: "Solved", value: ac.All ?? 0 },
      { label: "Easy", value: ac.Easy ?? 0 },
      { label: "Medium", value: ac.Medium ?? 0 },
      { label: "Hard", value: ac.Hard ?? 0 },
    ],
    live,
  };
}

type DeepPayload = { items: Record<string, { first_solved_at: string; difficulty: string; category: string }> };

async function deepml(): Promise<ContributionSet> {
  let data = deepmlSnapshot as DeepPayload;
  let live = false;
  try {
    data = await fetchJson<DeepPayload>("https://raw.githubusercontent.com/drizzy765/deep-ml/main/progress.json");
    live = true;
  } catch {}
  const items = Object.values(data.items ?? {});
  const counts = new Map<string, number>();
  for (const it of items) {
    const k = it.first_solved_at.slice(0, 10);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const by = (d: string) => items.filter((i) => i.difficulty?.toLowerCase() === d).length;
  const days = fillYear(counts);
  return {
    key: "deepml",
    label: "Deep-ML",
    href: "https://www.deep-ml.com/profile/drizzy765",
    days,
    total: items.length,
    totalLabel: "problems solved",
    stats: [
      { label: "Solved", value: items.length },
      { label: "Easy", value: by("easy") },
      { label: "Medium", value: by("medium") },
      { label: "Hard", value: by("hard") },
    ],
    live,
    note: "Synced from drizzy765/deep-ml. Just getting started.",
  };
}

function longestStreak(days: Day[]) {
  let best = 0,
    cur = 0;
  for (const d of days) {
    cur = d.count > 0 ? cur + 1 : 0;
    best = Math.max(best, cur);
  }
  return best;
}

/** Fetched at build time (fetch revalidates hourly); falls back to bundled snapshots. */
export async function getContributions(): Promise<ContributionSet[]> {
  return Promise.all([github(), leetcode(), deepml()]);
}
