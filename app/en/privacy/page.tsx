import type { Metadata } from "next";
import { IntelligenceConsoleShell } from "../../intelligence-console-overview";
import { ContextPage } from "../../context-page";

const canonical = "https://idc-index.com/en/privacy";

export const metadata: Metadata = {
  title: "Privacy Notice | IDC Atlas",
  description: "How IDC Atlas uses Google Analytics and handles website-usage data.",
  alternates: {
    canonical,
    languages: {
      "en": canonical,
      "zh-CN": "https://idc-index.com/privacy",
      "x-default": canonical,
    },
  },
  openGraph: { title: "Privacy Notice | IDC Atlas", description: "How IDC Atlas uses Google Analytics and handles website-usage data.", url: canonical, type: "article", images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas privacy notice" }] },
  twitter: { card: "summary_large_image", title: "Privacy Notice | IDC Atlas", description: "How IDC Atlas uses Google Analytics and handles website-usage data.", images: ["/og-idc-atlas-en.png"] },
  robots: { index: false, follow: true },
};

export default function EnglishPrivacyPage() {
  return (
    <IntelligenceConsoleShell lang="en" pageLabel="Privacy notice" className="atlas-privacy-shell"
      contextStatus={{ title: "Privacy notice", subtitle: "Analytics and third-party services", languageHref: "/privacy?lang=zh", items: [{ label: "Data use", value: "Improve content and experience" }, { label: "Accounts", value: "No registration required" }, { label: "Last updated", value: "July 22, 2026" }] }}
    ><ContextPage
      eyebrow="PRIVACY NOTICE · DATA BOUNDARY"
      title={<>How we handle<br />usage data</>}
      summary="IDC Atlas uses the minimum necessary analytics to improve content and experience. The site has no account requirement and does not intentionally collect names, email addresses or other directly identifying information through Analytics."
      backHref="/en#overview"
      backLabel="Back to intelligence overview →"
      items={[{ label: "Analytics", value: "Google Analytics" }, { label: "On-site accounts", value: "Not enabled" }, { label: "User profiling", value: "Not created" }]}
      sections={[
        { label: "01 · ANALYTICS", title: "Traffic analytics", copy: "We use Google Analytics to understand page visits, traffic sources, device types, approximate regions and page interactions so we can improve the product." },
        { label: "02 · COOKIES", title: "Cookies and third-party services", copy: <>Google Analytics may use cookies or similar technologies to process usage data. IDC Atlas does not set first-party cookies for earnings interactions or user profiling; you can restrict or delete cookies in browser settings. See <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Google&apos;s partner-sites information</a> for details.</> },
        { label: "03 · EXTERNAL LINKS", title: "External links and contact", copy: <>IDC Atlas links to reporting, filings and other source material. Those sites apply their own privacy policies. Questions about this notice can be sent through <a href="https://github.com/jasonlx327" target="_blank" rel="noreferrer">GitHub</a>.</> },
      ]}
      boundary={{ label: "NOTICE", title: "Third-party sites apply their own rules", copy: "When you leave IDC Atlas for an original source or another third-party site, its own data collection, cookie and privacy rules apply." }}
    /></IntelligenceConsoleShell>
  );
}
