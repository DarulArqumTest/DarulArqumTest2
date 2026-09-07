import "server-only";

/**
 * Every form submission, kept.
 *
 * Until now a submission was emailed and that was the whole of it. If the
 * mail failed — a bad key, a bounce, a Workspace hiccup — the registration
 * simply did not exist anywhere. A family would have filled the form,
 * believed they were registered, and nobody would ever know.
 *
 * So it is written here first and emailed second, and the admin panel reads
 * this list. Two copies of everything, and the one that matters does not
 * depend on an email arriving.
 *
 * Same store as the settings: a Redis-compatible REST endpoint over plain
 * fetch, with a memory fallback so the whole thing works in development.
 */

const KEY = "darul-arqum:submissions";
/** enough to cover a season of registrations without growing forever */
const CAP = 400;

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
export const SUBMISSIONS_PERSISTENT = Boolean(URL_ && TOKEN);

export type Submission = {
  id: string;
  /** which form: aalim, hifz, volunteer, mailing-list, … */
  form: string;
  at: string;
  /** whether the email went out; false means this record is the only copy */
  delivered: boolean;
  fields: Record<string, string>;
};

const g = globalThis as typeof globalThis & { __daSubs?: { list: Submission[] } };
const memory = (g.__daSubs ??= { list: [] });

async function command(args: (string | number)[]): Promise<unknown> {
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`store ${res.status}`);
  return (await res.json()) as { result?: unknown };
}

export async function recordSubmission(
  form: string,
  fields: Record<string, string>,
  delivered: boolean,
): Promise<boolean> {
  const entry: Submission = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    form,
    at: new Date().toISOString(),
    delivered,
    // the honeypot and other internals are not part of what was submitted
    fields: Object.fromEntries(Object.entries(fields).filter(([k]) => !k.startsWith("_"))),
  };

  if (!SUBMISSIONS_PERSISTENT) {
    memory.list.unshift(entry);
    memory.list.length = Math.min(memory.list.length, CAP);
    return false;
  }

  try {
    await command(["LPUSH", KEY, JSON.stringify(entry)]);
    await command(["LTRIM", KEY, 0, CAP - 1]);
    return true;
  } catch {
    // a store that is down must never lose the form for the visitor; the
    // email is still the second copy
    return false;
  }
}

export async function readSubmissions(limit = 100): Promise<Submission[]> {
  if (!SUBMISSIONS_PERSISTENT) return memory.list.slice(0, limit);
  try {
    const body = (await command(["LRANGE", KEY, 0, limit - 1])) as { result?: string[] };
    if (!Array.isArray(body.result)) return [];
    return body.result
      .map((row) => {
        try {
          return JSON.parse(row) as Submission;
        } catch {
          return null;
        }
      })
      .filter((s): s is Submission => Boolean(s?.id));
  } catch {
    return [];
  }
}
