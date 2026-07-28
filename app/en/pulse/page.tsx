import type { Metadata } from "next";
import EnglishHome, { type AtlasPayload } from "../english-home";
import { loadInitialAtlasPayload } from "../../initial-atlas";

const canonical = "https://idc-index.com/en/pulse";

export const metadata: Metadata = {
  title: "Data Center Project & Lease Tracker | IDC Atlas",
  description: "Daily source-linked tracker for global data-center projects, hyperscale leases and U.S. listed infrastructure-company disclosures.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/pulse", en: canonical } },
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
  return <EnglishHome initialPayload={initialPayload} view="pulse" />;
}
