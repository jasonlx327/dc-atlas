# September research release

Prepared 2026-09-06. All five bilingual long-form articles are source-led analyst columns. Internal ledgers and editorial reviews are adjacent JSON files; they are not reader-facing copy.

## Final release schedule (Asia/Shanghai)

The user's final instruction overrides the original September 7 slot for the NVIDIA/Hugging Face article. Its earlier review metadata records the original plan, not the final release time.

| Article | Publication time |
| --- | --- |
| nvidia-hugging-face-distribution | 2026-09-06 10:42, publish immediately |
| broadcom-custom-ai-profit-pool | 2026-09-08 09:30 |
| claude-compute-deal-risk-waterfall | 2026-09-09 09:30 |
| ciena-ai-network-outside-rack | 2026-09-10 09:30 |
| astra-agent-cost-per-completed-task | 2026-09-11 09:30 |

## Editorial and implementation acceptance

- NVIDIA/Hugging Face is a proposed acquisition, subject to closing conditions; no completed-acquisition claim.
- Claude/Lambda's reported agreement is attributed to reporting. Hut 8 is an independent contractual comparison, not an asserted participant.
- Company disclosures, calculations, hypotheses and scenarios remain distinguished. Research narrative meets 4,000 Chinese Han characters and 2,200 English words per article, excluding tables and metadata.
- Fifty-five behavioral tests pass, including exact bilingual time boundaries, homepage selection, company links, RSS, sitemap and llms discovery. Future article routes remain 404 before their scheduled time.
- Type checking, lint (zero errors; existing warnings), production build and Cloudflare deployment dry run pass.
- Fixed an existing optional routeCandidates null guard required by the type check, with focused behavioral regression coverage.

Status at source commit: ready to deploy. Deployment and production readback results are recorded separately after the exact source HEAD is saved and deployed. This research-only release does not restamp the site's full content review or rewrite daily snapshots.
