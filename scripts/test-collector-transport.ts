import assert from 'node:assert/strict';
import {fetchWithRetries} from '../worker/connectors/http.ts';
import {fetchRegisteredSource,sourceRegistry} from '../worker/connectors/index.ts';
const original=globalThis.fetch;
try {
 let calls=0;let cancelled=false;
 globalThis.fetch=async()=>{calls++;return calls===1?new Response(new ReadableStream({cancel(){cancelled=true}}),{status:503}):new Response('ok')};
 assert.equal((await fetchWithRetries('https://example.com')).response.status,200);assert.equal(calls,2);assert.equal(cancelled,true);
 const abort=new AbortController();abort.abort();calls=0;
 await assert.rejects(fetchWithRetries('https://example.com',{signal:abort.signal}));assert.equal(calls,0);
 globalThis.fetch=async()=>new Response(JSON.stringify([{id:'123456',text:'optical '.repeat(100),author:{screenName:'aleabitoreddit'},createdAtISO:'2026-09-05T08:11:29Z'}]));
 const r=await fetchRegisteredSource(sourceRegistry.find(s=>s.id==='serenity-archive')!);
 assert.equal(r.observations.length,1);assert.equal(r.observations[0].canonicalUrl,'https://x.com/aleabitoreddit/status/123456');assert.equal(r.observations[0].titleOriginal.length,240);assert.equal(r.observations[0].publishedAt,'2026-09-05T08:11:29.000Z');
 console.log('Retry cleanup, cancellation and archive URL regression passed');
}finally{globalThis.fetch=original}
