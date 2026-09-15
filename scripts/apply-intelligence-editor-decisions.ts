import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { RumorWatchItem } from "../app/watch-data.ts";
import { sourceRegistryById } from "../worker/connectors/index.ts";
import type { AtlasEditorDecisionPacket } from "../worker/event-intelligence/atlas-auto-editor.ts";
import { validateBilingualPair } from "../worker/event-intelligence/provider-contract.ts";

import { publicationReviewErrors, type PublicationReview } from "../worker/event-intelligence/publication-review.ts";

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? null;
}

function sourceName(sourceId: string | null): string {
  return sourceId ? sourceRegistryById.get(sourceId)?.name ?? sourceId : "公开媒体";
}

function toPublicItem(decision: AtlasEditorDecisionPacket["decisions"][number]): RumorWatchItem | null {
  if (decision.action !== "publish" || decision.route !== "rumor-watch" || !decision.publicCopy || !decision.canonicalUrls[0]) return null;
  if (validateBilingualPair({ ...decision.publicCopy, entities: decision.entities }).status !== "pass") return null;
  const multiSource = decision.reasonCodes.includes("multi-source-report");
  const name = sourceName(decision.sourceId);
  return {
    id: `editor-${decision.eventId}`,
    title: decision.publicCopy.titleZh,
    titleEn: decision.publicCopy.titleEn,
    summary: decision.publicCopy.summaryZh,
    summaryEn: decision.publicCopy.summaryEn,
    publishedAt: decision.publishedAt,
    sourceName: name,
    sourceUrl: decision.canonicalUrls[0],
    region: /中国|China/i.test(decision.region) ? "中国" : /美国|United States|U\.S\./i.test(decision.region) ? "美国" : "全球",
    status: "reported",
    statusLabel: multiSource ? "媒体 · 多源" : "媒体 · 单一来源",
    statusLabelEn: multiSource ? "Media · multi-source" : "Media · single source",
    sourceCount: multiSource ? Math.max(2, decision.canonicalUrls.length) : 1,
    entities: decision.entities,
    officialResponse: decision.evidenceStatus === "official_response"
      ? "相关主体已公开回应；报道中的其余主张继续按来源归属追踪。"
      : "本条依据所引媒体报道；当前未见对应一手确认。",
    officialResponseEn: decision.evidenceStatus === "official_response"
      ? "A relevant party has responded publicly; remaining claims continue to be tracked with attribution."
      : "Based on the cited media report; no corresponding primary confirmation was located.",
    sourceNote: `${name}公开报道；主张按原始来源归属呈现。`,
    sourceNoteEn: `Public reporting by ${name}; claims remain attributed to the original source.`,
  };
}

export function mergeIntelligenceItems(
  existing: RumorWatchItem[],
  packet: AtlasEditorDecisionPacket,
  review?: PublicationReview,
): { items: RumorWatchItem[]; applied: number } {
  const additions = packet.decisions.flatMap((decision) => {
    const item = toPublicItem(decision);
    if (item && review) {
      const proof = review.events.find(entry => entry.eventId === decision.eventId)!;
      item.eventKey = proof.clusterKey;
      item.impactLevel = proof.impact.level;
      item.sources = proof.sources.map(source => ({url:source.url, independenceGroup:source.independenceGroup}));
      const groups = new Set(proof.sources.filter(source => source.kind === 'original-media').map(source => source.independenceGroup));
      item.sourceCount = Math.max(1, groups.size);
      item.statusLabel = groups.size >= 2 ? '媒体 · 多源' : '媒体 · 单一来源';
      item.statusLabelEn = groups.size >= 2 ? 'Media · multi-source' : 'Media · single source';
      const prior = existing.find(entry => entry.eventKey === proof.clusterKey)
        ?? existing.find(entry => proof.change.priorPublicIds.includes(entry.id));
      if (prior) item.id = prior.id;
    }
    return item ? [item] : [];
  });
  const byId = new Map(existing.map((item) => [item.id, item]));
  additions.forEach((item) => {
    const prior = byId.get(item.id);
    if (prior?.sources && item.sources) item.sources = [...new Map([...prior.sources, ...item.sources].map(source => [source.url,source])).values()];
    byId.set(item.id, item);
  });
  return {
    items: [...byId.values()].sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt)),
    applied: additions.length,
  };
}

async function run() {
  const input = resolve(arg("input") ?? "artifacts/event-intelligence/editor-decision.json");
  const output = resolve(arg("output") ?? "app/data/public-intelligence.json");
  const packet = JSON.parse(await readFile(input, "utf8")) as AtlasEditorDecisionPacket;
  if (packet.schemaVersion !== "atlas-editor-decision.v1" || !["completed", "partial"].includes(packet.status)) {
    throw new Error("Atlas Editor 决策包缺失、无效或未完成，拒绝写入公开情报数据。");
  }
  const reviewPath = arg("review");
  if (!reviewPath) throw new Error("--review=<current publication review JSON> is required before public writes.");
  const review = JSON.parse(await readFile(resolve(reviewPath), "utf8")) as PublicationReview;
  const reviewErrors = publicationReviewErrors(packet, review);
  if (reviewErrors.length) throw new Error(reviewErrors.join("\n"));
  let existing: RumorWatchItem[] = [];
  try {
    existing = JSON.parse(await readFile(output, "utf8")) as RumorWatchItem[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const merged = mergeIntelligenceItems(existing, packet, review);
  await mkdir(dirname(output), { recursive: true });
  const temporary = `${output}.tmp`;
  await writeFile(temporary, `${JSON.stringify(merged.items, null, 2)}\n`);
  await rename(temporary, output);
  console.log(JSON.stringify({ message: "Versioned public intelligence updated", input, output, applied: merged.applied, total: merged.items.length }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) void run();
