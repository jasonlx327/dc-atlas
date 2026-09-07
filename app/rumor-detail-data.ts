import archivedRumors from "./data/rumor-archive.json";
import { RUMOR_BRIEFS, type RumorWatchItem } from "./watch-data";

// Detail permalinks outlive the editorial feed. Never import this collection
// into latest-news rankings or use recovery time as a publication date.
export const ARCHIVED_RUMOR_BRIEFS = archivedRumors as RumorWatchItem[];
const currentIds = new Set(RUMOR_BRIEFS.map((item) => item.id));
export const RUMOR_DETAIL_BRIEFS: RumorWatchItem[] = [
  ...RUMOR_BRIEFS,
  ...ARCHIVED_RUMOR_BRIEFS.filter((item) => !currentIds.has(item.id)),
];

export function isArchivedRumor(id: string) {
  return !currentIds.has(id) && ARCHIVED_RUMOR_BRIEFS.some((item) => item.id === id);
}
