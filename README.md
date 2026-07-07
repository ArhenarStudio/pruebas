# Sitecraft CMS — Sorthea Studio (Visual Order v2)

**Visual Order v2 — inspector mirrors site left-to-right.**

A visual CMS for a rifa/sorteo storefront (LotoCorp demo). The editor follows one rule everywhere: what is higher in the inspector list appears more to the left / earlier on the live site, and what you click on the canvas is highlighted in the inspector.

## Layout
- **Top bar**: Sorthea Studio branding, device toggle (desktop/tablet/mobile), undo/redo, Vista previa, Publicar. Sorthea green palette (`#3FC16F` primary, `#0B1510` text, `#F7F9F8` bg).
- **Left (~240px)**: page structure tree — Barra de Anuncios, Encabezado, Menú, Secciones, Pie de página. Click to select; sections reorder by drag.
- **Center**: live dark rifero storefront preview.
- **Right (~360px)**: contextual Visual Order inspector for the selected element.

## Header inspector (Visual Order)
Single vertical ordered list mirroring left→right on the header bar:
1. **Logo** — mode (imagen/texto/ambos), position (dentro/sobresale), size, X/Y offset, verified badge + icon, center toggle.
2. **Navigation links** — one row each (drag to reorder = header order), per-link normal/hover/active colors. Capacity rules: comfortable ≤5 @14px; 6+ auto-shrinks font to min 11px; amber warning on overflow; blocks the 8th with "Límite alcanzado"; live fit meter (green/amber/red).
3. **Action buttons** — sub-list (button/icon/icon+badge), presets Comprar/Mi cuenta/Carrito/Pagos, max 3 desktop / 2 mobile, mobile label warning.
4. **Header shell** (collapsed) — height, sticky, shadow, pill, background engine.

## Responsive
Breakpoint toggle affects canvas + inspector. Mobile: nav collapses to hamburger, actions become icons ("Móvil: iconos" badge), long labels warned.

## Stack
React + FastAPI + MongoDB. Config persisted at `GET/PUT /api/config`, defaults via `POST /api/config/reset`. Routes: `/` builder, `/store` live storefront.
