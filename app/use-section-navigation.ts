"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

export function useSectionNavigation<const T extends readonly string[]>(
  enabled: boolean,
  sectionIds: T,
  defaultSection: T[number],
) {
  const [activeSection, setActiveSection] = useState<T[number]>(defaultSection);
  const lockedSection = useRef<T[number] | null>(null);
  const unlockTimer = useRef<number | null>(null);

  const syncSection = useCallback(() => {
    if (!enabled || lockedSection.current) return;

    const pageBottom = window.scrollY + window.innerHeight;
    const documentBottom = document.documentElement.scrollHeight;
    if (pageBottom >= documentBottom - 4) {
      const finalSection = [...sectionIds].reverse().find((id) => document.getElementById(id));
      if (finalSection) {
        setActiveSection(finalSection);
        return;
      }
    }

    const marker = Math.min(180, window.innerHeight * 0.28);
    let nextSection = defaultSection;
    let nextTop = Number.NEGATIVE_INFINITY;

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (!element) continue;
      const top = element.getBoundingClientRect().top;
      if (top <= marker && top >= nextTop) {
        nextSection = id;
        nextTop = top;
      }
    }

    setActiveSection(nextSection);
  }, [defaultSection, enabled, sectionIds]);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const requestSync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncSection);
    };
    const hashSection = window.location.hash.slice(1) as T[number];

    if (sectionIds.includes(hashSection)) {
      window.requestAnimationFrame(() => {
        setActiveSection(hashSection);
        document.getElementById(hashSection)?.scrollIntoView({ block: "start" });
      });
    } else {
      requestSync();
    }

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    window.addEventListener("hashchange", requestSync);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      window.removeEventListener("hashchange", requestSync);
      if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
    };
  }, [defaultSection, enabled, sectionIds, syncSection]);

  const navigate = useCallback((event: MouseEvent<HTMLAnchorElement>, section: T[number]) => {
    if (!enabled) return;
    const target = document.getElementById(section);
    if (!target) return;

    event.preventDefault();
    lockedSection.current = section;
    setActiveSection(section);
    const baseUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", section === defaultSection ? baseUrl : `${baseUrl}#${section}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => {
      lockedSection.current = null;
      syncSection();
    }, 1400);
  }, [defaultSection, enabled, syncSection]);

  return { activeSection, navigate };
}
