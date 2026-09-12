import withdrawn from "./data/withdrawn-intelligence.json";
import archivedRumors from "./data/rumor-archive.json";
import { RUMOR_BRIEFS, type RumorWatchItem } from "./watch-data";

// Detail permalinks outlive the editorial feed. Never import this collection
// into latest-news rankings or use recovery time as a publication date.
export const ARCHIVED_RUMOR_BRIEFS = archivedRumors as RumorWatchItem[];
const currentIds = new Set(RUMOR_BRIEFS.map((item) => item.id));
export const RUMOR_DETAIL_BRIEFS: RumorWatchItem[] = [
  ...RUMOR_BRIEFS,
  ...withdrawn.map((item): RumorWatchItem => ({ ...item, title:"条目校订中", titleEn:"Editorial correction in progress", summary:"先前版本的双语摘要未通过复核，已撤回。请查看原始来源；完成逐条复核前不恢复到情报流。", summaryEn:"The previous bilingual summary was withdrawn after review. Consult the original source; this item will return to the feed only after individual editorial review.", sourceName:"原始来源 / Original source", region:"全球", status:"withdrawn", statusLabel:"校订中", statusLabelEn:"Under review", sourceCount:1, entities:[], officialResponse:"", officialResponseEn:"", sourceNote:"", sourceNoteEn:"" })),
  ...ARCHIVED_RUMOR_BRIEFS.filter((item) => !currentIds.has(item.id)),
];

export function isArchivedRumor(id: string) {
  return !currentIds.has(id) && ARCHIVED_RUMOR_BRIEFS.some((item) => item.id === id);
}

export function isWithdrawnRumor(id: string) { return withdrawn.some(item => item.id === id); }
