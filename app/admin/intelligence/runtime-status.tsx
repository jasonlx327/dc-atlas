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

  const gateLabel = status?.gateStatus === "gate4-ready"
    ? "Gate 4 已就绪"
    : status?.gateStatus === "waiting-live-smoke"
      ? "等待实时烟雾测试"
      : status?.gateStatus ?? "等待实时烟雾测试";

  return (
    <div className="atlas-intelligence-grid atlas-intelligence-grid-3" aria-label="生产影子运行状态">
      <div className="atlas-intelligence-card"><small>生产模式</small><strong>仅影子运行</strong><p>公开数据切换保持关闭。</p></div>
      <div className="atlas-intelligence-card"><small>Gate 4 上线门槛</small><strong>{gateLabel}</strong><p>{status ? `${status.latestJob} · ${status.latestRun.passingSources}/${status.latestRun.sources} 个信源通过` : "等待首次定时 Worker 运行。"}</p></div>
      <div className="atlas-intelligence-card"><small>实时烟雾测试槽位</small><strong>{status ? `${status.liveSmoke["event-night"]?.passed ? "夜间 ✓" : "夜间 —"} · ${status.liveSmoke["event-day"]?.passed ? "日间 ✓" : "日间 —"}` : "夜间 — · 日间 —"}</strong><p>{status?.generatedAt ?? "暂无生产心跳"}</p></div>
    </div>
  );
}
