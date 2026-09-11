import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

const root = process.cwd();
const gitFile = (revision, path) => execFileSync("git", ["show", `${revision}:${path}`], { cwd: root, encoding: "utf8" });
const oursRevision = "HEAD";
const theirsRevision = "88143828f89f7caed92710970fd13728e776e4ab";
const ours = JSON.parse(gitFile(oursRevision, "app/data/public-intelligence.json"));
const theirs = JSON.parse(gitFile(theirsRevision, "app/data/public-intelligence.json"));
const byId = new Map(theirs.map((item) => [item.id, item]));
for (const item of ours) byId.set(item.id, item);
const merged = [...byId.values()].sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));
await writeFile(`${root}/app/data/public-intelligence.json`, `${JSON.stringify(merged, null, 2)}\n`);
console.log(JSON.stringify({ mergedPublicIntelligence: merged.length, eventArtifact: "preserve-current-run-after-conflict-resolution" }));
