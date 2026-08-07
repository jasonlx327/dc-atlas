import type { Metadata } from "next";
import CalendarClient, { type CalendarEvent } from "./calendar-client";
import { deriveConsoleMeta } from "../console-meta";
import { loadInitialAtlasPayload } from "../initial-atlas";

const canonical = "https://idc-index.com/calendar";

export const metadata: Metadata = {
  title: "全球科技财报日历｜IDC Atlas",
  description: "IDC Atlas 全球科技财报日历：追踪云厂商、半导体与数据中心基础设施公司的关键财报节点与 CAPEX 关注项。",
  alternates: { canonical },
  openGraph: {
    title: "全球科技财报日历｜IDC Atlas",
    description: "追踪云厂商、半导体与数据中心基础设施公司的关键财报节点与 CAPEX 关注项。",
    url: canonical,
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 全球科技财报日历" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "全球科技财报日历｜IDC Atlas",
    description: "追踪云厂商、半导体与数据中心基础设施公司的关键财报节点与 CAPEX 关注项。",
    images: ["/og.png"],
  },
};

export default async function CalendarPage() {
  const payload = await loadInitialAtlasPayload();
  const data = payload as { calendarEvents?: CalendarEvent[]; upcomingEvents?: CalendarEvent[] } | null;
  const initialEvents = data?.calendarEvents ?? data?.upcomingEvents ?? [];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "全球科技财报日历",
        description: metadata.description,
        url: canonical,
        inLanguage: "zh-CN",
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: initialEvents.length,
          itemListElement: initialEvents.map((event, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${canonical}#${event.id}`,
            name: `${event.company}（${event.ticker}）财报节点`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" },
          { "@type": "ListItem", position: 2, name: "全球科技财报日历", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CalendarClient initialMeta={deriveConsoleMeta(payload)} initialEvents={initialEvents} /></>;
}
