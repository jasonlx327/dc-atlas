# Event Intelligence history-v1 replay corpus

`history-v1` contains traceable repository and shadow-run observations with 360 stratified labels. Labels are selected to preserve minimum coverage of primary records, media leads, duplicates, negative examples, capacity boundaries, bilingual pairs and response timelines.

## Review states

- `provisional`: rule-generated candidate, not gate-eligible.
- `audited`: accepted by the deterministic second-pass policy audit.
- `frozen`: accepted by an independent human reviewer.

The current gate accepts `audited` or `frozen` labels and reports their counts separately. Automated review never claims to be human review. Each accepted entry must match its label hash and retain reviewer type, decision, timestamp and checked source URLs.

## Commands and artifacts

```bash
npm run event:replay
npm run event:historical-replay
```

- Corpus: `scripts/fixtures/event-intelligence/history-v1.json`
- Review manifest: `scripts/fixtures/event-intelligence/history-v1-label-reviews.json`
- Validation: `artifacts/event-intelligence/replay-corpus-validation.json`
- Metrics: `artifacts/event-intelligence/replay-history-v1.json`
- T−7 ledger: `artifacts/event-intelligence/historical-replay-7d-ledger.json`

The historical replay uses only observations with explicit `publishedAt` at or before each cutoff. Records without a publication time are excluded, and the artifact explicitly states that reconstruction is not proof of historical Atlas fetch availability.

## Boundary

Replay performs zero model calls and writes local artifacts only. It does not authorize production writes or deployment.
