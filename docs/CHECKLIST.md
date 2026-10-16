# Implementation and launch checklist

## Implemented and covered by automated backend tests

- [x] Public routes render in Arabic RTL and English LTR.
- [x] Locale-preserving public links and sitemap generation.
- [x] Missing WhatsApp/phone settings produce no broken contact actions.
- [x] Inquiry persistence with unique reference, consent, private uploads and initial status.
- [x] MIME/extension rules reject executable artwork uploads.
- [x] Required fields, paired dimensions and sign configuration validation.
- [x] Honeypot and inquiry rate limiting.
- [x] Saved inquiry survives an email transport failure.
- [x] Admin login/logout, unauthorised route denial and staff restrictions.
- [x] Authorised private attachment download.
- [x] Status history, staff notes and quotation creation.
- [x] Currency rounding, discount bounds and disabled/enabled tax totals.
- [x] Printable Arabic/English quotation routes.
- [x] Editable homepage/footer/services and escaped public content.
- [x] Unapproved media private storage and publishing/unpublishing transitions.
- [x] No seeded accounts or hardcoded production passwords.
- [x] Source dependencies resolved and frontend production build succeeds.

## Implemented, requiring browser acceptance

- [ ] Mobile navigation: phone sizes, keyboard, Escape, focus, overflow.
- [ ] Native video play/pause, portrait display, no initial video downloads.
- [ ] Arabic shaping in the sign preview, including the actual business name.
- [ ] Latin extruded text, font, material, depth, lighting and orbit/reset controls.
- [ ] No-WebGL fallback and settings attachment to a real inquiry.
- [ ] Off-screen/hidden-tab pause and reduced-motion preference.
- [ ] Form use with JavaScript disabled, accessible field errors and keyboard flow.
- [ ] Quotations printed/saved to PDF in both languages.
- [ ] Contrast and layout review on real Android/iOS/desktop browsers.

## Owner/hosting acceptance

- [ ] Confirm name, logo, city, contacts, hours and service areas.
- [ ] Review Arabic/English copy, available services, package scope and portfolio rights.
- [ ] Confirm draft product specifications; publish only real products/materials.
- [ ] Review privacy draft, retention, contact and any analytics consent requirements.
- [ ] Confirm tax rules; leave tax off until confirmed.
- [ ] Deploy on PHP 8.3+/MySQL hosting and run migrations there.
- [ ] Test an inquiry, private download, admin update and quotation using real MySQL.
- [ ] Configure SMTP and confirm real recipient delivery after a test submission.
- [ ] Enable HTTPS, disable debug, secure cookies, verify document root and upload execution rules.
- [ ] Verify backup and restore, server upload limits, logs and access permissions.

## Intentionally absent

- Screenshot export from 3D preview; settings are attached instead.
- Automatic WhatsApp sending, payment processing, native apps, supplier marketplace and Saudi e-invoicing.
- A public quotation acceptance portal, account recovery emails, 2FA and antivirus scanning.
- Managed live hosting or a claim that the privacy policy is legally reviewed.
