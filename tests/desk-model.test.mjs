import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
const source=await readFile(new URL('../app/desk-model.ts',import.meta.url),'utf8');
const {buildDeskRecords,researchRecord}=await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`);
const article={href:'/columns/example',hrefEn:'/en/columns/example',title:'中文',titleEn:'English',summary:'摘要',summaryEn:'Summary',publishAt:'2026-09-08T08:00:00Z',image:'/cover.jpg',series:'TEST · 1'};
test('feed preserves media evidence, source and language without upgrading it to fact',()=>{
 const rumor={id:'x',title:'报道',titleEn:'Reported',summary:'媒体摘要',summaryEn:'Media summary',publishedAt:'2026-09-08T10:00:00Z',sourceName:'Publisher',sourceUrl:'https://example.org/report',sourceCount:1,officialResponse:'待确认',officialResponseEn:'Not confirmed',region:'全球'};
 const r=buildDeskRecords({pulse:[],companies:[],rumors:[rumor]},[article],'en');
 assert.equal(r[0].kind,'media');assert.equal(r[0].title,'Reported');assert.equal(r[0].response,'Not confirmed');assert.equal(r[0].sourceHref,rumor.sourceUrl);assert.equal(r[1].href,article.hrefEn);
});
test('duplicate story across project and company feeds is merged, separate events stay separate',()=>{
 const story={id:'a',title:'Event',sourceUrl:'https://example.org/a',publishedAt:'2026-09-07'};
 const r=buildDeskRecords({pulse:[story],companies:[story,{...story,id:'b',title:'Different event'}]},[],'zh');
 assert.equal(r.length,2);assert.ok(r.every(x=>x.kind==='fact'));
});
test('missing dates and summaries remain unknown and covers are unchanged',()=>{
 const r=buildDeskRecords({pulse:[{id:'x',title:'Unknown',sourceUrl:'https://example.org'}],companies:[]},[],'zh');
 assert.equal(r[0].date,'');assert.equal(r[0].summary,'');assert.equal(researchRecord(article,'en').image,article.image);
});
