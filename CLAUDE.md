# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Criterio Térmico is a static marketing/catalog site (Astro 7) for a solo technician
with 20+ years installing and repairing hot-water heating systems, based at Domingo
French 210, Villa Martelli (Vicente López, Province of Buenos Aires), Argentina —
**not** CABA, which is where the business used to be listed until 2026-08-09. The business can't compete with larger retailers on parts
inventory (only 4 SKUs today) — the site's strategy is to lead with the owner's
technical authority and diagnostic content rather than catalog breadth.

**Do not describe the owner or the site by a boiler brand** (see §8 of
`docs/norma-lenguaje.md`, added 2026-08-04). The site used to read as "the Peisa
technician" in 72 places, which pinned the business to one brand's spare parts; his
track record spans several brands and, in his words, installation work is identical
across them — the brand only affects a given unit's service. Brands still belong
wherever they are *product data* (a part's `marca`, compatible models, the specific
unit named inside a guide) and nowhere they would be *a description of him* (schema,
bylines, footer, meta descriptions, section titles).

## Commands

```sh
npm run dev       # Start dev server at localhost:4321
npm run catalogo  # Regenerate api/_catalogo.generado.js from the repuestos JSON
npm run build     # Build static site to ./dist/ (runs `catalogo` first, via prebuild)
npm run preview   # Preview the production build locally
npm run astro ...  # Run Astro CLI commands (e.g. astro add, astro check)
```

No test suite or linter is configured. Verify changes by running `npm run build`
(catches content-collection/schema errors) and `npm run check` (`astro check` —
types and unused bindings), then visually checking pages with the dev server. This
project has no component framework, so most bugs are visual/CSS or content-schema
mismatches, not logic bugs.

## Production

**The domain has a single source of truth: `site` in `astro.config.mjs`.**
`BaseLayout` reads it from `Astro.site`, everything else from `siteConfig.dominio`
(which must be kept in step with it). Canonical, `og:url`, `og:image`, the JSON-LD
breadcrumbs and the sitemap all derive from it, so a wrong value here breaks
WhatsApp link previews and tells Google the canonical version lives somewhere else.
It points at the owner's domain **`crtermico.com`** (bought 2026-07-24, live on
Vercel). The `.vercel.app` URL is now just the deploy target. Keep `site`
(astro.config.mjs), `siteConfig.dominio` (src/config/site.ts), the `Sitemap:`
line in `public/robots.txt` and the `www` redirect in `vercel.json` all in step —
JSON can't import the config, so that last one repeats the domain by hand.

**`www.crtermico.com` is registered too, and redirects to the bare domain.** Both
names had to exist: the wildcard DNS record answers for `www` anyway, so until it was
registered Vercel handed that name a certificate issued for the bare domain and
browsers refused the connection outright — anyone typing `www.` out of habit got a
security error rather than the site, and links with `www.` showed no preview. Adding
the domain gets the certificate; the redirect in `vercel.json` (matched on the `host`
header) is what stops the site from answering on two addresses at once, which would
hand Google a duplicate.

**`vercel.json` holds the headers** (JSON takes no comments, hence this note):
- Security: `nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`,
  `Permissions-Policy`, plus a CSP. The CSP needs `'unsafe-inline'` in `script-src`
  because Astro emits ~80 inline scripts here (carousel, reveals, product gallery,
  `PriceDisplay`) and there is no build step adding nonces — it still blocks
  externally-hosted scripts, which is the attack worth stopping on a static site.
  `connect-src` must list `dolarapi.com` (the blue-dollar fetch in `PriceDisplay`)
  and `font-src`/`style-src` the Google Fonts hosts. **Adding any third-party
  script, font or API means widening the CSP or the page silently breaks.**
  `frame-src` lists **both** `https://maps.google.com` and `https://www.google.com`
  for the location map on `/nosotros`: the keyless embed URL is requested on
  `maps.google.com` and **301s to `www.google.com/maps/embed`**, so dropping either
  host leaves an empty rectangle with no console error. Any other embed (YouTube,
  Instagram) is still blocked — the criterion is to link third-party media, not
  frame it.
- Cache: `/_astro/*` is immutable (Astro hashes those filenames); `/images/*` and
  `/videos/*` get a day of `max-age` plus a week of `stale-while-revalidate` —
  deliberately *not* `immutable`, because those filenames have no hash and photos
  do get replaced in place. Without this everything was served `max-age=0`.

Images are optimized by hand with `ffmpeg` before being committed (see the palette
note below for where they live). Photos straight from a camera are ~3264px wide and
have no business in a grid that renders them at 258px: scale to ~800px wide (1000
for the portrait) at `-q:v 4`. Always give `<img>` a `width`/`height` unless the
container already reserves the space with `aspect-ratio`, or the page shifts as it
loads.

## Payments (Mercado Pago — live and charging since 2026-09-01)

**Read `docs/mercadopago.md` before touching anything under `api/` or the buy
button.** It has the full setup, the env vars and the decisions taken.

The short version:

- **The price never travels from the browser.** `api/crear-preferencia.js` receives
  only the `slug` and looks the amount up server-side in `api/_catalogo.generado.js`.
  If the client sent the amount, anyone could edit it in devtools and buy a $468.000
  part for one peso. Never "simplify" this by passing the price from the front end.
- **`api/_catalogo.generado.js` is generated, not written.** `scripts/generar-catalogo.mjs`
  builds it from `src/content/repuestos/*.json` on every `prebuild`, so the displayed
  price and the charged price cannot drift apart. Edit the content JSON, not the
  generated file. It is committed so deploys work without a local build.
- **`PUBLIC_PAGOS_ONLINE` gates the button, and it is now `"true"` in Vercel.** The
  four parts with `precio_ars` charge through Mercado Pago; anything without it, or with
  `disponible: false`, still sells over WhatsApp. Read at *build* time, so changing it
  needs a redeploy, not just an env edit. The name must be exactly this: Astro only
  injects `PUBLIC_`-prefixed vars, and the code compares against the literal string
  `"true"`. Vercel refuses to mark a `PUBLIC_` var *Sensitive* — that combination is a
  contradiction, and the fix is to drop *Sensitive*, never the prefix.
- **`MP_ACCESS_TOKEN` is the key to the till** — Vercel env var only, never the repo,
  never the front end. `PUBLIC_`-prefixed vars are visible in the HTML: that prefix is
  for the on/off switch, never for a secret.
- **Webhook signature format matters and fails silently.** MP signs
  `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` where `data.id` comes from the URL
  query, not the body. Get it wrong and every legitimate payment is rejected with 401
  while nothing errors. `api/mp-webhook.js` has it right; the SaaS repo's Supabase
  Edge Function does **not** (it builds `id:<x-request-id>;request-date:<ts>;`) and
  must be fixed before charging there.
- **Account ownership (corrected 2026-09-01):** the MP account is **Edgardo's**, opened
  in his own name. This file previously said it was Alejandro's — that was wrong, and
  acting on it would send someone to the wrong account for credentials. Parts sold on the
  site are collected in Edgardo's account and reported under his CUIT. He loads the
  credentials into Vercel himself — do not ask for, store, or paste an Access Token
  anywhere in this repo.
- **Saving the webhook config regenerates the secret.** This cost an afternoon of 401s
  and is written nowhere in MP's docs. Every press of *Guardar* in Webhooks → Configurar
  notificaciones issues a new secret and discards the old one, so a key copied *before*
  that save is dead the moment it is pasted. Copy the key and leave without saving. The
  symptom is indistinguishable from having copied the key of the wrong mode: 401 on every
  notification, nothing logged anywhere. Suspect the key before the code — the manifest in
  `api/mp-webhook.js` is verified correct against the official template.
- **Test credentials exist; only the panel button is broken.** The web panel fails with
  "Algo salió mal" when activating sandbox credentials, but the `TEST-` access token and
  public key are issued and readable over the API — the Mercado Pago MCP server
  (`.mcp.json`, OAuth) returns them. A test user already exists: **3655965507**
  (`TESTUSER3476911726754698730`, MLA, buyer), password revealed at
  `/developers/panel/app/1426858103774532/test-users`.
- **Never validate a payment change by paying again.** It was done once, on 2026-09-01,
  only because the panel hid the sandbox credentials: a $5.000 part paid from another
  person's account. Worth knowing what a sale actually costs — MP took $215,15 (4,3%),
  tax withholding another $240, and the money is released ~18 days later, not on the
  spot. Use the test user above instead.
- **There is no stock control.** `disponible: false` in the content JSON blocks a
  purchase, but nothing sets it automatically. If the last unit sells and someone pays,
  the money has to be refunded by hand.
- **A sale notifies nobody.** The webhook logs it to Vercel and that is all — no email,
  no WhatsApp. Someone buying on a Sunday night goes unnoticed until the panel is opened.
  This is the most serious gap in the system now that the site charges for real.

## Architecture

**Stack:** Astro 7, static output (`output: "static"` in `astro.config.mjs`), zero UI
framework (no React/Vue/etc.), plain CSS (no Tailwind). Integrations: `@astrojs/mdx`,
`@astrojs/sitemap`.

**Content model** (`src/content.config.ts`, Zod-typed collections loaded from
`src/content/`):
- `repuestos` — JSON files, one per spare part (nombre, codigo, marca, precio_usd,
  precio_ars, imagen, disponible, modelos_compatibles[], sintomas[], descripcion,
  guia_instalacion_slug, whatsapp_mensaje). Rendered via `ProductCard.astro` and
  `src/pages/repuestos/[slug].astro`. **`precio_ars` is what gets charged** — it is
  the only price the payment flow will use (see Payments below), and a part without
  it stays WhatsApp-only.
- `diagnostico` — Markdown troubleshooting guides (title, description, fecha,
  categoria, repuestos_relacionados[] optional). This is the site's main
  differentiator/SEO asset — homepage surfaces it prominently, not as an
  afterthought.
- `instalacion` — Markdown step-by-step install guides, same shape plus an optional
  `repuesto_slug` linking back to a part.

**Palette (changed 2026-07-22):** the theme is now "Acero" — a cool neutral
(`#eaeef2` ground, `#101a24` dark blocks), replacing the previous warm cream/espresso.
The orange stays: it's the brand's fire. Three orange tokens exist for contrast
reasons, and picking the wrong one silently fails WCAG: `--color-orange` (brand, icons
and fills where nothing sits on top), `--color-orange-solid` (button fills, 4.6:1 with
white text), `--color-orange-ink` (small text on light grounds), plus
`--color-orange-light` for text on the dark blocks. Transparencies use the
`--rgb-*` components (`--rgb-ink`, `--rgb-inverse`, `--rgb-orange`, `--rgb-bg`) rather
than hardcoded channels. `public/images/repuestos/placeholder.svg` is static and does
NOT read tokens — update it by hand on any palette change.

**Design system:** a single `src/styles/global.css` (~2900 lines) defines everything
via CSS custom properties in `:root` — colors, typography (`Inter` body /
`Outfit` heading), spacing, radius, shadows, transitions. Current theme is a warm
light palette: `--color-bg-primary` (warm off-white), `--color-primary` (deep blue,
used for trust/navigation/links), `--color-accent` (terracotta orange, used for
CTAs/thermal branding). Changing the theme should be done by editing these root
variables, not by touching individual component styles — nearly every class
consumes tokens rather than hardcoding colors (the few historical hardcoded-color
exceptions, e.g. header backdrop blur and hero glow, are called out inline in the
CSS near where they occur).

**Components** (`src/components/`) are small and mostly presentational:
`Header`/`Footer`/`WhatsAppFloat` wrap every page via `BaseLayout.astro`.
`WhatsAppButton` and `PriceDisplay` (fetches blue-dollar rate client-side from
`dolarapi.com`) are used on product pages. `SchemaMarkup.astro` emits JSON-LD
(product/article/local-business/breadcrumb) — pass `type` + `data`.
`CredibilityStrip.astro` is a reusable stat band (icon/number/label) used on both
the homepage and `/nosotros`. `Icon.astro` holds the site's inline SVG icons
(stroke-based, `currentColor`) — use it instead of emoji, which render differently
per platform and don't inherit text color.

**Motion:** `[data-reveal]` + the IntersectionObserver in `BaseLayout.astro` drive
section reveals. Keep the transition at ~300ms and the offset small: at 700ms/26px
sections were still fading in while being read. The 2.5s fallback timer that reveals
everything is deliberate — without it, a renderer that never scrolls (a crawler, a
preview service) captures the page with its sections invisible.

**Audience (decided 2026-07-22):** the site is being repositioned toward the
professional installer — gasistas first, then sanitaristas and constructores. The
product being sold is Edgardo's advice; spare parts and the SaaS follow from it. See
`docs/plan-ux-2026.md` for the full plan and phase status.

**Language norm — read `docs/norma-lenguaje.md` before writing any user-facing copy.**
It is Edgardo's own criterion (2026-08-02) and overrides anything the older docs say.
The short version, in Spanish because that is what ships: readers are *treated as*
professionals but never *called* "profesionales" — they are named by their trade (el
gasista, el electricista, el calefaccionista). Never count "oficios" or write "gente de
oficio"; "oficio" is only valid as a quality ("20 años de oficio"), never as a label for
people. Never oppose site-work to academia ("nace del oficio, no de la academia") — the
product is thermal calculation, which comes from exactly that. Talking about training
and capacitación *is* allowed: what degrades is a classroom tone, not the word. The
section formerly at `/oficio` is now `/criterio` (301 in `vercel.json`).

**Narrative content — he supplies the facts, you write the piece. This is not a
style preference; it is the division of labour, and getting it wrong has cost
three rewrites so far.** Edgardo is not a writer and does not claim to be. When
he recounts an obra, he is handing over *raw material*: what happened, in the
order he happened to remember it, in the words that came out. **A draft that
follows his message beat by beat — same order, same phrasing, cleaned up — is a
transcription, and it is a failure of the job.** He notices instantly and says
so.

Write it as a piece of prose would be written: choose the entry point (rarely the
chronological start), decide what to withhold and when to reveal it, cut the
beats that carry no weight, and give it rhythm — short sentences where the turns
are. Aim at the standard of a well-told short story, not a tidy report.

**What may never change:** the technical facts, the numbers, and who did what.
**What may never be added:** detail he did not give — weather, province, dialogue,
how many people, what anyone felt. Invented colour is the other recurring failure
(see the skill `criterio-termico-obra`), and it is *more* tempting in narrative,
where it reads as craft. Naming what is unknown ("quién sabe cuándo, quién sabe
por quién") is legitimate; inventing it is not.

**Business config:** `src/config/site.ts` holds WhatsApp number, address, hours,
etc. `siteConfig.whatsapp` (Edgardo), `siteConfig.whatsappAlejandro` and
`siteConfig.email` (the domain's own Zoho mailbox) are real — they are published on
the live site. Don't replace them with invented values. The address is a **single
source of truth**: it feeds the footer (three places), the homepage strip, and — via
`SchemaMarkup` — the `PostalAddress` that Google reads. The schema splits it into
`streetAddress` / `addressLocality` / `addressRegion` / `postalCode` by hand, so
those five fields must be changed together with `siteConfig.direccion`.

**Images:** plain `<img src="/path">` strings, no `astro:assets` integration.
Convention: `public/images/home/` for homepage-only imagery, `public/images/nosotros/`
for the about page, `public/images/repuestos/` for product photos (falls back to
`placeholder.svg` when a part has no real photo yet — keep this SVG in sync with the
current theme tokens if the palette changes again, since it's static markup, not
theme-aware). `scripts/generate-image.sh` is a reusable FLUX (BFL API) generator —
`./scripts/generate-image.sh <model-path> <dimspec> <output-file> <prompt-file>`,
requires `BFL_API_KEY` in the environment. For `flux-pro-1.1-ultra`, `<dimspec>` is
an aspect ratio like `"4:3"` (uses `raw: true` for a candid/photographic feel); for
other models it's `WIDTHxHEIGHT` in pixels. AI-generated photos on this site
deliberately avoid rendering brand names/logos/legible text in the prompt (FLUX text
rendering is unreliable and a garbled fake logo reads worse than a clean generic
shot).
