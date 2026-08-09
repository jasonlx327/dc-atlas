# Gate 3.5B source health and clustering regression

## Source health

The current local run includes 31 endpoints from a 45-source registry. HTTP and connector-contract checks are structurally healthy, but only 12 endpoints currently emit event records. The other 19 are generic official HTML pages and are classified as `page-change-signal`; page reachability and a page title do not count as event-semantic ingestion.

The source artifact is [`artifacts/event-intelligence/source-health-30.json`](/Users/xlarge/Desktop/数据中心/data-center-site-work/artifacts/event-intelligence/source-health-30.json). Gate 4 requires at least 30 event-semantic endpoints, zero connector-contract errors, and the full seven-day shadow window. The present `12/30` semantic count is therefore a hard blocker rather than a stability pass.

Licensed media, API-key endpoints, known access restrictions, and unavailable endpoints remain visible in the registry. They are not silently counted as healthy.

## Clustering regression

The artifact [`artifacts/event-intelligence/clustering-regression.json`](/Users/xlarge/Desktop/数据中心/data-center-site-work/artifacts/event-intelligence/clustering-regression.json) currently executes 20 deterministic diagnostic cases:

- 12 exact canonical URL deduplication cases;
- 3 same-event cross-source relationship cases;
- 5 separate-event non-merge cases.

All 20 currently behave as expected. Cross-source fixtures prefer substantive stored records over auto-generated `source reference` placeholders and assert the relationship (`confirmation`, `translation`, or `syndication`) as well as the cluster count. This remains diagnostic evidence until the underlying corpus reaches the independent-review label gate.

Run both checks with:

```bash
npm run event:source-health
npm run event:cluster-regression
```

Neither command deploys, writes production D1/Worker/Sites/KV, changes public API semantics, or touches the industry-network path.
