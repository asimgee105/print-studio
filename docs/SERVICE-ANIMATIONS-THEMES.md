# Revision 3 — service animations and public dark/light themes

## Added

All seven existing services now have distinct motion concepts:

| Service | Animation concept |
| --- | --- |
| Stickers & vinyl | Scanning printer carriage, printed sheet, lifting decal |
| Signs & illuminated letters | Extruded Aa letter forms with changing illumination |
| Large-format printing | Roll printer, moving carriage, feeding printed material |
| UV & flatbed printing | Flat printing bed, scanning head, coloured light accent |
| Decorative boards & displays | Layered arched boards and dimensional display elements |
| Fabrication & installation | Wall mounting points, moving panel and fitting tool |
| Indoor printing | Room surfaces and printed wall artwork being positioned |

These are illustrative process animations, not equipment models, verified machinery specifications, fabrication instructions or promises of production results.

Homepage: all seven services appear, with small animated perspective previews in the cards. An additional service animation section includes a full WebGL scene. Hover/focus a service link there to preview that service, or follow the link to its detail page. Touch visitors can follow each service link and use the model on its page.

Service detail pages: a large procedural Three.js scene replaces the generic placeholder. Visitors can drag to rotate, use rotation buttons, and pause/play the process motion. The scene is loaded only when its full-size stage enters the viewport. Compact cards use CSS perspective animation without separate WebGL contexts. New services with unknown slugs use the generic printing concept until a specific scene is added.

The original video hero and the separate configurable sign quotation preview remain available.

## Dark and light mode

A sun/moon button in the public header switches themes. The selection is saved in browser local storage. On first visit, the operating-system preference is used; blocked storage does not prevent switching within the current page.

Light mode uses dark navy/near-black headings and dark body text on light surfaces. Hero text gradients, menus, cards, forms, footer and scene controls have explicit light colours. The underlying video footage is unaltered.

Dark mode now also darkens the formerly light content sections, service cards and quotation form, with light text and appropriate field backgrounds. Admin pages and printed quotation documents retain their existing stable colour scheme.

The header also has a motion pause control for all service animations. It is independent of the video hero's playback control. Each large service model has its own pause control. Reduced-motion preferences produce static service concepts by default. CSS animation pauses off-screen/when the tab is hidden; the WebGL loop stops off-screen, when hidden, or when motion is paused. Mobile rendering resolution is capped and shadows are omitted on small screens.

A CSS perspective illustration is the fallback if WebGL is unavailable or the context is lost. Rotation buttons still adjust that fallback. With JavaScript unavailable, static illustrations remain visible.

## Verification

Executed: JS syntax checks; production Vite build; Blade compilation; focused bilingual public-route regression (server rendering). Additional service routes were checked through the Laravel HTTP kernel for all seven published services in Arabic and English.

Not executed: actual browser/WebGL rendering, drag/touch interaction, theme persistence across browser reloads, screen-reader checks, real-device performance and visual contrast/layout inspection across every state. Passing compilation and route checks does not certify those interactions. Complete the browser acceptance checklist before production launch.

## Updating an existing installation

Replace the source and compiled `public/build` files, retain the existing `.env`, database and storage files, then run:

```bash
php artisan optimize:clear
```

No database migration or reseeding is required for this revision. Never run `migrate:fresh` on a live database.
