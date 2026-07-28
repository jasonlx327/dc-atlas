import type { Metadata } from "next";
import EnglishHome, { type AtlasPayload } from "../english-home";
import { loadInitialAtlasPayload } from "../../initial-atlas";

const canonical = "https://idc-index.com/en/pulse";

export const metadata: Metadata = {
  title: "Infrastructure Pulse | IDC Atlas",
  description: "Verified global data-center projects, leases and U.S. listed-company infrastructure disclosures.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/pulse", en: canonical } },
  openGraph: {
    title: "Infrastructure Pulse | IDC Atlas",
    description: "Verified global data-center projects, leases and U.S. listed-company infrastructure disclosures.",
    url: canonical,
    type: "website",
    images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas Infrastructure Pulse" }],
  },
  twitter: { card: "summary_large_image", title: "Infrastructure Pulse | IDC Atlas", images: ["/og-idc-atlas-en.png"] },
};

export default async function EnglishPulsePage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  return <EnglishHome initialPayload={initialPayload} view="pulse" />;
}
