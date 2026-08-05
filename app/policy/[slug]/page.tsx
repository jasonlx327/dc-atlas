import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchDetail from "../../watch-detail";
import { POLICY_BRIEFS } from "../../watch-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return POLICY_BRIEFS.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = POLICY_BRIEFS.find((entry) => entry.id === slug);
  if (!item) return {};
  const canonical = `https://idc-index.com/policy/${item.id}`;
  return {
    title: `${item.title}｜IDC Atlas 政策简报`,
    description: item.summary,
    alternates: { canonical, languages: { "zh-CN": canonical, en: `https://idc-index.com/en/policy/${item.id}`, "x-default": `https://idc-index.com/en/policy/${item.id}` } },
    openGraph: { title: item.title, description: item.summary, url: canonical, type: "article", publishedTime: item.publishedAt },
    twitter: { card: "summary", title: item.title, description: item.summary },
  };
}

export default async function PolicyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = POLICY_BRIEFS.find((entry) => entry.id === slug);
  if (!item) notFound();
  return <WatchDetail lang="zh" kind="policy" item={item} />;
}
