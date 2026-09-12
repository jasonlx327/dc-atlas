// Mechanical scaffolds are not translations, even if their token sets match.
export function publicCopyQualityErrors(copy: { titleZh: string; titleEn: string; summaryZh: string; summaryEn: string }): string[] {
  const text = Object.values(copy).join("\n");
  const errors: string[] = [];
  if (/source (?:figures|time):|原文(?:数值|时间)[：:]/i.test(text)) errors.push("numeric-padding-not-prose");
  if (/Reported update involving|reports: an AI infrastructure development|相关 AI 基础设施进展|The source describes/i.test(text)) errors.push("generic-translation-scaffold");
  if (/报道中的具体规模、时点和实施状态以原文为准|The report's specific scale, timing, and implementation status remain attributed/i.test(text)) errors.push("unreviewed-template-summary");
  return errors;
}
