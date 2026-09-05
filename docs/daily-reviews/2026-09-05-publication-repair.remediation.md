# 2026-09-05 publication repair

## Scope and baseline

User request: 检查一下现在的发布有没有问题？并修复。

This is a publication-integrity repair, not a new daily editorial review. The trusted `atlas-production` baseline is `51d13b05ff97b52e2c09659a01056026a68ab7df`, verified against the September 3 remediation, current Cloudflare version `6aa8912b-b4d0-4b0b-aa64-fc30d2094d51`, and Sites version 149 with the same source HEAD. The shared checkout and interrupted September 5 editorial worktree are unchanged.

## Findings and changes

- Reproduced in production: `/rumors` server-renders 37 published cards, then hydration replaces them with the API's 12-item slice. Existing records and bilingual detail pages were not deleted.
- Removed the API archive limit; the homepage retains its intentional six-item summary. Advanced only the feed cache identity so old truncated responses cannot mask the repair.
- Added an offline built-Worker regression comparing all server-rendered IDs to the live payload, plus adapter field equality, source deduplication and no internal closure injection. The regression failed on the baseline with `editor-evt-437c54e1c9d45acf4472` missing.
- Strengthened `check:live` to compare every versioned intelligence adapter record's ID, bilingual copy, canonical source, timestamp and status. It correctly failed against the unrepaired production API.
- Replaced a stale fixed-date test assertion with ISO review-date schema validation. Updated the expected cache identity. Added the existing manual snapshot source to the shared TypeScript contract.
- Editorial freshness stays `2026-09-03`. September 5's daily task was interrupted before completed gates/deployment; its candidates and WIP are not included. Current closure KV is `blocked`, and current candidate KV is still dated September 3. These are editorial backlog, not proof of publication.

## Validation and release

Lint, production build, 51 rendered/API tests, Cloudflare dry-run and intelligence adapter tests passed. Cloudflare preflight authenticated and read all three required KV keys. Optional historical discovery `event:gate-invariants` could not execute because `replay-corpus-validation.json` is not present in the versioned baseline; this repair does not modify discovery or claim that historical gate passed.

Status: validated locally; deployment and production readback pending. Manual snapshot refresh must back up the previous three KV values, use current public API content only, and preserve honest review freshness. Existing Cloudflare targets and Sites project/audience only; no public repository push or PR.
