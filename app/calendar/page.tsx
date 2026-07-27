import type { Metadata } from "next";
import CalendarClient from "./calendar-client";

const canonical = "https://idc-index.com/calendar";

export const metadata: Metadata = {
  title: "美股科技财报日历｜IDC Atlas",
  description: "IDC Atlas 美股科技财报日历：追踪云厂商、半导体与数据中心基础设施公司的关键财报节点与 CAPEX 关注项。",
  alternates: { canonical },
  openGraph: {
    title: "美股科技财报日历｜IDC Atlas",
    description: "追踪云厂商、半导体与数据中心基础设施公司的关键财报节点与 CAPEX 关注项。",
    url: canonical,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "美股科技财报日历｜IDC Atlas",
    description: "追踪云厂商、半导体与数据中心基础设施公司的关键财报节点与 CAPEX 关注项。",
  },
};

export default function CalendarPage() {
  return <CalendarClient />;
}
