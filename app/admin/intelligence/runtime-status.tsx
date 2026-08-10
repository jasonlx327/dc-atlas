"use client";

import { useEffect, useState } from "react";
import type { EventRuntimeStatus } from "../../../worker/event-intelligence/runtime.ts";

export function RuntimeStatus() {
  const [status, setStatus] = useState<EventRuntimeStatus | null>(null);

  useEffect(() => {
    fetch("/api/admin/intelligence", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((payload: { status: EventRuntimeStatus | null }) => setStatus(payload.status))
      .catch(() => setStatus(null));
  }, []);

  return (
    <div className="atlas-intelligence-grid atlas-intelligence-grid-3" aria-label="Production shadow runtime">
      <div className="atlas-intelligence-card"><small>Production mode</small><strong>Shadow only</strong><p>Public cutover remains disabled.</p></div>
      <div className="atlas-intelligence-card"><small>Gate 4</small><strong>{status?.gateStatus ?? "waiting-live-smoke"}</strong><p>{status ? `${status.latestJob} · ${status.latestRun.passingSources}/${status.latestRun.sources} sources` : "Waiting for the first scheduled Worker run."}</p></div>
      <div className="atlas-intelligence-card"><small>Live smoke slots</small><strong>{status ? `${status.liveSmoke["event-night"]?.passed ? "Night ✓" : "Night —"} · ${status.liveSmoke["event-day"]?.passed ? "Day ✓" : "Day —"}` : "Night — · Day —"}</strong><p>{status?.generatedAt ?? "No production heartbeat yet"}</p></div>
    </div>
  );
}
