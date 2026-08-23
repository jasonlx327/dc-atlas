"use client";

import { useSyncExternalStore } from "react";
import { trackAtlasEvent } from "./atlas-analytics";

const STORAGE_KEY = "idc-atlas:followed-entities:v1";

function savedEntities(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function useFollowedEntityIds(): string[] {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("idc-atlas:follow-change", onStoreChange);
      window.addEventListener("storage", onStoreChange);
      return () => {
        window.removeEventListener("idc-atlas:follow-change", onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => savedEntities().join("|"),
    () => "",
  );
  return snapshot ? snapshot.split("|") : [];
}

export default function EntityFollowButton({ slug, lang, compact = false }: { slug: string; lang: "zh" | "en"; compact?: boolean }) {
  const following = useFollowedEntityIds().includes(slug);

  function toggle() {
    const next = new Set(savedEntities());
    if (next.has(slug)) next.delete(slug); else next.add(slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    window.dispatchEvent(new CustomEvent("idc-atlas:follow-change"));
    trackAtlasEvent(next.has(slug) ? "company_follow" : "company_unfollow", { entity_id: slug });
  }

  return <button className={`atlas-follow-button${compact ? " compact" : ""}`} type="button" aria-pressed={following} onClick={toggle}>
    {following ? (lang === "zh" ? "已关注" : "Following") : (lang === "zh" ? "关注公司" : "Follow company")}
  </button>;
}
