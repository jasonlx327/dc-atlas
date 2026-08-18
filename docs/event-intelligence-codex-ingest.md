# Codex-first event ingestion

IDC Atlas uses Codex/local execution for the complete high-fan-out source scan. Cloudflare KV remains the authoritative handoff store, and the Worker remains responsible for model selection, Atlas Editor decisions, daily closure, snapshots, and production publication gates.

## Daily handoff

Run from the repository root before the 06:30 Asia/Shanghai closure:

```bash
npm run event:codex:scan
npm run event:codex:ingest
npm run event:codex:ingest -- --remote
```

The first command checks all enabled sources in bounded local batches, retries temporary failures, updates the local shadow database, and writes `artifacts/event-intelligence/codex-event-night.json`. The second command validates the artifact without changing remote state. The third command is the explicit Cloudflare KV handoff.

The ingestion validator rejects fixture data, missing enabled sources, wrong-day packets, failed runs, and any packet that still contains a Worker subrequest-limit error. A successful handoff writes the dated Codex key, the dated canonical source-run key, the latest source-run key, and an ingestion marker. It does not deploy the Worker or publish site content.

## Worker fallback

At scheduled source slots the Worker first looks for a valid same-day Codex packet. If none exists, it checks only the critical 14-source smoke set. This emergency scan is intentionally incomplete and cannot produce a full daily `verified-no-change` closure; its purpose is health visibility without exceeding Worker subrequest limits.

## Closure semantics

Atlas Editor reports `adapterReady` separately from rule-eligible candidates. Ordinary watch/low-priority holds remain internal and do not block an otherwise complete source review. Missing canonical evidence, inaccessible primary evidence, invalid bilingual copy, or a missing structured adapter on a material publication candidate remain blocking.
