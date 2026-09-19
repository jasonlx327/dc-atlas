# Earnings interpretation workflow

## Define the period and comparison

Confirm the issuer's fiscal calendar, reporting currency, latest reported period, release date, and filing date. Identify the intended comparison:

- Same period last year.
- Prior quarter.
- Prior company guidance.
- Pre-release consensus, only if timestamped and accessible.
- Prior Atlas conclusion.

Do not use a later estimate as a pre-release benchmark.

## Assemble the minimum primary packet

Required when available:

1. Earnings release.
2. 10-Q, 10-K, 20-F, 6-K, exchange filing, or equivalent.
3. Investor presentation and supplemental tables.
4. Official webcast or transcript; actively locate it when external research is allowed.
5. Previous-period guidance source.
6. Relevant customer, supplier, regulator, grid, or project-owner disclosure for cross-checks.

If the filing or call is not yet available, label the review as preliminary and list the missing gate.

## Build the change table

Use only metrics material to the Atlas question.

| Metric | Current | Comparison | Change | Basis | Source | Why it matters |
|---|---:|---:|---:|---|---|---|

Typical metrics:

- Revenue and segment revenue.
- Gross margin, operating margin, and cash flow.
- Capital expenditure: cash paid, additions, finance leases, and purchase commitments kept distinct.
- Cloud backlog, remaining performance obligations, bookings, or consumption metrics.
- Data-center capacity, land, leases, construction, power procurement, grid connections, and commissioning.
- Accelerator, networking, memory, rack-density, and cooling disclosures.
- Supply constraints, lead times, qualification, and geographic availability.

Do not include a metric only because it is conventional. Include it when it changes the infrastructure interpretation.

## Reconcile before interpreting

Check:

- Does the cash-flow capex figure match management's capex language?
- Are finance leases or equipment acquired but unpaid excluded?
- Is a segment figure affected by a reclassification?
- Is growth reported or constant currency?
- Are non-GAAP adjustments material?
- Does guidance refer to a quarter, fiscal year, run rate, exit rate, or multi-year target?
- Does “capacity” mean IT load, utility power, gross building capacity, contracted power, or operational capacity?

Show unresolved bridges in the output.

## Read the call as evidence

Use [call-analysis-workflow.md](call-analysis-workflow.md). Actively locate the latest applicable call; do not wait for the user to supply a transcript. Record the result in the source ledger even when no usable call material exists.

## Map the infrastructure read-through

For each supported conclusion, use:

`disclosure → operating change → infrastructure mechanism → affected link → time horizon → constraint → counter-evidence`

Example pattern:

`higher cloud demand and disclosed capacity additions → accelerated deployment schedule → more high-density clusters → near-term networking and power-equipment demand, later cooling and site-capacity demand → gated by grid interconnection and component lead times`

Each arrow needs evidence. Remove unsupported links.

## Draft formats

### Quick take

Use when speed matters and the source packet is complete enough:

1. One-sentence conclusion.
2. Three to five quantified changes.
3. Infrastructure read-through.
4. Main uncertainty or counter-evidence.
5. Sources and cutoff.

### Full Atlas earnings review

1. **Headline conclusion** — what changed and why it matters.
2. **Reported results** — compact change table.
3. **Management said** — guidance, call commentary, and disclosed constraints.
4. **Atlas view** — mechanism, timing, beneficiaries or affected links without security recommendations.
5. **What did not change** — retained conclusions and `verified-no-change` items.
6. **Counter-case** — alternative explanation and evidence that would weaken the view.
7. **Watch list** — specific operational disclosures to monitor next quarter.
8. **Source ledger** — primary documents first.

Include `call_status`, the call date, the source tier, and the material Q&A findings or the reason the call could not be used.

## Earnings-specific stop conditions

Do not publish as complete when:

- The latest period has not been confirmed.
- A material figure cannot be reconciled.
- Beat/miss language lacks timestamped pre-release consensus.
- The infrastructure conclusion skips an unsupported link.
- Management targets are written as realized outcomes.
- A key source link does not open or does not support the claim.

Exclude stock-price response, ratings, price targets, valuation calls, and investment advice even if upstream project templates contain them.
