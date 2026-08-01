# Open-source research patterns used in Atlas Research

This Skill synthesizes workflow ideas from public repositories. It does not copy their code or import their trading objectives.

Repository metadata was checked on 2026-08-01. Star counts change over time.

| Project | Useful pattern | Atlas adaptation | Boundary |
|---|---|---|---|
| [OpenBB](https://github.com/OpenBB-finance/OpenBB) | Connect data once and expose it across research surfaces | Keep the research workflow source-agnostic and normalize evidence before analysis | AGPL-3.0; no code incorporated |
| [FinceptTerminal](https://github.com/Fincept-Corporation/FinceptTerminal) | Unified multi-source research workspace and broad connector catalog | Use a single evidence packet and explicit source ledger | Public edition moved to monthly maintenance in June 2026; dual-license terms are restrictive for company use; no code incorporated |
| [TradingAgents](https://github.com/TauricResearch/TradingAgents) | Specialized analyst roles and structured bull/bear debate | Use evidence, mechanism, skeptic, and editor passes | Remove trader, technical signal, portfolio, and execution roles |
| [Dexter](https://github.com/virattt/dexter) | Task planning, self-validation, scratchpad trace, loop limits, evaluation | Use a bounded question tree, claim ledger, stop conditions, and explicit audit | Repository API exposes no license file although README states MIT; no code incorporated |
| [Anthropic financial-services](https://github.com/anthropics/financial-services) | Modular skills for earnings, sector research, model updates, and quality checks | Separate earnings and column routes; require current-source checks and publication gates | Remove ratings, price targets, valuation calls, and trade ideas from Atlas outputs |
| [GPT Researcher](https://github.com/assafelovic/gpt-researcher) | Planner, parallel evidence collection, source tracking, and publisher stages | Organize research by bounded questions and aggregate by claim | Avoid source-volume targets; source quality outranks link count |
| [ai-hedge-fund](https://github.com/virattt/ai-hedge-fund) | Multiple analytical viewpoints and an explicit final synthesis | Use role diversity to challenge industry conclusions | Exclude investor personas, signals, position sizing, and portfolio decisions |
| [FinRobot](https://github.com/AI4Finance-Foundation/FinRobot) | Deterministic calculation separated from LLM narration; provenance-tracked report workflow | Recalculate numerical bridges outside prose and use the model for explanation and editing | Exclude valuation and investment-committee recommendations |

## Design choices

Atlas Research intentionally prioritizes:

1. Primary-source provenance over connector breadth.
2. Claim-level reconciliation over a large source count.
3. Physical and commercial mechanisms over market-price interpretation.
4. Counter-evidence over synthetic agent consensus.
5. Explicit stop conditions over open-ended autonomy.
6. Publication gates over polished but unverifiable prose.

## License posture

The Skill contains original workflow instructions. It borrows general ideas and does not vendor, modify, or distribute code from the reviewed repositories. Review the upstream license before any future code reuse, especially for AGPL or dual-licensed projects.
