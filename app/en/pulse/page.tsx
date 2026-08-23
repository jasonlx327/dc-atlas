import type { Metadata } from "next";
import EnglishHome, { type AtlasPayload } from "../english-home";
import { loadInitialAtlasPayload } from "../../initial-atlas";
import { deriveConsoleMeta } from "../../console-meta";

const canonical = "https://idc-index.com/en/pulse";

export const metadata: Metadata = {
  title: "Data Center Project & Lease Tracker | IDC Atlas",
  description: "Daily source-linked tracker for global data-center projects, hyperscale leases and U.S. listed infrastructure-company disclosures.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/pulse", en: canonical, "x-default": canonical } },
  openGraph: {
    title: "Data Center Project & Lease Tracker | IDC Atlas",
    description: "Daily source-linked tracker for global data-center projects, hyperscale leases and U.S. listed infrastructure-company disclosures.",
    url: canonical,
    type: "website",
    images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas Infrastructure Pulse" }],
  },
  twitter: { card: "summary_large_image", title: "Data Center Project & Lease Tracker | IDC Atlas", images: ["/og-idc-atlas-en.png"] },
};

export default async function EnglishPulsePage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  const contentMeta = deriveConsoleMeta(initialPayload);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Data Center Project and Lease Tracker",
        url: canonical,
        inLanguage: "en-US",
        description: metadata.description,
        dateModified: contentMeta.lastContentChangedAt ?? contentMeta.reviewedAt,
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" },
        about: ["Data center projects", "Hyperscale leases", "U.S. listed infrastructure companies", "AI infrastructure"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" },
          { "@type": "ListItem", position: 2, name: "Infrastructure Pulse", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><EnglishHome initialPayload={initialPayload} view="pulse" /></>;
}
