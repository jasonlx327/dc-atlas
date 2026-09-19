---
name: atlas-research
description: Produce source-led IDC Atlas earnings reviews and deep industry columns for data centers, cloud, semiconductors, GPU and memory, power, cooling, networking, capacity parks, and AI-model demand. Use for quarterly or annual earnings interpretation, filing and earnings-call analysis, cross-company comparisons, sector mechanisms, thematic columns, evidence-led editorial updates, and review of an existing Atlas draft. Separates reported facts, management statements, and Atlas inference; emphasizes current primary sources, numerical reconciliation, counter-evidence, infrastructure transmission mechanisms, and publication-ready Chinese writing. Excludes stock-price commentary, ratings, price targets, trading signals, and investment advice.
---

# Atlas Research

Create defensible IDC Atlas research that explains not only what changed, but how the change propagates through AI infrastructure.

## Route the request

- For quarterly or annual results, filings, guidance, earnings calls, or peer-result comparisons, read [references/earnings-workflow.md](references/earnings-workflow.md).
- For an earnings call, management Q&A, analyst-question analysis, or transcript review, read [references/call-analysis-workflow.md](references/call-analysis-workflow.md).
- For a thematic deep dive, industry mechanism, project event, supply-chain question, or Atlas column, read [references/column-workflow.md](references/column-workflow.md).
- For every task, read [references/source-policy.md](references/source-policy.md) and [references/quality-gates.md](references/quality-gates.md).
- Read [references/research-patterns.md](references/research-patterns.md) only when reviewing the Skill design or adapting its workflow.

## Establish the research contract

Before collecting evidence, state:

1. The exact research question and intended output.
2. The as-of date, timezone, reporting period, and source cutoff.
3. The companies, projects, geographies, and infrastructure links in scope.
4. Whether the output is a quick take, full earnings review, deep column, or draft review.
5. Known access gaps such as an unavailable filing, transcript, consensus feed, or paywalled source.

If the requested scope is broad, define a bounded question tree. Do not silently broaden it.

## Build an evidence packet

Collect current primary documents before writing prose. Maintain a working ledger with:

| Field | Requirement |
|---|---|
| Claim ID | Stable short identifier |
| Claim | One checkable factual statement |
| Status | `reported`, `management-said`, `atlas-view`, `not-determined` |
| Source | Document title, issuer, publication or filing date, URL |
| Locator | Page, slide, section, table, or transcript speaker |
| Period and units | Fiscal period, currency, unit, GAAP/non-GAAP basis |
| Confidence | `high`, `medium`, or `low`, with reason |
| Conflict | Contradictory figure or unresolved definition |

Search snippets, social posts, and media summaries are discovery aids, not final evidence. A missing source is a gap, not permission to infer a fact.

For every earnings review, actively check whether the latest applicable earnings call exists when external research is allowed. Record `call_status` as `official-transcript`, `official-webcast`, `official-ir-record`, `licensed-transcript`, `call-unavailable`, or `not-requested`. Do not wait for the user to provide a link.

## Run the Atlas analysis loop

Use a bounded loop:

1. Plan the minimum questions needed to answer the brief.
2. Gather and normalize evidence.
3. Reconcile numbers and definitions.
4. Map the supported transmission mechanism.
5. Search specifically for counter-evidence and alternative explanations.
6. Draft only from the evidence packet.
7. Audit every material claim against its source.
8. Stop when the quality gates pass or report the remaining gap.

Do not keep researching merely to accumulate links. Stop when additional sources no longer change a material claim, close a gap, or test the conclusion.

## Separate the three analytical layers

Use these labels consistently, whether or not they appear as visible headings:

- **Reported / 已披露**: historical figures, filed facts, signed contracts, completed projects.
- **Management said / 管理层表示**: guidance, targets, intentions, timelines, qualitative call commentary.
- **IDC Atlas view / Atlas 研判**: the analytical consequence inferred from the first two layers.

Every Atlas inference must name its evidence, mechanism, time horizon, and main uncertainty. Never convert management intent into completed capacity or secured demand.

## Apply the infrastructure mechanism map

Test only the links relevant to the evidence:

`model demand → compute deployment → accelerator and CPU mix → memory and networking → rack density → power and grid → land and data-center capacity → cooling → construction and equipment supply chain`

For each claimed link, answer:

- What changed?
- Through what physical or commercial mechanism?
- At what time horizon?
- What is the bottleneck or gating condition?
- Which evidence would disprove or weaken the link?

Do not jump from revenue growth or higher capex directly to a data-center conclusion.

## Write for decision usefulness

Lead with the strongest supported conclusion. Prefer quantified change, causal explanation, and boundary over promotional language.

Default to Chinese. Keep official company and product names in their original form where useful. Provide a separate English version only when requested; do not interleave sentence-by-sentence translation.

Each publication-ready output should include:

- A factual lead.
- A compact change table or evidence map when it materially improves clarity.
- The mechanism and timing.
- Counter-evidence, uncertainty, and what would change the conclusion.
- A source ledger with dated clickable links.

Do not include stock-price moves, buy/sell ratings, price targets, portfolio advice, or trading signals.

## Handle incomplete evidence

- If no reliable new disclosure exists, say `verified-no-change` and retain the prior supported conclusion.
- If a material primary source is inaccessible, mark the affected claim `not-determined`.
- If two primary sources conflict, show both figures and explain the likely definitional or timing difference; do not choose silently.
- If pre-release consensus is unavailable, do not call a result a beat or miss.
- If an official transcript is unavailable, distinguish prepared remarks, webcast observations, and secondary transcripts.
- If an earnings call was checked, state the source tier, call date, speakers or participants when available, and any transcript or audio limitation.

## Final delivery

Provide the finished article or review first, then a concise research note containing:

- Scope and cutoff.
- Primary sources used.
- Material changes from any prior version.
- Open evidence gaps.
- Quality-gate result.

Do not describe a draft as publication-ready unless every required gate passes.
