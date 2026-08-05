import { publishedColumnArticles } from "../../columns/articles";

const siteUrl = "https://idc-index.com";
export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}

export function GET() {
  const articles = publishedColumnArticles();
  const latest = articles[0]?.publishAt ?? new Date().toISOString();
  const items = articles.map((article) => `<item>
    <title>${escapeXml(article.titleEn)}</title>
    <link>${siteUrl}${article.hrefEn}</link>
    <guid isPermaLink="true">${siteUrl}${article.hrefEn}</guid>
    <pubDate>${new Date(article.publishAt).toUTCString()}</pubDate>
    <description>${escapeXml(article.summaryEn)}</description>
  </item>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${siteUrl}/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>IDC Atlas Columns</title>
    <link>${siteUrl}/en/columns</link>
    <description>Source-linked research for the data-center and AI-infrastructure cycle.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/en/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
