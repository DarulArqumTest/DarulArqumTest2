"use client";

/**
 * The band for the day something is wrong.
 *
 * Snow, a burst pipe, a jamaat that is not happening. It sits above the
 * navbar on every page, pinned, because someone who opens the site on that
 * day is opening it for this and nothing else.
 *
 * Three decisions worth keeping:
 *
 *   It pins rather than scrolls. Everything else on this site gets out of the
 *   way; this does not, until it is dismissed. A closure read halfway down a
 *   programs page is a closure that was missed.
 *
 *   It is dismissible, and the dismissal is keyed to the words. Change the
 *   notice and it comes back for everyone who had already waved the last one
 *   away — otherwise the second announcement of a bad week is invisible to
 *   exactly the people who were paying attention to the first.
 *
 *   It is not green. The palette here comes from the subject, and the subject
 *   is a door that is shut. Amber for a change of plan, red for the masjid
 *   being closed.
 *
 * The height is published as `--da-notice-h` so the navbar — fixed on the
 * home page, sticky everywhere else — can sit underneath it instead of
 * being covered by it.
 */

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSettings } from "@/components/site/settings-provider";
import { noticeIsLive, todayInZone, type NoticeSettings } from "@/lib/settings";

/** dismissals are per-wording, so a new notice is never pre-dismissed */
function keyFor(n: NoticeSettings) {
  // every field, so correcting a time or fixing a link brings the band back
  // for people who had already waved the previous wording away
  const raw = `${n.tone}|${n.title}|${n.detail}|${n.href}|${n.linkLabel}|${n.until}`;
  // djb2 — short, stable, and it never leaves the browser
  let h = 5381;
  for (let i = 0; i < raw.length; i++) h = ((h << 5) + h + raw.charCodeAt(i)) | 0;
  return `da-notice-${(h >>> 0).toString(36)}`;
}

/**
 * A notice taped to the masjid door.
 *
 * The arch is the same shape as the one on the minbar in the Jumu'ah band, so
 * the two read as coming from the same hand. The paper hangs slightly askew
 * because a straight one looks like an icon and a crooked one looks like
 * somebody put it there this morning.
 */
/**
 * Good news: a minbar, catching its first light.
 *
 * The band's other two drawings are a door with a notice taped to it —
 * right for a closure, wrong for announcing a first Jumu'ah. This is the
 * same minbar that stands in the Friday band, so the two read as the same
 * hand and the same subject, with light rising behind it for the thing
 * that has not happened before.
 */
function NoticeMinbar() {
  const ink = "#e3c56a";
  return (
    <svg className="da-cn-art" viewBox="0 0 72 72" aria-hidden focusable="false">
      {/* the light behind it */}
      <circle cx="36" cy="40" r="24" fill={ink} fillOpacity="0.12" />
      <circle cx="36" cy="40" r="15" fill={ink} fillOpacity="0.14" />
      {/* the arch it stands in */}
      <path
        d="M17 62V36a19 19 0 0 1 38 0v26Z"
        fill="none"
        stroke={ink}
        strokeOpacity="0.34"
        strokeWidth="1.4"
      />
      {/* three steps */}
      <path d="M23 62V53h10v9Z" fill={ink} fillOpacity="0.5" />
      <path d="M33 62V45h10v17Z" fill={ink} fillOpacity="0.68" />
      <path d="M43 62V37h10v25Z" fill={ink} fillOpacity="0.85" />
      {/* the rail up the steps */}
      <path d="M23 53 L53 32" stroke={ink} strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* the canopy over the top step */}
      <path d="M42 37V26h12v11Z" fill="#12482f" stroke={ink} strokeOpacity="0.6" strokeWidth="1" />
      <path d="M40 26h16l-8-8Z" fill={ink} />
      {/* the floor */}
      <path d="M13 62h46" stroke="#f6f3ea" strokeOpacity="0.26" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function NoticeDoor({ tone }: { tone: NoticeSettings["tone"] }) {
  if (tone === "good") return <NoticeMinbar />;
  const ink = tone === "urgent" ? "#ef6b6b" : "#f0c14b";
  return (
    <svg className="da-cn-art" viewBox="0 0 72 72" aria-hidden focusable="false">
      {/* the doorway */}
      <path d="M14 64V30a22 22 0 0 1 44 0v34Z" fill="#000" fillOpacity="0.30" />
      <path
        d="M14 64V30a22 22 0 0 1 44 0v34Z"
        fill="none"
        stroke={ink}
        strokeOpacity="0.42"
        strokeWidth="1.6"
      />
      {/* the two leaves, and the ring handles */}
      <path d="M36 30v34" stroke={ink} strokeOpacity="0.28" strokeWidth="1.3" />
      <circle cx="30" cy="49" r="2.4" fill="none" stroke={ink} strokeOpacity="0.4" strokeWidth="1.2" />
      <circle cx="42" cy="49" r="2.4" fill="none" stroke={ink} strokeOpacity="0.4" strokeWidth="1.2" />
      {/* the arch light above the leaves */}
      <path
        d="M22 30a14 14 0 0 1 28 0Z"
        fill={ink}
        fillOpacity="0.13"
        stroke={ink}
        strokeOpacity="0.34"
        strokeWidth="1.1"
      />
      {/* the paper, taped on at an angle */}
      <g transform="rotate(-6 36 40)">
        <rect x="23" y="30" width="26" height="20" rx="1.5" fill="#f6f3ea" fillOpacity="0.94" />
        <rect
          x="23"
          y="30"
          width="26"
          height="20"
          rx="1.5"
          fill="none"
          stroke="#0e2419"
          strokeOpacity="0.25"
          strokeWidth="0.8"
        />
        {/* the tape */}
        <rect x="32" y="27" width="9" height="5" rx="1" fill="#f6f3ea" fillOpacity="0.5" />
        {/* handwriting, not words */}
        <g stroke="#0e2419" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round">
          <path d="M27 36h18" />
          <path d="M27 40h14" />
          <path d="M27 44h9" />
        </g>
      </g>
    </svg>
  );
}

export function ClosureNotice() {
  const { notice } = useSettings();
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);

  /**
   * Rendered only after mount. The expiry is judged against the masjid's
   * today, and the dismissal lives in this browser — neither is knowable
   * while rendering on the server, and guessing produces a band that flashes
   * on and then vanishes.
   */
  const [ready, setReady] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(true);

  const live = React.useMemo(() => noticeIsLive(notice, todayInZone()), [notice]);
  const key = React.useMemo(() => keyFor(notice), [notice]);

  React.useEffect(() => {
    let gone = false;
    try {
      gone = sessionStorage.getItem(key) === "1";
    } catch {
      /* private mode — it just will not be remembered */
    }
    setDismissed(gone);
    setReady(true);
  }, [key]);

  const shown = ready && live && !dismissed;

  /* publish the height so the navbar can sit below it */
  React.useEffect(() => {
    const root = document.documentElement;
    if (!shown) {
      root.style.setProperty("--da-notice-h", "0px");
      return;
    }
    const el = ref.current;
    if (!el) return;
    const write = () => root.style.setProperty("--da-notice-h", `${Math.round(el.offsetHeight)}px`);
    write();
    const ro = new ResizeObserver(write);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--da-notice-h", "0px");
    };
  }, [shown]);

  const close = () => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      /* not remembered, but it still closes */
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          ref={ref}
          className="da-cn"
          data-tone={notice.tone}
          role="status"
          aria-live="polite"
          initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="da-cn-inner">
            <NoticeDoor tone={notice.tone} />
            <div className="da-cn-text">
              <p className="da-cn-title">{notice.title}</p>
              {notice.detail && <p className="da-cn-detail">{notice.detail}</p>}
            </div>
            {notice.href && (
              /* Its own link rather than the whole band being clickable: the
                 band carries a dismiss button, and a button inside a link is
                 a trap. Following it does not dismiss either — someone who
                 clicks through to check a time should not lose the band
                 everywhere for it. The × is how it goes away. */
              <Link href={notice.href} className="da-cn-link">
                {notice.linkLabel || "Details"} <span aria-hidden="true">→</span>
              </Link>
            )}
            <button type="button" className="da-cn-x" onClick={close} aria-label="Dismiss this notice">
              <svg viewBox="0 0 16 16" aria-hidden focusable="false">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
