"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, checkPassword, createSession, isConfigured, readSession } from "@/lib/admin-auth";
import { readSettings, writeSettings, STORE_IS_PERSISTENT } from "@/lib/settings-store";
import { mergeSettings, type SiteSettings } from "@/lib/settings";

/**
 * Everything the admin panel is allowed to do, and nothing else.
 *
 * Each action re-checks the session itself. A server action is a public
 * endpoint — anyone who knows its id can call it — so "the UI only shows
 * this to signed-in people" is not a check.
 */

async function signedIn() {
  return readSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function adminStatus() {
  return {
    signedIn: await signedIn(),
    configured: isConfigured(),
    persistent: STORE_IS_PERSISTENT,
  };
}

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) {
    return {
      ok: false,
      error: "No password is set for this site yet. Add ADMIN_PASSWORD and ADMIN_SECRET in Vercel.",
    };
  }
  // a small delay on every attempt, so the endpoint is not worth grinding at
  await new Promise((r) => setTimeout(r, 400));
  if (!checkPassword(password)) return { ok: false, error: "That password is not right." };

  const s = createSession();
  (await cookies()).set(s.name, s.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: s.maxAge,
  });
  return { ok: true };
}

export async function adminLogout() {
  (await cookies()).delete(ADMIN_COOKIE);
  return { ok: true };
}

export async function loadSettings(): Promise<SiteSettings> {
  return readSettings();
}

export async function saveSettings(next: SiteSettings): Promise<{ ok: boolean; persisted: boolean; error?: string }> {
  if (!(await signedIn())) return { ok: false, persisted: false, error: "Not signed in." };

  const clean = mergeSettings(next);
  const res = await writeSettings(clean);
  if (!res.ok) return { ok: false, persisted: false, error: "Could not save. Try again." };

  // every page that shows one of these numbers
  for (const p of ["/", "/give", "/give/pledge", "/story", "/prayer-times"]) revalidatePath(p);

  return { ok: true, persisted: res.persisted };
}
