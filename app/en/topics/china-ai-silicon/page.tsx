import type { Metadata } from "next";
import Link from "next/link";

const canonical = "https://idc-index.com/en/topics/china-ai-silicon";

export const metadata: Metadata = {
  title: "China GPU & AI Silicon | IDC Atlas",
  description: "Track public milestones across China's GPUs, DCUs, AI accelerators, supernodes and developer ecosystems.",
  alternates: {
    canonical,
    languages: {
      "zh-CN": "https://idc-index.com/topics/china-ai-silicon",
      en: canonical,
      "x-default": canonical,
    },
  },
  openGraph: { title: "China GPU & AI Silicon", description: "Source-linked coverage of China's GPU, DCU, AI-accelerator, supernode and software-ecosystem milestones.", url: canonical, type: "article", images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas China GPU and AI silicon" }] },
  twitter: { card: "summary_large_image", title: "China GPU & AI Silicon | IDC Atlas", description: "Source-linked coverage of China's GPU, DCU, AI-accelerator, supernode and software-ecosystem milestones.", images: ["/og-idc-atlas-en.png"] },
};

const sections = [
  ["Silicon and products", "Follow GPU, DCU and AI-accelerator disclosures, development, software enablement and delivery milestones without treating unverified performance claims as fact."],
  ["Supernodes and interconnect", "Beyond a single accelerator, interconnect, unified memory, cooling and systems software determine whether scale-out deployment is practical."],
  ["Software ecosystem", "Developer toolchains, framework support, communications libraries and operations are core signals of engineering readiness."],
] as const;

const faqs = [
  ["Which China AI-silicon areas are covered?", "GPU, DCU, AI accelerators, supernodes, interconnect and developer ecosystems are covered; unverified product rumors are not treated as facts."],
  ["What counts as verified information?", "Vendor, exchange, developer-site and project disclosures are treated as primary evidence; media reports are labeled as leads and kept distinct from originals."],
  ["How should performance and production claims be read?", "Performance, production and delivery claims should follow original disclosures. Cross-product comparisons also require test conditions, software stack and full-system parameters."],
] as const;

export default function EnglishChinaAiSiliconPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: "China GPU & AI Silicon", url: canonical, inLanguage: "en-US", isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" } },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" }, { "@type": "ListItem", position: 2, name: "China GPU & AI Silicon", item: canonical }] },
      { "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    ],
  };

  return <main className="topic-page" lang="en"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="topic-nav"><Link href="/en">IDC ATLAS</Link><div><Link href="/topics/china-ai-silicon" lang="zh-CN">中文</Link><Link href="/en/industry?tab=china">Back to China GPU radar</Link></div></header><section className="topic-hero coral"><p>TOPIC GUIDE · CHINA GPU</p><h1>China GPU &amp; AI Silicon<br /><em>source-linked milestones.</em></h1><p>Track China&apos;s GPU, DCU, AI-accelerator, supernode and developer-ecosystem milestones through public, source-linked intelligence. Material claims remain tied to their original disclosures.</p><Link href="/en/industry?tab=china">View recent signals →</Link></section><section className="topic-sections">{sections.map(([title, copy]) => <article key={title}><span>CN SILICON</span><h2>{title}</h2><p>{copy}</p></article>)}</section><section className="topic-note"><h2>Evidence boundary</h2><p>Media leads are distinguished from vendor, exchange, developer-community and project disclosures. Original disclosures control performance, production and delivery claims.</p><p><Link href="/en/industry?tab=china">Explore the China GPU radar</Link> · <Link href="/en/methodology">Review the methodology</Link></p></section><section className="topic-faq coral" aria-labelledby="topic-faq-title"><div><span>FAQ · SOURCE-FIRST</span><h2 id="topic-faq-title">Frequently asked questions</h2></div><div className="topic-faq-grid">{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section></main>;
}
