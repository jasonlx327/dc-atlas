import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { entityDirectory, findEntity } from "../../../entity-directory";
import EntityPage from "../../../entity-page";
import { loadInitialAtlasPayload } from "../../../initial-atlas";
import { deriveConsoleMeta } from "../../../console-meta";

export function generateStaticParams() {
  return entityDirectory.map((entity) => ({ slug: entity.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entity = findEntity(slug);
  if (!entity) return {};
  const canonical = `https://idc-index.com/en/companies/${entity.slug}`;
  const description = `${entity.descriptionEn} Follow formal disclosures, related research, industry position and the next verification checkpoint.`;
  return {
    title: `${entity.nameEn} | IDC Atlas Entity Profile`,
    description,
    alternates: { canonical, languages: { "zh-CN": `https://idc-index.com/companies/${entity.slug}`, en: canonical, "x-default": canonical } },
    openGraph: { title: `${entity.nameEn} | IDC Atlas`, description, url: canonical, type: "website" },
  };
}

export default async function EnglishCompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entity = findEntity(slug);
  if (!entity) notFound();
  const initialPayload = await loadInitialAtlasPayload();
  const meta = deriveConsoleMeta(initialPayload);
  const canonical = `https://idc-index.com/en/companies/${entity.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "ProfilePage",
      name: `${entity.nameEn} | IDC Atlas Entity Profile`,
      url: canonical,
      inLanguage: "en-US",
      dateModified: meta.lastContentChangedAt ?? meta.reviewedAt,
      mainEntity: { "@id": `${canonical}#company` },
      about: [{ "@type": "Thing", name: entity.categoryEn }, ...entity.aliases.slice(0, 4).map((name) => ({ "@type": "Thing", name }))],
      isPartOf: { "@type": "CollectionPage", name: "IDC Atlas Company Library", url: "https://idc-index.com/en/companies" },
    }, {
      "@type": "Organization",
      "@id": `${canonical}#company`,
      name: entity.nameEn,
      alternateName: [entity.name, ...entity.aliases].slice(0, 8),
      description: entity.descriptionEn,
      url: canonical,
      ...(entity.ticker ? { tickerSymbol: entity.ticker } : {}),
    }, {
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" }, { "@type": "ListItem", position: 2, name: "Companies", item: "https://idc-index.com/en/companies" }, { "@type": "ListItem", position: 3, name: entity.nameEn, item: canonical }],
    }],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><EntityPage entity={entity} lang="en" initialPayload={initialPayload} /></>;
}
