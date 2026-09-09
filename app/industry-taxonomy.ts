export type IndustryStory = { id: string; title: string; titleEn?: string; summary?: string; summaryEn?: string; publishedAt?: string | null; sourceUrl?: string | null; permalink?: string; sourceName?: string | null; category?: string | null; industrySegment?: string };
// Rule matches are navigation aids, never evidence of a commercial relationship.
export const industrySegments = [
  { id: "silicon", zh: "芯片与制造", en: "Silicon & manufacturing", children: [
    ["accelerators", "GPU / ASIC", "GPU / ASIC", /GPU|MI355X|Blackwell|Vera Rubin|\bASIC\b|\bCPU\b|XPU|processor|AI accelerator|处理器|算力芯片/i],
    ["memory", "HBM / 存储", "HBM / memory", /HBM|DRAM|NAND|memory chip|内存|存储芯片/i],
    ["packaging", "封装与基板", "Packaging & substrates", /CoWoS|packaging|substrate|封装|基板/i]] },
  { id: "systems", zh: "服务器与机架", en: "Servers & racks", children: [
    ["servers", "服务器 / ODM", "Servers / ODM", /server|ODM|OEM|服务器/i],
    ["racks", "整机柜", "Rack systems", /rack|NVL72|机柜|机架|超节点/i]] },
  { id: "network", zh: "网络与光互联", en: "Networking & optics", children: [
    ["switching", "交换与互联", "Switching & interconnect", /switch|Ethernet|InfiniBand|NVLink|交换|互联/i],
    ["optics", "光模块 / CPO", "Optics / CPO", /CPO|LPO|optical|photon|800G|1\.6T|光模块|光通信/i],
    ["materials", "激光器与光材料", "Lasers & materials", /laser|InP|indium phosphide|激光|磷化铟/i]] },
  { id: "cooling", zh: "散热", en: "Cooling", children: [
    ["liquid", "冷板 / CDU / 快接", "Cold plates / CDU", /CDU|cold plate|quick disconnect|liquid cool|冷板|液冷|快接/i],
    ["thermal", "浸没与热排放", "Immersion & heat rejection", /immersion|chiller|heat rejection|浸没|冷机|热排放|散热/i]] },
  { id: "power", zh: "电力与能源", en: "Power & energy", children: [
    ["grid", "并网与电气设备", "Grid & electrical", /\bgrid\b|substation|transformer|switchgear|\bUPS\b|800\s*V|power conversion|并网|电网|变压器|供电|电力转换/i],
    ["energy", "发电 / 储能 / PPA", "Generation / storage / PPA", /\bPPA\b|power generation|turbine|battery|energy storage|发电|燃机|储能|绿电/i]] },
  { id: "campus", zh: "园区与运营", en: "Campuses & operations", children: [
    ["build", "许可与建设", "Permits & construction", /campus|园区|(?:data.?cent(?:er|re)|数据中心).*(?:permit|construction|project|项目|建设|开工|获批)|(?:permit|construction).*(?:data.?cent(?:er|re))/i],
    ["operations", "交付 / 租赁 / 利用率", "Delivery / leases / utilization", /\bleas(?:e|es|ing)\b|commission|utilization|租赁|交付|投运|利用率/i]] },
  { id: "cloud", zh: "云", en: "Cloud", children: [
    ["capex", "CAPEX 与算力采购", "CAPEX & compute procurement", /CAPEX|procurement|compute deal|资本开支|采购|算力协议|算力合同|AI 基础设施/i],
    ["cloud-services", "云平台与服务", "Cloud platforms & services", /cloud region|cloud service|AWS|Azure|Bedrock|Foundry|云区域|云服务|阿里云|腾讯云|谷歌云/i],
    ["inference", "算力价格与经济性", "Compute pricing & economics", /inference cost|token pric|compute pric|cost per token|推理成本|算力价格|算力经济性|每.*token.*成本/i]] },
  { id: "model", zh: "Model related", en: "Model related", children: [
    ["model-releases", "模型发布与能力", "Model releases & capabilities", /ChatGPT|GPT[- ]?\d|\bClaude\b|\bGemini\b|DeepSeek|Qwen|Llama|大模型|图像模型|模型发布|发布.*模型|model release|language model|image model/i],
    ["model-evaluation", "训练、推理与评测", "Training, inference & evaluation", /benchmark|model evaluat|model training|推理|模型训练|模型评测|能力评测|公开评测/i],
    ["model-applications", "Agent、应用与生态", "Agents, applications & ecosystem", /Hugging Face|\bagents?\b|agentic|研究代理|智能体|AI 助手|AI 项目|AI for the Planet|模型应用|model application/i]] },
] as const;
export function classifyIndustry(item: IndustryStory) {
  const title = `${item.title} ${item.titleEn ?? ""}`;
  const body = `${item.summary ?? ""} ${item.summaryEn ?? ""}`;
  const matches = industrySegments.flatMap(segment => segment.children.flatMap(([id, zh, en, pattern]) => pattern.test(segment.id === "model" ? title : title + " " + body) ? [{ id, zh, en, parent: segment.id, titleMatch: pattern.test(title) }] : []));
  const explicitSegment = industrySegments.flatMap(segment => segment.children.map(([id, zh, en]) => ({ id, zh, en, parent: segment.id, titleMatch: false }))).find(m => m.id === item.industrySegment);
  const explicit = explicitSegment;
  if (explicit && !matches.some(m => m.id === explicit.id)) matches.push(explicit);
  const primary = explicit ?? matches.find(m => m.titleMatch);
  return { primary, matches, basis: explicit ? "editorial" : "text-match" };
}
export function industryItems(items: IndustryStory[]) {
  const seen = new Set<string>();
  return [...items].sort((a,b) => (Date.parse(b.publishedAt ?? "") || 0) - (Date.parse(a.publishedAt ?? "") || 0)).filter(item => {
    let key = item.sourceUrl || item.permalink || item.id;
    try { const url = new URL(key); url.hash = ""; for (const k of [...url.searchParams.keys()]) if (/^utm_|^(fbclid|gclid)$/.test(k)) url.searchParams.delete(k); key = url.toString(); } catch { /* IDs remain valid deduplication keys. */ }
    if (seen.has(key)) return false; seen.add(key); return true;
  });
}
