import assert from 'node:assert/strict';
import test from 'node:test';

test('September 19 partial release keeps source-backed facts, chip specs and routes during feed failures', async (t) => {
  const prior = Object.getOwnPropertyDescriptor(globalThis, 'caches');
  Object.defineProperty(globalThis, 'caches', {configurable:true, value:{default:{match:async()=>undefined,put:async()=>{}}}});
  t.after(()=>{if(prior)Object.defineProperty(globalThis,'caches',prior);else delete globalThis.caches;});
  t.mock.method(globalThis,'fetch',async()=>new Response('Offline fixture',{status:503}));
  const {default:worker}=await import('../dist/server/index.js');
  const publishedAt='2026-09-19T11:00:00Z';
  const response=await worker.fetch(new Request('https://idc-index.com/api/atlas-live-v5?schema=v1'),{
    IDC_DAILY_SNAPSHOTS:{get:async()=>null},ATLAS_CONTENT_PUBLISHED_AT:publishedAt,
  },{waitUntil(){},passThroughOnException(){}});
  const p=await response.json();
  assert.equal(p.contentReviewedAt,'2026-09-19');
  assert.equal(p.lastContentChangedAt,publishedAt);
  assert.equal(p.contentRelease.mode,'partial');
  assert.deepEqual(p.contentRelease.heldSections,['cooling','rumors','columns']);
  assert.equal(p.sectionFreshness.coolingProgress.latestVerifiedAt,'2026-09-08');
  for(const [field,id] of [['policyIndex','ercot-community-impact-rfi-20260918'],['industryNews','ercot-community-impact-rfi-20260918'],['capacityRadar','dexus-anthropic-western-downs-lease-20260916'],['mnaDeals','cleanspark-notes-priced-2276m-20260918'],['mnaDeals','aib-texas-parcel-close-20260914'],['calendarEvents','micron-fy-q4-2026']]) assert.ok(p[field].some(x=>x.id===id),`${field}:${id}`);
  const chipIds=['hygon-board-egm-buyback-20260912','metax-ipo-lockup-float-20260910','biren-h-share-incentive-20260917','loongson-sponsor-rep-change-20260909'];
  for(const id of chipIds)for(const field of ['chinaChipNews','listedCompanyNews'])assert.ok(p[field].some(x=>x.id===id),`${field}:${id}`);
  const h=p.chinaChipNews.find(x=>x.id==='huawei-ascend960-atlas960e-npo-20260917');
  assert.ok(h?.details.length>=10 && h.details.length===h.detailsEn.length);
  assert.match(JSON.stringify(h.detailsEn),/288 GB.*9.6 TB\/s/);
  assert.match(JSON.stringify(h.detailsEn),/192 GB.*2.4 TB\/s/);
  assert.match(JSON.stringify(h.detailsEn),/not independent/);
  assert.ok(p.supernodes.some(x=>x.id===h.id));
  assert.equal(p.idcPulse.filter(x=>x.sourceUrl==='https://blogs.nvidia.com/blog/ai-infra-summit-vera-rubin-dsx-energy-efficiencies-tokens-per-watt-ai-factories/').length,1);
  const release=p.idcPulse.filter(x=>p.contentRelease.includedIds.includes(x.id));
  assert.equal(release.length,16);
  for(const x of release){assert.ok(x.titleEn&&x.summaryEn);assert.notEqual(new URL(x.sourceUrl).pathname,'/');}
  assert.ok(!p.idcPulse.some(x=>x.id==='cleanspark-notes-2227m-20260917'));
});
