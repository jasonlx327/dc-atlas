import type { MetadataRoute } from "next";
import { publishedColumnArticles } from "./columns/articles";
import { entityDirectory } from "./entity-directory";
import { RUMOR_BRIEFS } from "./watch-data";

export const dynamic = "force-dynamic";

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
      url: "https://idc-index.com/topics/data-center-glossary",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://idc-index.com/en/topics/data-center-intelligence",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/en/topics/data-center-glossary",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://idc-index.com/topics/china-ai-silicon",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://idc-index.com/en/topics/china-ai-silicon",
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
      url: "https://idc-index.com/rumors",
      changeFrequency: "daily",
      priority: 0.95,
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
      url: "https://idc-index.com/en/rumors",
      changeFrequency: "daily",
      priority: 0.95,
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
    ...publishedColumnArticles().flatMap((article) => [
      { url: `https://idc-index.com${article.href}`, lastModified: article.publishAt, changeFrequency: "weekly" as const, priority: 0.9 },
      { url: `https://idc-index.com${article.hrefEn}`, lastModified: article.publishAt, changeFrequency: "weekly" as const, priority: 0.9 },
    ]),
    ...RUMOR_BRIEFS.flatMap((item) => [
      { url: `https://idc-index.com/rumors/${item.id}`, lastModified: item.publishedAt, changeFrequency: "daily" as const, priority: 0.75 },
      { url: `https://idc-index.com/en/rumors/${item.id}`, lastModified: item.publishedAt, changeFrequency: "daily" as const, priority: 0.75 },
    ]),
    ...entityDirectory.flatMap((entity) => [
      { url: `https://idc-index.com/companies/${entity.slug}`, changeFrequency: "daily" as const, priority: 0.8 },
      { url: `https://idc-index.com/en/companies/${entity.slug}`, changeFrequency: "daily" as const, priority: 0.8 },
    ]),
  ];
}
