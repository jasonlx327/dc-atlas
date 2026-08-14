export type CoreCompanyLayer = "demand-platform" | "model-application" | "compute-silicon" | "capacity-power";

export type CoreCompanyWatch = {
  id: string;
  name: string;
  aliases: string[];
  layer: CoreCompanyLayer;
  regions: Array<"US" | "China" | "Global">;
  sourceIds: string[];
};

export const CORE_COMPANY_WATCHLIST: CoreCompanyWatch[] = [
  { id: "microsoft", name: "Microsoft", aliases: ["Microsoft", "Azure", "微软"], layer: "demand-platform", regions: ["US", "Global"], sourceIds: ["microsoft", "azure-blog"] },
  { id: "amazon", name: "Amazon", aliases: ["Amazon", "AWS", "亚马逊"], layer: "demand-platform", regions: ["US", "Global"], sourceIds: ["aws-news"] },
  { id: "alphabet", name: "Alphabet", aliases: ["Alphabet", "Google", "谷歌"], layer: "demand-platform", regions: ["US", "Global"], sourceIds: ["google-cloud", "google-ai-blog", "google-developers"] },
  { id: "meta", name: "Meta", aliases: ["Meta", "Facebook", "脸书"], layer: "demand-platform", regions: ["US", "Global"], sourceIds: ["meta", "meta-engineering"] },
  { id: "oracle", name: "Oracle", aliases: ["Oracle", "OCI", "甲骨文"], layer: "demand-platform", regions: ["US", "Global"], sourceIds: ["oracle"] },
  { id: "openai", name: "OpenAI", aliases: ["OpenAI", "ChatGPT"], layer: "demand-platform", regions: ["US", "Global"], sourceIds: ["openai-news"] },
  { id: "anthropic", name: "Anthropic", aliases: ["Anthropic", "Claude"], layer: "demand-platform", regions: ["US", "Global"], sourceIds: [] },
  { id: "xai", name: "xAI", aliases: ["xAI", "Grok", "SpaceXAI", "Colossus"], layer: "demand-platform", regions: ["US", "Global"], sourceIds: ["xai-news"] },
  { id: "coreweave", name: "CoreWeave", aliases: ["CoreWeave"], layer: "demand-platform", regions: ["US", "Global"], sourceIds: ["coreweave"] },
  { id: "alibaba", name: "Alibaba", aliases: ["Alibaba", "AliCloud", "Alibaba Cloud", "阿里巴巴", "阿里云"], layer: "demand-platform", regions: ["China", "Global"], sourceIds: [] },
  { id: "tencent", name: "Tencent", aliases: ["Tencent", "腾讯", "腾讯云"], layer: "demand-platform", regions: ["China", "Global"], sourceIds: [] },
  { id: "bytedance", name: "ByteDance", aliases: ["ByteDance", "字节跳动", "火山引擎"], layer: "demand-platform", regions: ["China", "Global"], sourceIds: [] },

  { id: "apple", name: "Apple", aliases: ["Apple", "苹果"], layer: "model-application", regions: ["US", "Global"], sourceIds: ["apple"] },
  { id: "tesla", name: "Tesla", aliases: ["Tesla", "特斯拉", "Dojo"], layer: "model-application", regions: ["US", "Global"], sourceIds: [] },
  { id: "palantir", name: "Palantir", aliases: ["Palantir", "PLTR"], layer: "model-application", regions: ["US", "Global"], sourceIds: [] },
  { id: "salesforce", name: "Salesforce", aliases: ["Salesforce", "Agentforce"], layer: "model-application", regions: ["US", "Global"], sourceIds: [] },
  { id: "servicenow", name: "ServiceNow", aliases: ["ServiceNow", "Now Assist"], layer: "model-application", regions: ["US", "Global"], sourceIds: [] },
  { id: "snowflake", name: "Snowflake", aliases: ["Snowflake", "Cortex AI"], layer: "model-application", regions: ["US", "Global"], sourceIds: [] },
  { id: "cloudflare", name: "Cloudflare", aliases: ["Cloudflare", "Workers AI"], layer: "model-application", regions: ["US", "Global"], sourceIds: ["cloudflare"] },
  { id: "baidu", name: "Baidu", aliases: ["Baidu", "百度", "文心", "ERNIE"], layer: "model-application", regions: ["China", "Global"], sourceIds: [] },
  { id: "deepseek", name: "DeepSeek", aliases: ["DeepSeek", "深度求索"], layer: "model-application", regions: ["China", "Global"], sourceIds: [] },
  { id: "mistral", name: "Mistral AI", aliases: ["Mistral AI", "Mistral", "Le Chat"], layer: "model-application", regions: ["Global"], sourceIds: [] },
  { id: "perplexity", name: "Perplexity", aliases: ["Perplexity", "Perplexity AI"], layer: "model-application", regions: ["US", "Global"], sourceIds: [] },
  { id: "asml", name: "ASML", aliases: ["ASML", "阿斯麦"], layer: "compute-silicon", regions: ["Global"], sourceIds: [] },
  { id: "applied-materials", name: "Applied Materials", aliases: ["Applied Materials", "应用材料"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: [] },
  { id: "lam-research", name: "Lam Research", aliases: ["Lam Research", "泛林集团"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: [] },

  { id: "nvidia", name: "NVIDIA", aliases: ["NVIDIA", "英伟达"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: ["nvidia", "nvidia-developer"] },
  { id: "amd", name: "AMD", aliases: ["AMD", "超威"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: ["amd"] },
  { id: "broadcom", name: "Broadcom", aliases: ["Broadcom", "博通"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: [] },
  { id: "marvell", name: "Marvell", aliases: ["Marvell", "美满电子"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: [] },
  { id: "tsmc", name: "TSMC", aliases: ["TSMC", "台积电"], layer: "compute-silicon", regions: ["Global"], sourceIds: [] },
  { id: "sk-hynix", name: "SK hynix", aliases: ["SK hynix", "SK海力士", "海力士"], layer: "compute-silicon", regions: ["Global"], sourceIds: ["sk-hynix"] },
  { id: "micron", name: "Micron", aliases: ["Micron", "美光"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: [] },
  { id: "samsung", name: "Samsung Electronics", aliases: ["Samsung Electronics", "Samsung", "三星电子", "三星"], layer: "compute-silicon", regions: ["Global"], sourceIds: ["samsung"] },
  { id: "arista", name: "Arista Networks", aliases: ["Arista Networks", "Arista"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: [] },
  { id: "dell", name: "Dell Technologies", aliases: ["Dell Technologies", "Dell", "戴尔"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: ["dell"] },
  { id: "supermicro", name: "Supermicro", aliases: ["Supermicro", "Super Micro", "SMCI", "超微电脑"], layer: "compute-silicon", regions: ["US", "Global"], sourceIds: [] },
  { id: "huawei", name: "Huawei", aliases: ["Huawei", "华为", "昇腾", "Ascend"], layer: "compute-silicon", regions: ["China", "Global"], sourceIds: [] },

  { id: "equinix", name: "Equinix", aliases: ["Equinix"], layer: "capacity-power", regions: ["US", "Global"], sourceIds: ["equinix"] },
  { id: "digital-realty", name: "Digital Realty", aliases: ["Digital Realty", "DLR"], layer: "capacity-power", regions: ["US", "Global"], sourceIds: ["digital-realty"] },
  { id: "vertiv", name: "Vertiv", aliases: ["Vertiv", "维谛"], layer: "capacity-power", regions: ["US", "Global"], sourceIds: [] },
  { id: "schneider-electric", name: "Schneider Electric", aliases: ["Schneider Electric", "施耐德电气"], layer: "capacity-power", regions: ["Global"], sourceIds: [] },
  { id: "eaton", name: "Eaton", aliases: ["Eaton", "伊顿"], layer: "capacity-power", regions: ["US", "Global"], sourceIds: [] },
  { id: "ge-vernova", name: "GE Vernova", aliases: ["GE Vernova", "GE能源"], layer: "capacity-power", regions: ["US", "Global"], sourceIds: [] },
  { id: "hut-8", name: "Hut 8", aliases: ["Hut 8", "Hut8"], layer: "capacity-power", regions: ["US"], sourceIds: ["hut8"] },
  { id: "terawulf", name: "TeraWulf", aliases: ["TeraWulf"], layer: "capacity-power", regions: ["US"], sourceIds: ["terawulf"] },
  { id: "galaxy-digital", name: "Galaxy Digital", aliases: ["Galaxy Digital", "Galaxy"], layer: "capacity-power", regions: ["US"], sourceIds: ["galaxy"] },
  { id: "riot-platforms", name: "Riot Platforms", aliases: ["Riot Platforms", "Riot"], layer: "capacity-power", regions: ["US"], sourceIds: [] },
  { id: "applied-digital", name: "Applied Digital", aliases: ["Applied Digital", "APLD"], layer: "capacity-power", regions: ["US"], sourceIds: [] },
  { id: "gds", name: "GDS Holdings", aliases: ["GDS Holdings", "GDS", "万国数据"], layer: "capacity-power", regions: ["China", "Global"], sourceIds: [] },
];

function normalized(value: string): string {
  return value.toLocaleLowerCase().replace(/[\s·._/()-]+/g, " ").trim();
}

function aliasMatches(haystack: string, alias: string): boolean {
  const needle = normalized(alias);
  if (!needle) return false;
  if (/[^\x00-\x7F]/.test(needle)) return haystack.includes(needle);
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i").test(haystack);
}

export function matchCoreCompanies(values: string[]): CoreCompanyWatch[] {
  const haystack = normalized(values.join(" | "));
  if (!haystack) return [];
  return CORE_COMPANY_WATCHLIST.filter((company) => company.aliases.some((alias) => aliasMatches(haystack, alias)));
}

export const CORE_COMPANY_SOURCE_IDS = [...new Set(CORE_COMPANY_WATCHLIST.flatMap((company) => company.sourceIds))];

export const CORE_COMPANY_WATCH_STATE_KEY = "event-intelligence:core-company-watch:latest";

export type CoreCompanyWatchState = {
  schemaVersion: "atlas-core-company-watch.v1";
  generatedAt: string;
  companyCount: number;
  companies: Array<{
    id: string;
    name: string;
    layer: CoreCompanyLayer;
    regions: CoreCompanyWatch["regions"];
    sourceIds: string[];
    eventsInLatestRun: number;
    latestEventId: string | null;
    latestEventTitle: string | null;
    latestEventAt: string | null;
    lastCheckedAt: string;
  }>;
};

type CompanyWatchEvent = {
  id: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  entities: string[];
  lastUpdatedAt: string;
};

export function buildCoreCompanyWatchState(
  events: CompanyWatchEvent[],
  generatedAt: string,
  prior: CoreCompanyWatchState | null = null,
): CoreCompanyWatchState {
  const priorById = new Map((prior?.companies ?? []).map((company) => [company.id, company]));
  const matches = new Map<string, CompanyWatchEvent[]>();
  for (const event of events) {
    const companies = matchCoreCompanies([
      event.titleZh,
      event.titleEn,
      event.summaryZh,
      event.summaryEn,
      ...event.entities,
    ]);
    for (const company of companies) matches.set(company.id, [...(matches.get(company.id) ?? []), event]);
  }
  return {
    schemaVersion: "atlas-core-company-watch.v1",
    generatedAt,
    companyCount: CORE_COMPANY_WATCHLIST.length,
    companies: CORE_COMPANY_WATCHLIST.map((company) => {
      const current = (matches.get(company.id) ?? []).sort((left, right) => Date.parse(right.lastUpdatedAt) - Date.parse(left.lastUpdatedAt));
      const latest = current[0];
      const previous = priorById.get(company.id);
      return {
        id: company.id,
        name: company.name,
        layer: company.layer,
        regions: company.regions,
        sourceIds: company.sourceIds,
        eventsInLatestRun: current.length,
        latestEventId: latest?.id ?? previous?.latestEventId ?? null,
        latestEventTitle: latest?.titleZh ?? latest?.titleEn ?? previous?.latestEventTitle ?? null,
        latestEventAt: latest?.lastUpdatedAt ?? previous?.latestEventAt ?? null,
        lastCheckedAt: generatedAt,
      };
    }),
  };
}
