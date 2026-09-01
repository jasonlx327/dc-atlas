# IDC Atlas current-time supplemental release — 2026-09-01

- Window: 2026-09-01 09:30–09:55 Beijing time; the prior 09:30 packet was reconciled as discovery input.
- Global scan: 2,823 fetched records, 2,784 normalized records, 650 clusters and 138 editorial candidates.
- Core companies: 50/50 checked; 4 changed, 28 no-change and 18 not-determined. Failed or blocked official routes were not converted into no-change.
- Public scope: four formal bilingual records and five versioned bilingual Global Intelligence records.
- Local holds: 133 candidates were deduplicated, off-topic, stale, inaccessible or insufficiently bounded. Holds remain event-local.

## Section decisions

Publish: IDC Pulse, listed companies, M&A, capacity, compute products, supply chain, power/model demand, Global Intelligence and policy.

No change: cooling, China GPU formal records, earnings calendar and columns. The CXMT HBM3E report remains attributed Global Intelligence, while the MiniMax/Z.ai research published earlier remains current and is not duplicated.

## Evidence boundaries

The AMD/HUMAIN live-compute milestone, Alibaba Brazil region, NVIDIA/MediaTek transaction and U.S. bulk-power order use opened T0/T1 records. Rubin CPX, OpenAI energy desk, PJM/Oklo, CXMT HBM3E and OpenAI advertising run rate remain attributed media intelligence. Generation MW is not converted into data-center load; reported revenue run rate is not converted into tokens, compute or power.

## Release state

Published from commit `e62852c962fe2525e6b9624129a8f4e10bd66d60` to Cloudflare version `49142956-eec1-4c6e-b5d8-33d836b9eac6` and Sites version `143`. Both deployments use the same commit. Formal-domain bilingual pages and record IDs returned 200; the Sites mirror returned its expected 308 canonical redirect and followed to a 200 formal-domain response. The production API returned all five new Global Intelligence records in the top six after the public-feed cache version was refreshed, and the server-rendered Chinese first screen included the latest Rubin CPX record before client hydration.
