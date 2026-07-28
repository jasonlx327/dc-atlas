import type { Metadata } from "next";
import Home, { type AtlasPayload } from "../home-client";
import { loadInitialAtlasPayload } from "../initial-atlas";

export const metadata: Metadata = {
  title: "IDC 产业中心｜算力、园区、电力与液冷",
  description: "追踪从算力芯片、网络和电力，到大型园区、液冷与模型需求的公开进展。",
  alternates: { canonical: "https://idc-index.com/industry" },
};

export default async function IndustryPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  return <Home initialPayload={initialPayload} view="industry" />;
}
