# 005 - Add Tactile Active Press Feedback to Interactive Buttons and Chips

- **Status**: DONE
- **Commit**: f91e0d0
- **Severity**: MEDIUM
- **Category**: Physicality & Feedback
- **Estimated scope**: 1 file (`src/styles/main.css`), ~20 lines added

## Problem

None of the primary interactive controls in the portfolio have physical press feedback (`:active`). When clicking or tapping buttons like `.tool-chip`, `.stage-step-btn`, `.stage-expand-btn`, `.repo-link-btn`, `.modal-btn`, `.modal-close`, or `.view-mode-btn`, the surface remains completely rigid.

In Emil Kowalski's motion philosophy, physical affordances require that pressing an element induces an immediate, subtle tactile sink (typically `scale(0.97)`). Without this, the interface feels flat and unyielding.

```css
/* src/styles/main.css:400 - current */
.tool-chip {
  padding: 8px 16px;
  border-radius: 9999px;
  background: var(--bg-card);
  border: 1px solid var(--border-soft);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease;
}
/* No :active press state */
```

## Target

Introduce a unified, subtle press feedback token: `transform: scale(0.97)` on `:active`, transitioning with `transform 160ms ease-out`. Keep the scale in the 0.96-0.98 range so it feels tactile rather than bouncy.

```css
/* target */
.magnetic-btn:active,
.tool-chip:active,
.stage-step-btn:active,
.stage-expand-btn:active,
.repo-link-btn:active,
.modal-btn:active,
.modal-close:active,
.view-mode-btn:active,
.work-row-cta:active,
.nav-cta-pill:active {
  transform: scale(0.97);
  transition: transform 160ms ease-out;
}
```

## Repo conventions to follow

- Existing interactive components in `src/styles/main.css`.
- Leverages native CSS `:active` pseudo-class for immediate, lag-free response without JavaScript listeners.

## Steps

1. In `src/styles/main.css` (after button utility definitions, around line 1030):
   Add the consolidated `:active` press rule for interactive controls:
   ```css
   .magnetic-btn:active,
   .tool-chip:active,
   .stage-step-btn:active,
   .stage-expand-btn:active,
   .repo-link-btn:active,
   .modal-btn:active,
   .modal-close:active,
   .view-mode-btn:active,
   .work-row-cta:active,
   .nav-cta-pill:active {
     transform: scale(0.97);
     transition: transform 160ms ease-out;
   }
   ```

2. In `src/styles/main.css` (inside `@media (prefers-reduced-motion: reduce)` around line 2217):
   Ensure `:active` states remain gentle or keep `transform: none !important;` if all motion is disabled.

## Boundaries

- Do NOT scale layout cards or scroll containers (only discrete clickable buttons and chips).
- Do NOT use aggressive scale values below 0.95.
- Do NOT add audio or haptic JS libraries.

## Verification

- **Mechanical**:
  - Run `npm run build` and ensure exit code 0.
  - Run `npm test` and ensure all 16 tests pass.
- **Feel check**:
  - Click any category chip in the Graphic Design section. Feel the subtle 3% compression while holding the mouse button down, releasing cleanly.
  - Click "Perbesar Karya" in list mode. Feel the tactile button press.
  - Test modal buttons (Previous, Next, Close). Confirm immediate tactile feedback on every click.
- **Done when**: All major interactive buttons and chips exhibit subtle, satisfying 160ms press compression on mousedown/touch.
