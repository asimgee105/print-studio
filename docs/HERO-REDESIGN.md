# Revision 2 — cinematic video hero

This revision replaces the static typographic sign hero with real workshop footage in a perspective carousel. The surrounding public design changes from green-charcoal to midnight blue, cyan, soft white and restrained amber.

## Experience

- The four approved workshop videos become hero slides. The illuminated sign/display clip opens first. Captions come from the existing editable Media records.
- The active portrait video sits in a three-dimensional CSS frame with two recessed neighbouring poster cards, material highlights, orbit outlines and a soft stage reflection.
- A bounded desktop pointer tilt responds to the cursor. Touch devices use swipe navigation without pointer tilt.
- Thumbnail selectors, current-slide numbering, next/previous controls and progress tracks provide visible navigation.
- Muted playback starts when the video stage enters the viewport, subject to the browser's autoplay policy. A clip ending advances to the next unless automatic advance was paused or keyboard focus entered the carousel.
- Play/pause controls both playback and automatic advancement. A stopped video can be explicitly restarted.
- Only the selected video receives a source URL for streaming. Inactive cards use extracted posters and do not start playback. Previously played streams may remain cached by the browser.
- The current clip pauses off-screen, while the tab is hidden, or when the visitor starts another workshop video.
- Reduced-motion preference disables autoplay, automatic advancement and pointer tilt. Explicit play/select remains available.
- Without JavaScript, the first hero poster and workshop link remain; the workshop page retains native video controls.
- The original portrait framing is preserved with `object-fit: contain`; this is CSS perspective presentation of real videos, not a claim of reconstructed three-dimensional footage.

The full public theme also updates the header, service cards, project images, 3D-preview invitation, video panels and footer.

## Files changed

- `resources/views/components/hero-slider.blade.php` — new bilingual carousel component.
- `resources/views/public/home.blade.php` — uses the new hero.
- `resources/views/layouts/public.blade.php` — scopes the new public theme.
- `resources/css/cinema.css` — responsive video stage and public visual identity.
- `resources/js/hero-slider.js` — playback, lazy source attachment, progress, controls, keyboard/swipe, viewport/visibility pause and reduced motion.
- `resources/css/app.css`, `resources/js/app.js` — include the new assets.
- `lang/ar/site.php`, `lang/en/site.php` — translated control/status labels.

## Revision checks actually executed

- `node --check resources/js/hero-slider.js`: passed.
- `npm run build`: passed; carousel is part of the regular frontend bundle, with no additional library dependency.
- `php artisan view:cache`: passed.
- Focused bilingual public-route regression: 1 test, 37 assertions, passed. This covers server rendering, not browser interactions.

Browser playback, tilt, gestures, mobile layout, autoplay policy, keyboard focus and reduced-motion behavior still require real-browser acceptance. No browser test or screenshot is claimed for this revision.

All quotation, inquiry, privacy, authentication and admin workflows retain their existing implementation. The first revision's backend test report is preserved in VERIFICATION.md. New installs use README.md. Existing installs should replace source/public build files, retain their own `.env` and stored customer files, then run `php artisan optimize:clear`. No database migration or reseeding is required for this visual revision. Never use `migrate:fresh` to update a live installation.
