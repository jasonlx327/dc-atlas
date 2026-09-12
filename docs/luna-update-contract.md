# Atlas update corrections — 2026-09-12

This contract applies to both daily update automations. It preserves their source,
bilingual, partial-release and existing-production authorization requirements.

## Delayed runs and concurrent writers

Use the scheduled trigger and run identity to distinguish the 10:00 main run from
the 11:00 retry; record actual start separately. A same-day delayed start before
16:30 may resume its intended job. Do not turn elapsed clock time into a new
approval requirement or silently defer a recoverable job to the next day.
The retry first checks the main task and its lock. If the main task is active,
report waiting/handed-off; never scan or publish concurrently. After 16:30, hand
the morning progress to the afternoon task, preserving cutoff and artifacts.

All content writers use the same project-wide production lock at
`/Users/xlarge/Desktop/数据中心/.codex/locks/idc-atlas-production.lock` through the
installed `atlas-daily-update/scripts/run_guard.py`. Inspect ownership and process
liveness before recovering a stale lock. Do not bypass another live owner.

## Production baseline

Resolve atlas-production, the latest successfully deployed native Sites version,
Cloudflare deployment evidence, and the newest actual release receipt. A newer
UI/research repair can have a valid receipt outside the old daily remediation
filename. Never replace it with an older daily baseline merely because its date or
filename differs. Inspect source ancestry and preserve independent released work.
An application HEAD and a later documentation-only commit are distinct.

## Public copy and held records

Deterministic fallback is scoring and routing only. It emits completionRequired
until a current editor writes natural, source-reviewed Chinese and English copy.
Do not use disabled dated generators or append entity/number/date token lists to
pass validation. Passing token checks does not prove factual equivalence.

Run `npm test` and the existing editorial/adapter suites. The shared bilingual
validator rejects known generic scaffolds and numeric padding; dataset tests
reject these forms in versioned public content. Keep every candidate's ID and
source chain even when locally held. Do not label a reduced subset a completed
review of the entire candidate set.

The 73 withdrawn copies and original source URLs are preserved in
`docs/daily-reviews/2026-09-12-luna-audit/quarantined-copy.json`. Their public
permalinks show neutral correction notices and noindex. Reinstatement requires
individual source review, factual bilingual rewriting, tests, removal of the
corresponding withdrawn-ID entry, and normal publication readback. Never merely
strip the scaffold phrases or replay the old decision packet.

Source-confirmed formal updates can be written to existing versioned adapters,
including `worker/formal-content-supplement.ts` and the source arrays mapped in
the installed `references/site-sections.md`. Lack of a generic auto-apply command
is not lack of a formal publication path. Preserve metric units and lifecycle;
review and test the actual source diff instead of exposing a KV candidate.

## Evidence coverage

HTTP 200 proves transport only. No matching feed item does not establish that
all relevant disclosures were reviewed. Entry-point-only checks remain
not-determined. To assert no-change, store reviewEvidence with
reviewedSourceUrls, windowStart, windowEnd, checkedAt, and a specific conclusion.
Run `node scripts/validate-update-audit.mjs <core-ledger> <xpu-ledger> <cpo-ledger>`.
Missing evidence holds that company or section; it need not block unrelated
source-reviewed content. Keep attemptedCount distinct from completedEvidenceChecks.

## Same-source mirror release

Follow `docs/sites-mirror-release.md`. Commit the tested source, build the small
mirror with `npm run build:sites:mirror`, package `.sites-mirror-build` using the
currently installed Sites helper, push the exact source, and save that version
before deploying Cloudflare. Keep the full Cloudflare dist untouched. Do not
upload the full image archive to run a redirect. Deploy the saved Sites version
and verify its source SHA, succeeded status, and live x-atlas-source-head header.
Preserve path/query redirects and current audience.

A Cloudflare-only release with failed Sites save/deploy is a split-release
incident, not successful partially-published. Recover the matching Sites release
or restore the prior verified deployment; record the actual state and blocker.
After both readbacks pass, advance atlas-production to the deployed application
HEAD and write a durable release receipt. Never overwrite shared main.
