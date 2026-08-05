import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isColumnPublished } from "../../../columns/articles";
import {
  researchMetadataFields,
  researchStructuredData,
  ScheduledResearchArticle,
} from "../../../columns/scheduled-article";
import { scheduledResearchBySlug } from "../../../columns/scheduled-article-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isColumnPublished(slug) || !scheduledResearchBySlug(slug)) notFound();
  const fields = researchMetadataFields(slug, "en");
  if (!fields) notFound();

  return {
    title: `${fields.title} | IDC Atlas`,
    description: fields.description,
    alternates: {
      canonical: fields.canonical,
      languages: {
        "zh-CN": fields.alternate,
        en: fields.canonical,
        "x-default": fields.canonical,
      },
    },
    openGraph: {
      title: fields.title,
      description: fields.description,
      url: fields.canonical,
      type: "article",
      publishedTime: fields.publishedAt,
      modifiedTime: fields.publishedAt,
      images: [{ url: fields.image, width: 1672, height: 941, alt: fields.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fields.title,
      description: fields.description,
      images: [fields.image],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!isColumnPublished(slug) || !scheduledResearchBySlug(slug)) notFound();
  const structuredData = researchStructuredData(slug, "en");

  return <>
    {structuredData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /> : null}
    <ScheduledResearchArticle slug={slug} lang="en" />
  </>;
}
