import "server-only";
import crypto from "node:crypto";

/**
 * Who is allowed to change the masjid's numbers.
 *
 * The password is never in this repository and never reaches the browser. It
 * lives in an environment variable, the comparison happens inside a server
 * action, and what comes back is a signed httpOnly cookie the client cannot
 * read or forge. A password checked in the browser is not a password — it is
 * a note taped to the door — and this panel can change the prayer times a
 * congregation turns up for.
 *
 * SETUP: two environment variables in Vercel.
 *
 *   ADMIN_PASSWORD   what the organisers type
 *   ADMIN_SECRET     any long random string, used to sign the session
 *
 * With neither set, the panel refuses every login rather than falling open.
 */

const COOKIE = "da_admin";
/** eight hours: long enough for an evening's work, short enough to expire */
const TTL_SECONDS = 8 * 60 * 60;

function secret() {
  return process.env.ADMIN_SECRET ?? "";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** constant time, so a wrong password cannot be narrowed down by timing */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // still compare something, so length alone is not a signal
    crypto.timingSafeEqual(ab, ab);
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

export function isConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!isConfigured()) return false;
  return safeEqual(input, expected);
}

export function createSession() {
  const expires = Date.now() + TTL_SECONDS * 1000;
  const payload = String(expires);
  return { name: COOKIE, value: `${payload}.${sign(payload)}`, maxAge: TTL_SECONDS };
}

export function readSession(raw: string | undefined) {
  if (!raw || !isConfigured()) return false;
  const [payload, mac] = raw.split(".");
  if (!payload || !mac) return false;
  const expected = sign(payload);
  if (!safeEqual(mac, expected)) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

export const ADMIN_COOKIE = COOKIE;
