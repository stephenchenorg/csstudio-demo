# Design Notes — Minion (Astro clone)

This project is an Astro (starter.astro) re-build of the **Minion** Shopify theme
demo by Softali — a playful, pastel cat-food storefront.

- **Source demo:** https://minion-theme.myshopify.com/
- **Theme store:** https://themes.shopify.com/themes/minion/presets/minion

## Design tokens (`src/styles/index.css`)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary-500` | `#009688` (teal) | Brand accent, buttons, prices, eyebrows |
| `--color-navy` | `#142c73` | Body text & dark sections |
| `--color-mint` | `#ddf1f0` | Pastel section background |
| `--color-sky` | `#deefff` | Pastel section background |
| `--color-pink` | `#ffcfdb` | Pastel section background |
| `--color-cream` | `#fff3b3` | Pastel section background |
| `--color-cloud` | `#f6f7fa` | Secondary background |
| `--color-sale` | `#d20404` | Sale badge / compare-at price |
| Font | **Figtree** (400–900) | Headings & body |
| Container | max-width `1360px` | Page width |
| Radius | button/input `8px`, cards `12px` | — |
| Shadow | `0 4px 20px rgba(22,19,69,.13)` | Card elevation |

## Structure

- `src/data/home.ts` — all homepage content (products, reviews, FAQs, brands,
  features, stats, blog) as typed data.
- `src/components/ui/` — `Button`, `StarRating`, `SectionHeading`, `ProductCard`.
- `src/components/home/` — the 20 homepage sections, composed in `src/pages/index.astro`.
- `src/layouts/partials/` — `Header` (announcement bar + sticky nav + mobile menu)
  and `Footer`.
- `public/images/` — assets downloaded from the demo store.

All sections are pure Astro (zero client JS) for SEO; the FAQ uses native
`<details>` and the mobile menu / dropdowns use CSS only.
