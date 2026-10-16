# Print & Sign Studio — revision 3: service animations and themes

All seven service pages now have matching interactive 3D process concepts. The homepage has animated service previews, and the public site has persistent dark/light mode. See `docs/SERVICE-ANIMATIONS-THEMES.md` for behavior and verification limits.

The homepage now features a cinematic perspective carousel using the supplied workshop videos. See `docs/HERO-REDESIGN.md` for controls, update instructions and verification limits.

Temporary editable brand: **Your Brand**. This is a printing/signage inquiry platform for a Saudi-based business. It does not include payments, Saudi e-invoicing, automatic WhatsApp delivery or income guarantees.

## Quick start on Windows / WAMP

Use **PHP 8.3 or newer** with Ctype, cURL, DOM/XML, Fileinfo, Intl, Mbstring, OpenSSL, PDO and PDO MySQL enabled. Check `php -v`; the PHP selected in your terminal must also be 8.3+. Do not bypass Composer platform checks on PHP 8.2.

1. Extract the project to `C:\wamp64\www\print-studio`.
2. Create an empty MySQL database named `print_studio` in phpMyAdmin.
3. Open a terminal in the extracted project folder.

```powershell
Copy-Item .env.example .env
```

Edit `.env` with your MySQL username/password. Then run:

```powershell
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan studio:admin
php artisan serve
```

Open `http://localhost:8000/ar` (Arabic), `/en` (English), and `/admin` (administration).

**No default administrator/password exists.** The `studio:admin` command prompts privately for a password of at least 12 characters and confirmation. Store it in your password manager.

The delivery ZIP includes the resolved PHP dependencies in `vendor/` and compiled frontend files in `public/build/`. Node does not need to stay running, and neither Composer nor Node is required just to run that packaged copy. If you deliberately remove `vendor/`, restore dependencies with:

```bash
composer install
```

For frontend changes, use Node **22.12+** (or a compatible newer release):

```bash
npm ci
npm run build
```

Do not upload `node_modules` to PHP hosting. The lock files pin the dependency versions used in this delivery.

## First configuration

After signing in:

- **Settings:** replace Your Brand; add the confirmed logo, city, address, phone, WhatsApp digits, email, notification email, hours and service areas. Unconfigured contact buttons remain hidden.
- **Pages:** `home` edits the homepage hero title/intro; `footer` edits the footer description; `about` and `privacy` edit those pages. Arabic and English fields are separate.
- **Services / Packages / FAQs:** edit text and display order, publish or unpublish. Do not add unsupported claims.
- **Products:** three development drafts are intentionally unpublished. Confirm real options/specifications and publish them. Fixed prices appear only when explicitly marked verified.
- **Projects / Media:** initial portfolio references use the supplied videos and extracted posters. Confirm public usage rights and captions with the owner.
- **Team:** create staff accounts. Staff can handle inquiries and quotations; only administrators manage content, media, settings and accounts.
- **Privacy:** review the clearly labelled draft, set the actual retention period/contact, and obtain appropriate review before going live. The public draft label remains explicit in this build.
- **Tax:** disabled by default. Enable it only after the business confirms its settings. Documents are quotations, not tax invoices.

## Inquiry and quotation workflow

1. A visitor submits the form without creating an account.
2. Server validation checks fields, consent, published service, dimensions, optional sign settings and file types/limits.
3. An inquiry and its status history are saved in a transaction. Files go to `storage/app/private/inquiries` under random names.
4. A reference is shown after success. Do not refresh a submitted POST; the response redirects to the form.
5. If notification email is configured, the app attempts synchronous email delivery after saving. Failure is recorded and does not discard the inquiry. `logged_only` means development log transport, not delivered mail; `sent` means accepted by the configured transport, not proof of inbox receipt.
6. Staff review the inquiry, download authorised attachments, assign a staff member, add notes and update status.
7. Staff create a quotation with line items, discount, delivery, installation, confirmed tax, expiry and payment terms. Calculations use integer halalas (cents). The quotation may be printed in Arabic or English from the admin panel.

Statuses: New → Contacted → Quoted → Accepted → In Production → Ready → Completed; Cancelled is also available. Staff can choose the appropriate status; the application records changes, rather than enforcing a rigid transition graph.

The optional WhatsApp button opens a customer-initiated message. It does **not** automatically send any message.

## Sign preview

The preview page lazy-loads Three.js; other public pages load no Three.js bundle. Supported controls: text, two font choices, colour, material appearance, depth, illumination, wall, orbit/zoom and reset.

Latin ASCII text uses extruded geometry. Arabic and other scripts use browser-shaped flat artwork on a 3D panel, with explicit disclosure. Canvas fonts load locally. Unsupported system-script glyphs depend on installed fallback fonts; confirm actual requested text during design approval.

Settings attach to the inquiry through session storage; quotation forms work without WebGL or JavaScript. **Screenshot export is not implemented** and no screenshot is claimed. Storage-disabled browsers may be unable to retain the concept between pages. The original quote form remains available.

Rendering resolution is capped, the loop pauses when the preview is off-screen or the tab is hidden, and reduced-motion disables view damping and decorative motion. On WebGL failure, a static sign and an explanation remain.

## Videos and storage

Original, untouched supplied clips are in `original-videos/`, outside the public web root. `docs/ASSETS.md` maps them to their source filenames. Web copies remove audio, encode H.264 with fast-start metadata, and preserve portrait proportions. Posters are real extracted video frames. Public videos use native playback controls, `preload="none"`, and pause other videos on play.

New unapproved media uploads are private. Publishing new uploaded media moves it to public storage; unpublishing moves it back. The four shipped source portfolio assets are already approved public references; their bundled files remain available by URL even if hidden from gallery listings. These are not customer-private files. Customer artwork must only be submitted through inquiry attachments.

`php artisan storage:link` links only `storage/app/public`. Never link `storage/app/private`, `original-videos`, the whole project, or the database into the public web root.

PHP upload settings:

```ini
upload_max_filesize = 50M
post_max_size = 64M
max_file_uploads = 10
memory_limit = 256M
```

Application limits: inquiries up to 5 files, 10 MB each; JPEG/PNG/WebP/PDF only. Admin portfolio upload up to 50 MB; JPEG/PNG/WebP/MP4/WebM; uploaded videos require a poster. SVG, executables, archives and office files are intentionally excluded. Include extension restrictions and `nosniff` at the web server. Scanning with an antivirus service is a possible later addition, not part of this delivery.

## Email

Set a real SMTP transport in the server environment:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=your-confirmed-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-mailbox
MAIL_PASSWORD=your-secret
MAIL_FROM_ADDRESS=your-confirmed-sender
```

Add the recipient in Admin → Settings → Notification email. Use your provider's required TLS settings. Test a real submission after configuration. Credentials are never stored in the public source/settings UI. Development defaults to `MAIL_MAILER=log`, which writes to the application log and sends nothing externally.

No queue worker or scheduler is used. Email is attempted synchronously. Slow/unavailable SMTP can delay the confirmation response; configure a short SMTP timeout or move notifications to a queue if the workload requires it later.

## PHP/MySQL production deployment

Use hosting that supports PHP 8.3+, MySQL 8+, HTTPS and a document root pointing to **`public/`**. Sites/Cloudflare Workers do not run this PHP application; no hosted Laravel deployment is claimed in this delivery.

1. Upload the application outside the public document root. Keep originals out of public hosting if not needed there.
2. Create a restricted MySQL user/database and set the server `.env` values.
3. Set `APP_ENV=production`, `APP_DEBUG=false`, the correct HTTPS `APP_URL`, and `SESSION_SECURE_COOKIE=true`.
4. Run `composer install --no-dev --optimize-autoloader` on a PHP-compatible machine/server. If deploying the bundled dependencies, replace them with the production install when feasible.
5. Build with `npm ci && npm run build` locally and upload `public/build/`, or build on the server if Node is available.
6. Run `php artisan key:generate` once for a **new** install; never rotate a live application's key casually.
7. Run `php artisan migrate --force`, then `php artisan db:seed --force` if you want the supplied editable starting content. The seeder preserves existing entries with the same slugs.
8. Run `php artisan storage:link`, then `php artisan studio:admin`.
9. Ensure `storage/` and `bootstrap/cache/` are writable by PHP. Avoid world-writable permissions.
10. Run `php artisan optimize`. After future configuration changes, rebuild the cache with this command.
11. Complete `docs/CHECKLIST.md` on the real environment before opening the site to customers.

Example Nginx configuration is in `docs/nginx.conf`. For Apache/WAMP, enable `mod_rewrite` and point a virtual host to `public/`; Laravel's included `public/.htaccess` handles routing. Block PHP execution in `/storage/` at server level. Do not serve the project root under a normal WAMP folder URL.

SEO: canonical URLs, equivalent-language hreflang, Open Graph and `/sitemap.xml` are generated. LocalBusiness structured data appears only after a real name/address is configured. Set search-console verification separately. `public/robots.txt` excludes the admin and storage paths. It does not provide access control.

Optional GA4 ID can be configured in Settings. Analytics is **disabled by default**; review the applicable consent requirements and privacy policy before enabling it. No consent-management platform is included.

## Backups and recovery

Back up the MySQL database, `storage/app/private`, `storage/app/public`, the deployed source/version and encrypted server secrets. Keep backups outside the web root, restrict access, encrypt them and regularly test restoration. Set an owner-approved retention/deletion policy. Do not publish a database dump or customer attachments in Git. Keep `APP_KEY` secure and available for recovery.

## Verification and limitations

See `docs/VERIFICATION.md` for the exact executed tests. Automated integration tests used SQLite, **not MySQL**. No browser/WebGL/mobile-playback verification or live SMTP/production hosting test has been executed in this environment. The production frontend build and backend feature tests pass; that is not a claim of complete production certification.

Run on your environment:

```bash
php artisan test
```

The app is a working first implementation, with an owner review and browser/hosting acceptance pass still required. There are no real customer records, default administrator passwords, testimonials, made-up equipment specifications or fabricated project-count claims in the seed data.
