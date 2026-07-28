import type { Metadata } from "next";
import HyperscaleLeaseArticle from "../../../columns/hyperscale-idc-leases/article";

const canonical = "https://idc-index.com/en/columns/hyperscale-idc-leases";

export const metadata: Metadata = {
  title: "Gigawatt Leases Are Reshaping the Data Center Market｜IDC Atlas",
  description: "What the latest CoreWeave, Digital Realty and VNET contracts reveal about hyperscale leasing, delivery, financing and customer concentration.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/hyperscale-idc-leases", en: canonical } },
  openGraph: { title: "Gigawatt Leases Are Reshaping the Data Center Market", description: "Contracted megawatts create visibility. Energization, financing and concentration decide how much becomes billable.", url: canonical, type: "article", publishedTime: "2026-07-28T00:00:00+08:00", images: [{ url: "https://idc-index.com/column-hyperscale-leases.png", width: 1672, height: 941, alt: "A hyperscale data center campus linked by long-term capacity contracts" }] },
  twitter: { card: "summary_large_image", title: "Gigawatt Leases Are Reshaping the Data Center Market", description: "How 100–600MW contracts convert into energized, billable data-center capacity.", images: ["https://idc-index.com/column-hyperscale-leases.png"] },
};

export default function Page() {
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: "Gigawatt Leases Are Reshaping the Data Center Market", description: metadata.description, image: "https://idc-index.com/column-hyperscale-leases.png", datePublished: "2026-07-28T00:00:00+08:00", dateModified: "2026-07-28T00:00:00+08:00", inLanguage: "en", author: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" }, publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" }, mainEntityOfPage: canonical };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><HyperscaleLeaseArticle lang="en" /></>;
}
