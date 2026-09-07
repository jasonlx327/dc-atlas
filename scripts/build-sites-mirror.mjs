import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
execFileSync("git", ["diff", "--exit-code", "HEAD", "--", "worker/sites-mirror.mjs", "scripts/build-sites-mirror.mjs", ".openai/hosting.json"], { cwd: root });
const head = execFileSync("git", ["rev-parse", "--verify", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const source = await readFile(new URL("../worker/sites-mirror.mjs", import.meta.url), "utf8");
const marker = '/* BUILD_SOURCE_HEAD */ "development"';
if (source.split(marker).length !== 2) throw new Error("Missing or duplicate mirror release marker");
const built = source.replace(marker, JSON.stringify(head));
const hosting = await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8");
const output = new URL("../.sites-mirror-build/", import.meta.url);
for (const path of [".openai/", "dist/.openai/", "dist/server/"]) {
  await mkdir(new URL(path, output), { recursive: true });
}
await writeFile(new URL("dist/server/index.js", output), built);
await writeFile(new URL(".openai/hosting.json", output), hosting);
await writeFile(new URL("dist/.openai/hosting.json", output), hosting);
console.log(JSON.stringify({ sourceHead: head, packageRoot: fileURLToPath(output), bytes: Buffer.byteLength(built) }));
