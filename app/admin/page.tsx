import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminPage } from "@/components/sections/admin-page";
import { readSettings, STORE_IS_PERSISTENT } from "@/lib/settings-store";
import { ADMIN_COOKIE, isConfigured, readSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Administration",
  // never in search results, never in the sitemap
  robots: { index: false, follow: false, nocache: true },
};

/** the session is per request, so this page can never be cached */
export const dynamic = "force-dynamic";

export default async function AdminRoute() {
  const signedIn = readSession((await cookies()).get(ADMIN_COOKIE)?.value);
  // the settings are only handed to the client once past the door
  const settings = await readSettings();

  return (
    <main>
      <AdminPage
        initial={settings}
        signedIn={signedIn}
        configured={isConfigured()}
        persistent={STORE_IS_PERSISTENT}
      />
    </main>
  );
}
