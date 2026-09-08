"use client";

import { useEffect } from "react";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  atlasGaInitialized?: boolean;
};

function initializeAnalytics() {
  if (typeof window === "undefined" || window.location.hostname !== "idc-index.com") return;
  const target = window as AnalyticsWindow;
  if (target.atlasGaInitialized) return target.gtag;
  target.dataLayer = target.dataLayer || [];
  target.gtag = function () {
    // gtag's command queue uses the standard arguments object.
    // eslint-disable-next-line prefer-rest-params
    target.dataLayer!.push(arguments);
  };
  target.atlasGaInitialized = true;
  target.gtag("js", new Date());
  target.gtag("config", "G-XRKL96W42Q");
  const script = document.createElement("script");
  script.id = "atlas-google-analytics";
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-XRKL96W42Q";
  document.head.appendChild(script);
  return target.gtag;
}

export function AtlasAnalytics() {
  useEffect(() => { initializeAnalytics(); }, []);
  return null;
}

export function trackAtlasEvent(name: string, parameters: Record<string, string | number | boolean> = {}) {
  initializeAnalytics()?.("event", name, parameters);
}
