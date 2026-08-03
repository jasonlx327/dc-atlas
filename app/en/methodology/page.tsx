import type { Metadata } from "next";
import Link from "next/link";
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

const sections = [
  ["Sources", "Public reporting and specialist feeds surface leads. Vendor sites, exchange filings, government and project notices, and developer documentation are used to verify material facts."],
  ["Verification", "Capacity, value, specifications and delivery timing are anchored to primary disclosures where available. Media-only claims remain attributed rather than presented as settled fact."],
  ["Update cadence", "The homepage updates with available public signals. Topic pages are reviewed after material disclosures, with source links and verification dates retained wherever possible."],
] as const;

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
  ><div className="topic-page atlas-console-content-page"><section className="topic-hero"><p>METHOD &amp; SOURCES</p><h1>How IDC Atlas<br /><em>builds a signal</em></h1><p>IDC Atlas tracks public developments across data centers, AI infrastructure, compute, power and cooling. Discovery signals and verified facts are kept separate so readers can trace the evidence and understand its limits.</p><Link href="/en#overview">Back to the intelligence overview</Link></section><section className="topic-sections">{sections.map(([title, copy]) => <article key={title}><span>IDC ATLAS STANDARD</span><h2>{title}</h2><p>{copy}</p></article>)}</section><section className="topic-note"><h2>Research boundary</h2><p>This site is for public-information research and industry observation only, not investment advice. Undisclosed, unverifiable or conflicting claims are not presented as confirmed facts.</p></section></div></IntelligenceConsoleShell></>;
}
