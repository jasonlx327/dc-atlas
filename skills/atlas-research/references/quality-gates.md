# Publication quality gates

All required gates must pass. If one fails, deliver a research status note or draft with the failed gate named.

## Gate 1: Scope

- [ ] Research question, audience, format, geography, time horizon, and cutoff are explicit.
- [ ] The output answers the stated question without silent scope expansion.

## Gate 2: Source integrity

- [ ] Latest relevant period or event is confirmed from a primary source.
- [ ] Material facts use the strongest accessible source.
- [ ] Each source link opens and directly supports the associated claim.
- [ ] Search snippets and media are not used as substitute evidence.
- [ ] Inaccessible or missing evidence is marked `not-determined`.

## Gate 3: Numerical integrity

- [ ] Units, currencies, periods, and accounting bases are explicit.
- [ ] Reported, adjusted, guidance, target, and estimate figures are not mixed.
- [ ] Percentages and basis-point movements recalculate correctly.
- [ ] Material differences across release, filing, presentation, and call are reconciled or shown.
- [ ] Beat/miss language uses timestamped pre-release consensus.

## Gate 4: Analytical integrity

- [ ] Fact, management statement, and Atlas inference remain separate.
- [ ] Each inference names its mechanism, time horizon, and constraint.
- [ ] No unsupported jump occurs in the infrastructure chain.
- [ ] Announced, contracted, under-construction, and operational states are distinct.
- [ ] The strongest alternative explanation and counter-evidence are addressed.

## Gate 5: Editorial quality

- [ ] The lead states the main supported conclusion.
- [ ] Important claims are quantified.
- [ ] Repetition, generic background, and promotional language are removed.
- [ ] Tables and charts have sources and materially aid understanding.
- [ ] Uncertainty and what would change the conclusion are visible.
- [ ] The source ledger is complete and dated.

## Gate 6: Atlas safety boundary

- [ ] No stock-price commentary.
- [ ] No buy/sell rating, price target, trading signal, or portfolio instruction.
- [ ] No fabricated update or freshness theater.
- [ ] No source-inaccessible claim is presented as confirmed.

## Recommended audit record

Record:

```text
scope_gate: pass|fail
source_gate: pass|fail
numeric_gate: pass|fail
analysis_gate: pass|fail
editorial_gate: pass|fail
safety_gate: pass|fail
open_gaps:
publication_status: ready|draft|blocked|verified-no-change
```

`publication_status: ready` requires all six gates to pass.
