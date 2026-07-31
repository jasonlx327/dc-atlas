import type { Metadata } from "next";
import ColumnsIndex from "../../columns/columns-index";

const canonical = "https://idc-index.com/en/columns";

export const metadata: Metadata = {
  title: "IDC Atlas Columns｜Data Center & AI Infrastructure Research",
  description: "Source-linked IDC Atlas analysis of data-center contracts, hyperscaler capital spending, power, cooling and billable capacity.",
  alternates: {
    canonical,
    languages: { "zh-CN": "https://idc-index.com/columns", en: canonical, "x-default": canonical },
    types: { "application/rss+xml": "https://idc-index.com/en/feed.xml" },
  },
  openGraph: { title: "IDC Atlas Columns", description: "Source-linked research for the data-center and AI infrastructure cycle.", url: canonical, type: "website", images: [{ url: "https://idc-index.com/column-cxmt-us-chips.png", width: 1672, height: 941, alt: "IDC Atlas data center and AI infrastructure research" }] },
  twitter: { card: "summary_large_image", title: "IDC Atlas Columns", description: "Source-linked research for the data-center and AI infrastructure cycle.", images: ["https://idc-index.com/column-cxmt-us-chips.png"] },
};

export default function Page() {
  return <ColumnsIndex lang="en" />;
}
