import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchDetail from "../../../watch-detail";
import { POLICY_BRIEFS } from "../../../watch-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return POLICY_BRIEFS.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = POLICY_BRIEFS.find((entry) => entry.id === slug);
  if (!item) return {};
  const canonical = `https://idc-index.com/en/policy/${item.id}`;
  return {
    title: `${item.titleEn} | IDC Atlas Policy Brief`,
    description: item.summaryEn,
    alternates: { canonical, languages: { "zh-CN": `https://idc-index.com/policy/${item.id}`, en: canonical, "x-default": canonical } },
    openGraph: { title: item.titleEn, description: item.summaryEn, url: canonical, type: "article", publishedTime: item.publishedAt },
    twitter: { card: "summary", title: item.titleEn, description: item.summaryEn },
  };
}

export default async function EnglishPolicyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = POLICY_BRIEFS.find((entry) => entry.id === slug);
  if (!item) notFound();
  return <WatchDetail lang="en" kind="policy" item={item} />;
}
