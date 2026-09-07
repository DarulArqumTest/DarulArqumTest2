import "server-only";
import { mergeSettings, type SiteSettings } from "@/lib/settings";

/**
 * Where the admin panel's numbers are kept.
 *
 * Vercel gives a serverless function no writable disk, so this cannot be a
 * file. It talks to a Redis-compatible REST store (Vercel KV, or Upstash
 * directly) over plain fetch, which means no extra dependency and no client
 * library to keep current.
 *
 * SETUP: add the Vercel KV / Upstash integration and the two env vars below
 * appear on their own. Until they do, the store falls back to memory: the
 * panel works end to end and you can see every screen, but a change lasts
 * only as long as the running server. It says so, loudly, in the panel.
 *
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 */

const KEY = "darul-arqum:site-settings";
const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const STORE_IS_PERSISTENT = Boolean(URL_ && TOKEN);

/**
 * The fallback store, for when no KV is connected.
 *
 * It hangs off globalThis rather than a module constant: Next bundles the
 * server-action graph and the RSC graph separately, so a plain module-level
 * object gives the action one copy and the layout another, and a save
 * appears to do nothing. Survives a request, not a deploy.
 */
const g = globalThis as typeof globalThis & { __daSettings?: { value: Partial<SiteSettings> | null } };
const memory = (g.__daSettings ??= { value: null });

export async function readSettings(): Promise<SiteSettings> {
  if (!STORE_IS_PERSISTENT) return mergeSettings(memory.value);
  try {
    const res = await fetch(`${URL_}/get/${encodeURIComponent(KEY)}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return mergeSettings(null);
    const body = (await res.json()) as { result?: string | null };
    if (!body.result) return mergeSettings(null);
    return mergeSettings(JSON.parse(body.result) as Partial<SiteSettings>);
  } catch {
    // a store that is down must never take the site down with it
    return mergeSettings(null);
  }
}

export async function writeSettings(next: SiteSettings): Promise<{ ok: boolean; persisted: boolean }> {
  const clean = mergeSettings({ ...next, updatedAt: new Date().toISOString() });
  if (!STORE_IS_PERSISTENT) {
    memory.value = clean;
    return { ok: true, persisted: false };
  }
  try {
    const res = await fetch(`${URL_}/set/${encodeURIComponent(KEY)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(clean),
      cache: "no-store",
    });
    return { ok: res.ok, persisted: res.ok };
  } catch {
    return { ok: false, persisted: false };
  }
}
