import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { beijingLabel, jobForUtcSlot, newYorkLabel } from "../worker/event-intelligence/schedule.ts";

const outputUrl = new URL("../artifacts/event-intelligence/timezone-dst-report.json", import.meta.url);

function localParts(date: Date, timeZone: string): Record<string, string> {
  return Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
}

const cases = [
  { id: "beijing-event-night-next-day", instant: "2026-08-08T21:30:00Z", timeZone: "Asia/Shanghai", expected: { year: "2026", month: "08", day: "09", hour: "05", minute: "30" } },
  { id: "beijing-daily-closure", instant: "2026-08-08T22:30:00Z", timeZone: "Asia/Shanghai", expected: { year: "2026", month: "08", day: "09", hour: "06", minute: "30" } },
  { id: "beijing-winter-no-dst", instant: "2026-01-15T15:00:00Z", timeZone: "Asia/Shanghai", expected: { year: "2026", month: "01", day: "15", hour: "23", minute: "00" } },
  { id: "beijing-summer-no-dst", instant: "2026-07-15T15:00:00Z", timeZone: "Asia/Shanghai", expected: { year: "2026", month: "07", day: "15", hour: "23", minute: "00" } },
  { id: "new-york-standard-time", instant: "2026-01-15T15:00:00Z", timeZone: "America/New_York", expected: { year: "2026", month: "01", day: "15", hour: "10", minute: "00" } },
  { id: "new-york-daylight-time", instant: "2026-07-15T15:00:00Z", timeZone: "America/New_York", expected: { year: "2026", month: "07", day: "15", hour: "11", minute: "00" } },
];

const results = cases.map((item) => {
  const actual = localParts(new Date(item.instant), item.timeZone);
  assert.deepEqual(actual, item.expected, `${item.id} timezone conversion`);
  return { ...item, actual, pass: true };
});
assert.equal(jobForUtcSlot(new Date("2026-08-08T21:30:00Z")), "event-night");
assert.equal(jobForUtcSlot(new Date("2026-08-08T04:30:00Z")), "event-midday");
assert.equal(jobForUtcSlot(new Date("2026-08-08T12:30:00Z")), "event-day");
assert.equal(jobForUtcSlot(new Date("2026-08-08T22:30:00Z")), "daily-closure");
assert.match(beijingLabel(new Date("2026-08-08T21:30:00Z")), /08\/09|8\/9/);
assert.match(newYorkLabel(new Date("2026-01-15T15:00:00Z")), /10:00/);
assert.match(newYorkLabel(new Date("2026-07-15T15:00:00Z")), /11:00/);

const output = {
  schemaVersion: "atlas-event-timezone-dst.v1",
  status: "passed",
  generatedAt: new Date().toISOString(),
  timeZones: { zh: "Asia/Shanghai", en: "America/New_York" },
  utcSchedule: { eventNight: "30 21 * * *", eventMidday: "30 4 * * *", eventDay: "30 12 * * *", snapshotDaily: "0 22 * * *", dailyClosure: "30 22 * * *" },
  cases: results,
  productionTouched: false,
};
const outputPath = fileURLToPath(outputUrl);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output: outputPath, status: output.status, cases: results.length }, null, 2));
