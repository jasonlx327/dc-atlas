import type { Metadata } from "next";
import WatchIndex, { type WatchPayload } from "../../watch-index";
import { loadInitialAtlasPayload } from "../../initial-atlas";

const canonical = "https://idc-index.com/en/rumors";

export const metadata: Metadata = {
  title: "Rumor Watch | IDC Atlas",
  description: "Reported data-center, cloud, chip and AI-infrastructure developments not yet fully confirmed by companies or regulators, with entities, responses and sources visible.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/rumors", en: canonical, "x-default": canonical } },
  openGraph: { title: "Rumor Watch | IDC Atlas", description: "Reported developments with entities, public responses, timestamps and source boundaries visible.", url: canonical, type: "website" },
};

export default async function EnglishRumorsPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<WatchPayload> | null;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Rumor Watch",
    url: canonical,
    inLanguage: "en-US",
    description: metadata.description,
    isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><WatchIndex lang="en" kind="rumors" initialPayload={initialPayload} /></>;
}
