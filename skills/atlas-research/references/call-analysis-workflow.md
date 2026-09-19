# Listed-company earnings-call analysis

## Trigger and output contract

When the task includes earnings, a call, transcript, management Q&A, or post-results analysis, actively locate the latest applicable call if external research is allowed. Do not wait for a user-provided link.

Record:

```text
call_status: official-transcript|official-webcast|official-ir-record|licensed-transcript|call-unavailable|not-requested
call_date:
reporting_period:
source_tier:
source_url:
speakers_or_participants:
transcript_method: official|recording-derived|licensed|none
```

`call-unavailable` is a research result, not a failure to conceal. Use `not-requested` only when the user explicitly limits the task to supplied materials or prohibits external research.

## Discovery order

Use this order and preserve the source tier:

1. U.S.-listed company investor-relations quarterly-results or events page: official transcript, webcast replay, slides, prepared remarks, and press release. Treat this as the canonical source for management's latest call statements.
2. U.S. SEC EDGAR disclosure linked to the result: 8-K or 6-K first, then 10-Q, 10-K, or 20-F. Use it to reconcile the release and attached exhibits; do not assume it contains the full call transcript.
3. Company-hosted replay or official webcast platform. Capture the call date and timestamp for every material statement.
4. China A-share: issuer IR page and investor-relations activity record; CNINFO disclosure; SSE Roadshow Center or SSE e-Interaction; SZSE/Interactive Easy investor-event page; official company webcast or Q&A record.
5. Licensed transcript provider, used only when an official transcript is absent. Identify the provider, retrieval date, and that the source is secondary.

Search results and media summaries can locate a call but cannot stand in for its content.

For U.S. calls, search the issuer's IR site first with `latest earnings call`, `quarterly results`, or `investor events`, then verify the matching 8-K/6-K on EDGAR. Search the web or a licensed provider only after the issuer source has been checked.

## Validate the match

Before extraction, confirm:

- Call date and reporting period match the earnings release.
- Company and ticker match the issuer, including ADR or subsidiary naming differences.
- The call is the latest completed earnings call, not a conference presentation or an older quarter.
- The source is complete enough to identify prepared remarks and Q&A, or the limitation is recorded.

Do not use a transcript that merely repeats the release. Do not combine two quarters' Q&A.

## Extract a call evidence sheet

Separate prepared remarks from Q&A. For each material exchange, capture:

| Topic | Analyst / participant | Management speaker | What was said | Label | Locator | Cross-check |
|---|---|---|---|---|---|---|

Allowed labels:

- `reported`: fact independently in the release, filing, or official supplement.
- `management-said`: guidance, target, intent, explanation, or qualitative statement.
- `analyst-question`: question or concern; never present it as a company fact.
- `atlas-view`: inference after cross-checking the call with primary documents.
- `not-determined`: unclear, unsupported, or inaccessible material.

Extract only items that affect the Atlas question: demand visibility, deployments, GPU or network mix, power procurement, grid, capacity states, cooling, supply constraints, project timing, financing, customer concentration, and guidance assumptions.

## Analyze Q&A without sentiment theater

Identify:

- New disclosure or a clarification not present in the release.
- A management statement that changes the prior Atlas view.
- Repeated analyst questions by theme; report the count and themes, not a speculative “market mood.”
- Direct answer, partial answer, or declined quantification.
- Explicit dependencies, timing, and bottlenecks.
- Differences between prepared remarks and Q&A.

Do not score executive confidence from tone, wording, or an apparent evasion. State only the observable answer quality and missing quantitative evidence.

## Recording-derived notes

If an official webcast exists without a transcript, use recording-derived notes only when audio access and transcription are available.

- Mark each such item `recording-derived`.
- Preserve a timestamp and speaker identity when available.
- Cross-check numbers and definitive claims against the release, filing, slides, or official materials.
- Do not present a machine transcript as an official quotation.
- If a segment is unclear, mark it `not-determined`; do not repair it from context.

## Write the call section

Use this compact format in an earnings review:

1. **Call status** — period, date, source tier, and material limitation.
2. **Management additions** — two to five evidence-linked new points.
3. **Analyst focus** — repeated themes and the relevant management answers.
4. **What changed for Atlas** — supported mechanism, timing, constraint, and uncertainty.
5. **Open items** — unanswered questions and the next disclosure that could resolve them.

No call section may contain stock-price commentary, rating changes, price targets, trading signals, or investment recommendations.

## Stop conditions

Do not present a call analysis as complete when:

- The latest call was not actively checked despite permitted external research.
- The call date or quarter cannot be matched to the release.
- A source is paywalled, incomplete, or unauthenticated and the limitation is hidden.
- An analyst question is written as a management confirmation.
- A recording-derived statement lacks timestamp, speaker, or corroboration for a material claim.
