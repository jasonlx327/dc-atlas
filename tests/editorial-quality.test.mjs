import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { stripTypeScriptTypes } from "node:module";
import { coverageErrors } from "../scripts/validate-update-audit.mjs";
const source = await readFile(new URL("../worker/event-intelligence/public-copy-quality.ts", import.meta.url), "utf8");
const { publicCopyQualityErrors } = await import(`data:text/javascript,${encodeURIComponent(stripTypeScriptTypes(source))}`);
const copy = {titleZh:"一家企业的机房扩建",titleEn:"A company expands a data center",summaryZh:"据媒体报道，公司计划扩建机房，尚待许可。",summaryEn:"The company plans a data-center expansion, subject to permits, the outlet reports."};
test("token padding and generic translated scaffolds cannot become public copy",()=>{
  for (const suffix of [" (source figures: 200MW)", "（原文时间：2027）", "The source describes Reported update involving a company."]) {
    assert.ok(publicCopyQualityErrors({...copy,summaryEn:copy.summaryEn+suffix}).length);
  }
  assert.deepEqual(publicCopyQualityErrors(copy),[]);
});
test("all public records are free of known scaffolds and withdrawn IDs",async()=>{
  const current=JSON.parse(await readFile(new URL('../app/data/public-intelligence.json',import.meta.url),'utf8'));
  const withdrawn=JSON.parse(await readFile(new URL('../app/data/withdrawn-intelligence.json',import.meta.url),'utf8'));
  const ids=new Set(withdrawn.map(x=>x.id));
  for(const r of current){assert.ok(!ids.has(r.id));assert.deepEqual(publicCopyQualityErrors({titleZh:r.title,titleEn:r.titleEn,summaryZh:r.summary,summaryEn:r.summaryEn}),[],r.id);}
});
test("reachable company entrypoints alone never establish no-change",()=>{
  const company={id:'issuer',result:'no-change',sourceCoverage:{officialHttpStatus:200}};
  assert.equal(coverageErrors({companies:[company]}).length,1);
  assert.equal(coverageErrors({companies:[{...company,result:'not-determined'}]}).length,0);
  assert.equal(coverageErrors({companies:[{...company,reviewEvidence:{reviewedSourceUrls:['https://issuer.example/announcements'],windowStart:'2026-09-10T00:00:00Z',windowEnd:'2026-09-11T00:00:00Z',checkedAt:'2026-09-11T00:00:00Z',conclusion:'Reviewed every announcement in the window; no material change.'}}]}).length,0);
});

test("archived snapshots retract bad copy without changing source history", async () => {
  const workerSource = await readFile(new URL('../worker/index.ts',import.meta.url),'utf8');
  const fn = workerSource.slice(workerSource.indexOf('async function dailySnapshotApi('),workerSource.indexOf('type AtlasApiOptions ='));
  const withdrawnIntelligence = [{id:'withdrawn'}];
  const factory = new Function('withdrawnIntelligence','dailySnapshotKey',stripTypeScriptTypes(fn)+'; return dailySnapshotApi;');
  const handler = factory(withdrawnIntelligence,date=>'daily:'+date);
  const original = JSON.stringify({rumors:[{id:'withdrawn',summary:'bad copy'},{id:'retained',summary:'reviewed'}],dailySnapshot:{date:'2026-09-11'}});
  const env = {IDC_DAILY_SNAPSHOTS:{get:async()=>original}};
  const response = await handler(new Request('https://example.com/api/daily-snapshot?date=2026-09-11'),env);
  const body = await response.json();
  assert.deepEqual(body.rumors,[{id:'retained',summary:'reviewed'}]);
  assert.deepEqual(body.editorialCorrection.withdrawnIds,['withdrawn']);
  assert.equal(body.dailySnapshot.date,'2026-09-11');
  assert.equal(JSON.parse(original).rumors.length,2);
});
