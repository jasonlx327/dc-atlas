import type { Metadata } from "next";
import ColumnsIndex from "../../columns/columns-index";

const canonical = "https://idc-index.com/en/columns";

export const metadata: Metadata = {
  title: "IDC Atlas Columns｜Data Center & AI Infrastructure Research",
  description: "Source-linked IDC Atlas analysis of data-center contracts, hyperscaler capital spending, power, cooling and billable capacity.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns", en: canonical } },
  openGraph: { title: "IDC Atlas Columns", description: "Source-linked research for the data-center and AI infrastructure cycle.", url: canonical, type: "website" },
};

export default function Page() {
  return <ColumnsIndex lang="en" />;
}
