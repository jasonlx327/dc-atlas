import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { entityDirectory, findEntity } from "../../../entity-directory";
import EntityPage from "../../../entity-page";
import { loadInitialAtlasPayload } from "../../../initial-atlas";

export function generateStaticParams() {
  return entityDirectory.map((entity) => ({ slug: entity.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entity = findEntity(slug);
  if (!entity) return {};
  const canonical = `https://idc-index.com/en/companies/${entity.slug}`;
  return {
    title: `${entity.nameEn} | IDC Atlas Entity Profile`,
    description: entity.descriptionEn,
    alternates: { canonical, languages: { "zh-CN": `https://idc-index.com/companies/${entity.slug}`, en: canonical, "x-default": canonical } },
    openGraph: { title: `${entity.nameEn} | IDC Atlas`, description: entity.descriptionEn, url: canonical, type: "website" },
  };
}

export default async function EnglishCompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entity = findEntity(slug);
  if (!entity) notFound();
  const initialPayload = await loadInitialAtlasPayload();
  const canonical = `https://idc-index.com/en/companies/${entity.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${entity.nameEn} | IDC Atlas Entity Profile`,
    url: canonical,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "Organization",
      name: entity.nameEn,
      description: entity.descriptionEn,
      url: canonical,
      ...(entity.ticker ? { tickerSymbol: entity.ticker } : {}),
    },
    isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/en" },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><EntityPage entity={entity} lang="en" initialPayload={initialPayload} /></>;
}
