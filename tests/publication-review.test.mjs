import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
const src = await readFile(new URL('../worker/event-intelligence/publication-review.ts',import.meta.url),'utf8');
const {publicationReviewErrors,sourceClasses} = await import(`data:text/javascript,${encodeURIComponent(stripTypeScriptTypes(src))}`);
const u='https://issuer.example/disclosure';
const packet={day:'2026-09-12',decisions:[{eventId:'event',action:'publish',canonicalUrls:[u]}]};
const good={schemaVersion:'atlas-publication-review.v1',day:packet.day,sourceCoverage:sourceClasses.map(kind=>({kind,result:'not-determined',urls:[],note:'Disclosure review incomplete; retained as a gap.'})),events:[{eventId:'event',clusterKey:'issuer-project-period',change:{type:'new-event',description:'Project received a construction permit.',priorPublicIds:[]},impact:{level:'material',dimension:'capacity',affected:'Project delivery',consequence:'Permit clears a construction dependency, but does not establish commissioning.',evidenceUrls:[u]},sources:[{url:u,kind:'issuer-ir',independenceGroup:'issuer',readAt:'2026-09-12T02:00:00Z',finding:'The disclosure states that the construction permit was issued.'}],primaryAttempts:[{url:u,result:'reviewed',note:'Read the full project announcement.'}]}]};
test('source-backed event review passes without disguising coverage gaps',()=>assert.deepEqual(publicationReviewErrors(packet,good),[]));
test('public writing rejects absent impact, unread citations and repeated event cards',()=>{
 for(const alter of [r=>delete r.events[0].impact,r=>r.events[0].sources=[],r=>r.events[0].primaryAttempts=[],r=>r.events[0].change.type='duplicate']){const r=structuredClone(good);alter(r);assert.ok(publicationReviewErrors(packet,r).length);}
 const r=structuredClone(good);r.events.push({...r.events[0],eventId:'second'});
 assert.ok(publicationReviewErrors({...packet,decisions:[...packet.decisions,{...packet.decisions[0],eventId:'second'}]},r).some(e=>e.includes('duplicate')));
});

test('server homepage compaction preserves reviewed event identity and impact in both languages',async()=>{
 const worker=await readFile(new URL('../worker/index.ts',import.meta.url),'utf8');
 const source=worker.slice(worker.indexOf('function compactHomepageAtlasPayload('),worker.indexOf('function bytesToBase64('));
 const compact=new Function('firstItems',stripTypeScriptTypes(source)+';return compactHomepageAtlasPayload;')((value,count)=>Array.isArray(value)?value.slice(0,count):[]);
 const item={id:'event',eventKey:'project-action-period',impactLevel:'material',title:'许可',titleEn:'Permit',sourceName:'Issuer'};
 for(const lang of ['zh','en']){const body=compact({idcPulse:[item],rumors:[item]},lang);assert.equal(body.rumors[0].impactLevel,'material');assert.equal(body.idcPulse[0].eventKey,item.eventKey);}
});
