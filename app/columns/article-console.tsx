import type { ReactNode } from "react";
import { IntelligenceConsoleShell } from "../intelligence-console-overview";

export function ColumnArticleConsole({
  lang,
  children,
}: {
  lang: "zh" | "en";
  children: ReactNode;
}) {
  return <IntelligenceConsoleShell
    lang={lang}
    activeSection="columns"
    pageLabel={lang === "zh" ? "专栏研究" : "Columns"}
    className="atlas-column-article-shell"
  >
    <div className="column-article-page" lang={lang === "zh" ? "zh-CN" : "en"}>
      {children}
    </div>
  </IntelligenceConsoleShell>;
}
