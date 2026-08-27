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
    id: "2026-08-27-nvidia-fy27-q2",
    editionDate: "2026-08-27",
    publishedAt: "2026-08-27T09:10:00+08:00",
    articleHref: "/columns/nvidia-fy27-q2-five-tests",
    selectedBecauseZh: "它把 NVIDIA 的收入增速、毛利率、应收、库存、供应承诺与项目担保放进同一张风险表，是今天影响 AI 基础设施定价最完整的一组新事实。",
    selectedBecauseEn: "It puts NVIDIA's revenue growth, margins, receivables, inventory, supply commitments and project guarantees on one risk map—the most complete new evidence set for AI-infrastructure pricing today.",
  },
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
