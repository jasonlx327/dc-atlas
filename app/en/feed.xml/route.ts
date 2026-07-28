import { columnArticles } from "../../columns/articles";

const siteUrl = "https://idc-index.com";

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}

export function GET() {
  const items = columnArticles.map((article) => `<item>
    <title>${escapeXml(article.titleEn)}</title>
    <link>${siteUrl}${article.hrefEn}</link>
    <guid isPermaLink="true">${siteUrl}${article.hrefEn}</guid>
    <pubDate>${new Date(`${article.date}T00:00:00+08:00`).toUTCString()}</pubDate>
    <description>${escapeXml(article.summaryEn)}</description>
  </item>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>IDC Atlas Columns</title>
    <link>${siteUrl}/en/columns</link>
    <description>Source-linked research for the data-center and AI-infrastructure cycle.</description>
    <language>en-US</language>
    ${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
