import hf from "./september-week-hf.json";
import broadcom from "./september-week-broadcom.json";
import claude from "./september-week-claude.json";
import ciena from "./september-week-ciena.json";
import { astraSeptemberRecord } from "./astra-september-data";
import type { ScheduledResearchRecord } from "./scheduled-article-data";

export const septemberWeekResearchRecords: ScheduledResearchRecord[] = [
  hf as ScheduledResearchRecord,
  broadcom as ScheduledResearchRecord,
  claude as ScheduledResearchRecord,
  ciena as ScheduledResearchRecord,
  astraSeptemberRecord,
];
