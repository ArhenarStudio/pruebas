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

### Iteration 3 (2026-06) — Sorthea Studio "Visual Order v2" (tested 100%: backend 5/5, frontend 51/51)
- Full editor redesign: 3 zones — TOP BAR (Sorthea green, device toggle, undo/redo, Vista previa, Publicar), LEFT structure tree (~240px), CENTER dark rifa/sorteo storefront (LotoCorp), RIGHT contextual inspector (~360px). Spanish UI.
- **Visual Order principle**: inspector row order mirrors site left→right; click canvas element ↔ highlight inspector row (bidirectional sync); empty state "Selecciona un elemento en el lienzo".
- **Header Visual Order inspector**: Logo row (mode/position/center/size/X-Y/verified), Navigation rows (drag reorder, per-link normal/hover/active colors, capacity rules: ≤5@14px, 6+ auto-shrink to 11px min, amber overflow warning, block 8th "Límite alcanzado", fit meter), Action rows (button/icon/icon-badge, presets Comprar/Cuenta/Carrito/Pagos, max 3 desktop/2 mobile), Header shell accordion (height/sticky/shadow/pill/background engine).
- **Responsive**: device toggle affects canvas + inspector; mobile hamburger, icon-only actions, "Móvil: iconos" badge, long-label warnings.
- **Undo/redo** history; rifa storefront (sorteos/ganadores/cómo participar); backend API contract unchanged.

## Remaining backlog
- P2: real sorteo catalog CRUD, publish versioning.

### Iteration 4 (2026-06) — Premium: Temas, Bloques, Colores por anuncio, Tipografía (tested 100%: backend 5/5, frontend 49/49)
- **Temas guardados globales**: 6 presets (Esmeralda/Medianoche/Oro Real/Rubí/Marfil/Violeta) que cambian anuncio+header+footer+acento+fuentes en UN clic (via `applyPatch`, deshacer en un paso).
- **Banco de bloques**: presets por componente (Barra de anuncios, Encabezado, Pie de página) con swatch de vista previa, aplican fondo/estilo al instante.
- **Colores por anuncio**: cada mensaje puede tener su propio fondo/texto que se muestra al rotar (no-marquee).
- **Editor de tipografía global**: selector de fuente de títulos y de texto (9 fuentes), color de acento y redondeo global.
- Nuevo `applyPatch` en ConfigContext (deep-merge multi-sección, un solo commit de historial). Items de árbol: Tema, Bloques.

## Next Tasks
- Await user feedback; consider auth + image upload if user wants production readiness.
