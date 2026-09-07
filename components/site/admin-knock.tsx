"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/**
 * The way in.
 *
 * Five taps on the copyright line, within a few seconds of each other, and
 * the panel opens. It is not a secret — anyone reading this file knows it —
 * and it does not have to be, because the door behind it is a real password
 * checked on the server. This is only so the organisers do not have to
 * remember a URL, and so nobody stumbles in by accident.
 *
 * The knock counts down out loud after the second tap, which is the whole
 * pleasure of the thing: you can feel it arming.
 */

const NEEDED = 5;
/** taps have to be deliberate; a pause resets the count */
const WINDOW_MS = 2500;

export function AdminKnock({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [count, setCount] = React.useState(0);
  const timer = React.useRef<number | null>(null);

  const reset = React.useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCount(0), WINDOW_MS);
  }, []);

  React.useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  function knock() {
    const next = count + 1;
    if (next >= NEEDED) {
      setCount(0);
      if (timer.current) window.clearTimeout(timer.current);
      router.push("/admin");
      return;
    }
    setCount(next);
    reset();
  }

  const remaining = NEEDED - count;
  const armed = count >= 2;

  return (
    <p
      className={`da-knock${armed ? " da-knock-armed" : ""}`}
      onClick={knock}
      /* not a button: it must read as the copyright line, and a screen
         reader announcing "button, copyright" would be a lie */
      role="presentation"
      style={{ ["--knock" as string]: String(count) }}
    >
      {children}
      <span className={`da-knock-count${armed ? " da-knock-count-on" : ""}`} aria-hidden>
        {armed ? `${remaining}` : ""}
      </span>
    </p>
  );
}
