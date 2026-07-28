import { columnArticles } from "../columns/articles";

const siteUrl = "https://idc-index.com";

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}

export function GET() {
  const items = columnArticles.map((article) => `<item>
    <title>${escapeXml(article.title)}</title>
    <link>${siteUrl}${article.href}</link>
    <guid isPermaLink="true">${siteUrl}${article.href}</guid>
    <pubDate>${new Date(`${article.date}T00:00:00+08:00`).toUTCString()}</pubDate>
    <description>${escapeXml(article.summary)}</description>
  </item>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>IDC Atlas 专栏</title>
    <link>${siteUrl}/columns</link>
    <description>数据中心与 AI 基础设施的来源可追溯研究。</description>
    <language>zh-CN</language>
    ${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
