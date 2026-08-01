# IDC Atlas shared Console design QA

final result: passed

## Source visual truth

- Research-queue issue screenshot: `/var/folders/y5/bc2bdsks1_d9hlc43c2s6sl40000gn/T/codex-clipboard-36d0fc74-2f00-44d6-83fa-45da4afa7851.png`
  - Source pixels: 1834 × 536.
  - State: desktop Chinese homepage research queue with one undersized inline thumbnail.
- Industry-map issue screenshot: `/var/folders/y5/bc2bdsks1_d9hlc43c2s6sl40000gn/T/codex-clipboard-9f91cf6b-aa18-47d7-80e7-b412d6b97b25.png`
  - Source pixels: 1598 × 1716.
  - State: desktop Chinese legacy dark industry page.
- Additional brand issue screenshot: `/var/folders/y5/bc2bdsks1_d9hlc43c2s6sl40000gn/T/codex-clipboard-a3b82a1f-9ef6-430b-9645-e439a53a57f0.png`
  - State: plain IDC ATLAS rail lockup before the terminal-style refinement.

## Rendered implementation

- Local preview: `http://localhost:4173/`
- Desktop CSS viewport: 1280 × 720, device scale factor 1.
- Mobile CSS viewport: 390 × 844, device scale factor 1.
- Chinese homepage: `artifacts/design-qa/home-research-desktop-v2.png` — 1280 × 720.
- Chinese industry map: `artifacts/design-qa/industry-zh-desktop-v2.png` — 1280 × 720.
- English industry map: `artifacts/design-qa/industry-en-desktop-v2.png` — 1280 × 720.
- Chinese mobile research queue: `artifacts/design-qa/home-research-mobile-v2.png` — 390 × 844.
- Chinese mobile industry map: `artifacts/design-qa/industry-zh-mobile-v2.png` — 390 × 844.
- English mobile industry map after copy-spacing fix: `artifacts/design-qa/industry-en-mobile-v3.png` — 390 × 844.
- Console tools desktop: `artifacts/design-qa/console-tools-desktop.png` — 1280 × 720.
- QR share desktop: `artifacts/design-qa/console-qr-desktop.png` — 1280 × 720.
- Console tools mobile: `artifacts/design-qa/console-tools-mobile.png` — 390 × 844.
- QR share mobile: `artifacts/design-qa/console-qr-mobile.png` — 390 × 844.
- Chinese homepage after decision-row revision: `artifacts/design-qa/home-calendar-columns-desktop-v1.png` — 1600 × 900.
- Chinese mobile lead image after fill fix: `artifacts/design-qa/home-lead-mobile-v1.png` — 390 × 844.
- Chinese column detail in shared Console: `artifacts/design-qa/column-detail-zh-desktop-v1.png` — 1600 × 900.
- English column detail in shared Console: `artifacts/design-qa/column-detail-en-desktop-v1.png` — 1600 × 900.
- Chinese mobile column detail: `artifacts/design-qa/column-detail-zh-mobile-v1.png` — 390 × 844.
- Chinese large-campus cards after shared light-card revision: `artifacts/design-qa/industry-campus-desktop-v4.png`.
- Chinese GPU cards after shared light-card revision: `artifacts/design-qa/industry-china-mobile-v4.png`.
- Homepage editorial lead after complete-image fitting: `artifacts/design-qa/home-lead-contained-desktop-v5.png`.

The browser captures are JPEG-encoded at the recorded CSS pixel dimensions. No density normalization was needed because source and implementation were evaluated as layout references rather than pixel-identical clones.

## Comparison evidence

- Focused research-queue comparison: `artifacts/design-qa/compare-research-queue-v2.jpg`
  - Left: reported inline-thumbnail issue.
  - Right: large featured research visual plus four compact rows.
- Full first-screen industry comparison: `artifacts/design-qa/compare-industry-v2.jpg`
  - Left: reported legacy dark page.
  - Right: shared light Console shell, status bar, rail, hero, tabs and first industry module.
- Focused lead-image crop comparison: `artifacts/design-qa/compare-home-lead-crop-v5.png`
  - Left: reported `object-fit: cover` crop with embedded typography cut at the edge.
  - Right: the same editorial artwork fitted in full against its native dark background.
- Focused checks were required because the research thumbnail, brand lockup, nav active state and mobile wrapping were too small to judge from a single full-page capture.

## Fidelity surfaces

- Fonts and typography: the shared sans/mono pairing is preserved across Chinese and English; hero sizes are reduced from the legacy oversized treatment; mobile headings use readable optical sizes and no orphaned English punctuation remains.
- Spacing and layout rhythm: all Console destinations use the same 196 px desktop rail, 64 px mobile header, status bar, thin-rule grid and compact section spacing. Research imagery is now a deliberate featured block rather than an inline interruption.
- Colors and visual tokens: paper, surface, ink, forest, ultramarine and terracotta tokens now govern home, Pulse, Industry, Columns, Calendar, Methodology and Privacy. Legacy cyan-on-black topic shells no longer appear from Console navigation.
- Image quality and asset fidelity: existing editorial and product assets are retained at natural crops; the research feature image is 94 px high on desktop and 184 px high on mobile, while industry product cards retain large source imagery.
- Copy and content: Chinese and English labels remain distinct while navigation order, page labels, source counts and disclaimers use the same structure. Empty source counts display an em dash without a malformed unit suffix.

## Comparison history

### Iteration 1

- [P1] Research queue used one 66 × 28 inline thumbnail that disrupted the five-row rhythm.
  - Fix: promoted the first article to a large visual feature and retained four compact text rows.
  - Post-fix evidence: `compare-research-queue-v2.jpg` and `home-research-mobile-v2.png`.
- [P1] Chinese and English Industry routes still used separate legacy dark shells.
  - Fix: introduced a shared `IntelligenceConsoleShell` and moved both industry routes into the light institutional Console system.
  - Post-fix evidence: `compare-industry-v2.jpg`, `industry-en-desktop-v2.png`, `industry-zh-mobile-v2.png`.
- [P1] Pulse, Columns, Calendar, Methodology and Privacy broke visual continuity after Console navigation.
  - Fix: migrated every direct Console destination to the same rail, status bar, content canvas and footer.
  - Post-fix evidence: route scan confirmed one `.atlas-console-overview` and one `.atlas-console-rail` on all 11 checked routes.
- [P2] The rail brand looked like plain text rather than an intelligence-console identity.
  - Fix: strengthened IDC / ATLAS contrast, added a restrained multitone ATLAS treatment, a terminal-status line and a vertical system marker.
- [P2] Hiding the English hero line break on mobile removed the space in “grid, AI”.
  - Fix: preserved a literal space before the responsive break.
  - Post-fix evidence: browser text readback returned `From silicon to grid, AI turns physical.`

### Iteration 2

- Added a compact Console utility group below the primary navigation and above Methodology / Privacy.
- RSS opens the active language feed: `/feed.xml` for Chinese and `/en/feed.xml` for English.
- QR generation is deferred until the user opens the control and encodes the current canonical `https://idc-index.com` route instead of localhost.
- Desktop panel remains inside the rail; mobile panel expands to the drawer width without overflowing or hiding the close control.
- Post-fix evidence: `console-tools-desktop.png`, `console-qr-desktop.png`, `console-tools-mobile.png`, `console-qr-mobile.png`.

### Iteration 3

- [P1] The homepage repeated Pulse content inside a separate intelligence brief and compressed the calendar and research queue into three narrow columns.
  - Fix: removed the duplicate brief, expanded the decision row to two columns, added Eastern time and conclusion status to earnings entries, and gave the research feature a summary plus four series-labelled rows.
  - Post-fix evidence: `home-calendar-columns-desktop-v1.png`.
- [P1] The homepage lead visual reserved a fixed image region and left an empty gray block below short assets.
  - Fix: converted the figure to a fill-and-caption grid so the image occupies all available height without creating a blank placeholder.
  - Post-fix evidence: `home-calendar-columns-desktop-v1.png` and `home-lead-mobile-v1.png`.
- [P1] All twelve Chinese and English column-detail routes still used a separate dark layout with oversized headings and no shared Console navigation.
  - Fix: wrapped all six bilingual article components in one `ColumnArticleConsole`, removed the redundant article navigation, introduced a two-column editorial lead, increased body text to 18 px on desktop and disabled forced hero breaks on narrow screens.
  - Post-fix evidence: `column-detail-zh-desktop-v1.png`, `column-detail-en-desktop-v1.png` and `column-detail-zh-mobile-v1.png`.

### Iteration 4

- [P1] Chinese GPU and large-campus cards retained the legacy dark cyberpunk components inside the new light Console, creating a visible split between the page shell and its content.
  - Fix: scoped the shared paper, surface, line, ink, forest, ultramarine and terracotta tokens across supernode, China GPU and campus cards; reduced oversized metrics and restored readable card hierarchy.
- [P1] English China-watch cards retained a separate dark component treatment.
  - Fix: moved the English supernode grid onto the same light card surface and source-link treatment as the Chinese Industry route.
- [P1] “Close navigation” only changed the mobile drawer state and had no desktop effect.
  - Fix: added a desktop rail-collapsed state, full-width canvas transition and a persistent “Open navigation” recovery control while retaining the mobile drawer behavior.

### Iteration 5

- [P1] The 16:9 editorial lead image was forced into a narrower portrait-like slot with `object-fit: cover`, cutting the embedded headline and IDC Atlas label at the left edge.
  - Fix: editorial assets using the `/column-*` cover family now use complete-image fitting on the original dark artwork background; ordinary project photography retains its full-bleed crop.
  - Post-fix evidence: `compare-home-lead-crop-v5.png`.

## Interaction and route checks

- Checked `/`, `/en`, `/pulse`, `/en/pulse`, `/industry`, `/en/industry`, `/columns`, `/en/columns`, `/calendar`, `/methodology` and `/privacy`.
- Every route contains exactly one shared Console shell and one shared navigation rail.
- Chinese mobile menu opens; `收起导航` closes it and returns `aria-expanded="false"`.
- Industry tabs switch content without leaving the shared shell.
- Chinese home navigation scrolls to the large research queue and closes the mobile rail.
- Chinese and English RSS links resolve to their matching feed routes.
- Chinese and English QR controls generate a PNG data image and retain the canonical production path.
- Browser page logs contained only Vite connection messages and the React development notice; no page warning or error was recorded.

## Verification

- `npm run lint`: passed with existing `no-img-element` performance warnings and no errors.
- `npm run build`: passed.
- `node --test tests/rendered-html.test.mjs`: 33 passed, 0 failed.
- Production deployment is performed only after this record and the exact source commit are complete.

final result: passed
