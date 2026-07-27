import type { Metadata } from "next";
import EnglishHome, { type AtlasPayload } from "./english-home";
import { loadInitialAtlasPayload } from "../initial-atlas";

const canonical = "https://idc-index.com/en";

export const metadata: Metadata = {
  title: "IDC Atlas | Data Center Intelligence for Investors",
  description: "Source-first data center intelligence for investors tracking AI infrastructure, cloud CAPEX, power, cooling, semiconductors and global campus buildouts.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/", en: canonical } },
  openGraph: {
    title: "IDC Atlas | Data Center Intelligence for Investors",
    description: "Track AI infrastructure, cloud CAPEX and data-center buildouts through source-linked public intelligence.",
    url: canonical,
    type: "website",
    images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas AI Infrastructure Intelligence" }],
  },
  twitter: { card: "summary_large_image", title: "IDC Atlas | Data Center Intelligence for Investors", images: ["/og-idc-atlas-en.png"] },
};

export default async function EnglishPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  return <EnglishHome initialPayload={initialPayload} />;
}
