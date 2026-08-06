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

## Final result

passed
