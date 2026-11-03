# 004 - Gate Hover Translations Behind Hover and Fine Pointer Media Query

- **Status**: DONE
- **Commit**: f91e0d0
- **Severity**: MEDIUM
- **Category**: Accessibility & Physicality
- **Estimated scope**: 1 file (`src/styles/main.css`), ~50 lines modified

## Problem

Throughout `src/styles/main.css`, spatial `:hover` rules (`transform: translateY(-2px)`, `transform: translateY(-4px)`, `transform: translateX(4px)`) are applied globally without checking whether the device supports hover or possesses a precision pointer.

On smartphones and tablets, mobile browsers fire simulated hover states on tap. As a result, when a user taps a work card, filter tab, or button, the element physically jumps and remains stuck in its hovered offset position ("sticky hover") until another area of the screen is touched.

```css
/* src/styles/main.css:1113-1117 - current */
.work-scroll-area.grid-mode .work-row:hover,
.work-scroll-area.grid-mode .work-row:focus-within {
  transform: translateY(-4px);
  background: var(--bg-elevated);
}

/* src/styles/main.css:1300-1303 - current */
.work-scroll-area.list-mode .work-row:hover {
  background: var(--bg-elevated);
  border-color: var(--border-control);
  transform: translateX(4px);
}

/* src/styles/main.css:1558-1560 - current */
.arch-tile:hover {
  transform: translateY(-2px);
  background: var(--bg-card);
}
```

## Target

Retain color and background highlights on `:hover`, but gate all spatial `transform` shifts behind `@media (hover: hover) and (pointer: fine)`. On touchscreens, tapping cards and buttons produces instant tactile feedback without sticky translation offsets.

```css
/* target pattern */
.work-scroll-area.grid-mode .work-row:hover,
.work-scroll-area.grid-mode .work-row:focus-within {
  background: var(--bg-elevated);
}

.work-scroll-area.list-mode .work-row:hover {
  background: var(--bg-elevated);
  border-color: var(--border-control);
}

.arch-tile:hover {
  background: var(--bg-card);
}

@media (hover: hover) and (pointer: fine) {
  .work-scroll-area.grid-mode .work-row:hover {
    transform: translateY(-4px);
  }
  .work-scroll-area.list-mode .work-row:hover {
    transform: translateX(4px);
  }
  .arch-tile:hover {
    transform: translateY(-2px);
  }
  .persona-tab:hover {
    transform: translateY(-2px);
  }
  .copy-email-btn:hover {
    transform: translateY(-2px);
  }
  .nav-cta-pill:hover,
  .theme-toggle-btn:hover,
  .stage-expand-btn:hover,
  .repo-link-btn:hover,
  .stage-next-outline-btn:hover {
    transform: translateY(-1px);
  }
}
```

## Repo conventions to follow

- Existing media queries at end of `src/styles/main.css`.
- Preserves existing `:hover` background/color definitions while isolating spatial transforms.

## Steps

1. In `src/styles/main.css`:
   Remove raw `transform: translateY(...)` and `transform: translateX(...)` from the default `:hover` rules of:
   - `.theme-toggle-btn:hover` (line 297)
   - `.persona-tab:hover` (line 447)
   - `.copy-email-btn:hover` (line 499)
   - `.nav-cta-pill:hover` (line 765)
   - `.stage-expand-btn:hover, .repo-link-btn:hover` (line 997)
   - `.stage-next-outline-btn:hover` (line 1019)
   - `.work-scroll-area.grid-mode .work-row:hover` (line 1115)
   - `.work-scroll-area.list-mode .work-row:hover` (line 1301)
   - `.arch-tile:hover` (line 1559)
   - `.contact-card:hover` (line 1675)

2. In `src/styles/main.css` (around line 2030):
   Add a consolidated `@media (hover: hover) and (pointer: fine)` block containing those transforms for desktop pointer devices only.

## Boundaries

- Do NOT remove `:focus-visible` outlines or keyboard accessibility indicators.
- Do NOT remove background color or border changes on hover (only spatial translation is gated).
- Do NOT change desktop hover appearance.

## Verification

- **Mechanical**:
  - Run `npm run build` and ensure exit code 0.
  - Run `npm test` and ensure all 16 tests pass.
- **Feel check**:
  - Desktop: Hover over cards, buttons, and tabs. Verify all lift / slide transforms occur exactly as before.
  - Mobile (DevTools touch simulation or phone): Tap cards and buttons. Confirm they do not jump or stay displaced when lifted.
- **Done when**: Touch interactions never induce sticky translation offsets on mobile while desktop pointer experience remains tactile.
