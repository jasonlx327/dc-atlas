import { industryItems, type IndustryStory } from "./industry-taxonomy.ts";
type ReferenceRecord = {id: string; title: string; titleEn?: string; note?: string; noteEn?: string; publishedAt: string; sourceUrl: string; sourceName: string};
type FeedPayload = {industryNews?: IndustryStory[]; chainNews?: Record<string, IndustryStory[]>; nvidiaNews?: IndustryStory[]; chinaChipNews?: IndustryStory[]; modelNews?: IndustryStory[]; coolingNews?: IndustryStory[]; coolingProgress?: ReferenceRecord[]; capacityRadar?: ReferenceRecord[]};
// Both navigation surfaces and both languages consume this same pool.
export function industryFeed(payload?: FeedPayload | null): IndustryStory[] {
  if (!payload) return [];
  const references = (items: ReferenceRecord[] = [], industrySegment: string) => items.map(r => ({...r, summary: r.note, summaryEn: r.noteEn, industrySegment}));
  return industryItems([
    ...references(payload.coolingProgress, "liquid"), ...references(payload.capacityRadar, "build"),
    ...(payload.industryNews ?? []), ...Object.values(payload.chainNews ?? {}).flat(),
    ...(payload.nvidiaNews ?? []), ...(payload.chinaChipNews ?? []), ...(payload.modelNews ?? []), ...(payload.coolingNews ?? []),
  ]);
}
