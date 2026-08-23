import type { Metadata } from "next";
import WatchIndex, { type WatchPayload } from "../../watch-index";
import { loadInitialAtlasPayload } from "../../initial-atlas";
import { deriveConsoleMeta } from "../../console-meta";
import { RUMOR_BRIEFS } from "../../watch-data";

const canonical = "https://idc-index.com/en/rumors";

export const metadata: Metadata = {
  title: "Rumor Watch | IDC Atlas",
  description: "Reported data-center, cloud, chip and AI-infrastructure developments not yet fully confirmed by companies or regulators, with entities, responses and sources visible.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/rumors", en: canonical, "x-default": canonical } },
  openGraph: { title: "Rumor Watch | IDC Atlas", description: "Reported developments with entities, public responses, timestamps and source boundaries visible.", url: canonical, type: "website", images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas Rumor Watch" }] },
  twitter: { card: "summary_large_image", title: "Rumor Watch | IDC Atlas", description: "Reported developments with entities, public responses, timestamps and source boundaries visible.", images: ["/og-idc-atlas-en.png"] },
};

export default async function EnglishRumorsPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<WatchPayload> | null;
  const contentMeta = deriveConsoleMeta(initialPayload);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Rumor Watch",
    url: canonical,
    inLanguage: "en-US",
    description: metadata.description,
    dateModified: contentMeta.lastContentChangedAt ?? contentMeta.reviewedAt,
    isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: RUMOR_BRIEFS.length,
      itemListElement: RUMOR_BRIEFS.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.titleEn,
        url: `https://idc-index.com/en/rumors/${item.id}`,
      })),
    },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><WatchIndex lang="en" kind="rumors" initialPayload={initialPayload} /></>;
}
