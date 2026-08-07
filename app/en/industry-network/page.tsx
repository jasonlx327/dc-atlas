import type { Metadata } from "next";
import IndustryNetworkClient from "../../industry-network/industry-network-client";

const canonical = "https://idc-index.com/en/industry-network";

export const metadata: Metadata = {
  title: "Industry Network | IDC Atlas",
  description: "Start from one company and explore its public upstream and downstream relationships, amounts and sources across HBM, cooling, power, leasing, storage and China-compute chains.",
  alternates: {
    canonical,
    languages: { "zh-CN": "https://idc-index.com/industry-network", en: canonical, "x-default": canonical },
  },
  openGraph: { title: "Industry Network | IDC Atlas", description: "Start from one company and explore its public upstream and downstream relationships, amounts and sources across HBM, cooling, power, leasing, storage and China-compute chains.", url: canonical, type: "website", images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas industry relationship network" }] },
  twitter: { card: "summary_large_image", title: "Industry Network | IDC Atlas", description: "Explore source-linked upstream and downstream relationships across HBM, cooling, power, leasing, storage and China-compute chains.", images: ["/og-idc-atlas-en.png"] },
};

export default async function EnglishIndustryNetworkPage({ searchParams }: { searchParams: Promise<{ focus?: string | string[]; scenario?: string | string[] }> }) {
  const params = await searchParams;
  const focus = typeof params.focus === "string" ? params.focus : undefined;
  const scenario = typeof params.scenario === "string" ? params.scenario : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Industry Network",
        description: metadata.description,
        url: canonical,
        inLanguage: "en-US",
        about: ["HBM", "liquid cooling", "data-center power", "IDC leasing", "memory", "China AI silicon"],
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" },
        mainEntity: {
          "@type": "WebApplication",
          name: "IDC Atlas Industry Relationship Network",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          isAccessibleForFree: true,
          featureList: ["Explore upstream and downstream company relationships", "Inspect source-linked amounts", "Filter evidence by infrastructure theme"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" },
          { "@type": "ListItem", position: 2, name: "Industry Network", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><IndustryNetworkClient lang="en" initialFocus={focus} initialScenario={scenario} /></>;
}
