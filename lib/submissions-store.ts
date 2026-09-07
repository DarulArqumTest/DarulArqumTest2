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
/**
 * Which submissions are in the bin, and when they went in.
 *
 * Deliberately a separate hash rather than a flag inside each row. The log
 * is a Redis list, and editing one entry of a list means finding it by
 * index — but a registration arriving at that moment shifts every index by
 * one, and the write lands on the wrong family. Marking deletions in a hash
 * keyed by id means nothing is ever rewritten in place: deleting is one
 * HSET, restoring is one HDEL, and a form submitted mid-click is untouched.
 */
const DELETED_KEY = "darul-arqum:submissions-deleted";
/** enough to cover a season of registrations without growing forever */
const CAP = 400;
/** how long the bin holds something before it goes for good */
export const TRASH_DAYS = 30;

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
  /** when it was put in the bin; absent means it is not in the bin */
  deletedAt?: string;
};

const g = globalThis as typeof globalThis & {
  __daSubs?: { list: Submission[]; deleted: Map<string, string> };
};
const memory = (g.__daSubs ??= { list: [], deleted: new Map<string, string>() });
// an older shape may be in memory across a hot reload
memory.deleted ??= new Map<string, string>();

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

/** how long ago, in days, an ISO timestamp was */
function daysSince(iso: string): number {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return 0;
  return (Date.now() - t) / 86_400_000;
}

export async function readSubmissions(limit = 100): Promise<Submission[]> {
  if (!SUBMISSIONS_PERSISTENT) {
    // the bin empties itself here too, so development behaves like production
    for (const [id, at] of memory.deleted) {
      if (daysSince(at) >= TRASH_DAYS) {
        memory.list = memory.list.filter((s) => s.id !== id);
        memory.deleted.delete(id);
      }
    }
    return memory.list
      .slice(0, limit)
      .map((s) => ({ ...s, deletedAt: memory.deleted.get(s.id) }));
  }

  try {
    const [listBody, delBody] = await Promise.all([
      command(["LRANGE", KEY, 0, limit - 1]) as Promise<{ result?: string[] }>,
      command(["HGETALL", DELETED_KEY]) as Promise<{ result?: string[] }>,
    ]);
    if (!Array.isArray(listBody.result)) return [];

    /* HGETALL comes back flat: [field, value, field, value, …] */
    const deleted = new Map<string, string>();
    const flat = delBody.result;
    if (Array.isArray(flat)) {
      for (let i = 0; i + 1 < flat.length; i += 2) deleted.set(String(flat[i]), String(flat[i + 1]));
    }

    const rows: Submission[] = [];
    /* raw JSON is kept beside the parsed row so an expired one can be removed
       by exact value — LREM matches the string, so no index can drift */
    const expired: string[] = [];

    for (const raw of listBody.result) {
      let parsed: Submission | null = null;
      try {
        parsed = JSON.parse(raw) as Submission;
      } catch {
        continue;
      }
      if (!parsed?.id) continue;

      const deletedAt = deleted.get(parsed.id);
      if (deletedAt && daysSince(deletedAt) >= TRASH_DAYS) {
        expired.push(raw);
        continue;
      }
      rows.push(deletedAt ? { ...parsed, deletedAt } : parsed);
    }

    /**
     * The thirty days are up. Emptying the bin on read rather than on a
     * schedule means it happens without anything having to be running, and
     * a submission nobody ever looks at is not a submission anyone is
     * keeping. Failures here are ignored: not purging is a tidiness problem,
     * whereas throwing would take the whole panel down.
     */
    if (expired.length) {
      void Promise.all(
        expired.map(async (raw) => {
          try {
            const id = (JSON.parse(raw) as Submission).id;
            await command(["LREM", KEY, 1, raw]);
            await command(["HDEL", DELETED_KEY, id]);
          } catch {
            /* it will be tried again on the next read */
          }
        }),
      );
    }

    return rows;
  } catch {
    return [];
  }
}

/* ── the bin ──────────────────────────────────────────────────────── */

/** into the bin; recoverable for TRASH_DAYS */
export async function trashSubmission(id: string): Promise<boolean> {
  if (!id) return false;
  const now = new Date().toISOString();
  if (!SUBMISSIONS_PERSISTENT) {
    memory.deleted.set(id, now);
    return true;
  }
  try {
    await command(["HSET", DELETED_KEY, id, now]);
    return true;
  } catch {
    return false;
  }
}

/** back out of the bin, with its original date intact */
export async function restoreSubmission(id: string): Promise<boolean> {
  if (!id) return false;
  if (!SUBMISSIONS_PERSISTENT) return memory.deleted.delete(id);
  try {
    await command(["HDEL", DELETED_KEY, id]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gone. Not marked, not hidden — removed from the log.
 *
 * Only reachable from inside the bin, where the thing has already been
 * deleted once. Someone who opens the bin and deletes the same item again
 * is not making the same mistake twice, so this does what it says.
 *
 * LREM matches on the exact stored string, so it cannot remove the wrong
 * row no matter what has been submitted since.
 */
export async function purgeSubmission(id: string): Promise<boolean> {
  if (!id) return false;
  if (!SUBMISSIONS_PERSISTENT) {
    memory.list = memory.list.filter((s) => s.id !== id);
    memory.deleted.delete(id);
    return true;
  }
  try {
    const body = (await command(["LRANGE", KEY, 0, CAP - 1])) as { result?: string[] };
    if (!Array.isArray(body.result)) return false;
    const raw = body.result.find((row) => {
      try {
        return (JSON.parse(row) as Submission).id === id;
      } catch {
        return false;
      }
    });
    if (raw) await command(["LREM", KEY, 1, raw]);
    await command(["HDEL", DELETED_KEY, id]);
    return true;
  } catch {
    return false;
  }
}
