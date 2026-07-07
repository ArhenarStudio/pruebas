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
- Config API (GET/PUT/reset) — tested 5/5.
- CMS builder with live preview, section pills, device toggle, dirty badge, publish/discard/reset.
- Editors: announcement, header (logo/nav/layout/colors/icons), sticky header (pill/bar, scroll threshold, blur), footer (columns/socials/copyright), cart (labels/accent/free-shipping/images).
- Storefront `/store` renders saved config; cart drawer add/inc/dec/remove/subtotal + free-shipping progress; announcement dismiss; sticky pill on scroll.
- Verified end-to-end by testing agent: backend 100%, frontend 100%.

## Backlog
- P1: Persist cart to backend; multiple pages/sections; drag-reorder nav & footer columns.
- P2: Auth for admin; image upload for logo/products; theme presets; publish history/versioning.
- P2: Real product catalog CRUD in CMS.

## Next Tasks
- Await user feedback; consider auth + image upload if user wants production readiness.
