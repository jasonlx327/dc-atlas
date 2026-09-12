import type { AtlasEditorDecisionPacket } from './atlas-auto-editor.ts';
export const sourceClasses = ['issuer-ir', 'exchange-regulator', 'earnings-call', 'permit-grid', 'government-policy', 'technical-standard', 'partner-customer', 'original-media'] as const;
export type PublicationReview = {
  schemaVersion: 'atlas-publication-review.v1';
  day: string;
  sourceCoverage: Array<{kind: typeof sourceClasses[number]; result: 'reviewed' | 'not-determined' | 'not-applicable'; urls: string[]; note: string}>;
  events: Array<{
    eventId: string;
    clusterKey: string;
    change: {type: 'new-event' | 'new-detail' | 'status-change' | 'official-response' | 'contradiction'; description: string; priorPublicIds: string[]};
    impact: {level: 'high' | 'material'; dimension: 'capacity' | 'economics' | 'supply-chain' | 'technology' | 'policy' | 'capital'; affected: string; consequence: string; evidenceUrls: string[]};
    sources: Array<{url: string; kind: typeof sourceClasses[number]; independenceGroup: string; readAt: string; finding: string}>;
    primaryAttempts: Array<{url: string; result: 'reviewed' | 'unavailable' | 'no-matching-disclosure'; note: string}>;
  }>;
};
const text = (v: unknown): v is string => typeof v === 'string' && !!v.trim();
const url = (v: unknown): v is string => { try { return typeof v === 'string' && ['http:', 'https:'].includes(new URL(v).protocol); } catch { return false; } };
export function publicationReviewErrors(packet: AtlasEditorDecisionPacket, review: PublicationReview): string[] {
  const errors: string[] = [];
  if (review?.schemaVersion !== 'atlas-publication-review.v1' || review.day !== packet.day) return ['Current-day publication review is required'];
  const coverage = review.sourceCoverage ?? [];
  for (const kind of sourceClasses) {
    const rows = coverage.filter(r => r.kind === kind);
    if (rows.length !== 1 || !text(rows[0].note) || !['reviewed','not-determined','not-applicable'].includes(rows[0].result)
      || !Array.isArray(rows[0].urls) || !rows[0].urls.every(url) || (rows[0].result === 'reviewed' && !rows[0].urls.length)) errors.push(`Source class ${kind}: actual review or explicit gap is required`);
  }
  const clusters = new Set<string>();
  const publicDecisions = packet.decisions.filter(d => d.action === 'publish');
  for (const d of publicDecisions) {
    const entries = (review.events ?? []).filter(r => r.eventId === d.eventId);
    if (entries.length !== 1) { errors.push(`${d.eventId}: exactly one event review is required`); continue; }
    const r = entries[0];
    if (!text(r.clusterKey) || clusters.has(r.clusterKey)) errors.push(`${d.eventId}: duplicate or missing event cluster`);
    clusters.add(r.clusterKey);
    if (!r.change || !['new-event','new-detail','status-change','official-response','contradiction'].includes(r.change.type)
      || !text(r.change.description) || !Array.isArray(r.change.priorPublicIds)
      || (r.change.type !== 'new-event' && !r.change.priorPublicIds.length)) errors.push(`${d.eventId}: material delta and prior public IDs are required`);
    const sources = r.sources ?? [];
    if (!sources.length || sources.some(s => !url(s.url) || !sourceClasses.includes(s.kind) || !text(s.independenceGroup) || !Number.isFinite(Date.parse(s.readAt)) || !text(s.finding))) errors.push(`${d.eventId}: original documents must be read and attributed`);
    const readUrls = new Set(sources.map(s => s.url));
    if (!d.canonicalUrls.length || d.canonicalUrls.some(u => !readUrls.has(u))) errors.push(`${d.eventId}: public sources must have reading evidence`);
    if (!r.primaryAttempts?.length || r.primaryAttempts.some(a => !url(a.url) || !['reviewed','unavailable','no-matching-disclosure'].includes(a.result) || !text(a.note)
      || (a.result === 'reviewed' && !sources.some(s => s.url === a.url && s.kind !== 'original-media')))) errors.push(`${d.eventId}: direct primary-source search is required`);
    const impact = r.impact;
    if (!impact || !['high','material'].includes(impact.level) || !['capacity','economics','supply-chain','technology','policy','capital'].includes(impact.dimension)
      || !text(impact.affected) || !text(impact.consequence) || !impact.evidenceUrls?.length || impact.evidenceUrls.some(u => !readUrls.has(u))) errors.push(`${d.eventId}: source-backed industry impact is required`);
  }
  for (const r of review.events ?? []) if (!publicDecisions.some(d => d.eventId === r.eventId)) errors.push(`${r.eventId}: review has no matching public decision`);
  return errors;
}
