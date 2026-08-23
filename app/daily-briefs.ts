export type DailyBriefRecord = {
  id: string;
  editionDate: string;
  publishedAt: string;
  articleHref: string;
  selectedBecauseZh: string;
  selectedBecauseEn: string;
};

export const dailyBriefRecords: readonly DailyBriefRecord[] = [
  {
    id: "2026-08-22-ai-financing-platforms",
    editionDate: "2026-08-22",
    publishedAt: "2026-08-22T09:30:00+08:00",
    articleHref: "/columns/ai-financing-platforms",
    selectedBecauseZh: "它把当前最重要的 AI 基础设施变量——资金、送电和客户现金流——放在同一条兑现链上。",
    selectedBecauseEn: "It connects the most important infrastructure variables now: financing, energization and customer cash flow.",
  },
];

export function currentDailyBriefRecord(now = new Date()): DailyBriefRecord | undefined {
  const timestamp = now.getTime();
  return [...dailyBriefRecords]
    .filter((record) => new Date(record.publishedAt).getTime() <= timestamp)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0];
}
