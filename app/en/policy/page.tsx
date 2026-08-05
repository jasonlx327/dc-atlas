import type { Metadata } from "next";
import WatchIndex, { type WatchPayload } from "../../watch-index";
import { loadInitialAtlasPayload } from "../../initial-atlas";
import { POLICY_BRIEFS } from "../../watch-data";

const canonical = "https://idc-index.com/en/policy";

export const metadata: Metadata = {
  title: "China / U.S. Data Center Policy Tracker | IDC Atlas",
  description: "Source-linked briefs on China and U.S. policy changes affecting data-center construction, power, interconnection and operating costs, with status and direct effects.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/policy", en: canonical, "x-default": canonical } },
  openGraph: { title: "China / U.S. Data Center Policy Tracker", description: "Source-linked policy briefs with implementation status and direct effects.", url: canonical, type: "website" },
};

export default async function EnglishPolicyPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<WatchPayload> | null;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "China / U.S. Data Center Policy Tracker",
    url: canonical,
    inLanguage: "en-US",
    description: metadata.description,
    isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: POLICY_BRIEFS.length,
      itemListElement: POLICY_BRIEFS.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.titleEn,
        url: `https://idc-index.com/en/policy/${item.id}`,
      })),
    },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><WatchIndex lang="en" kind="policy" initialPayload={initialPayload} /></>;
}
