"use client";

/**
 * Cross-page "scroll to section + gold spotlight" behavior used by Programs,
 * Contact us, and Community nav/footer links. Home mounts the controller once
 * (useSectionHighlightController) and wraps each target section in
 * <SectionSpotlight id="...">. Any link anywhere (nav, footer, buttons) calls
 * requestSectionScroll(id) — if already on "/", it dispatches a window event
 * the controller is listening for; otherwise it's a plain navigation to
 * `/#id` and the controller auto-fires on mount after a 260ms settle delay.
 */

import * as React from "react";

export const SCROLL_TARGETS = {
  "programs-section": 70,
  "contact-us": 90,
  "whatsapp-section": 90,
} as const;

export type ScrollTargetId = keyof typeof SCROLL_TARGETS;

const EVENT_NAME = "da:scroll-highlight";

export function requestSectionScroll(id: ScrollTargetId) {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/") {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { id } }));
  }
  // else: caller renders a real <Link href={`/${id ? `#${id}` : ""}`}> and the
  // controller's mount-time hash check takes over once the page lands.
}

export function useSectionHighlightController() {
  const [target, setTarget] = React.useState<string | null>(null);
  const [nonce, setNonce] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scrollToSection = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = SCROLL_TARGETS[id as ScrollTargetId] ?? 80;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
    clearTimeout(timerRef.current);
    setTarget(id);
    setNonce((n) => n + 1);
    timerRef.current = setTimeout(() => setTarget(null), 1800);
  }, []);

  React.useEffect(() => {
    const onEvent = (e: Event) => {
      const id = (e as CustomEvent).detail?.id as string | undefined;
      if (id) scrollToSection(id);
    };
    window.addEventListener(EVENT_NAME, onEvent);

    const hash = window.location.hash.replace("#", "");
    if (hash && hash in SCROLL_TARGETS) {
      const t = setTimeout(() => scrollToSection(hash), 260);
      return () => {
        clearTimeout(t);
        window.removeEventListener(EVENT_NAME, onEvent);
      };
    }
    return () => window.removeEventListener(EVENT_NAME, onEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { target, nonce, isHighlighted: (id: string) => target === id };
}

export function SectionSpotlight({
  id,
  nonce,
  active,
}: {
  id: string;
  nonce: number;
  active: boolean;
}) {
  if (!active) return null;
  return (
    <div
      key={`${id}-${nonce}`}
      aria-hidden
      className="da-spotlight pointer-events-none absolute -inset-5 z-[6] rounded-3xl"
    />
  );
}

/** Shared context so any section on Home can read the controller's highlight state
 * without prop-drilling. HomeHighlightProvider wraps Home's <main>. */
export const HomeHighlightContext = React.createContext<{ isHighlighted: (id: string) => boolean; nonce: number } | null>(null);

export function HomeHighlightProvider({ children }: { children: React.ReactNode }) {
  const { target, nonce, isHighlighted } = useSectionHighlightController();
  const value = React.useMemo(() => ({ isHighlighted, nonce }), [isHighlighted, nonce, target]);
  return <HomeHighlightContext.Provider value={value}>{children}</HomeHighlightContext.Provider>;
}
