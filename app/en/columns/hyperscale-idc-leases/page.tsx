import type { Metadata } from "next";
import HyperscaleLeaseArticle from "../../../columns/hyperscale-idc-leases/article";

const canonical = "https://idc-index.com/en/columns/hyperscale-idc-leases";

export const metadata: Metadata = {
  title: "Gigawatt Leases Are Reshaping the Data Center Market｜IDC Atlas",
  description: "What the latest CoreWeave, Digital Realty and VNET contracts reveal about hyperscale leasing, delivery, financing and customer concentration.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/hyperscale-idc-leases", en: canonical, "x-default": canonical } },
  openGraph: { title: "Gigawatt Leases Are Reshaping the Data Center Market", description: "Contracted megawatts create visibility. Energization, financing and concentration decide how much becomes billable.", url: canonical, type: "article", publishedTime: "2026-07-28T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/column-hyperscale-leases.png", width: 1672, height: 941, alt: "A hyperscale data center campus linked by long-term capacity contracts" }] },
  twitter: { card: "summary_large_image", title: "Gigawatt Leases Are Reshaping the Data Center Market", description: "How 100–600MW contracts convert into energized, billable data-center capacity.", images: ["https://idc-index.com/column-hyperscale-leases.png"] },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Gigawatt Leases Are Reshaping the Data Center Market",
        description: metadata.description,
        image: "https://idc-index.com/column-hyperscale-leases.png",
        datePublished: "2026-07-28T00:00:00+08:00",
        dateModified: "2026-08-01T23:00:00+08:00",
        inLanguage: "en-US",
        articleSection: "Hyperscale data center leasing",
        isAccessibleForFree: true,
        about: ["Data center leases", "Hyperscale cloud customers", "Energized capacity", "Billable megawatts"],
        citation: [
          "https://ir.applieddigital.com/sec-filings/all-sec-filings/content/0001144879-26-000036/apld_invxinvestorpresent.htm",
          "https://investors.corescientific.com/sec-filings/all-sec-filings/content/0001193125-26-165121/d149019dex992.htm",
          "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-announces-purchase-blackstone-interest-three",
          "https://ir.vnet.com/news-releases/news-release-details/vnet-reports-unaudited-first-quarter-2026-financial-results",
        ],
        author: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        mainEntityOfPage: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" },
          { "@type": "ListItem", position: 2, name: "Columns", item: "https://idc-index.com/en/columns" },
          { "@type": "ListItem", position: 3, name: "Gigawatt Leases Are Reshaping the Data Center Market", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><HyperscaleLeaseArticle lang="en" /></>;
}
