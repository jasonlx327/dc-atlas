import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { entityDirectory, findEntity } from "../../entity-directory";
import EntityPage from "../../entity-page";
import { loadInitialAtlasPayload } from "../../initial-atlas";
import { deriveConsoleMeta } from "../../console-meta";

export function generateStaticParams() {
  return entityDirectory.map((entity) => ({ slug: entity.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entity = findEntity(slug);
  if (!entity) return {};
  const canonical = `https://idc-index.com/companies/${entity.slug}`;
  const description = `${entity.description} 查看其正式披露、关联研究、产业位置与下一验证点。`;
  return {
    title: `${entity.name}｜IDC Atlas 实体档案`,
    description,
    alternates: { canonical, languages: { "zh-CN": canonical, en: `https://idc-index.com/en/companies/${entity.slug}`, "x-default": `https://idc-index.com/en/companies/${entity.slug}` } },
    openGraph: { title: `${entity.name}｜IDC Atlas`, description, url: canonical, type: "website" },
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entity = findEntity(slug);
  if (!entity) notFound();
  const initialPayload = await loadInitialAtlasPayload();
  const meta = deriveConsoleMeta(initialPayload);
  const canonical = `https://idc-index.com/companies/${entity.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "ProfilePage",
      name: `${entity.name}｜IDC Atlas 实体档案`,
      url: canonical,
      inLanguage: "zh-CN",
      dateModified: meta.lastContentChangedAt ?? meta.reviewedAt,
      mainEntity: { "@id": `${canonical}#company` },
      about: [{ "@type": "Thing", name: entity.category }, ...entity.aliases.slice(0, 4).map((name) => ({ "@type": "Thing", name }))],
      isPartOf: { "@type": "CollectionPage", name: "IDC Atlas 公司库", url: "https://idc-index.com/companies" },
    }, {
      "@type": "Organization",
      "@id": `${canonical}#company`,
      name: entity.name,
      alternateName: [entity.nameEn, ...entity.aliases].slice(0, 8),
      description: entity.description,
      url: canonical,
      ...(entity.ticker ? { tickerSymbol: entity.ticker } : {}),
    }, {
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: "公司库", item: "https://idc-index.com/companies" }, { "@type": "ListItem", position: 3, name: entity.name, item: canonical }],
    }],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><EntityPage entity={entity} lang="zh" initialPayload={initialPayload} /></>;
}
