import type { Metadata } from "next";
import EnglishHome, { type AtlasPayload } from "./english-home";
import { loadInitialAtlasPayload } from "../initial-atlas";

const canonical = "https://idc-index.com/en";

export const metadata: Metadata = {
  title: "Data Center Infrastructure Intelligence | IDC Atlas",
  description: "Track hyperscaler CAPEX, data-center leases, power, liquid cooling, AI hardware and earnings through daily source-linked intelligence.",
  alternates: {
    canonical,
    languages: { "zh-CN": "https://idc-index.com/", en: canonical, "x-default": canonical },
    types: { "application/rss+xml": "https://idc-index.com/en/feed.xml" },
  },
  other: { "content-language": "en-US" },
  openGraph: {
    title: "Data Center Infrastructure Intelligence | IDC Atlas",
    description: "Track hyperscaler CAPEX, data-center leases, power, cooling and AI hardware through source-linked public intelligence.",
    url: canonical,
    type: "website",
    images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas AI Infrastructure Intelligence" }],
  },
  twitter: { card: "summary_large_image", title: "Data Center Infrastructure Intelligence | IDC Atlas", description: "Daily intelligence on hyperscaler CAPEX, data-center leases, power, cooling and AI hardware.", images: ["/og-idc-atlas-en.png"] },
};

export default async function EnglishPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "IDC Atlas",
        url: "https://idc-index.com/en",
        inLanguage: ["en", "zh-CN"],
        description: "Source-linked intelligence for data-center construction, AI infrastructure, power, cooling, networking and China AI silicon.",
      },
      {
        "@type": "Organization",
        name: "IDC Atlas",
        url: "https://idc-index.com/",
        sameAs: ["https://github.com/jasonlx327"],
      },
      {
        "@type": "CollectionPage",
        name: "Data Center Infrastructure Intelligence",
        url: canonical,
        inLanguage: "en-US",
        description: metadata.description,
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        about: [
          { "@type": "Thing", name: "Data center infrastructure" },
          { "@type": "Thing", name: "Hyperscaler capital expenditure" },
          { "@type": "Thing", name: "Data center leasing" },
          { "@type": "Thing", name: "Power and liquid cooling" },
        ],
        hasPart: [
          { "@type": "WebPage", name: "Infrastructure Pulse", url: "https://idc-index.com/en/pulse" },
          { "@type": "WebPage", name: "AI Infrastructure Industry Map", url: "https://idc-index.com/en/industry" },
          { "@type": "WebPage", name: "IDC Atlas Columns", url: "https://idc-index.com/en/columns" },
          { "@type": "WebPage", name: "Rumor Watch", url: "https://idc-index.com/en/rumors" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: canonical },
        ],
      },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><EnglishHome initialPayload={initialPayload} /></>;
}
