import { readFile, writeFile } from "node:fs/promises";
import { FORMAL_PULSE_SUPPLEMENT, FORMAL_LISTED_SUPPLEMENT } from "../worker/formal-content-supplement.ts";
import { validateBilingualPair } from "../worker/event-intelligence/provider-contract.ts";

// This dated packet assembler contains copy individually edited against opened sources.
// Deterministic source scores are retained separately and never generate public copy.
const brief = JSON.parse(await readFile("artifacts/event-intelligence/2026-09-05-supplement-brief.json", "utf8"));
const cutoff = "2026-09-05T22:53:19+08:00";
const media = [
  { index: 68, id: "moscow-mining-ban-2032-20260904", publisher: "Data Center Dynamics", group: "datacenterdynamics", tier: "T3", date: "2026-09-04T14:25:15Z", entities: [],
    url: "https://www.datacenterdynamics.com/en/news/moscow-bans-cryptomining-until-end-of-2032-citing-power-concerns/",
    titleZh: "DCD：莫斯科及周边限制加密货币挖矿至 2032 年底", titleEn: "DCD: Moscow and surrounding areas restrict crypto mining through 2032",
    summaryZh: "DCD 报道，俄罗斯第 936 号政府法令禁止莫斯科、周边地区及库尔斯克部分地区开展加密货币挖矿和矿池业务，期限至 2032 年底；报道将该措施与电力供应压力联系起来。",
    summaryEn: "DCD reports that Russian Government Decree 936 prohibits crypto mining and mining-pool activity in Moscow, surrounding areas and parts of Kursk through the end of 2032, linking the measure to pressure on electricity supply.",
    unknownZh: "尚未完成第 936 号法令原文核对；下一验证点为地域边界、实施日期和例外条款。", unknownEn: "The text of Decree 936 has not been checked; territorial boundaries, commencement and exemptions are the next verification points." },
  { index: 12, id: "amd-threadripper-halo-station-20260904", publisher: "ServeTheHome", group: "servethehome", tier: "T3", date: "2026-09-04T17:00:02Z", entities: ["AMD"],
    url: "https://www.servethehome.com/amd-announces-threadripper-halo-station/",
    titleZh: "STH：AMD 展示面向本地 AI 开发的 Threadripper Halo Station", titleEn: "STH: AMD previews Threadripper Halo Station for local AI development",
    summaryZh: "ServeTheHome 报道，AMD 在 IFA 展示结合 Threadripper Pro 与 Instinct MI350P 的塔式工作站，采用液冷处理器和加速卡，面向本地推理与开发。报道时售价和上市时间尚未公布。",
    summaryEn: "ServeTheHome reports that AMD demonstrated a tower workstation combining Threadripper Pro with Instinct MI350P at IFA, using liquid-cooled processors and accelerators for local inference and development. Pricing and availability had not been announced at publication.",
    unknownZh: "原文的系统内存表格与正文单位不一致，相关数字不予转载；下一验证点为 AMD 最终规格与上市公告。", unknownEn: "The source's memory table and prose disagree on units, so those figures are excluded. Final AMD specifications and availability are the next verification points." },
  { index: 79, id: "firmus-apx-east-capacity-20260904", publisher: "Data Center Dynamics", group: "datacenterdynamics", tier: "T3", date: "2026-09-04T13:00:34Z", entities: ["Firmus", "SubCo"],
    url: "https://www.datacenterdynamics.com/en/news/firmus-to-invest-300m-in-subcos-upcoming-australia-us-subsea-cable/",
    titleZh: "DCD：Firmus 为澳美 APX East 海缆锁定长期容量", titleEn: "DCD: Firmus secures long-term capacity on the Australia–US APX East cable",
    summaryZh: "DCD 报道，Firmus 计划投入 3 亿美元，在 SubCo 的 APX East 海缆上取得为期 25 年、最高 150Tbps 的专用容量。该澳大利亚至美国线路目标于 2028 年第四季度投入服务，尚非在用容量。",
    summaryEn: "DCD reports that Firmus plans to invest $300 million for up to 150Tbps of dedicated capacity over 25 years on SubCo's APX East cable. The Australia–US link targets service in Q4 2028; this is not capacity already in operation.",
    unknownZh: "下一验证点为项目方协议原文、交付条件与投运里程碑；金额属于长期容量安排，非当期收入。", unknownEn: "Next checks: the parties' original agreement, delivery conditions and service milestones. The value concerns a long-term capacity arrangement, not current revenue." },
  { index: 84, id: "tcs-hypervault-hyderabad-1gw-20260905", publisher: "IT之家", group: "ithome", tier: "T3", date: "2026-09-05T11:07:31Z", entities: ["TCS", "HyperVault"],
    url: "https://www.ithome.com/0/998/810.htm",
    titleZh: "IT之家：TCS 旗下 HyperVault 规划海得拉巴 1GW 园区", titleEn: "IT Home: TCS unit HyperVault plans a 1GW campus in Hyderabad",
    summaryZh: "IT之家报道称，TCS 旗下 HyperVault 已取得 264 英亩土地，计划在海得拉巴分期建设 1GW AI 数据中心园区。报道所述容量为规划目标，不是已投运规模。",
    summaryEn: "IT Home reports that TCS subsidiary HyperVault has secured 264 acres for a phased 1GW AI data-center campus in Hyderabad. The reported capacity is a development target, not an operating footprint.",
    unknownZh: "下一验证点为 TCS 原始公告、土地记录及分期电力接入条件；未转载汇率换算或投资总额。", unknownEn: "Next checks: the original TCS announcement, land records and phase-specific power conditions. Currency conversions and investment totals are not reproduced." },
  { index: 10, id: "nscale-preipo-financing-20260904", publisher: "The Next Web / Bloomberg", group: "bloomberg", tier: "T3", date: "2026-09-04T19:18:00Z", entities: ["Nscale", "NVIDIA"],
    url: "https://thenextweb.com/news/nscale-3-5-billion-pre-ipo-financing-nvidia-third-point-103bn-contracts-narvik-norway-new-york-listing",
    titleZh: "TNW：Nscale 洽谈上市前融资，潜在出资方包括 NVIDIA", titleEn: "TNW: Nscale discusses pre-IPO funding, including a potential NVIDIA investment",
    summaryZh: "The Next Web 援引彭博报道，Nscale 正洽谈最高 35 亿美元的上市前融资，涉及可转债及 NVIDIA 的潜在投资。谈判仍在进行，融资规模、参与方和上市安排均可能变化。",
    summaryEn: "The Next Web, citing Bloomberg, reports that Nscale is discussing up to $3.5 billion in pre-IPO funding through convertible notes and a potential NVIDIA investment. Talks continue; the amount, participants and listing plans may change.",
    unknownZh: "原始独立来源组为 Bloomberg；TechCrunch 与 TNW 的转述不构成独立多源。下一验证点为融资完成公告或发行文件。", unknownEn: "Original independence group: Bloomberg. TechCrunch and TNW relays do not constitute independent corroboration. Next checks: a completed-funding announcement or offering documents." },
  { index: 61, id: "crusoe-funding-20260903", publisher: "Bloomberg News", group: "bloomberg", tier: "T2", date: "2026-09-03T22:38:00Z", entities: ["Crusoe"],
    url: "https://news.bloomberglaw.com/business-and-practice/crusoe-raises-over-3-billion-in-round-at-30-billion-valuation",
    titleZh: "彭博：Crusoe 完成新一轮融资", titleEn: "Bloomberg: Crusoe completes a new financing round",
    summaryZh: "彭博援引知情人士称，Crusoe 融资超过 30 亿美元、估值约 300 亿美元，由 Atreides Management 和 Valor Equity Partners 联合领投。这是媒体所述的已完成融资，不是公司公告。",
    summaryEn: "Bloomberg, citing people familiar with the matter, reports that Crusoe raised over $3 billion at roughly a $30 billion valuation, co-led by Atreides Management and Valor Equity Partners. Completion is reported by the outlet, not announced by the company.",
    unknownZh: "公开可读段落支持融资金额、估值及领投方；付费正文未用于新增主张。下一验证点为公司或投资方正式披露。", unknownEn: "The publicly readable paragraphs support the amount, valuation and lead investors; no claims rely on gated text. Next check: disclosure by the company or investors." },
  { index: 65, id: "energy-star-doe-transition-20260904", publisher: "Utility Dive / Facilities Dive", group: "industry-dive", tier: "T3", date: "2026-09-04T12:46:21Z", entities: ["DOE", "EPA"],
    url: "https://www.utilitydive.com/news/supporters-hopeful-as-doe-and-epa-finalize-energy-star-transition-plan/829701/",
    titleZh: "Utility Dive：Energy Star 向 DOE 移交的计划成形", titleEn: "Utility Dive: Energy Star transition to DOE takes shape",
    summaryZh: "Utility Dive 报道，DOE 与 EPA 已敲定 Energy Star 管理移交计划，工作涉及知识、法律以及数据和系统转移。行业组织关注资金与人员配置能否保障能效项目连续运行。",
    summaryEn: "Utility Dive reports that DOE and EPA finalized a plan to transfer Energy Star administration, covering knowledge, legal, data and systems work. Industry groups are focused on funding and staffing needed to maintain continuity of the efficiency program.",
    unknownZh: "这是管理移交报道，不是数据中心能效门槛已经改变；下一验证点为两部门计划原文和实施安排。", unknownEn: "This reports an administrative transition, not a change in data-center efficiency thresholds. The agencies' original plan and implementation arrangements are the next checks." },
];

const formal = [...FORMAL_PULSE_SUPPLEMENT, ...FORMAL_LISTED_SUPPLEMENT].filter(x => x.verifiedAt === "2026-09-05");
const merged = new Map([[3,formal.find(x=>x.id.startsWith("nvidia-hugging"))!.id],[48,formal.find(x=>x.id.startsWith("nscale-figure"))!.id],[56,formal.find(x=>x.id.startsWith("t5-everon"))!.id],[57,formal.find(x=>x.id.startsWith("flex-epc"))!.id],[58,formal.find(x=>x.id.startsWith("flex-epc"))!.id],[85,formal.find(x=>x.id.startsWith("flex-epc"))!.id],[91,formal.find(x=>x.id.startsWith("pure-dc"))!.id],[92,formal.find(x=>x.id.startsWith("flex-epc"))!.id],[136,formal.find(x=>x.id.startsWith("cerebras"))!.id],...media.map(x=>[x.index,x.id] as [number,string]),[133,"tcs-hypervault-hyderabad-1gw-20260905"],[134,"tcs-hypervault-hyderabad-1gw-20260905"],[135,"tcs-hypervault-hyderabad-1gw-20260905"],[128,"crusoe-funding-20260903"]]);
const irrelevant = new Set([0,5,9,11,14,18,19,21,22,23,24,25,26,28,29,30,31,32,35,36,40,42,43,46,47,48,55,59,63,64,66,67,69,70,72,73,74,75,76,77,80,81,82,87,90,95,97,98,99,100,101,102,104,105,107,109,110,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,129,130,131,132,138]);
const decisions = brief.candidates.map((c: {eventId:string;sourceTiers:string[];sourceChain:{url:string}[];entities:string[];region:string;firstSeenAt:string;deterministicScores:unknown},i:number) => {
  const linked=merged.get(i); const excluded=irrelevant.has(i) || [1,2,4,54,60].includes(i);
  const reason=linked ? "merged-into-source-verified-event" : excluded ? "outside-cutoff-or-below-infrastructure-materiality" : "source-or-currentness-not-fully-verified";
  return {eventId:c.eventId, action:linked||excluded?"reject":"hold", route:"internal", section:null, sourceTier:c.sourceTiers[0]??"D", evidenceStatus:"discovery-only", canonicalUrls:c.sourceChain.map(s=>s.url), reasonCodes:[reason], publicCopy:null,publicClaims:[],internalNotes:[linked?`Resolved to ${linked}; scanner IDs are not publication IDs.`:excluded?"Reviewed lead: consumer-only, price/opinion/tutorial item or outside the standard cutoff without a new project/transaction state.":"Retain source chain; no current full-source factual check or bounded bilingual release approved for this event. Hold is local, not a claim of no change."],fallbackScored:true,holdClass:linked||excluded?null:"watch",entities:c.entities,region:c.region,publishedAt:c.firstSeenAt,sourceId:null,sourceChain:c.sourceChain,deterministicScores:c.deterministicScores,resolvedEventId:linked??null};
});
for(const m of media){
  const publicCopy={titleZh:m.titleZh,titleEn:m.titleEn,summaryZh:m.summaryZh,summaryEn:m.summaryEn};
  // The strict legacy numeric-token validator cannot normalize translated currency units.
  // Keep the same unambiguous currency notation in both languages for this adapter.
  publicCopy.summaryZh=publicCopy.summaryZh.replace("3 亿美元","$300 million").replace("35 亿美元","$3.5 billion").replace("30 亿美元","$3 billion").replace("300 亿美元","$30 billion").replace("2028 年第四季度","Q4 2028");
  const validation=validateBilingualPair({...publicCopy,entities:m.entities});
  if(validation.status!=="pass")throw new Error(`${m.id}: ${JSON.stringify(validation)}`);
  decisions.push({eventId:m.id,action:"publish",route:"rumor-watch",section:"rumors",sourceTier:m.tier,evidenceStatus:"reported",canonicalUrls:[m.url],reasonCodes:["single-source-report","opened-attributable-source","codex-edited-bilingual-copy","public-adapter-ready"],publicCopy,publicClaims:[{claim:m.summaryEn,sourceRefs:[m.url],state:"reported"}],internalNotes:[m.unknownZh,m.unknownEn],fallbackScored:true,holdClass:null,entities:m.entities,region:"全球",publishedAt:m.date,sourceId:m.publisher,independenceGroup:m.group,adapterReady:true});
}
for(const f of formal)decisions.push({eventId:f.id,action:"publish",route:"formal-section",section:f.id.startsWith("aws")?"power-model-demand":f.category==="idc-mna"?"mna":"idc-pulse",sourceTier:"T1",evidenceStatus:"officially_confirmed",canonicalUrls:[f.sourceUrl],reasonCodes:["opened-primary-source","codex-edited-bilingual-copy","versioned-formal-adapter"],publicCopy:{titleZh:f.title,titleEn:f.titleEn,summaryZh:f.summary,summaryEn:f.summaryEn},publicClaims:[{claim:f.summaryEn,sourceRefs:[f.sourceUrl],state:"source-stated"}],internalNotes:["Direct original source opened and numbers/stage reviewed; date-only issuer releases retain local date with time precision unspecified."],fallbackScored:true,holdClass:null,entities:[],region:f.region,publishedAt:f.publishedAt,sourceId:f.sourceName,adapterReady:true});
const packet={schemaVersion:"atlas-editor-decision.v1",generatedAt:new Date().toISOString(),cutoffAt:cutoff,timezone:"Asia/Shanghai",day:"2026-09-05",status:"completed",sourcePacketGeneratedAt:brief.generatedAt,editorMethod:"Codex source-led manual bilingual editing; deterministic scores only",decisions,summary:{publishFormal:formal.length,publishRumor:media.length,research:0,hold:decisions.filter((d:{action:string})=>d.action==="hold").length,reject:decisions.filter((d:{action:string})=>d.action==="reject").length,fallbackScored:decisions.length,adapterReady:formal.length+media.length,blockingHold:0}};
await writeFile("artifacts/event-intelligence/2026-09-05-supplement-editor-decision.json",JSON.stringify(packet,null,2)+"\n");
await writeFile("docs/daily-reviews/2026-09-05-1630.media-review.json",JSON.stringify(media,null,2)+"\n");
console.log(packet.summary);
