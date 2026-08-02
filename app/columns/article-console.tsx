import type { ReactNode } from "react";
import { IntelligenceConsoleShell } from "../intelligence-console-overview";
import { deriveConsoleMeta } from "../console-meta";
import { loadInitialAtlasPayload } from "../initial-atlas";

export async function ColumnArticleConsole({
  lang,
  children,
}: {
  lang: "zh" | "en";
  children: ReactNode;
}) {
  const meta = deriveConsoleMeta(await loadInitialAtlasPayload());
  return <IntelligenceConsoleShell
    lang={lang}
    activeSection="columns"
    generatedAt={meta.generatedAt}
    reviewedAt={meta.reviewedAt}
    sourceCount={meta.sourceCount}
    verifiedCount={meta.verifiedCount}
    pageLabel={lang === "zh" ? "专栏研究" : "Columns"}
    className="atlas-column-article-shell"
  >
    <div className="column-article-page" lang={lang === "zh" ? "zh-CN" : "en"}>
      {children}
    </div>
  </IntelligenceConsoleShell>;
}
