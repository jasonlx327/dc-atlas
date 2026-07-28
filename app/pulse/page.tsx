import type { Metadata } from "next";
import Home, { type AtlasPayload } from "../home-client";
import { loadInitialAtlasPayload } from "../initial-atlas";

export const metadata: Metadata = {
  title: "IDC 最新脉冲｜项目、上市公司与 AI 日报",
  description: "集中查看近 45 天中美数据中心项目、A 股与美股核心 IDC 标的及每日 AI 资讯。",
  alternates: { canonical: "https://idc-index.com/pulse" },
};

export default async function PulsePage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  return <Home initialPayload={initialPayload} view="pulse" />;
}
