import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchDetail from "../../../watch-detail";
import { RUMOR_DETAIL_BRIEFS, isArchivedRumor } from "../../../rumor-detail-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return RUMOR_DETAIL_BRIEFS.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = RUMOR_DETAIL_BRIEFS.find((entry) => entry.id === slug);
  if (!item) return {};
  const canonical = `https://idc-index.com/en/rumors/${item.id}`;
  return {
    title: `${item.titleEn} | IDC Atlas Global Intelligence`,
    description: item.summaryEn,
    keywords: item.entities,
    alternates: { canonical, languages: { "zh-CN": `https://idc-index.com/rumors/${item.id}`, en: canonical, "x-default": canonical } },
    openGraph: { title: item.titleEn, description: item.summaryEn, url: canonical, type: "article", publishedTime: item.publishedAt, modifiedTime: item.publishedAt },
    twitter: { card: "summary", title: item.titleEn, description: item.summaryEn },
  };
}

export default async function EnglishRumorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = RUMOR_DETAIL_BRIEFS.find((entry) => entry.id === slug);
  if (!item) notFound();
  return <WatchDetail lang="en" kind="rumors" item={item} archived={isArchivedRumor(item.id)} />;
}
