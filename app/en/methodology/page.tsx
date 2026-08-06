import type { Metadata } from "next";
import { ContextPage } from "../../context-page";
import { IntelligenceConsoleShell } from "../../intelligence-console-overview";

const canonical = "https://idc-index.com/en/methodology";

export const metadata: Metadata = {
  title: "Methodology and Sources | IDC Atlas",
  description: "How IDC Atlas sources, verifies and updates data-center and AI-infrastructure intelligence.",
  alternates: {
    canonical,
    languages: {
      "en": canonical,
      "zh-CN": "https://idc-index.com/methodology",
    },
  },
};

export default function EnglishMethodologyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Methodology and Sources",
    url: canonical,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" },
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><IntelligenceConsoleShell
    lang="en"
    pageLabel="Methodology and sources"
    className="atlas-method-shell"
    contextStatus={{ title: "Research method", subtitle: "Methodology and sources", languageHref: "/methodology?lang=zh", items: [{ label: "Source hierarchy", value: "Primary disclosure first" }, { label: "Review cadence", value: "After material disclosure" }, { label: "Research boundary", value: "Not investment advice" }] }}
  ><ContextPage
    eyebrow="METHOD & SOURCES · RESEARCH METHOD"
    title={<>How information<br />enters IDC Atlas</>}
    summary="IDC Atlas tracks public data-center and AI-infrastructure developments. Discovery leads, primary disclosures and research conclusions are shown separately so readers can trace the source and judge its boundary."
    backHref="/en#overview"
    backLabel="Back to intelligence overview →"
    items={[{ label: "Source hierarchy", value: "Primary disclosure first" }, { label: "Verified fields", value: "Capacity, value, specs and delivery" }, { label: "Presentation rule", value: "Lead is not a conclusion" }]}
    sections={[
      { label: "01 · DISCOVERY", title: "Surface a lead", copy: "Public reporting, specialist channels and developer information help surface a change. They begin a source check; they do not settle a factual claim." },
      { label: "02 · PRIMARY SOURCES", title: "Verify the record", copy: "Vendor sites, exchange filings, government and project notices, and developer documentation anchor capacity, value, specifications and delivery timing." },
      { label: "03 · REVIEW", title: "Review and update", copy: "The homepage follows available public signals. Topic pages are reviewed after material disclosures, with sources and specific dates retained where possible." },
    ]}
    boundary={{ label: "RESEARCH BOUNDARY", title: "Public-information research, not a recommendation", copy: "This site is for public-information research and industry observation only. Undisclosed, unverifiable or conflicting claims are not presented as confirmed facts." }}
  /></IntelligenceConsoleShell></>;
}
