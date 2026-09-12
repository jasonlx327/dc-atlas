import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchDetail from "../../watch-detail";
import { RUMOR_DETAIL_BRIEFS, isArchivedRumor, isWithdrawnRumor } from "../../rumor-detail-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return RUMOR_DETAIL_BRIEFS.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = RUMOR_DETAIL_BRIEFS.find((entry) => entry.id === slug);
  if (!item) return {};
  const canonical = `https://idc-index.com/rumors/${item.id}`;
  return {
    title: `${item.title}｜IDC Atlas 全球情报台`,
    description: item.summary,
    keywords: item.entities,
    ...(isWithdrawnRumor(item.id) ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical, languages: { "zh-CN": canonical, en: `https://idc-index.com/en/rumors/${item.id}`, "x-default": `https://idc-index.com/en/rumors/${item.id}` } },
    openGraph: { title: item.title, description: item.summary, url: canonical, type: "article", publishedTime: item.publishedAt, modifiedTime: item.publishedAt },
    twitter: { card: "summary", title: item.title, description: item.summary },
  };
}

export default async function RumorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = RUMOR_DETAIL_BRIEFS.find((entry) => entry.id === slug);
  if (!item) notFound();
  return <WatchDetail lang="zh" kind="rumors" item={item} archived={isArchivedRumor(item.id)} />;
}
