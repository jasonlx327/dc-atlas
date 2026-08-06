import type { Metadata } from "next";
import Link from "next/link";

const canonical = "https://idc-index.com/en/topics/data-center-intelligence";

export const metadata: Metadata = {
  title: "Data Center Market Tracker & Infrastructure Reports | IDC Atlas",
  description: "Track global data-center projects, capacity, leases, power, liquid cooling, AI hardware, hyperscaler CAPEX and public-company disclosures.",
  alternates: {
    canonical,
    languages: {
      "zh-CN": "https://idc-index.com/topics/data-center-intelligence",
      en: canonical,
      "x-default": canonical,
    },
  },
  openGraph: {
    title: "Data Center Market Tracker & Infrastructure Reports",
    description: "Source-linked tracking of data-center projects, capacity, leases, power, cooling and AI infrastructure demand.",
    url: canonical,
    type: "article",
    images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas data center infrastructure intelligence" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Center Market Tracker & Infrastructure Reports",
    description: "Source-linked data-center projects, capacity, leases, power, cooling and AI infrastructure demand.",
    images: ["/og-idc-atlas-en.png"],
  },
};

const sections = [
  ["Projects, campuses and capacity", "Follow construction, expansion, lease, delivery and commissioning milestones while separating announced, energized and billable capacity."],
  ["Power, cooling and networks", "Track grid access, clean power, electrical distribution, liquid cooling and high-speed interconnects that shape deployment timing."],
  ["CAPEX and public companies", "Connect hyperscaler capital spending, long-term data-center leases and company disclosures to campus construction and infrastructure orders."],
] as const;

const faqs = [
  ["What does IDC Atlas track?", "Data-center projects, capacity, leases, power, cooling, networking, compute demand and listed-company disclosures, with traceable public sources prioritized."],
  ["How often is the tracker updated?", "Live cards update when reliable public information is available. The full site is checked daily, and every item keeps a specific date and source."],
  ["How are reports verified?", "News leads and primary disclosures are shown separately. Capacity, delivery, commissioning and product specifications should be checked against the attached original source."],
  ["Is IDC Atlas affiliated with International Data Corporation?", "No. IDC Atlas is an independent data-center and AI-infrastructure research site."],
] as const;

export default function EnglishDataCenterIntelligencePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Data Center Market Tracker & Infrastructure Reports",
        url: canonical,
        inLanguage: "en-US",
        about: ["Data center projects", "Data center capacity", "Data center leases", "Data center power", "Liquid cooling", "Hyperscaler capital expenditure"],
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" },
          { "@type": "ListItem", position: 2, name: "Data Center Market Tracker", item: canonical },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return <main className="topic-page" lang="en"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="topic-nav"><Link href="/en">IDC ATLAS</Link><div><Link href="/topics/data-center-intelligence" lang="zh-CN">中文</Link><Link href="/en">Back to intelligence</Link></div></header><section className="topic-hero"><p>TOPIC GUIDE · DATA CENTER MARKET</p><h1>Data center market<br /><em>tracker and reports.</em></h1><p>IDC Atlas serves investors, researchers and operators tracking data-center construction, capacity conversion, power, cooling, networking and AI infrastructure demand. Every material update retains a traceable public source.</p><Link href="/en/pulse">Open the data center project and company tracker</Link></section><section className="topic-sections">{sections.map(([title, copy]) => <article key={title}><span>IDC ATLAS</span><h2>{title}</h2><p>{copy}</p></article>)}</section><section className="topic-note"><h2>How to use the tracker</h2><p>News leads and primary disclosures are shown separately. Use the original source attached to each item when checking capacity, delivery, commissioning and product specifications.</p><p><Link href="/en/topics/data-center-glossary">Read the data center glossary</Link> · <Link href="/en/industry">Explore the infrastructure map</Link> · <Link href="/en/columns">Read the columns</Link> · <Link href="/en/methodology">Review the methodology</Link></p></section><section className="topic-faq" aria-labelledby="topic-faq-title"><div><span>FAQ · SOURCE-FIRST</span><h2 id="topic-faq-title">Frequently asked questions</h2></div><div className="topic-faq-grid">{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section></main>;
}
