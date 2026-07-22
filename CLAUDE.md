# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Criterio Térmico is a static marketing/catalog site (Astro 7) for a solo technician
with 20+ years of experience repairing and installing Peisa gas boilers, based in
Villa Urquiza, CABA, Argentina. The business can't compete with larger retailers on
parts inventory (only 4 SKUs today) — the site's strategy is to lead with the
owner's technical authority and diagnostic content rather than catalog breadth.

## Commands

```sh
npm run dev       # Start dev server at localhost:4321
npm run build     # Build static site to ./dist/
npm run preview   # Preview the production build locally
npm run astro ...  # Run Astro CLI commands (e.g. astro add, astro check)
```

No test suite or linter is configured. Verify changes by running `npm run build`
(catches content-collection/schema errors) and visually checking pages with the dev
server — this project has no component framework, so most bugs are visual/CSS or
content-schema mismatches, not logic bugs.

## Architecture

**Stack:** Astro 7, static output (`output: "static"` in `astro.config.mjs`), zero UI
framework (no React/Vue/etc.), plain CSS (no Tailwind). Integrations: `@astrojs/mdx`,
`@astrojs/sitemap`.

**Content model** (`src/content.config.ts`, Zod-typed collections loaded from
`src/content/`):
- `repuestos` — JSON files, one per spare part (nombre, codigo, marca, precio_usd,
  imagen, disponible, modelos_compatibles[], sintomas[], descripcion,
  guia_instalacion_slug, whatsapp_mensaje). Rendered via `ProductCard.astro` and
  `src/pages/repuestos/[slug].astro`.
- `diagnostico` — Markdown troubleshooting guides (title, description, fecha,
  categoria, repuestos_relacionados[] optional). This is the site's main
  differentiator/SEO asset — homepage surfaces it prominently, not as an
  afterthought.
- `instalacion` — Markdown step-by-step install guides, same shape plus an optional
  `repuesto_slug` linking back to a part.

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

**Business config:** `src/config/site.ts` holds WhatsApp number, address, hours,
etc. `siteConfig.whatsapp` (Edgardo) and `siteConfig.whatsappAlejandro` are real
numbers — they are published on the live site. Don't replace them with invented values.

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
