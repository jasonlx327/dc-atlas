export type EventIntelligenceJob = "event-night" | "event-midday" | "snapshot-daily" | "daily-closure" | "event-day";

export const eventIntelligenceSchedule = [
  { job: "event-night" as const, utc: "30 21 * * *", beijing: "05:30", purpose: "nightly event ingest, cluster and route" },
  { job: "event-midday" as const, utc: "30 4 * * *", beijing: "12:30", purpose: "midday event ingest, cluster and route" },
  { job: "snapshot-daily" as const, utc: "0 22 * * *", beijing: "06:00", purpose: "existing formal Atlas snapshot" },
  { job: "daily-closure" as const, utc: "30 22 * * *", beijing: "06:30", purpose: "DeepSeek selection, 13-section closure and refreshed snapshot" },
  { job: "event-day" as const, utc: "30 12 * * *", beijing: "20:30", purpose: "evening event ingest, cluster and route" },
];

export function jobForUtcSlot(date: Date): EventIntelligenceJob | null {
  return eventIntelligenceSchedule.find((item) => item.utc.startsWith(`${date.getUTCMinutes()} ${date.getUTCHours()} `) || item.utc === `${date.getUTCMinutes()} ${date.getUTCHours()} * * *`)?.job ?? null;
}

export function beijingLabel(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "short", timeStyle: "short", hour12: false }).format(date);
}

export function newYorkLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", dateStyle: "short", timeStyle: "short", hour12: false }).format(date);
}

export async function dispatchEventIntelligenceSchedule(
  date: Date,
  handlers: Record<EventIntelligenceJob, () => Promise<void>>,
): Promise<EventIntelligenceJob | null> {
  const job = jobForUtcSlot(date);
  if (!job) return null;
  await handlers[job]();
  return job;
}
