# darularqum.org — DNS as it stood before the Vercel cutover

Captured 2026-09-06, from Wix → Account → Domains → darularqum.org →
Manage DNS records. Everything here is what the zone looked like while the
old Wix site was live. If the new site has to be pulled and the Wix one put
back, restore the two rows marked CHANGED and nothing else.

Nameservers are `ns14.wixdns.net` / `ns15.wixdns.net` and are **not
editable** — the zone can only be edited from inside Wix, which is why the
mail records below cannot be disturbed from anywhere else.

## A (Host) — CHANGED

| Host | Value | TTL |
|---|---|---|
| darularqum.org | 185.230.63.171 | 1 Hour |
| darularqum.org | 185.230.63.186 | 1 Hour |
| darularqum.org | 185.230.63.107 | 1 Hour |

Replaced with a single row pointing at Vercel: `216.198.79.1`.

## CNAME (Aliases) — one row CHANGED

| Host | Value | TTL | |
|---|---|---|---|
| _dmarc.darularqum.org | _dmarc.wixemails.com | 1 Hour | untouched |
| s1._domainkey.darularqum.org | s1._domainkey.darularqum.… | 1 Hour | untouched |
| s2._domainkey.darularqum.org | s2._domainkey.darularqum.… | 1 Hour | untouched |
| sel1._domainkey.darularqum.org | sel1._domainkey.darularqu… | 1 Hour | untouched |
| sel2._domainkey.darularqum.org | sel2._domainkey.darularqu… | 1 Hour | untouched |
| sg.darularqum.org | sg.darularqum.org.s007.as… | 1 Hour | untouched |
| **www.darularqum.org** | **cdn1.wixdns.net** | 1 Hour | **CHANGED** |

`www` replaced with the Vercel target: `35dc1620fd47a348.vercel-dns-017.com`.

## TXT — one row ADDED after the cutover

| Host | Value | TTL | |
|---|---|---|---|
| darularqum.org | google-site-verification=sz… | 1 Hour | untouched |
| **darularqum.org** | **v=spf1 include:_spf.google.com include:_spf.wix.com ~all** | 1 Hour | **ADDED** |

The domain had **no SPF record at all** — twenty Workspace mailboxes had been
sending without one for years, which is why so much of this domain's mail
lands in spam. Added 2026-09-07.

Both senders are named on purpose. Google is the mailboxes and the website's
forms. Wix is there because `sg`, `s1._domainkey` and `s2._domainkey` all
resolve to `s007.ascendbywix.com`, and `sel1`/`sel2._domainkey` to
`ascendbywix.com` — Ascend by Wix, Wix's own marketing mail. It may or may not
still be used, but naming it costs four DNS lookups (five in total, against a
limit of ten) and stops a forgotten campaign from failing.

It ends in `~all`, a softfail: a sender nobody remembered gets marked, not
rejected. Do not tighten that to `-all` until someone has actually read a few
weeks of DMARC reports and knows every sender.

### DKIM — ADDED 2026-09-07

| Host | Value | TTL |
|---|---|---|
| google._domainkey | `v=DKIM1; k=rsa; p=MIIBIjANBgkq…QIDAQAB` (2048-bit) | 1 Hour |

Generated in Google Admin → Apps → Gmail → Authenticate email, selector
`google`, then switched on with **Start authentication**. Admin now reports
*"Authenticating email with DKIM."*

This is the **public** half of the pair and belongs in public DNS. The private
half never leaves Google. If it is ever regenerated in Admin, this record has
to be replaced at the same time or outbound mail starts failing DKIM.

### DMARC — REPLACED 2026-09-07

Was a CNAME:

| Host | Value |
|---|---|
| _dmarc.darularqum.org | _dmarc.wixemails.com |

which resolved to `v=DMARC1; p=none; rua=mailto:dmarc_agg@vali.email` — Wix's
shared record. Reports went to Wix's aggregator, so nobody at the masjid could
see who was sending as this domain, and the policy lived on infrastructure the
masjid does not control.

Now a TXT record of the masjid's own:

| Host | Value | TTL |
|---|---|---|
| _dmarc | `v=DMARC1; p=none; rua=mailto:admin@darularqum.org` | 1 Hour |

`p=none` is deliberate and identical in effect to what Wix's record did: it
enforces nothing, so no mail can start failing because of this change. The only
difference is that the daily reports now arrive at admin@ instead of at Wix.

**Tightening to `p=quarantine` is a later decision, and it must be made from
the reports, not from confidence.** Read several weeks of them first. If a
sender nobody remembered — an old Ascend campaign, a form on some other
service — is still sending as this domain, enforcing will silently drop its
mail. This is a charity that solicits donations; the reason to eventually
enforce is that a spoofed "our banking details have changed" message to the
donor list is a realistic attack, and DMARC is the defence against it.

To revert to Wix's: delete this TXT and recreate the CNAME above.

## SRV — none

## MX (Mail Exchange) — untouched, and not editable from this screen

| Host | Points to | Priority | TTL |
|---|---|---|---|
| darularqum.org | aspmx.l.google.com | 10 | 1 Hour |
| darularqum.org | alt1.aspmx.l.google.com | 20 | 1 Hour |
| darularqum.org | alt2.aspmx.l.google.com | 30 | 1 Hour |
| darularqum.org | alt3.aspmx.l.google.com | 40 | 1 Hour |
| darularqum.org | alt4.aspmx.l.google.com | 50 | 1 Hour |

Wix shows these read-only, behind a separate "Edit MX Records" screen. The
A and CNAME edits cannot reach them. This is the masjid's mail — twenty
active mailboxes — and it must keep flowing through the cutover.
