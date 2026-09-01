# IDC Atlas current-time supplemental release remediation — 2026-09-01

- Global cutoff: 2026-09-01 09:30–09:55 Beijing time; all 121 records from the 09:30 handoff were reconciled as discovery input.
- Scan: 2,823 fetched, 2,784 normalized, 650 clusters and 138 editorial candidates.
- Core companies: 50/50 checked; 4 changed, 28 verified no-change and 18 not-determined. Seven source routes failed; none was converted into no-change.
- Public writes: four bilingual formal records and five bilingual attributed Global Intelligence records.
- Section closure: nine publish and four no-change; 133 stale, duplicate, off-topic, inaccessible or insufficiently bounded candidates remain event-local holds.

## Remediation completed

1. Corrected the Global Intelligence status track so a generic media-report state no longer lights the official-response step.
2. Removed the legacy order-keyword priority from the public intelligence feed and made the newest attributable records the prominent sequence.
3. Added a public-feed cache version so a deployment cannot retain the previous ordering under an unchanged content hash.
4. Removed an unused full daily-brief object from the compressed homepage prime so the latest intelligence record is present in the server-rendered first screen rather than appearing only after client hydration.

## Release proof

- Release commit: `e62852c962fe2525e6b9624129a8f4e10bd66d60`.
- Cloudflare: version `49142956-eec1-4c6e-b5d8-33d836b9eac6`.
- Sites: version `143`, built from the same commit.
- Production API: `contentReviewedAt=2026-09-01`; the five new media records occupy positions 1–5 of the public intelligence feed.
- Server-rendered first screen: the latest Rubin CPX record is present before client hydration; the client then expands the desk to the six newest records.
- Formal and English pages: root, intelligence index, representative intelligence detail and policy detail all returned HTTP 200.
- Sites mirror: deployment succeeded; the mirror returned the expected HTTP 308 canonical redirect to `https://idc-index.com/`, which returned HTTP 200.

## Remaining follow-up

- Eighteen company checks and seven failed source routes remain explicitly not-determined and should be retried in later windows.
- No global release blocker remains.
