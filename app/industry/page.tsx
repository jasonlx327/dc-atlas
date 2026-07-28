import type { Metadata } from "next";
import Home, { type AtlasPayload } from "../home-client";
import { loadInitialAtlasPayload } from "../initial-atlas";

export const metadata: Metadata = {
  title: "IDC 产业中心｜算力、园区、电力与液冷",
  description: "按主题查看数据中心产业链、NVIDIA 与 AMD、中国 GPU、模型需求、大型园区和液冷部署。",
  alternates: { canonical: "https://idc-index.com/industry" },
};

export default async function IndustryPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  return <Home initialPayload={initialPayload} view="industry" />;
}
