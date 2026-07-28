import type { Metadata } from "next";
import EnglishHome, { type AtlasPayload } from "../english-home";
import { loadInitialAtlasPayload } from "../../initial-atlas";

const canonical = "https://idc-index.com/en/industry";

export const metadata: Metadata = {
  title: "AI Infrastructure Industry Map | IDC Atlas",
  description: "Track compute, networking, power, cooling, campus capacity and selective global supply-chain signals.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/industry", en: canonical } },
  openGraph: {
    title: "AI Infrastructure Industry Map | IDC Atlas",
    description: "Track compute, networking, power, cooling, campus capacity and selective global supply-chain signals.",
    url: canonical,
    type: "website",
    images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas AI Infrastructure Industry Map" }],
  },
  twitter: { card: "summary_large_image", title: "AI Infrastructure Industry Map | IDC Atlas", images: ["/og-idc-atlas-en.png"] },
};

export default async function EnglishIndustryPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  return <EnglishHome initialPayload={initialPayload} view="industry" />;
}
