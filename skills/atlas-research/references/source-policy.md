# IDC Atlas source policy

## Evidence hierarchy

Use the strongest available source for each claim:

1. Regulatory or exchange filing; audited annual report; statutory government or grid disclosure.
2. Company earnings release, investor presentation, official data supplement, project-owner announcement, permit, procurement notice, or signed transaction disclosure.
3. Official earnings webcast, call transcript, executive statement, customer or supplier disclosure.
4. Reputable reporting used for independently attributed context or to discover a primary source.
5. Search snippets, social posts, newsletters, and unsourced commentary used only as leads.

Media cannot fill a missing primary-source fact. If the primary record is unavailable, keep the limitation visible.

## Freshness and cutoff

Record:

- Current date and timezone.
- Research cutoff time.
- Fiscal period and publication or filing dates.
- Whether each source was available before the cutoff.

Do not assume the newest fiscal quarter from training knowledge or calendar position. Confirm it on the issuer's IR site and relevant filing system.

For daily Atlas maintenance, no new disclosure is a valid result only after the relevant source set was checked. Preserve the existing copy and mark `verified-no-change`.

## Numerical discipline

For every important number, preserve:

- Currency and unit.
- Fiscal versus calendar period.
- Reported versus adjusted basis.
- GAAP/IFRS versus non-GAAP measure.
- Actual, guidance, estimate, or management target.
- YoY, QoQ, sequential, or constant-currency comparison.
- Gross versus net capacity, contracted versus available capacity, and announced versus energized capacity.

Recalculate percentages and basis-point changes. Reconcile earnings release, filing, presentation, and transcript. If definitions differ, show the bridge instead of forcing false agreement.

Consensus is usable for beat/miss language only when its provider, scope, and pre-release timestamp are known. Post-release estimates are not a valid benchmark.

## Earnings-call evidence

Preserve the difference among:

- Prepared remarks.
- Analyst question.
- Management answer.
- Inference from tone or omission.

Attribute the speaker and locate the statement. Quote sparingly. A repeated analyst question may reveal uncertainty, but it is not itself proof of a business condition.

## Claim language

- `reported`: document-backed historical fact.
- `management-said`: dated guidance, intention, target, or interpretation.
- `atlas-view`: supported analytical inference.
- `not-determined`: evidence is missing, inaccessible, contradictory, or too weak.

Use calibrated language:

- High confidence: “shows”, “reported”, “filed”.
- Medium confidence: “indicates”, “is consistent with”.
- Low confidence: “may”, “could”, with the missing evidence named.

Avoid “proves”, “guarantees”, or “will” unless the source and circumstance justify certainty.

## Citation requirements

Every material fact needs a dated clickable source close enough for the reader to identify its support. Tables and charts require source lines. Prefer a specific filing, release, slide, table, or transcript location over a homepage.

The final source ledger should include:

| Source | Issuer | Date | Period | Locator | URL | Used for |
|---|---|---|---|---|---|---|

Do not cite a source for a claim it does not directly support.

## Prohibited substitutions

- Do not use stock prices as evidence of operating performance.
- Do not convert capex into megawatts without a disclosed or explicit conversion basis.
- Do not equate a GPU purchase with completed data-center capacity.
- Do not equate announced capacity, contracted capacity, construction start, mechanical completion, and energization.
- Do not treat model benchmarks or user growth as power demand without a supported deployment mechanism.
- Do not infer a supplier win solely from customer capex.
- Do not manufacture an update to make a section look fresh.
