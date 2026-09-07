import fs from "node:fs/promises";
const root = "docs/daily-reviews/2026-09-07-recovery";
const read = async (p) => JSON.parse(await fs.readFile(p, "utf8"));
const write = async (p, value) => fs.writeFile(p, JSON.stringify(value, null, 2) + "\n");
const brief = await read("artifacts/event-intelligence/recovery-brief.json");
const selected = await read("artifacts/event-intelligence/recovery-public-decisions.json");
const published = new Map(selected.decisions.map(d => [d.eventId, d]));
const duplicate = new Set([2,22,25,29,30,33,52,61,65,67,76,87,93,94,95]);
const irrelevant = new Set([1,4,5,6,7,12,13,17,24,28,35,38,40,41,44,45,46,47,49,54,56,57,60,72,75,78,79,80,83,84,86]);
const research = new Set([23,26,31,36,39,42,50,53,58,59,64,66,68,73,74,89,91,92]);
const old = new Map([[8,"Original Google page: 2026-08-06; discovery timestamp is not publication."],[11,"GE Vernova primary announcement: 2026-08-24; September relay is not a new launch."],[55,"Original Google page: 2026-07-31; discovery timestamp is not publication."]]);
const notes = {0:"CNBC original retrieval failed.",3:"FT original not accessible.",9:"Verge original retrieval failed.",10:"AWS/Microsoft preview: original product notice and duplicate match remain unresolved.",15:"Social lead: Meta original material not established.",18:"Microsoft/Cornell: original paper not established.",19:"Meta RPM research: original paper not established.",20:"Muse Spark benchmark: original result not established.",21:"Reasoning research: original paper not established.",27:"CoreWeave analysis is not a new company disclosure.",32:"VMware factory announcement date and original notice unresolved.",34:"Thinking Machines financing: social lead not corroborated by an accessible publisher.",43:"HPE earnings: complete primary results not reviewed in this bounded catch-up.",51:"EPA proposal: primary text and duplicate comparison unresolved; no formal policy update.",62:"Kentucky local restriction: original county action unresolved.",63:"LG Uplus/GS standard: original corporate notice unresolved.",69:"AI pharma funding: original announcement not established.",70:"Neo-MME source retrieval failed.",71:"Social distribution post, no distinct confirmed publication event.",77:"Robotaxi acquisition lead: original reporting unresolved.",82:"Punjab hub: original reporting unresolved.",85:"Adobe Rilo acquisition lead: original notice unresolved.",88:"FluidStack financing: original reporting unresolved.",90:"SANDI award: original notice unresolved."};
const decisions = brief.candidates.map((c,i) => {
  if (published.has(c.eventId)) return published.get(c.eventId);
  const action = duplicate.has(i) || irrelevant.has(i) || old.has(i) ? "reject" : research.has(i) ? "watch" : "hold";
  const reason = duplicate.has(i) ? "Existing coverage or merged duplicate; no separately established new fact." : irrelevant.has(i) ? "No distinct material AI news event: non-AI product, stock recommendation, index page or spam." : old.get(i) ?? notes[i] ?? "Research commentary retained for follow-up, not an incremental event update.";
  return {eventId:c.eventId, action, route:action === "watch" ? "research-queue" : "internal",section:null,sourceTier:c.sourceTiers[0],canonicalUrls:c.sourceChain.map(s=>s.url),evidenceStatus:"reviewed-candidate",reasonCodes:[duplicate.has(i)?"duplicate":old.has(i)?"recirculated-old-announcement":action],publicCopy:null,publicClaims:[],internalNotes:[reason],fallbackScored:false};
});
decisions.push(...selected.decisions.filter(d=>!brief.candidates.some(c=>c.eventId===d.eventId)));
const packet = {...selected, decisions, summary:{publishFormal:decisions.filter(d=>d.action==="publish"&&d.route==="formal-section").length,publishRumor:decisions.filter(d=>d.action==="publish"&&d.route==="rumor-watch").length,research:decisions.filter(d=>d.action==="watch").length,hold:decisions.filter(d=>d.action==="hold").length,reject:decisions.filter(d=>d.action==="reject").length,fallbackScored:0}};
await write(`${root}.editor-review.json`,packet);
const previous = await read("docs/daily-reviews/2026-09-05-1630.core-company-checks.json");
const companies = previous.companies.map(c=>({id:c.id,name:c.name,urls:(c.sourceCoverage??[]).map(s=>s.url)}));
const queue = [...new Set(companies.flatMap(c=>c.urls))]; const results = new Map();
await Promise.all(Array.from({length:6},async()=>{
  while(queue.length){ const url=queue.shift(); const checkedAt=new Date().toISOString();
    try { const r=await fetch(url,{signal:AbortSignal.timeout(12000)}); const html=await r.text(); const dates=[...new Set(html.match(/2026[-/]0[89][-/]\d{2}/g)??[])].slice(0,12);
      results.set(url,{url,resolvedUrl:r.url,checkedAt,httpStatus:r.status,accessState:r.ok?"public":"unavailable",pageTitle:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim(),datesObserved:dates,status:"not-determined",note:"Current transport and index probe only; individual disclosures not fully reviewed."});
    } catch(e){results.set(url,{url,checkedAt,accessState:"unavailable",error:e.cause?.code??e.message,status:"not-determined"});}
  }
}));
await write(`${root}.core-company-checks.json`,{generatedAt:new Date().toISOString(),companies:companies.map(c=>({...c,sourceCoverage:c.urls.map(u=>results.get(u)),status:"not-determined"})),note:"Historical URLs reused as a catalog only; all results are fresh. This bounded catch-up is not a full 50-company editorial clearance."});
console.log(JSON.stringify({editorial:packet.summary,companies:companies.length,urls:results.size}));
