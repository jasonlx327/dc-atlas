import assert from "node:assert/strict";
import { mergeIntelligenceItems } from "./apply-intelligence-editor-decisions.ts";
import type { AtlasEditorDecisionPacket } from "../worker/event-intelligence/atlas-auto-editor.ts";

const packet = {
  schemaVersion: "atlas-editor-decision.v1",
  generatedAt: "2026-09-01T08:30:00.000Z",
  cutoffAt: "2026-09-01T08:30:00.000Z",
  timezone: "Asia/Shanghai",
  day: "2026-09-01",
  status: "completed",
  sourcePacketGeneratedAt: "2026-09-01T08:25:00.000Z",
  decisions: [{
    eventId: "media-capacity-event",
    action: "publish",
    route: "rumor-watch",
    section: "rumors",
    sourceTier: "T3",
    evidenceStatus: "reported",
    canonicalUrls: ["https://media.example/report"],
    reasonCodes: ["attributable-media-report", "single-source-report", "bilingual-copy-valid"],
    publicCopy: {
      titleZh: "媒体报道一项新的数据中心项目",
      titleEn: "Media reports a new data-center project",
      summaryZh: "报道披露了项目位置与计划容量，相关主张继续按来源归属追踪。",
      summaryEn: "The report identifies the location and planned capacity; the claims remain attributed while follow-up continues.",
    },
    publicClaims: [],
    internalNotes: [],
    fallbackScored: false,
    holdClass: null,
    entities: ["Example Cloud"],
    region: "美国",
    publishedAt: "2026-09-01T07:00:00.000Z",
    sourceId: "media-example",
  }],
  summary: { publishFormal: 0, publishRumor: 1, research: 0, hold: 0, reject: 0, fallbackScored: 0, adapterReady: 1, blockingHold: 0 },
} satisfies AtlasEditorDecisionPacket;

const first = mergeIntelligenceItems([], packet);
assert.equal(first.applied, 1);
assert.equal(first.items[0]?.id, "editor-media-capacity-event");
assert.equal(first.items[0]?.statusLabel, "媒体 · 单一来源");
assert.equal(first.items[0]?.titleEn, "Media reports a new data-center project");

const updated = mergeIntelligenceItems([{ ...first.items[0]!, summary: "旧摘要" }], packet);
assert.equal(updated.items.length, 1, "repeated runs must update the same event instead of duplicating it");
assert.notEqual(updated.items[0]?.summary, "旧摘要");

console.log(JSON.stringify({ message: "Intelligence publication adapter tests passed", items: updated.items.length }));
