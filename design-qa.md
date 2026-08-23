# IDC Atlas context pages visual QA

- Source visual truth: `https://idc-index.com/` captured at `1280 x 720` CSS px, 1x density; saved as `/tmp/idc-atlas-home-mobile-reference.png`.
- Implementation: `http://localhost:4173/methodology` captured at `1280 x 720` CSS px, 1x density; saved as `/tmp/idc-atlas-methodology-desktop-implementation.png`.
- Mobile implementation: `http://localhost:4173/methodology` and `/privacy` captured at `390 x 720` CSS px; saved as `/tmp/idc-atlas-methodology-mobile-implementation.png` and `/tmp/idc-atlas-privacy-mobile-implementation.png`.
- Desktop comparison: `/tmp/idc-atlas-context-desktop-comparison.png`.

## Comparison history

### Iteration 1

- [P1] Context pages used an older hero-and-card treatment and showed empty live-data placeholders.
  - Fix: introduced the shared `ContextPage` reading layout and page-specific status metadata. The shared console rail, status-bar structure, typography, paper palette, grid lines and language control now match the main console.
- [P2] Privacy and methodology used independent page CSS and inconsistent mobile spacing.
  - Fix: replaced both paths with the same responsive context-page grid and mobile treatment.

## Required fidelity surfaces

- Fonts and typography: display heading, mono labels, dense body copy and small status text use the shared console tokens; Chinese wrapping stays within the 390px viewport.
- Spacing and layout rhythm: the desktop context hero follows the console rail and statusbar grid; mobile converts the facts and sections into a single readable column.
- Colors and visual tokens: paper, forest, terracotta, ultramarine and line tokens match the main console reference.
- Image quality and asset fidelity: no page-specific imagery is required for methodology or privacy; the brand mark and existing console shell are retained.
- Copy and content: privacy keeps the Google partner-information and GitHub links; method pages preserve the source, verification, review and research-boundary statements.

## Interaction checks

- Chinese and English language controls preserve their corresponding routes.
- Mobile method and privacy screens have no horizontal overflow.
- Browser console: no errors observed on the checked local method and privacy screens.

## 2026-08-23 product-upgrade closure

- Homepage: pass — the versioned daily brief is the first editorial surface, with separate fact, research, brief and scan clocks.
- Company directory: pass — followed-only view, verified-update count, research count/date and next checkpoint remain readable in the dense grid.
- Entity page: pass — disclosure → entity → industry → research/checkpoint reads left-to-right and collapses to two columns on mobile.
- Research library: pass — lifecycle filtering works and persists in a shareable query string.
- Visual language: pass — the existing warm editorial palette, square borders, mono labels, typography and spacing are preserved.
- Browser interaction: pass — followed-only filtering reduced the visible set and the research lifecycle control produced `?status=active`.

## Final result

passed

---

# IDC Atlas full product upgrade QA — 2026-08-23

- Product audit source: `artifacts/product-audit/pm-audit-2026-08-23.md`.
- Audit board: `https://www.figma.com/design/ltfiTNK28MGSmZWMBp7n8T/IDC-Atlas-%C2%B7-Product-Audit---Full-Upgrade-%C2%B7-2026-08-23?node-id=2-2`.
- Verified local preview: `http://localhost:3107/`.
- Browser verification covered `/`, `/en`, `/companies`, `/en/companies`, `/companies/riot-platforms`, and `/rumors`.

## Upgrade closure

- [P0] The information architecture mixed page types with user tasks and could leave no active navigation item while scrolling.
  - Fix: replaced it with six task-oriented entries — Today, Facts, Companies, Industry, Research, Intelligence — and mapped every observed homepage section back to a valid navigation state.
- [P0] The homepage status bar used system activity as a proxy for content freshness.
  - Fix: separated latest content edition, system scan, content review, source coverage, and verified-record counts. A meta-only first render now says `Syncing` instead of showing misleading zero counts.
- [P0] The homepage did not make one editorial choice or explain its urgency.
  - Fix: introduced a single Daily Brief selected from published research, a concise `Why this today` thesis, visible evidence states, entities, source cutoff, and the full-article action.
- [P0] Companies were labels inside stories rather than a navigable first-class object.
  - Fix: added bilingual company-library routes with search, market, industry, event-strength and update-time filters, 24 tracked entities, update counts, research state, follow controls, and entity-page routing.
- [P0] Company pages did not close the event-to-entity-to-research loop.
  - Fix: added formal event timelines, related research, next checkpoints, watchlist state, and a visually separate Rumor Watch section. Homepage company cards now return to the entity page when a match exists.
- [P1] Rumor Watch lacked a visible lifecycle.
  - Fix: added the three-step state track from reported lead to official response to formal-record promotion, while keeping rumor material outside formal facts.
- [P1] English coverage was incomplete and could surface generic fallback copy.
  - Fix: English now uses the complete bilingual coverage set and falls back to the original sourced title/summary rather than generic placeholders.
- [P1] Same-version client hydration could reject a fuller payload.
  - Fix: payload adoption now considers tracked collection counts before content-version equality; the company library hydrates from metadata-only SSR to the complete live dataset.
- [P1] Event-to-company routing depended on text matching and could associate a company merely mentioned in another company's disclosure.
  - Fix: the Worker now emits explicit `entityIds`; disclosed tickers control the relation and text matching is only the no-ticker fallback. The relation schema versions the edge-cache key. Browser readback confirmed the Riot event maps only to Riot Platforms, not AMD.
- [P1] The columns page remained a date-sorted portfolio rather than a research database.
  - Fix: added thesis search plus topic, company and relationship filters; every card now displays published state, Daily Brief membership and linked company entities.
- [P1] SEO/GEO treated scan time as modification time and under-described entities.
  - Fix: structured data and sitemaps use content-change/review dates, include the bilingual company library, emit `ProfilePage` plus `Organization` entity graphs, and expose company routes in AI-readable discovery manifests.

## Visual and interaction checks

- Desktop homepage: the Daily Brief, evidence strip, company/research routing, separated freshness fields, and six-item navigation render without the previous empty editorial block.
- Company library: live hydration produced 67 matched updates across 24 tracked companies; search, filters, follow/unfollow, and entity links worked in the in-app browser.
- Riot Platforms entity page: formal timeline, related research, next checkpoint, follow control, and separated rumor material were present.
- Rumor Watch: the newest-first feed and repeated status tracks were present; official responses remain attributed rather than promoted into formal facts.
- English: `/en` and `/en/companies` rendered without the previous generic source-linked placeholder strings.
- Responsive coverage: existing `390 x 844` homepage evidence remains valid; new company, entity, and rumor layouts have explicit `1100px` and `720px` breakpoints and passed rendered-HTML checks. A fresh mobile viewport capture was unavailable in the current in-app browser API, so this iteration does not claim a new pixel-comparison artifact for those routes.

## Engineering gates

- `npm run build`: passed.
- `npm run lint -- --quiet`: passed.
- `node --test tests/rendered-html.test.mjs`: 47/47 passed.
- `npm run cf:check`: passed as a Cloudflare dry run; no deployment was made.
- `git diff --check`: passed.
- `npx tsc --noEmit --pretty false`: blocked only by pre-existing nullable-state errors in `app/admin/intelligence/workspace.tsx`; no errors were emitted for the public-product upgrade files.

## Final result

passed — public product implementation. The Figma audit remains a partial supporting artifact because the Starter-plan MCP quota prevented adding the final roadmap/metrics nodes; the complete roadmap and metrics remain in the PM audit report.

---

# IDC Atlas research-first homepage visual QA

- Source visual truth: selected ImageGen direction 1 at `1487 x 1058`; `/Users/xlarge/.codex/generated_images/019fe36c-cf6f-7e73-80ea-6c4bb8dcd51c/exec-fb55b787-f51e-4d90-8fa0-b0732137e24b.png`.
- Normalized comparison viewport: `1440 x 1024` CSS px at 1x density. The reference was resized to this viewport only for side-by-side inspection.
- Implementation state: Chinese desktop homepage with local live-data snapshot; `/private/tmp/idc-atlas-home-audit-20260823/10-homepage-spacing-fixed.png`.
- Final side-by-side comparison: `/private/tmp/idc-atlas-home-audit-20260823/12-spacing-fixed-comparison.png`.
- Mobile implementation: `390 x 844` CSS px; `/private/tmp/idc-atlas-home-audit-20260823/11-homepage-spacing-fixed-mobile.png`.
- English implementation: `1440 x 1024` CSS px; `/private/tmp/idc-atlas-home-audit-20260823/07-homepage-en.png`.

## Comparison history

### Iteration 1

- [P1] The evidence source row used a semantic `footer`, which inherited the site's global dark footer treatment.
  - Fix: replaced it with a scoped evidence-source container so it remains part of the paper editorial card.
- [P2] The initial article title was larger than the selected direction and compressed the thesis.
  - Fix: reduced the display cap and tightened the responsive type scale.
- [P2] The Rumor Watch section appeared at the bottom of the first desktop viewport, weakening the intended research-first hierarchy.
  - Fix: raised the editorial desk's desktop minimum height while preserving the shorter responsive layout.
- [P2] Short ticker matching caused `PPL` to match unrelated words such as `supply`.
  - Fix: use exact boundaries for short tickers and display the canonical ticker alias.

### Iteration 2

- [P2] The desktop minimum height added in iteration 1 overcorrected the first-screen hierarchy and left a large empty block below the two editorial lists.
  - Fix: removed the fixed `420px` minimum height so the editorial desk follows its actual content height. The Rumor Watch section now begins immediately after the lists, while the two-column and mobile stacking behavior remain unchanged.
  - Post-fix evidence: `/private/tmp/idc-atlas-home-audit-20260823/10-homepage-spacing-fixed.png` and `/private/tmp/idc-atlas-home-audit-20260823/12-spacing-fixed-comparison.png`.

## Required fidelity surfaces

- Fonts and typography: the existing Atlas display, mono-label and dense editorial body styles are retained; the hierarchy follows the selected direction without introducing another type system.
- Spacing and layout rhythm: the page leads with one research thesis and cover, then a three-state evidence strip, followed by key changes and company-to-research routing.
- Colors and visual tokens: the existing warm paper, forest, terracotta, ultramarine and line tokens are preserved.
- Image quality and asset fidelity: the latest published article's existing editorial cover is used at its intended aspect ratio. No unverified company logos or placeholder artwork were added.
- Copy and content: the evidence strip explicitly separates confirmed facts, unknowns and the next validation checkpoint; the source and cutoff remain visible.
- Responsive behavior: the hero, evidence strip and editorial desk collapse cleanly at `390 x 844` without horizontal overflow.

## Interaction checks

- Chinese and English homepages render the newest published research article by `publishAt`.
- Article, key-change, company and research-center links are present and use their existing routes.
- Mobile navigation opens and closes successfully.
- Browser console: no warnings or errors observed on the checked Chinese and English homepage states.

## Final result

passed
