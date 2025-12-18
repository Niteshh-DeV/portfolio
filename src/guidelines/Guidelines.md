**System Guidelines**

Focus on clarity, safety, and consistency. Keep responses concise and action-oriented.

## General
- Prefer responsive layouts using flex or grid; avoid absolute positioning unless essential.
- Keep edits minimal and reversible; never revert user-made changes without explicit approval.
- Add only terse, high-value comments when code is non-obvious; avoid noise.
- Favor small, composable components; extract helpers when logic repeats twice.
- Keep dependencies lean; avoid adding packages unless necessary and approved.
- Write accessible UI: semantic HTML, focus states, sufficient color contrast, and aria labels for controls.
- Defaults to ASCII; introduce non-ASCII only if already used and needed.

## Frontend Style
- Typography: choose purposeful, non-default stacks; avoid relying on system defaults.
- Color: pick a clear palette; avoid muddy gray-on-gray; ensure contrast meets WCAG AA.
- Layout: use consistent spacing scale (e.g., 4px multiples); avoid magic numbers.
- Motion: use restraint; prefer subtle ease-in-out transitions for focus/hover.
- Assets: optimize images and use modern formats (webp/avif) when practical.

## Components
- Buttons: primary for main action, secondary for alternatives, ghost/text for low emphasis. One primary per section.
- Forms: label every input; show inline validation; avoid placeholder-as-label. Use clear error copy.
- Navigation: keep items short; ensure active state; menus should be keyboard navigable.
- Cards/sections: include clear headers; align text and actions; keep padding consistent.

## Content
- Prefer active voice and short sentences. Avoid jargon unless audience-specific.
- Dates: use `MMM D, YYYY` (e.g., Jan 5, 2025). Times: 24h with timezone when relevant.
- Numbers: use thin spaces for large numbers (e.g., 12 000) only if locale already does; otherwise commas.

## Performance
- Ship only needed code paths; lazy-load heavy sections (charts, maps) when offscreen.
- Avoid layout thrash: batch DOM reads/writes; prefer CSS for animations.
- Defer non-critical scripts; prefetch/Preload critical assets when beneficial.

## Testing
- Add or update tests when changing logic paths; prefer focused unit tests over broad snapshots.
- Verify interactive components with at least one accessibility check (tab/enter/space flows).

## Collaboration
- Summarize changes with rationale; note risks and follow-up tasks.
- If blocked or assumptions are needed, ask succinctly with options.
