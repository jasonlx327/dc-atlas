import type { Metadata } from "next";
import EnglishHome, { type AtlasPayload } from "../english-home";
import { loadInitialAtlasPayload } from "../../initial-atlas";

const canonical = "https://idc-index.com/en/industry";

export const metadata: Metadata = {
  title: "AI Data Center Supply Chain: Power, Cooling & Compute | IDC Atlas",
  description: "Track compute, networking, grid access, liquid cooling, campus capacity and global AI data-center supply-chain signals.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/industry", en: canonical, "x-default": canonical } },
  openGraph: {
    title: "AI Data Center Supply Chain: Power, Cooling & Compute | IDC Atlas",
    description: "Track compute, networking, grid access, liquid cooling, campus capacity and global AI data-center supply-chain signals.",
    url: canonical,
    type: "website",
    images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas AI Infrastructure Industry Map" }],
  },
  twitter: { card: "summary_large_image", title: "AI Data Center Supply Chain: Power, Cooling & Compute | IDC Atlas", images: ["/og-idc-atlas-en.png"] },
};

export default async function EnglishIndustryPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "AI Data Center Infrastructure Map",
        url: canonical,
        inLanguage: "en-US",
        description: metadata.description,
        dateModified: initialPayload?.generatedAt,
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" },
        about: ["AI accelerators", "Data center networking", "Grid access", "Liquid cooling", "Campus capacity"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" },
          { "@type": "ListItem", position: 2, name: "Infrastructure Center", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><EnglishHome initialPayload={initialPayload} view="industry" /></>;
}
