import { NextResponse } from "next/server";
import { checkUnsubscribeToken, removeSubscriber } from "@/lib/subscribers";

/**
 * The endpoint named in the List-Unsubscribe header.
 *
 * POST removes the address. That is the RFC 8058 one-click flow: Gmail and
 * Outlook show their own "Unsubscribe" button beside the sender and POST here
 * when it is pressed, which is why the header is paired with
 * List-Unsubscribe-Post.
 *
 * GET does not remove anything — it sends the reader to the confirm page.
 * Spam filters, link checkers and mail previewers all fetch the links in a
 * message before a human sees it, and a GET that unsubscribes would quietly
 * empty the list on the first send. The two verbs doing different things here
 * is the whole point.
 */

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("e") ?? "";
  const token = searchParams.get("t") ?? "";

  if (!email || !checkUnsubscribeToken(email, token)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await removeSubscriber(email);
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { search } = new URL(req.url);
  return NextResponse.redirect(new URL(`/unsubscribe${search}`, req.url));
}
