# PRD — Sitecraft CMS (Storefront Builder)

## Original Problem Statement
"create a cms to my site builder, annucement bar, header, sticky header, sticky header pill, footer, cart, etc."

## User Choices
- Visual editor with live preview + settings panel
- Manage all components: Announcement bar, Header, Sticky header (+pill), Footer, Cart
- No authentication
- Include a live storefront that renders managed components
- Design decided by agent → Swiss high-contrast light theme (Outfit + Inter)

## Architecture
- **Backend (FastAPI + MongoDB)**: Single config document (`_id="site"`) in `site_config` collection.
  - `GET /api/config` (creates default on first call), `PUT /api/config`, `POST /api/config/reset`
- **Frontend (React + Tailwind + shadcn)**:
  - `ConfigContext` holds live `config` (preview) and `savedConfig` (published), dirty tracking, save/reset/discard.
  - `/` → Builder: top bar (device toggle, view store, reset, discard, publish), left settings sidebar with 5 section editors, right live-preview canvas (browser frame).
  - `/store` → live storefront rendering `savedConfig`.
  - Shared storefront components: AnnouncementBar, StoreHeader, StickyPill, StoreFooter, CartDrawer, Storefront (hero + product grid + cart state).

## User Personas
- Store owner / marketer configuring their storefront chrome without code.

## Implemented (2026-06)
- Config API (GET/PUT/reset) — tested.
- CMS builder with live preview, section pills, device toggle, dirty badge, publish/discard/reset.
- Editors: announcement, header, sticky header, footer, cart.
- Storefront `/store` renders saved config; cart drawer; announcement dismiss; sticky pill on scroll.

### Iteration 2 (2026-06) — Interactive builder + banks (tested 100% backend & frontend)
- **Interactive preview**: click any component in the preview to select it — blue selection outline + labeled badge, auto-opens that component's editor (announcement/header/footer/sticky).
- **Rich announcement bar**: multiple announcements (add/reorder/remove), each with own text + link; transitions Slide/Fade/Marquee/None + auto-rotate interval; height (padding) control.
- **Background system (reusable)**: Solid / Gradient (from-to + angle + presets) / Pattern bank (dots, grid, diagonal, crosshatch, stripes, zigzag) + Emoji-pattern with opacity/scale. Applied to announcement bar & header.
- **Link state banks (header nav)**: hover-animation bank (underline/scale/slide-up/glow/highlight), border bank (box/pill/bottom), hover color, per-link emoji/icons.
- **Size controls**: height (padding) sliders for announcement bar and header.

## Backlog
- P1: Apply background system + size controls to footer & sticky pill; drag-reorder nav/footer.
- P2: Reusable block/component bank & saved presets; per-announcement background/colors.
- P2: Auth for admin; image upload; product catalog CRUD; publish versioning.

## Next Tasks
- Await user feedback; consider auth + image upload if user wants production readiness.
