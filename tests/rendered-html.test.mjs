import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://dc-atlas.example/", { headers: { accept: "text/html", host: "dc-atlas.example" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished DC Atlas homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>DC Atlas｜中美数据中心上市公司情报站<\/title>/i);
  assert.match(html, /看懂全球算力/);
  assert.match(html, /上市公司全景库/);
  assert.match(html, /东阳光/);
  assert.match(html, /600673/);
  assert.match(html, /演示快照/);
  assert.match(html, /数据有边界，结论才可信/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("includes social sharing metadata for the request host", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /property="og:image" content="https:\/\/dc-atlas\.example\/og\.png"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  assert.match(html, /lang="zh-CN"/i);
});
