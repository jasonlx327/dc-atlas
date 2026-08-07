import type { Metadata } from "next";
import { IntelligenceConsoleShell } from "../intelligence-console-overview";
import { ContextPage } from "../context-page";

const canonical = "https://idc-index.com/privacy";

export const metadata: Metadata = {
  title: "隐私说明｜IDC Atlas",
  description: "IDC Atlas 关于网站访问统计与 Google Analytics 的隐私说明。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/privacy", "x-default": "https://idc-index.com/en/privacy" } },
  openGraph: { title: "隐私说明｜IDC Atlas", description: "IDC Atlas 关于网站访问统计与 Google Analytics 的隐私说明。", url: canonical, type: "article", images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 隐私说明" }] },
  twitter: { card: "summary_large_image", title: "隐私说明｜IDC Atlas", description: "IDC Atlas 关于网站访问统计与 Google Analytics 的隐私说明。", images: ["/og.png"] },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <IntelligenceConsoleShell lang="zh" pageLabel="隐私说明" className="atlas-privacy-shell"
      contextStatus={{ title: "隐私说明", subtitle: "访问统计与第三方服务", languageHref: "/en/privacy?lang=en", items: [{ label: "数据用途", value: "改进内容与体验" }, { label: "账户体系", value: "无需注册" }, { label: "最后更新", value: "2026 年 7 月 22 日" }] }}
    ><ContextPage
      eyebrow="PRIVACY NOTICE · 数据使用边界"
      title={<>我们如何处理<br />访问数据</>}
      summary="IDC Atlas 使用最小必要的访问统计来改善内容与体验。本站不要求注册账号，也不会主动通过 Analytics 收集姓名、邮箱等可直接识别个人身份的信息。"
      backHref="/#overview"
      backLabel="返回情报总览 →"
      items={[{ label: "分析工具", value: "Google Analytics" }, { label: "站内账户", value: "未开放注册" }, { label: "个人画像", value: "不建立" }]}
      sections={[
        { label: "01 · ANALYTICS", title: "访问统计", copy: "我们使用 Google Analytics 了解页面访问量、来源渠道、设备类型、近似地区和页面互动情况，用于改进内容与使用体验。" },
        { label: "02 · COOKIES", title: "Cookie 与第三方服务", copy: <>Google Analytics 可能使用 Cookie 或类似技术处理访问数据。IDC Atlas 不设置用于财报互动或用户画像的第一方 Cookie；你可以在浏览器设置中限制或删除 Cookie。Google 如何处理合作伙伴网站数据，可参阅 <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Google 的说明</a>。</> },
        { label: "03 · EXTERNAL LINKS", title: "外部链接与联系", copy: <>本站链接至新闻、公告与数据来源；对应网站适用其自身隐私规则。如对本说明有疑问，可通过 <a href="https://github.com/jasonlx327" target="_blank" rel="noreferrer">GitHub</a> 联系。</> },
      ]}
      boundary={{ label: "NOTICE", title: "第三方网站适用其自身规则", copy: "当你离开 IDC Atlas 前往原始来源或其他第三方网站时，其数据收集、Cookie 与隐私处理方式由该网站负责。" }}
    /></IntelligenceConsoleShell>
  );
}
