# Executed verification

Date: 16 October 2026.

- Runtime: PHP 8.3.6; Laravel 13.37.0; Node 24.19.0.
- Composer dependency resolution completed; composer.json validation passed. Composer reported no vulnerability advisories at installation time. This is not a guarantee against all vulnerabilities.
- Production Vite build passed. Main JS: approximately 58 kB; lazy sign-preview JS: approximately 713 kB (203 kB gzip). The latter triggers the build tool’s size advisory; it is loaded only on the preview page.
- PHPUnit: **16 tests, 135 assertions, all passed**. These include the framework starter’s one basic unit assertion; the other coverage exercises actual application behavior.
- All Blade templates compiled.
- Application routes were enumerated successfully.
- Public pages and service/project detail routes rendered in both locales through the Laravel HTTP test kernel.
- Original video hashes matched the uploaded bytes. Optimized videos retained portrait dimensions, use H.264, and have no audio streams. Posters are extracted from the supplied footage.

## Covered behaviors

Inquiry persistence and reference; private file persistence; initial/status-change history; invalid consent, executable files, unpublished services, spam fields, incomplete dimensions and invalid sign settings; rate limiting; mail failure preservation; login/logout; anonymous and role-denied admin access; authorised artwork download; staff quotation creation; rounding, discount limits and tax enable/disable behavior; printable document routes; editable escaped service content; editable home/footer; private media publication/unpublication.

## Not executed

- MySQL integration tests: the automated suite used an in-memory SQLite database. MySQL configuration and migrations are provided, but need acceptance on the target server.
- Browser visual, mobile, keyboard/focus and WebGL tests. Browser QA tooling was unavailable under this environment’s supported workflow, so no browser server/screenshot was improvised.
- Actual video playback or screen-reader testing.
- Live SMTP delivery, WhatsApp click-through, analytics, HTTPS hosting and backups.
- Cross-browser Arabic canvas shaping and physical printed output.

No claim is made that those remaining checks passed. See CHECKLIST.md for owner/hosting acceptance.
