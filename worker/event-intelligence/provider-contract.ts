import { publicCopyQualityErrors } from "./public-copy-quality.ts";

export type TranslationLanguage = "zh-CN" | "en-US";

export type TranslationRequest = {
  sourceLanguage: TranslationLanguage;
  targetLanguage: TranslationLanguage;
  sourceText: string;
  recordedText?: string | null;
};

export type TranslationResult = {
  status: "complete" | "source-only";
  text: string;
  provenance: "recorded" | "untranslated-source";
};

export type TranslationAdapter = {
  id: string;
  kind: "recorded" | "external";
  translateTitle(request: TranslationRequest): TranslationResult;
  translateSummary(request: TranslationRequest): TranslationResult;
  protectEntities(text: string, expectedEntities?: string[]): string[];
  protectNumerics(text: string): string[];
  validateBilingualPair(pair: BilingualPair): BilingualValidation;
};

export type BilingualPair = {
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  entities?: string[];
};

export type BilingualValidation = {
  status: "pass" | "source-only" | "fail";
  errors: string[];
  numericTokensZh: string[];
  numericTokensEn: string[];
  entityTokens: string[];
  timeTokensZh: string[];
  timeTokensEn: string[];
};

export type AnalysisProvider = {
  id: string;
  kind: "deterministic" | "recorded" | "external";
  model: string;
  privacy: "local-only" | "user-selected-external";
  analyze(input: { title: string; summary: string }): Promise<{ status: "recorded" | "deterministic"; modelCalls: number; estimatedUsd: number }>;
};

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function normalizeNumeric(value: string): string {
  return value.toLocaleLowerCase().replace(/,/g, "").replace(/\s+/g, "").replace(/亿元/g, "亿").replace(/年/g, "");
}

function numericTokens(text: string): string[] {
  return unique([...text.matchAll(/(?:[$¥￥])?\s?\d+(?:[.,]\d+)?\s?(?:GW|MW|kW|TB|PB|GB|万卡|万张|卡|亿美元|亿元|billion|million|bn|m|%|Q[1-4]|\d{4}年?)/gi)].map((match) => normalizeNumeric(match[0]))).sort();
}

function timeTokens(text: string): string[] {
  return unique([...text.matchAll(/(?:20\d{2}|Q[1-4]|[一二三四]季度|\d{1,2}月|\d{1,2}月\d{1,2}日)/gi)].map((match) => match[0].toLocaleLowerCase())).sort();
}

function entityTokens(text: string, expectedEntities: string[] = []): string[] {
  const exactExpected = expectedEntities.filter((entity) => /^(?:[A-Z][A-Z0-9.-]{1,}|OpenAI|Anthropic|Microsoft|Google|Amazon|Meta|Intel|Micron)$/.test(entity) && text.toLocaleLowerCase().includes(entity.toLocaleLowerCase()));
  const protectedText = text.match(/\b(?:AI|GPU|HPC|IT|AWS|SEC|FERC|EPA|DOE|PJM|ERCOT|PUE|NVIDIA|AMD|OpenAI|Anthropic|Microsoft|Google|Amazon|Meta|Intel|Micron)\b/gi) ?? [];
  return unique([...exactExpected, ...protectedText]).sort((left, right) => left.localeCompare(right));
}

export function protectEntities(text: string, expectedEntities: string[] = []): string[] {
  return entityTokens(text, expectedEntities);
}

export function protectNumerics(text: string): string[] {
  return numericTokens(text);
}

export function validateBilingualPair(pair: BilingualPair): BilingualValidation {
  if (![pair.titleZh, pair.titleEn, pair.summaryZh, pair.summaryEn].every((value) => value.trim())) {
    return { status: "source-only", errors: ["title-and-summary-pair-incomplete"], numericTokensZh: [], numericTokensEn: [], entityTokens: [], timeTokensZh: [], timeTokensEn: [] };
  }
  const zhText = `${pair.titleZh} ${pair.summaryZh}`;
  const enText = `${pair.titleEn} ${pair.summaryEn}`;
  const numericTokensZh = numericTokens(zhText);
  const numericTokensEn = numericTokens(enText);
  const timeTokensZh = timeTokens(zhText);
  const timeTokensEn = timeTokens(enText);
  const expectedEntities = pair.entities ?? [];
  const entityTokensZh = entityTokens(zhText, expectedEntities);
  const entityTokensEn = entityTokens(enText, expectedEntities);
  const errors: string[] = publicCopyQualityErrors(pair);
  const containsHan = (value: string) => /[\u3400-\u9fff]/.test(value);
  const normalizedCopy = (value: string) => value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase();
  if (!containsHan(zhText)) errors.push("zh-copy-missing-han-text");
  if (containsHan(enText)) errors.push("en-copy-contains-han-text");
  if (normalizedCopy(pair.titleZh) === normalizedCopy(pair.titleEn)
    || normalizedCopy(pair.summaryZh) === normalizedCopy(pair.summaryEn)) {
    errors.push("mirrored-source-copy");
  }
  if (numericTokensZh.join("|") !== numericTokensEn.join("|")) errors.push("numeric-or-unit-mismatch");
  if (timeTokensZh.filter((token) => /^20\d{2}|^q[1-4]/i.test(token)).join("|") !== timeTokensEn.filter((token) => /^20\d{2}|^q[1-4]/i.test(token)).join("|")) errors.push("time-token-mismatch");
  const stableExpectedEntities = (pair.entities ?? []).filter((entity) => /^(?:[A-Z][A-Z0-9.-]{1,}|OpenAI|Anthropic|Microsoft|Google|Amazon|Meta|Intel|Micron)$/.test(entity));
  for (const token of stableExpectedEntities) {
    const inZh = zhText.toLocaleLowerCase().includes(token.toLocaleLowerCase());
    const inEn = enText.toLocaleLowerCase().includes(token.toLocaleLowerCase());
    if (inZh !== inEn) errors.push(`entity-token-mismatch:${token}`);
  }
  const sharedEntityTokens = [...new Set([...entityTokensZh, ...entityTokensEn])].filter((token) => zhText.toLocaleLowerCase().includes(token.toLocaleLowerCase()) && enText.toLocaleLowerCase().includes(token.toLocaleLowerCase()));
  return { status: errors.length ? "fail" : "pass", errors, numericTokensZh, numericTokensEn, entityTokens: sharedEntityTokens.sort(), timeTokensZh, timeTokensEn };
}

export const recordedTranslationAdapter: TranslationAdapter = {
  id: "recorded-translation-v1",
  kind: "recorded",
  translateTitle(request) {
    return request.recordedText?.trim()
      ? { status: "complete", text: request.recordedText.trim(), provenance: "recorded" }
      : { status: "source-only", text: request.sourceText, provenance: "untranslated-source" };
  },
  translateSummary(request) {
    return request.recordedText?.trim()
      ? { status: "complete", text: request.recordedText.trim(), provenance: "recorded" }
      : { status: "source-only", text: request.sourceText, provenance: "untranslated-source" };
  },
  protectEntities,
  protectNumerics,
  validateBilingualPair,
};

export const deterministicShadowProvider: AnalysisProvider = {
  id: "deterministic-shadow-v1",
  kind: "deterministic",
  model: "rules-v1",
  privacy: "local-only",
  async analyze() {
    return { status: "deterministic", modelCalls: 0, estimatedUsd: 0 };
  },
};

export const recordedResponseProvider: AnalysisProvider = {
  id: "recorded-response-v1",
  kind: "recorded",
  model: "recorded-fixture",
  privacy: "local-only",
  async analyze() {
    return { status: "recorded", modelCalls: 0, estimatedUsd: 0 };
  },
};

export const providerDecision = {
  selectedProvider: deterministicShadowProvider.id,
  externalProvider: "openai-compatible-shadow-v1",
  externalDecision: "implemented-disabled-by-default",
  reason: "The optional external adapter is restricted to owner-triggered shadow scoring. It cannot change evidence status, routing, eligibility, or public data, and remains disabled until a secret and deployment variables are explicitly configured.",
  candidateResponsibilities: ["classification", "entity-and-fact extraction", "cluster support", "translation only when a recorded pair exists"],
};
