import type { MetadataRoute } from "next";
import { publishedColumnArticles } from "./columns/articles";
import { entityDirectory } from "./entity-directory";
import { RUMOR_BRIEFS } from "./watch-data";

export const dynamic = "force-dynamic";

const bilingual = (zh: string, en: string) => ({
  languages: { "zh-CN": zh, en, "x-default": en },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: "https://idc-index.com/",
      changeFrequency: "daily",
      priority: 1,
      alternates: bilingual("https://idc-index.com/", "https://idc-index.com/en"),
    },
    {
      url: "https://idc-index.com/pulse",
      changeFrequency: "daily",
      priority: 0.9,
      alternates: bilingual("https://idc-index.com/pulse", "https://idc-index.com/en/pulse"),
    },
    {
      url: "https://idc-index.com/industry",
      changeFrequency: "daily",
      priority: 0.9,
      alternates: bilingual("https://idc-index.com/industry", "https://idc-index.com/en/industry"),
    },
    {
      url: "https://idc-index.com/companies",
      changeFrequency: "daily",
      priority: 0.9,
      alternates: bilingual("https://idc-index.com/companies", "https://idc-index.com/en/companies"),
    },
    {
      url: "https://idc-index.com/topics/data-center-intelligence",
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: bilingual("https://idc-index.com/topics/data-center-intelligence", "https://idc-index.com/en/topics/data-center-intelligence"),
    },
    {
      url: "https://idc-index.com/topics/data-center-glossary",
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: bilingual("https://idc-index.com/topics/data-center-glossary", "https://idc-index.com/en/topics/data-center-glossary"),
    },
    {
      url: "https://idc-index.com/en/topics/data-center-intelligence",
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: bilingual("https://idc-index.com/topics/data-center-intelligence", "https://idc-index.com/en/topics/data-center-intelligence"),
    },
    {
      url: "https://idc-index.com/en/topics/data-center-glossary",
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: bilingual("https://idc-index.com/topics/data-center-glossary", "https://idc-index.com/en/topics/data-center-glossary"),
    },
    {
      url: "https://idc-index.com/topics/china-ai-silicon",
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: bilingual("https://idc-index.com/topics/china-ai-silicon", "https://idc-index.com/en/topics/china-ai-silicon"),
    },
    {
      url: "https://idc-index.com/en/topics/china-ai-silicon",
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: bilingual("https://idc-index.com/topics/china-ai-silicon", "https://idc-index.com/en/topics/china-ai-silicon"),
    },
    {
      url: "https://idc-index.com/methodology",
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: bilingual("https://idc-index.com/methodology", "https://idc-index.com/en/methodology"),
    },
    {
      url: "https://idc-index.com/en/methodology",
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: bilingual("https://idc-index.com/methodology", "https://idc-index.com/en/methodology"),
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
      alternates: bilingual("https://idc-index.com/rumors", "https://idc-index.com/en/rumors"),
    },
    {
      url: "https://idc-index.com/en",
      changeFrequency: "daily",
      priority: 0.9,
      alternates: bilingual("https://idc-index.com/", "https://idc-index.com/en"),
    },
    {
      url: "https://idc-index.com/en/pulse",
      changeFrequency: "daily",
      priority: 0.9,
      alternates: bilingual("https://idc-index.com/pulse", "https://idc-index.com/en/pulse"),
    },
    {
      url: "https://idc-index.com/en/industry",
      changeFrequency: "daily",
      priority: 0.9,
      alternates: bilingual("https://idc-index.com/industry", "https://idc-index.com/en/industry"),
    },
    {
      url: "https://idc-index.com/en/companies",
      changeFrequency: "daily",
      priority: 0.9,
      alternates: bilingual("https://idc-index.com/companies", "https://idc-index.com/en/companies"),
    },
    {
      url: "https://idc-index.com/en/rumors",
      changeFrequency: "daily",
      priority: 0.95,
      alternates: bilingual("https://idc-index.com/rumors", "https://idc-index.com/en/rumors"),
    },
    {
      url: "https://idc-index.com/columns",
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: bilingual("https://idc-index.com/columns", "https://idc-index.com/en/columns"),
    },
    {
      url: "https://idc-index.com/en/columns",
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: bilingual("https://idc-index.com/columns", "https://idc-index.com/en/columns"),
    },
    ...publishedColumnArticles().flatMap((article) => [
      { url: `https://idc-index.com${article.href}`, lastModified: article.publishAt, changeFrequency: "weekly" as const, priority: 0.9, alternates: bilingual(`https://idc-index.com${article.href}`, `https://idc-index.com${article.hrefEn}`) },
      { url: `https://idc-index.com${article.hrefEn}`, lastModified: article.publishAt, changeFrequency: "weekly" as const, priority: 0.9, alternates: bilingual(`https://idc-index.com${article.href}`, `https://idc-index.com${article.hrefEn}`) },
    ]),
    ...RUMOR_BRIEFS.flatMap((item) => [
      { url: `https://idc-index.com/rumors/${item.id}`, lastModified: item.publishedAt, changeFrequency: "daily" as const, priority: 0.8, alternates: bilingual(`https://idc-index.com/rumors/${item.id}`, `https://idc-index.com/en/rumors/${item.id}`) },
      { url: `https://idc-index.com/en/rumors/${item.id}`, lastModified: item.publishedAt, changeFrequency: "daily" as const, priority: 0.8, alternates: bilingual(`https://idc-index.com/rumors/${item.id}`, `https://idc-index.com/en/rumors/${item.id}`) },
    ]),
    ...entityDirectory.flatMap((entity) => [
      { url: `https://idc-index.com/companies/${entity.slug}`, changeFrequency: "daily" as const, priority: 0.8, alternates: bilingual(`https://idc-index.com/companies/${entity.slug}`, `https://idc-index.com/en/companies/${entity.slug}`) },
      { url: `https://idc-index.com/en/companies/${entity.slug}`, changeFrequency: "daily" as const, priority: 0.8, alternates: bilingual(`https://idc-index.com/companies/${entity.slug}`, `https://idc-index.com/en/companies/${entity.slug}`) },
    ]),
  ];
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
