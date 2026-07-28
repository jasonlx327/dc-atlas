import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://idc-index.com/",
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://idc-index.com/privacy",
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: "https://idc-index.com/topics/data-center-intelligence",
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
      url: "https://idc-index.com/calendar",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/en",
      changeFrequency: "daily",
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
  ];
}
