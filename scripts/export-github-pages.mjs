import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "dc-atlas";
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? "jasonlx327";
const basePath = repository === `${owner}.github.io` ? "" : `/${repository}`;
const host = `${owner}.github.io`;
const outputDir = resolve("pages-dist");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(resolve("dist/client"), outputDir, { recursive: true });

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages-export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request(`https://${host}/`, {
    headers: {
      accept: "text/html",
      host,
      "x-forwarded-host": host,
      "x-forwarded-proto": "https",
    },
  }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) throw new Error(`Static render failed with ${response.status}`);

let html = await response.text();
html = html
  .replaceAll('"/assets/', `"${basePath}/assets/`)
  .replaceAll('href="/favicon.svg"', `href="${basePath}/favicon.svg"`)
  .replaceAll(`https://${host}/favicon.svg`, `https://${host}${basePath}/favicon.svg`)
  .replaceAll(`https://${host}/og.png`, `https://${host}${basePath}/og.png`)
  .replace('"pathname":"/"', `"pathname":"${basePath}/"`);

await writeFile(resolve(outputDir, "index.html"), html);
await writeFile(resolve(outputDir, "404.html"), html);
await writeFile(resolve(outputDir, ".nojekyll"), "");

const exported = await readFile(resolve(outputDir, "index.html"), "utf8");
if (!exported.includes("上市公司全景库") || exported.includes('href="/assets/')) {
  throw new Error("GitHub Pages export validation failed");
}

console.log(`Exported GitHub Pages site to ${outputDir} with base ${basePath || "/"}`);
