import "server-only";
import crypto from "node:crypto";

/**
 * The mailing list.
 *
 * Signups already land in the submissions log, but that log is an audit
 * trail: it is capped, it mixes every form together, and it is the thing you
 * clear out when it fills with test rows. A mailing list cannot live there.
 * Clearing the log would silently delete the congregation.
 *
 * So the list is its own store, and a signup writes to both: the log records
 * that a form was submitted, this records that a person wants the newsletter.
 * A Redis hash rather than a list, because the field is the address and that
 * makes signing up twice a no-op instead of two copies of one person.
 *
 * ── Unsubscribing ────────────────────────────────────────────────────────
 *
 * Canada's anti-spam law is not lenient and this is a registered charity, so
 * every message carries a working unsubscribe link and the masjid's postal
 * address. The link is signed rather than stored: the token is an HMAC of the
 * address, which means it cannot be guessed for somebody else's email, it
 * never expires, and there is no table of tokens to keep in step with the
 * list. Removing a subscriber is one HDEL.
 */

const KEY = "darul-arqum:subscribers";

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
export const SUBSCRIBERS_PERSISTENT = Boolean(URL_ && TOKEN);

export type Subscriber = { email: string; name: string; at: string };

const g = globalThis as typeof globalThis & { __daSubscribers?: Map<string, Subscriber> };
const memory = (g.__daSubscribers ??= new Map<string, Subscriber>());

async function command(args: (string | number)[]): Promise<{ result?: unknown }> {
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`store ${res.status}`);
  return (await res.json()) as { result?: unknown };
}

/** lowercased and trimmed, so one person is one row however they typed it */
export function normalizeEmail(raw: string): string {
  return String(raw ?? "").trim().toLowerCase();
}

/** deliberately loose — the job here is to reject nonsense, not to adjudicate */
export function looksLikeEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export async function addSubscriber(rawEmail: string, name = ""): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  if (!looksLikeEmail(email)) return false;
  const entry: Subscriber = { email, name: String(name ?? "").trim().slice(0, 120), at: new Date().toISOString() };

  if (!SUBSCRIBERS_PERSISTENT) {
    // keep the original signup date if they are already on the list
    if (!memory.has(email)) memory.set(email, entry);
    return true;
  }
  try {
    // HSETNX, so signing up again does not reset the date they joined
    await command(["HSETNX", KEY, email, JSON.stringify(entry)]);
    return true;
  } catch {
    return false;
  }
}

export async function removeSubscriber(rawEmail: string): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  if (!email) return false;
  if (!SUBSCRIBERS_PERSISTENT) return memory.delete(email);
  try {
    await command(["HDEL", KEY, email]);
    return true;
  } catch {
    return false;
  }
}

export async function listSubscribers(): Promise<Subscriber[]> {
  if (!SUBSCRIBERS_PERSISTENT) return [...memory.values()];
  try {
    const body = await command(["HGETALL", KEY]);
    const flat = body.result;
    if (!Array.isArray(flat)) return [];
    const out: Subscriber[] = [];
    // HGETALL comes back as [field, value, field, value, …]
    for (let i = 0; i + 1 < flat.length; i += 2) {
      const email = String(flat[i]);
      try {
        const parsed = JSON.parse(String(flat[i + 1])) as Subscriber;
        out.push({ email, name: parsed.name ?? "", at: parsed.at ?? "" });
      } catch {
        out.push({ email, name: "", at: "" });
      }
    }
    return out.sort((a, b) => (a.at < b.at ? 1 : -1));
  } catch {
    return [];
  }
}

export async function countSubscribers(): Promise<number> {
  if (!SUBSCRIBERS_PERSISTENT) return memory.size;
  try {
    const body = await command(["HLEN", KEY]);
    return typeof body.result === "number" ? body.result : 0;
  } catch {
    return 0;
  }
}

/* ── the signed unsubscribe link ─────────────────────────────────── */

function secret() {
  return process.env.ADMIN_SECRET ?? "";
}

export function unsubscribeToken(rawEmail: string): string {
  return crypto
    .createHmac("sha256", secret())
    .update(`unsub:${normalizeEmail(rawEmail)}`)
    .digest("base64url");
}

export function checkUnsubscribeToken(rawEmail: string, token: string): boolean {
  if (!secret() || !token) return false;
  const expected = unsubscribeToken(rawEmail);
  const a = Buffer.from(expected);
  const b = Buffer.from(String(token));
  if (a.length !== b.length) {
    crypto.timingSafeEqual(a, a);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export function unsubscribeUrl(siteUrl: string, rawEmail: string): string {
  const email = normalizeEmail(rawEmail);
  const q = new URLSearchParams({ e: email, t: unsubscribeToken(email) });
  return `${siteUrl.replace(/\/$/, "")}/unsubscribe?${q.toString()}`;
}
