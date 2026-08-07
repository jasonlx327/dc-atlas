import type { Metadata } from "next";
import Link from "next/link";

const canonical = "https://idc-index.com/en/topics/data-center-glossary";

export const metadata: Metadata = {
  title: "Data Center Glossary: Capacity, CAPEX, Power, Cooling & AI Clusters | IDC Atlas",
  description: "A source-first guide to data-center capacity, CAPEX, power, liquid cooling and AI GPU clusters, including the boundaries that matter when reading disclosures.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/topics/data-center-glossary", en: canonical, "x-default": canonical } },
  openGraph: { title: "Data Center Glossary: Capacity, CAPEX, Power, Cooling & AI Clusters", description: "Core terms and disclosure boundaries for data-center and AI-infrastructure research.", url: canonical, type: "article", images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas data center infrastructure intelligence" }] },
  twitter: { card: "summary_large_image", title: "Data Center Glossary | IDC Atlas", description: "Core terms and disclosure boundaries for data-center and AI-infrastructure research.", images: ["/og-idc-atlas-en.png"] },
};

const terms = [
  ["Capacity: announced, energized and billable", "A campus's announced MW, energized MW and customer-delivered, billable MW describe different stages. Confirm whether a figure is planned, interconnected, commissioned or leased before comparing projects."],
  ["CAPEX: spending is not revenue", "Capital expenditure may cover land, halls, servers, networking, power and cooling. It measures build intensity, but does not by itself prove demand, activation speed or future free-cash-flow conversion."],
  ["Power and interconnection: capacity's prerequisite", "High-density campuses need usable power, transmission and distribution work, and the relevant interconnection and permitting path. Announced scale becomes more credible as that path becomes specific."],
  ["Liquid cooling: an engineering choice", "Liquid cooling addresses heat at higher rack densities. Read disclosures for the cooling architecture, deployment scope, rack density and delivery status rather than treating the label as a capacity claim."],
  ["AI GPU clusters: chips to usable compute", "GPU count is only one part of a cluster. Networking, storage, power, cooling, the software stack and operations determine whether a system can sustain training or inference workloads."],
] as const;

export default function EnglishDataCenterGlossaryPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "DefinedTermSet", name: "IDC Atlas Data Center and AI Infrastructure Glossary", url: canonical, inLanguage: "en-US", hasDefinedTerm: terms.map(([name, description]) => ({ "@type": "DefinedTerm", name, description, inDefinedTermSet: canonical })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" }, { "@type": "ListItem", position: 2, name: "Data Center Glossary", item: canonical }] },
    ],
  };

  return <main className="topic-page" lang="en"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="topic-nav"><Link href="/en">IDC ATLAS</Link><div><Link href="/topics/data-center-glossary" lang="zh-CN">中文</Link><Link href="/en/industry">Back to infrastructure center</Link></div></header><section className="topic-hero"><p>REFERENCE GUIDE · DATA CENTER TERMS</p><h1>Read data-center<br /><em>and AI-infrastructure metrics.</em></h1><p>IDC Atlas tracks projects, campuses, power, cooling and compute hardware through public sources. These terms separate project marketing, engineering progress and deliverable capacity; they do not replace the primary disclosure attached to each item.</p><Link href="/en/pulse">Open the project and company pulse</Link></section><section className="topic-sections">{terms.map(([name, description]) => <article key={name}><span>IDC ATLAS · TERM</span><h2>{name}</h2><p>{description}</p></article>)}</section><section className="topic-note"><h2>Reading boundary</h2><p>These definitions are a reading framework, not conclusions about any individual project. Use the original source and specific date attached to each item for capacity, delivery, product and financial claims.</p><p><Link href="/en/topics/data-center-intelligence">Data center market tracker</Link> · <Link href="/en/industry">Infrastructure center</Link> · <Link href="/en/methodology">Methodology and sources</Link></p></section></main>;
}
