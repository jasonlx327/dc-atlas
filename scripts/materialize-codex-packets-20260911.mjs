import { readFile, writeFile, mkdir } from "node:fs/promises";
import { buildCodexEditorialPackets } from "../worker/event-intelligence/codex-editorial-judgment.ts";

const root = process.cwd();
const source = JSON.parse(await readFile(`${root}/artifacts/event-intelligence/codex-event-night.json`, "utf8"));
const judgment = JSON.parse(await readFile(`${root}/artifacts/event-intelligence/codex-editorial-judgment.json`, "utf8"));
const packets = buildCodexEditorialPackets(source, judgment);
await mkdir(`${root}/artifacts/event-intelligence`, { recursive: true });
for (const [name, value] of Object.entries({
  "2026-09-11-editor-decision.json": packets.editor,
  "2026-09-11-selection.json": packets.selection,
  "2026-09-11-candidates.json": packets.candidates,
  "2026-09-11-closure.json": packets.closure,
})) await writeFile(`${root}/artifacts/event-intelligence/${name}`, `${JSON.stringify(value, null, 2)}\n`);
console.log(JSON.stringify({ editor: packets.editor.summary, closure: packets.closure.counts, closureStatus: packets.closure.status }));
