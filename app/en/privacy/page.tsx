import type { Metadata } from "next";
import { IntelligenceConsoleShell } from "../../intelligence-console-overview";

const canonical = "https://idc-index.com/en/privacy";

export const metadata: Metadata = {
  title: "Privacy Notice | IDC Atlas",
  description: "How IDC Atlas uses Google Analytics and handles website-usage data.",
  alternates: {
    canonical,
    languages: {
      "en": canonical,
      "zh-CN": "https://idc-index.com/privacy",
    },
  },
  robots: { index: false, follow: true },
};

export default function EnglishPrivacyPage() {
  return (
    <IntelligenceConsoleShell lang="en" pageLabel="Privacy notice" className="atlas-privacy-shell">
      <div className="privacy-page atlas-console-content-page">
        <p className="eyebrow"><span></span> PRIVACY NOTICE</p>
        <h1>Privacy notice</h1>
        <p className="privacy-updated">Updated July 22, 2026</p>

        <section>
          <h2>Traffic analytics</h2>
          <p>IDC Atlas uses Google Analytics to understand page visits, traffic sources, device types, approximate regions and page interactions so we can improve the product. The site does not require an account and does not intentionally collect names, email addresses or other directly identifying information through Analytics.</p>
        </section>

        <section>
          <h2>Cookies and third-party services</h2>
          <p>Google Analytics may use cookies or similar technologies to process usage data. IDC Atlas does not set first-party cookies for earnings interactions or user profiling. See <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Google&apos;s partner-sites privacy information</a> for details. You can restrict or delete cookies through your browser settings.</p>
        </section>

        <section>
          <h2>External links and contact</h2>
          <p>IDC Atlas links to news reports, filings and other source material. Those sites apply their own privacy policies. Questions about this notice can be sent through <a href="https://github.com/jasonlx327" target="_blank" rel="noreferrer">GitHub</a>.</p>
        </section>
      </div>
    </IntelligenceConsoleShell>
  );
}
