# 001 - Prevent Repeated Entry Keyframes on Dynamic Filter and Search

- **Status**: DONE
- **Commit**: f91e0d0
- **Severity**: HIGH
- **Category**: Interruptibility & Frequency
- **Estimated scope**: 2 files (`src/styles/main.css`, `src/scripts/app.js`), ~25 lines modified

## Problem

When the user types in the search box (`#driveSearchInput`), clicks a category filter chip (`.tool-chip`), or toggles the view mode (`#viewGridBtn` / `#viewListBtn`), `renderDriveList()` destroys and recreates the list cards via `container.innerHTML = ...`.

Because `.work-row` unconditionally applies `@keyframes sectionEnter` with a 0.6s duration and staggered delays, every single keystroke and filter change forces every visible card to re-trigger a full 18px upward translation and opacity fade from 0. On rapid keystrokes, cards flicker and reset mid-flight, making search and navigation feel sluggish and broken.

```css
/* src/styles/main.css:2201 - current */
.work-row {
  animation: sectionEnter 0.6s var(--ease-out-expo) both;
}

.work-row {
  animation-delay: calc(var(--stagger-idx, 0) * 0.035s);
}
```

```javascript
/* src/scripts/app.js:129 - current */
container.innerHTML = currentFilteredDrive
  .map((item, idx) => {
    return `
      <div class="work-row spotlight-card${idx === 0 ? ' is-selected' : ''}"
           data-drive-idx="${idx}"
           style="--stagger-idx: ${idx % 9};">
      ...
    `;
  })
  .join('');
```

## Target

Separate the initial page entrance animation from dynamic DOM updates:
1. Static SSR cards rendered on initial page load keep their staggered entrance reveal via a specific modifier class `.work-row.is-initial-reveal` or only on the initial page load.
2. Dynamically re-rendered cards generated during search/filter/view toggles in `renderDriveList()` do NOT re-trigger `@keyframes sectionEnter`. Instead, dynamic updates render immediately with clean, instant visual response, or a subtle 120ms opacity fade on the parent container `#driveWorkList`.

```css
/* target */
.work-row.is-initial-reveal {
  animation: sectionEnter 0.6s var(--ease-out-expo) both;
  animation-delay: calc(var(--stagger-idx, 0) * 0.035s);
}

.work-scroll-area {
  transition: opacity 120ms ease;
}

.work-scroll-area.is-updating {
  opacity: 0.6;
}
```

## Repo conventions to follow

- Easing curves use `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);` from `src/styles/main.css:46`.
- Event handling in `src/scripts/app.js` uses standard event listeners and class toggling without third-party animation libraries.

## Steps

1. In `src/components/GraphicDesignSection.astro` (around line 163):
   Add the class `is-initial-reveal` to the SSR-rendered `.work-row` items:
   ```astro
   class={`work-row spotlight-card is-initial-reveal${idx === 0 ? ' is-selected' : ''}`}
   ```

2. In `src/styles/main.css` (lines 2200-2206):
   Change `.work-row` keyframe animation selector to scope strictly to `.work-row.is-initial-reveal`:
   ```css
   .hero-status-bar,
   .hero-name,
   .hero-statement,
   .persona-switcher,
   .hero-bio,
   .hero-stats-row,
   .tilt-stage,
   .studio-ribbon,
   .live-stage,
   .stage-main-split,
   .stage-frame,
   .stage-video,
   .work-list-heading,
   .work-row.is-initial-reveal,
   .bento-cell,
   .arch-tile,
   .contact-section,
   .site-footer {
     animation: sectionEnter 0.6s var(--ease-out-expo) both;
   }

   .work-row.is-initial-reveal {
     animation-delay: calc(var(--stagger-idx, 0) * 0.035s);
   }
   ```

3. In `src/scripts/app.js` (`renderDriveList`, around line 129):
   Ensure template string outputs plain `.work-row spotlight-card` (without `is-initial-reveal`), so dynamic search and filter results render without re-triggering the 600ms upward entrance.

## Boundaries

- Do NOT remove `sectionEnter` from other sections (`.bento-cell`, `.arch-tile`, `.live-stage`, etc.).
- Do NOT alter card HTML markup or data attributes (`data-drive-idx`, `data-action`).
- Do NOT change card layout or CSS grid properties.

## Verification

- **Mechanical**:
  - Run `npm run build` and ensure build completes with exit code 0.
  - Run `node --test tests/verify-portfolio.mjs` and ensure all 16 tests pass.
- **Feel check**:
  - Open the portfolio in a browser and navigate to the Graphic Designer Showcase.
  - Type rapidly in the search input ("kpu", "poster", "logo"). Confirm cards update instantly without flashing from translateY(18px) or opacity: 0 on each letter.
  - Click through category filters ("Semua", "Photoshop", "Illustrator"). Confirm selection updates crisp and immediate without staggered 600ms entrance replay.
  - Reload the page. Confirm initial page scroll still reveals cards with smooth staggered motion.
- **Done when**: Dynamic search and filtering present cards without replaying the 600ms entry keyframe.
