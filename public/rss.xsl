<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/rss/channel">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="title" /></title>
        <style>
          :root { color-scheme: dark; --bg: #070d15; --panel: #101b26; --line: #253747; --text: #e8f0f5; --muted: #8ea0ad; --accent: #43e5dc; }
          * { box-sizing: border-box; }
          body { margin: 0; padding: 48px 20px 72px; background: radial-gradient(circle at 80% 0%, #12343a 0, transparent 38%), var(--bg); color: var(--text); font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          main { max-width: 920px; margin: 0 auto; }
          .eyebrow { color: var(--accent); font: 700 12px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .16em; text-transform: uppercase; }
          h1 { margin: 14px 0 8px; font-size: clamp(32px, 6vw, 56px); line-height: 1.05; letter-spacing: -.04em; }
          .intro { margin: 0 0 30px; color: var(--muted); }
          .item { padding: 24px 0; border-top: 1px solid var(--line); }
          h2 { margin: 0 0 6px; font-size: clamp(21px, 3vw, 28px); line-height: 1.2; }
          h2 a { color: var(--text); text-decoration: none; }
          h2 a:hover { color: var(--accent); }
          time { color: var(--accent); font: 700 12px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; }
          .summary { margin: 10px 0 0; color: var(--muted); }
          .subscribe { display: inline-flex; margin-top: 22px; color: var(--bg); background: var(--accent); padding: 10px 14px; border-radius: 999px; font-weight: 700; text-decoration: none; }
          @media (max-width: 560px) { body { padding: 32px 18px 56px; } .item { padding: 20px 0; } }
        </style>
      </head>
      <body>
        <main>
          <div class="eyebrow">IDC Atlas · RSS</div>
          <h1><xsl:value-of select="title" /></h1>
          <p class="intro"><xsl:value-of select="description" /></p>
          <a class="subscribe" href="/columns">Browse all columns →</a>
          <xsl:for-each select="item">
            <article class="item">
              <time><xsl:value-of select="pubDate" /></time>
              <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
              <p class="summary"><xsl:value-of select="description" /></p>
            </article>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
