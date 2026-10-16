# Project map

- `routes/web.php`: locale-aware public routes and guarded admin routes.
- `app/Http/Controllers/PublicController.php`: services, projects, content, videos and sitemap.
- `app/Http/Controllers/InquiryController.php`: public server validation, transactional persistence, private files and post-save mail attempt.
- `app/Http/Controllers/AdminController.php`: role-restricted management, authorised downloads, quotations, media and settings.
- `app/Policies/InquiryPolicy.php`: staff/admin inquiry authorisation.
- `app/Providers/AppServiceProvider.php`: gates, rate limits and shared view settings.
- `app/Services/QuoteTotals.php`: integer currency calculations and discount bounds.
- `app/Models`: inquiries, attachments, history, quotations, bilingual content, media and settings.
- `database/migrations`: schema for MySQL; also portable to SQLite for automated tests.
- `database/seeders`: editable starting content and explicitly unpublished example product drafts. No sample customers/accounts.
- `resources/views/public`: public pages; `layouts/public` owns language/SEO/navigation/footer.
- `resources/views/admin`: protected management and printable quotations.
- `resources/css/app.css`: Tailwind entry plus the studio's custom public/admin design.
- `resources/js/app.js`: Alpine, video coordination and quote basket/settings transfer.
- `resources/js/sign-preview.js`: lazy-loaded Three.js scene, Arabic canvas panel and static fallback.
- `lang/ar`, `lang/en`: public UI and validation translations.
- `public/media`: approved real portfolio references only.
- `storage/app/private`: inquiry artwork and unapproved uploaded media; never symlink this directory publicly.

Request flow: browser → Laravel web middleware (session, CSRF, validation/rate limits) → controller/policy → Eloquent/MySQL → Blade response. Vite compiles static JS/CSS; production requests run through PHP only.

Quotations are snapshots: staff create a fresh document rather than editing already issued line totals. Arabic/English output translates document labels; line descriptions and payment terms are whatever language the staff entered.

Keep business claims and portfolio publishing decisions with the owner. This project intentionally excludes marketing promises and unsupported specifications.
