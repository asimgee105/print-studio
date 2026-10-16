Act as a senior Laravel developer, UI/UX designer and 3D web developer. Build a complete, working website for a Saudi Arabia-based printing, signage and advertising business.

I want actual implementation with working source code, database, admin panel and setup instructions—not only a proposal, screenshots or a static landing page.

PROJECT GOAL

Help the business showcase its real capabilities, receive qualified customer inquiries and quotation requests, and turn those inquiries into printing and installation orders.

The website itself does not guarantee earnings. Its purpose is to help sell the business’s services.

BUSINESS CONTEXT

The business provides:

- Sticker and vinyl printing.
- Flex and banner printing.
- UV printing.
- Indoor printing.
- Flatbed printing.
- Large-format printing.
- Signboards and illuminated 3D letters.
- Decorative printed boards and display cutouts.
- Pasting, fabrication and installation.

Make services editable. Do not invent equipment specifications, certifications, customer reviews, client logos, years of experience or completed-project counts.

Business name, city, address, WhatsApp number, logo, prices and operating hours are not confirmed yet. Store these in configurable settings. Clearly mark missing information in development and hide unconfigured contact actions on the public website.

Use a temporary editable brand name: “Your Brand”.\
Do not present it as the confirmed business name.

ATTACHED REFERENCE VIDEOS

Inspect the four uploaded videos and use them as real portfolio references:

1. “WhatsApp Video 2026-10-16 at 10.48.18 AM.mp4”\
   Shows a large roll-fed printing machine and production activity.
2. “WhatsApp Video 2026-10-16 at 10.48.19 AM (1).mp4”\
   Shows colourful graphics being printed on a flat surface.
3. “WhatsApp Video 2026-10-16 at 10.48.19 AM.mp4”\
   Shows illuminated dimensional letters, decorative printed boards and cutout displays.
4. “WhatsApp Video 2026-10-16 at 10.48.20 AM.mp4”\
   Shows floral artwork being printed on roll material.

Do not infer exact machine models, printing technology or material specifications solely from appearance.

If the files are accessible:

- Preserve the original videos.
- Create web-friendly copies and poster images.
- Use descriptive filenames and editable captions.
- Keep portrait footage correctly proportioned.
- Avoid stretching or cropping away the actual work.

If you cannot access the uploaded files, say so explicitly. Create clearly labelled media slots and an upload workflow instead of pretending the videos were integrated.

TECH STACK

Use:

- A currently supported stable Laravel release compatible with the available PHP environment.
- MySQL.
- Blade templates.
- Tailwind CSS.
- Alpine.js where useful.
- Vite.
- Three.js for the interactive 3D feature.

Verify dependency compatibility before choosing versions. Keep the architecture understandable for a PHP/Laravel developer.

The production site should not require a permanently running Node.js server. Node should be used for building frontend assets.

DESIGN DIRECTION

Create a premium visual identity inspired by illuminated signage, print production and physical materials.

Visual style:

- Deep charcoal and midnight backgrounds.
- Warm white text.
- Restrained electric cyan and amber accents inspired by illuminated signs.
- Some light sections to improve readability and visual rhythm.
- Large, confident typography.
- High-quality Arabic and English typography.
- Spacious layouts and clear calls to action.
- Subtle depth, lighting and material effects.
- Carefully controlled animation.

Avoid generic dashboard styling on the public website, excessive glowing borders, distracting particles and repetitive cards.

The first screen should clearly communicate:

1. What the business does.
2. Where it operates, once configured.
3. How to request a quotation.

Use concise customer-facing language. Do not expose developer terminology in the public interface.

LANGUAGES

Build complete Arabic and English support:

- Arabic as the default public language.
- Correct RTL layout.
- English LTR layout.
- Locale-aware URLs such as /ar and /en.
- A language switcher that preserves the equivalent page.
- Translated navigation, forms, validation messages and buttons.
- Editable Arabic and English content fields.
- Saudi Riyal formatting wherever prices are used.

PUBLIC PAGES

1. Homepage.
2. Services listing.
3. Individual service pages.
4. Products and materials catalog.
5. Individual product/material pages.
6. Projects gallery.
7. Project detail pages.
8. Our Workshop / Production Videos.
9. Interactive 3D Sign Preview.
10. Request a Quote.
11. About.
12. Contact.
13. FAQ.
14. Privacy policy with editable draft content for owner review.

Do not publish unsupported business claims or pretend draft policies have been legally reviewed.

HOMEPAGE

Build these sections:

A. Header

- Logo.
- Navigation.
- Language switcher.
- Request a Quote button.
- Responsive mobile menu.

B. Hero

- Strong Arabic/English headline.
- Short description covering printing, signage and installation.
- Primary action: Request a Quote.
- Secondary action: View Our Work.
- An attractive 3D sign scene with a lightweight static fallback.
- A visible route to the real workshop videos.

C. Services

- Visually distinctive service cards.
- Clear descriptions.
- Links to individual service pages.

D. Featured Work

- Actual video posters and project images when available.
- Categories such as Printing, 3D Signs, Displays and Installation.
- Accessible project/video viewer.

E. Interactive Sign Preview

- A small preview inviting visitors to customise a sample sign.

F. Business Packages\
Editable inquiry-based packages, such as:

- New Shop Opening.
- Restaurant and Café Branding.
- Office Signage.
- Promotional Printing.

Show included services and a quotation button. Do not invent fixed prices.

G. How It Works

- Send requirements.
- Receive quotation.
- Approve design.
- Production.
- Delivery or installation.

H. Workshop Videos

- Use the four uploaded videos.
- Poster-first loading.
- Click to play.
- Playback controls.
- No automatic audio.
- Pause other videos when one starts.

I. FAQ.

J. Contact call to action and footer.

3D EXPERIENCE

Build a useful, working 3D signage preview rather than decorative animation alone.

Allow the visitor to:

- Enter sample sign text.
- Select from a small set of supported fonts.
- Change the front colour.
- Choose acrylic-like, metallic or matte material.
- Adjust letter depth within a safe range.
- Switch illumination on or off.
- Choose a wall/background.
- Rotate the view.
- Reset the view.
- Attach the selected configuration to a quotation request.

If reliable image export is supported, include a preview screenshot in the quote request. Store the settings even when screenshot export is unavailable.

Important:

- Label the result “Visual concept only; final design, dimensions, materials and price require confirmation.”
- Do not claim the preview is a fabrication-ready design.
- Explain unsupported font characters gracefully.
- Correctly handle Arabic shaping. If true extruded Arabic text cannot be implemented reliably, use a clearly disclosed flat Arabic artwork preview on a 3D sign panel.
- Do not render broken Arabic text.
- Lazy-load Three.js.
- Limit rendering resolution on mobile.
- Pause rendering when off-screen or when the tab is hidden.
- Respect reduced-motion preferences.
- Provide a fallback when WebGL is unavailable.
- Keep contact and quotation forms usable without 3D.

QUOTE REQUEST SYSTEM

Visitors must be able to submit a quote without creating an account.

Fields:

- Customer name.
- Company name, optional.
- Phone/WhatsApp.
- Email, optional.
- City and area.
- Required service.
- Product/material, when relevant.
- Width and height.
- Measurement unit.
- Quantity.
- Indoor or outdoor use.
- Installation required: yes/no.
- Requested completion date, optional.
- Description.
- Design/reference uploads.
- Optional 3D configuration.
- Consent to be contacted regarding the inquiry.

On successful submission:

- Validate on the server.
- Save the inquiry in the database.
- Assign a reference number.
- Show a proper confirmation.
- Notify the administrator through configured email.
- Do not lose the saved inquiry if email delivery fails.
- Provide an optional customer-initiated WhatsApp button with a concise prefilled message.

Do not claim WhatsApp messages were automatically sent. Automatic WhatsApp delivery requires a separately configured integration.

Use a quote basket where useful, so a visitor can request several services/products in one inquiry.

Do not show automatic prices unless real pricing rules have been entered by the administrator.

ADMIN PANEL

Create a protected admin panel with:

1. Dashboard

- New inquiries.
- Pending quotations.
- Approved work.
- Completed work.
- Counts based on real database records.

2. Services management

- Arabic/English fields.
- Images.
- Display order.
- Publish/unpublish.

3. Products/materials management

- Categories.
- Descriptions.
- Options.
- Images.
- Optional verified pricing.
- Active/inactive status.

4. Projects management

- Photos and videos.
- Service category.
- Description.
- Featured status.
- Publish/unpublish.

5. Media management

- Upload videos and images.
- Poster image support.
- File validation.
- Editable captions and alt text.

6. Inquiries

- View complete requirements.
- View authorised attachments.
- Search and filter.
- Internal notes.
- Assigned staff member.
- Status history.

Suggested statuses:\
New → Contacted → Quoted → Accepted → In Production → Ready → Completed.\
Also allow Cancelled.

7. Quotations

- Create quotations linked to inquiries.
- Line items, quantities, prices and discounts.
- Delivery and installation charges.
- Configurable tax field, disabled until the business confirms its settings.
- Validity date and payment terms.
- Printable Arabic/English quotation.
- Correct totals and server-side validation.

Do not present quotations as compliant Saudi tax invoices or claim e-invoicing integration.

8. Content management

- Homepage text.
- FAQs.
- About.
- Contact details.
- Footer.
- Packages.

9. Settings

- Business name and logo.
- Phone and WhatsApp.
- Email.
- Address and map link.
- Service areas.
- Opening hours.
- Social links.
- Language settings.
- SEO defaults.

10. Roles

- Admin: full control.
- Staff: inquiries and quotations only.

CUSTOMER ACQUISITION FEATURES

Implement:

- Clear service pages with editable local content.
- Descriptive URLs.
- Editable page titles and meta descriptions.
- Canonical URLs.
- XML sitemap.
- Arabic/English hreflang.
- Open Graph previews.
- Structured data using verified business information only.
- Fast mobile pages.
- Prominent WhatsApp and call buttons when configured.
- Optional analytics configuration with documented setup.
- An optional review section that remains hidden until genuine approved reviews exist.

Do not promise Google rankings, customer volume or guaranteed earnings.

SECURITY

Include:

- Secure authentication and password hashing.
- CSRF protection.
- Server-side validation.
- Authorisation policies.
- Login and inquiry rate limits.
- Spam protection.
- Escaped user content.
- Safe file names and upload size limits.
- MIME/type validation.
- No executable uploads.
- Private storage for customer artwork and inquiry attachments.
- Authorised download routes.
- Public storage only for approved portfolio assets.
- Environment variables for secrets.
- No hardcoded production passwords.
- Safe error handling.

Do not expose customer inquiries or files through predictable public URLs.

PERFORMANCE AND ACCESSIBILITY

- Responsive layouts from small phones to desktops.
- Keyboard-accessible menus and modals.
- Visible focus states.
- Proper labels and accessible validation errors.
- Adequate contrast.
- Reduced-motion support.
- Responsive images with dimensions.
- Video posters and lazy loading.
- No downloading every video on initial page load.
- No unnecessary animation dependencies.
- Avoid loading the 3D bundle on pages that do not need it.

INITIAL SCOPE

Complete the website, admin panel, gallery, video integration, 3D preview and quotation workflow first.

Exclude online payments, native mobile apps, automatic WhatsApp campaigns, supplier marketplaces and Saudi e-invoicing from the initial build. Keep the architecture ready for later additions without pretending these integrations already work.

DELIVERABLES

Provide:

- Complete project source.
- Database migrations and clearly labelled development seed data.
- .env.example without secrets.
- Installation and local setup instructions.
- A secure way to create the initial administrator.
- Build instructions.
- Deployment instructions for compatible PHP/MySQL hosting.
- Guidance for storage paths and video upload limits.
- Queue/scheduler instructions only if used.
- Backup recommendations.
- A final implementation checklist.
- Clear disclosure of anything incomplete or untested.

If the environment supports file creation, create actual project files and provide a ZIP/downloadable deliverable. If it does not, explicitly say so and provide complete files with paths in manageable batches. Never invent a download link.

VERIFICATION

Test the meaningful workflows:

- Submit a quote and confirm database persistence.
- Confirm field validation and upload restrictions.
- Ensure unauthorised users cannot access private attachments or admin routes.
- Create a quotation and verify totals.
- Check Arabic RTL and English LTR.
- Check mobile navigation.
- Verify videos and 3D fallbacks.
- Confirm missing contact settings do not create broken buttons.
- Check that content updates in admin appear publicly.

Clearly distinguish tests actually executed from checks that still require a real browser or configured hosting.

WORKING METHOD

First inspect the environment and uploaded assets. Briefly state assumptions, then start implementation.

Use sensible editable defaults instead of blocking on missing branding details. Build in coherent stages, keep a progress checklist, and continue toward a working project.

Prioritise:

1. A polished public design.
2. Working quotation and admin workflows.
3. Real portfolio videos.
4. A performant and useful 3D experience.

Do not stop after creating only the homepage or describing what could be built.