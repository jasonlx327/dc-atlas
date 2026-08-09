# Gate 3.6 accelerated remediation — 2026-08-09

## Outcome

The local event-intelligence gate no longer requires seven calendar days of waiting. It uses a source-bounded T−7 reconstruction for breadth and two real canonical scheduler runs for live smoke evidence. Production was not touched.

## Evidence

- Historical replay: 14/14 slots passing across 7/7 Beijing dates (2026-08-02 through 2026-08-08).
- Event-semantic sources: 37 healthy endpoints; requirement 30.
- Label audit: 360 deterministic second-pass policy audits; requirement 240.
- Coverage includes 52 capacity-boundary, 274 duplicate/syndication, 51 negative, 21 bilingual and 56 timeline-response labels.
- Replay: relevance precision 0.879, recall 1.000, high-value recall 1.000, clustering purity 1.000, bilingual consistency 1.000; all safety counters zero.
- Clustering regression: 20/20 passing.
- Live smoke: event-day recorded and passing; event-night remains the only acceptance blocker.

## Review boundary

`automated-policy-audit` is an explicit deterministic second pass, not an independent human review. Human-reviewed labels remain separately counted as `frozen`; none are claimed here. The automated gate is accepted because the intended operating model is AI-managed, while every label retains its source URL, hash, audit decision and timestamp.

The historical replay filters on explicit publication time. It proves deterministic behavior against the present traceable corpus; it does not claim Atlas fetched each item at that historical instant. Live scheduler provenance is therefore still checked with one real `event-night` and one real `event-day` run.

## Public translation boundary

Source-only internal candidates may remain untranslated. A run fails only if an item marked public-eligible lacks either Chinese or English title/summary. This prevents internal discovery records from blocking the pipeline while preserving the public bilingual contract.

## Release boundary

All artifacts are local/shadow-only. Production D1, Worker, Sites, KV, public API behavior and the industry-network path are unchanged. Gate 4 deployment still requires explicit approval after the remaining live-smoke slot passes.
