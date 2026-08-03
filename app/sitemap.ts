import type { MetadataRoute } from "next";
import { entityDirectory } from "./entity-directory";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://idc-index.com/",
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://idc-index.com/pulse",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/industry",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/topics/data-center-intelligence",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/en/topics/data-center-intelligence",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/topics/china-ai-silicon",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/methodology",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://idc-index.com/en/methodology",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://idc-index.com/calendar",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/policy",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/rumors",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/en",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/pulse",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/industry",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/policy",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/en/rumors",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/columns",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/columns",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/columns/alibaba-qwen-cloud",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/columns/alibaba-qwen-cloud",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/columns/microsoft-ai-capex",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/columns/microsoft-ai-capex",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/columns/frontier-model-economics",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/columns/frontier-model-economics",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/columns/ai-capex-power",
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://idc-index.com/en/columns/ai-capex-power",
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://idc-index.com/columns/hyperscale-idc-leases",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/columns/hyperscale-idc-leases",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/columns/cxmt-us-chip-impact",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/columns/cxmt-us-chip-impact",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/columns/sk-hynix-hbm-earnings",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://idc-index.com/en/columns/sk-hynix-hbm-earnings",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...entityDirectory.flatMap((entity) => [
      { url: `https://idc-index.com/companies/${entity.slug}`, changeFrequency: "daily" as const, priority: 0.8 },
      { url: `https://idc-index.com/en/companies/${entity.slug}`, changeFrequency: "daily" as const, priority: 0.8 },
    ]),
  ];
}
