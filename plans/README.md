# Implementation Plans - Animation & Motion Polish

Self-contained implementation plans produced by the `improve-animations` audit (Emil Kowalski animation philosophy).
Baseline commit: `f91e0d0`.

## Plans Overview

| # | Plan | Severity | Category | Status |
|---|------|----------|----------|--------|
| [001](001-work-row-dynamic-entry.md) | Prevent Repeated Entry Keyframes on Dynamic Filter/Search | HIGH | Interruptibility & Frequency | DONE |
| [002](002-lightbox-modal-transitions.md) | Add Fluid Entrance and Exit Transitions to Project Lightbox Modal | HIGH | Physicality & Easing | DONE |
| [003](003-tilt-card-guards-and-physics.md) | Guard 3D Tilt with Reduced-Motion, Pointer Guards, and Deceleration | MEDIUM | Accessibility & Physicality | DONE |
| [004](004-gate-hover-motion-media-query.md) | Gate Hover Translations Behind Hover and Fine Pointer Media Query | MEDIUM | Accessibility & Physicality | DONE |
| [005](005-tactile-active-press-feedback.md) | Add Tactile Active Press Feedback to Interactive Buttons and Chips | MEDIUM | Physicality & Feedback | DONE |

## Recommended Execution Order

1. **Plan 001 (Dynamic Entry Keyframes)**: High visual impact for anyone searching or filtering works; eliminates flashing and layout jitter during core interactions.
2. **Plan 002 (Lightbox Modal Transitions)**: Upgrades the centerpiece showcase presentation from abrupt popups to fluid 250ms scale and opacity deceleration.
3. **Plan 005 (Tactile Press Feedback)**: Directly improves the physical feel of all buttons, chips, and modal controls across the entire portfolio.
4. **Plan 004 (Gate Hover Translations)**: Cleans up touch device interactions, eliminating sticky offset bugs on smartphones and tablets.
5. **Plan 003 (3D Tilt Guards & Physics)**: Polishes the hero portrait motion with optical perspective, reduced-motion compliance, and smooth spring-like recovery.

## Dependencies

- **Plan 001**: Independent. Modifies `src/components/GraphicDesignSection.astro`, `src/styles/main.css`, and `src/scripts/app.js`.
- **Plan 002**: Independent. Modifies `src/styles/main.css` and `src/scripts/app.js`.
- **Plan 003**: Independent. Modifies `src/scripts/app.js` and `src/styles/main.css`.
- **Plan 004**: Independent. Modifies `src/styles/main.css`.
- **Plan 005**: Independent. Modifies `src/styles/main.css`. Best executed alongside or after Plan 004.
