# 002 - Add Fluid Entrance and Exit Transitions to Project Lightbox Modal

- **Status**: DONE
- **Commit**: f91e0d0
- **Severity**: HIGH
- **Category**: Physicality, Easing & Duration
- **Estimated scope**: 2 files (`src/styles/main.css`, `src/scripts/app.js`), ~40 lines modified

## Problem

The lightbox modal (`#projectModal`) toggles abruptly between `display: none` and `display: flex`. When the user clicks "Perbesar Karya", "Putar Video", or any portfolio item, the dark blurred backdrop (14px blur) and the heavy content box (1080px wide) pop onto the screen in 0 frames with no motion cues. Likewise, pressing ESC or clicking "Tutup" causes the modal to vanish instantly.

Because modals are focal presentation surfaces, the absence of entrance physics makes the interface feel unpolished and abrupt.

```css
/* src/styles/main.css:1740-1755 - current */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(8, 7, 6, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-backdrop.open {
  display: flex;
}
```

## Target

Implement an Emil Kowalski-aligned modal presentation curve:
1. Backdrop smoothly fades in over 200ms with `ease-out`.
2. Modal content box scales smoothly from `scale(0.96)` to `scale(1)` with `opacity: 0` to `opacity: 1` over 250ms using `--ease-out-expo`, with `transform-origin: center`.
3. Modal exit fades out smoothly over 150ms.
4. When `prefers-reduced-motion: reduce` is active, the `scale(0.96)` transform is bypassed while preserving the 150ms opacity fade.

```css
/* target */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(8, 7, 6, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 200ms ease-out, visibility 200ms ease-out;
}

.modal-backdrop.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.modal-box {
  width: 100%;
  max-width: 1080px;
  max-height: 92vh;
  background: var(--bg-card-solid);
  border-radius: 18px;
  overflow-y: auto;
  padding: 24px 28px 28px;
  transform: scale(0.96);
  opacity: 0;
  transform-origin: center center;
  transition: transform 250ms var(--ease-out-expo), opacity 200ms ease-out;
}

.modal-backdrop.open .modal-box {
  transform: scale(1);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .modal-box {
    transform: none !important;
  }
}
```

## Repo conventions to follow

- Existing easing token: `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);` from `src/styles/main.css:46`.
- Existing modal container id: `#projectModal`.
- Focus trap and ESC key event handling in `src/scripts/app.js`.

## Steps

1. In `src/styles/main.css` (lines 1740-1765):
   Replace `display: none` / `display: flex` toggle with `opacity`, `visibility`, and `pointer-events` transitions on `.modal-backdrop`.
   Add `transform: scale(0.96)` and `opacity: 0` to `.modal-box`, transitioning to `scale(1)` and `opacity: 1` when `.modal-backdrop.open` is active.

2. In `src/styles/main.css` (inside `@media (prefers-reduced-motion: reduce)` around line 2217):
   Add `.modal-box { transform: none !important; }` to honor accessibility guardrails while retaining opacity fade.

3. In `src/scripts/app.js` (`closeModal`, around line 610):
   Before clearing `modalMediaContainer.innerHTML` or removing `.open`, ensure the media container is cleared either after the 150ms fade or keep the element clean without tearing layout prematurely.

## Boundaries

- Do NOT change modal internal HTML structure or button data attributes (`data-action="close-modal"`).
- Do NOT alter `#projectModal` z-index (200) or mobile layout overrides.
- Never use `scale(0)` (target is `scale(0.96)`).

## Verification

- **Mechanical**:
  - Run `npm run build` and ensure exit code 0.
  - Run `node --test tests/verify-portfolio.mjs` and verify all 16 tests pass.
- **Feel check**:
  - Open any work in the modal. Observe the backdrop and box. Confirm the box grows subtly from center (`scale(0.96)` to `1`) with crisp deceleration, not an abrupt pop.
  - Close the modal with ESC or the Close button. Confirm it dismisses smoothly.
  - In Chrome DevTools > Rendering, enable "Emulate CSS prefers-reduced-motion: reduce". Re-open the modal and verify the scale effect is disabled while opacity transition remains intact.
- **Done when**: Modal opens and closes with fluid 200-250ms deceleration curves rather than an instant cut.
