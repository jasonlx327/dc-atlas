import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { entityDirectory, findEntity } from "../../entity-directory";
import EntityPage from "../../entity-page";
import { loadInitialAtlasPayload } from "../../initial-atlas";

export function generateStaticParams() {
  return entityDirectory.map((entity) => ({ slug: entity.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entity = findEntity(slug);
  if (!entity) return {};
  const canonical = `https://idc-index.com/companies/${entity.slug}`;
  return {
    title: `${entity.name}｜IDC Atlas 实体档案`,
    description: entity.description,
    alternates: { canonical, languages: { "zh-CN": canonical, en: `https://idc-index.com/en/companies/${entity.slug}`, "x-default": `https://idc-index.com/en/companies/${entity.slug}` } },
    openGraph: { title: `${entity.name}｜IDC Atlas`, description: entity.description, url: canonical, type: "website" },
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entity = findEntity(slug);
  if (!entity) notFound();
  const initialPayload = await loadInitialAtlasPayload();
  const canonical = `https://idc-index.com/companies/${entity.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${entity.name}｜IDC Atlas 实体档案`,
    url: canonical,
    inLanguage: "zh-CN",
    about: { "@type": "Organization", name: entity.name, tickerSymbol: entity.ticker },
    isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><EntityPage entity={entity} lang="zh" initialPayload={initialPayload} /></>;
}
