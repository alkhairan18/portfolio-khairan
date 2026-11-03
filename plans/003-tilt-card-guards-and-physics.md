# 003 - Guard 3D Tilt Interaction with Reduced-Motion, Pointer Guards, and Smooth Deceleration

- **Status**: DONE
- **Commit**: f91e0d0
- **Severity**: MEDIUM
- **Category**: Accessibility & Physicality
- **Estimated scope**: 2 files (`src/scripts/app.js`, `src/styles/main.css`), ~30 lines modified

## Problem

The interactive 3D hero portrait tilt (`#tiltCard`) calculates raw rotation angles (`rotateY`, `rotateX`) on `mousemove`. It exhibits three distinct motion flaws:
1. **Missing accessibility check**: Unlike `initSpotlightAndMagnetic()`, `initTiltCard()` does not check `(prefers-reduced-motion: reduce)`. Users who request reduced motion still receive spatial rotation effects when moving over the portrait.
2. **Missing touch / pointer check**: On touchscreens and mobile devices, tap and scroll gestures over the hero portrait trigger simulated mouse events, tilting the card and leaving it stuck in a skewed state.
3. **Rough snap on exit**: On `mouseleave`, the card immediately snaps back to `rotateY(0deg) rotateX(0deg)` with zero transition smoothing. Furthermore, the absence of CSS `perspective(1000px)` causes the transformation to distort geometrically rather than physically rotating in 3D space.

```javascript
/* src/scripts/app.js:808-820 - current */
function initTiltCard() {
  const tiltCard = document.getElementById('tiltCard');
  if (!tiltCard) return;
  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}
```

## Target

1. Gate initialization with `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and `window.matchMedia('(hover: hover) and (pointer: fine)').matches`.
2. Add optical perspective: `perspective(1000px) rotateY(...) rotateX(...)`.
3. Animate return on exit with `transition: transform 0.4s var(--ease-out-expo)`, clearing the transition during active `mousemove` so tracking remains responsive and does not lag.

```javascript
/* target */
function initTiltCard() {
  if (typeof window === 'undefined') return;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduced || !isFinePointer) return;

  const tiltCard = document.getElementById('tiltCard');
  if (!tiltCard) return;

  tiltCard.addEventListener('mousemove', (e) => {
    tiltCard.style.transition = 'transform 80ms ease-out';
    const rect = tiltCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `perspective(1000px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg)`;
  });

  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transition = 'transform 0.4s var(--ease-out-expo)';
    tiltCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });
}
```

## Repo conventions to follow

- Pattern in `src/scripts/app.js:824`:
  ```javascript
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  ```
- Easing variable `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);`.

## Steps

1. In `src/scripts/app.js` (`initTiltCard`, line 808):
   Insert guards for `prefers-reduced-motion` and `(hover: hover) and (pointer: fine)`.
   Update transform template string to include `perspective(1000px)`.
   Add `transition = 'transform 80ms ease-out'` during `mousemove` and `transition = 'transform 0.4s var(--ease-out-expo)'` on `mouseleave`.

2. In `src/styles/main.css` (`.tilt-card`, around line 543):
   Add `transform-style: preserve-3d;` and `will-change: transform;`.

## Boundaries

- Do NOT change the aspect ratio or image fit inside `#tiltCard`.
- Do NOT increase rotation limits beyond ±10 degrees (subtle physics only).
- Do NOT alter surrounding hero grid layout.

## Verification

- **Mechanical**:
  - Run `npm run build` and ensure exit code 0.
  - Run `npm test` and ensure all tests pass.
- **Feel check**:
  - Hover over the portrait with a mouse. Move the cursor smoothly across corners and verify perspective tilt follows cursor without lagging.
  - Move the cursor out of the portrait. Verify the card glides smoothly back to level with a 0.4s exponential deceleration curve instead of snapping instantly.
  - Open DevTools > Device Mode (iPhone / Android) and touch the hero portrait. Confirm no sticky tilt occurs.
  - Enable reduced motion in DevTools. Confirm portrait remains perfectly static.
- **Done when**: Tilt operates with true 3D perspective and smooth spring-like recovery, while completely disabled on mobile touch and reduced-motion profiles.
