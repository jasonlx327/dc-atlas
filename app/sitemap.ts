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
  ];
}
