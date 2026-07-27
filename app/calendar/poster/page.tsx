import type { Metadata } from "next";
import CalendarClient from "../calendar-client";

export const metadata: Metadata = {
  title: "美股科技财报日历海报｜IDC Atlas",
  robots: { index: false, follow: false },
};

export default function CalendarPosterPage() {
  return <CalendarClient poster />;
}
