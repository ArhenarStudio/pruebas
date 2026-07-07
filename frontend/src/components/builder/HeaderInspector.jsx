import React, { useEffect, useRef, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { Label, TextInput, ColorInput, SliderRow, SwitchRow, Segmented, FitMeter, RowCard, useDnd, move, EmojiInput, ColorStates, BackgroundEngine, cx } from "./ui";
import { navStatus, navFontSize, actionMax, NAV_MAX, MOBILE_LABEL_MAX } from "@/lib/headerFit";
import { Plus, Trash2, ChevronDown, AlertTriangle, Image, Layers, Menu, MousePointerClick, GripVertical, Ticket, User, ShoppingCart, CreditCard } from "lucide-react";

const ACTION_PRESETS = [
  { key: "comprar", label: "Comprar", icon: "ticket", type: "button", bg: "#3FC16F", color: "#062012", Icon: Ticket },
  { key: "cuenta", label: "Mi cuenta", icon: "user", type: "icon", bg: "transparent", color: "#EAF2EC", Icon: User },
  { key: "carrito", label: "Carrito", icon: "cart", type: "icon-badge", bg: "transparent", color: "#EAF2EC", Icon: ShoppingCart },
  { key: "pagos", label: "Pagos", icon: "pay", type: "button", bg: "#122018", color: "#EAF2EC", Icon: CreditCard },
];

const BLOCK_META = {
  logo: { title: "Logo", Icon: Image },
  nav: { title: "Navegación", Icon: Menu },
  actions: { title: "Botones de acción", Icon: MousePointerClick },
};

const posLabel = (idx, total) => (idx === 0 ? "Izquierda" : idx === total - 1 ? "Derecha" : "Centro");

export const HeaderInspector = ({ device, sel, onSelect }) => {
  const { config, updateSection } = useConfig();
  const h = config.header;
  const setH = (patch) => updateSection("header", patch);
  const setLogo = (patch) => setH({ logo: { ...h.logo, ...patch } });
  const setShell = (patch) => setH({ shell: { ...h.shell, ...patch } });
  const setNav = (nav) => setH({ navLinks: nav });
  const setActions = (a) => setH({ actions: a });

  const order = (h.blockOrder && h.blockOrder.length ? h.blockOrder : ["logo", "nav", "actions"]);
  const blockDnd = useDnd((from, to) => setH({ blockOrder: move(order, from, to) }));

  const navCount = h.navLinks.length;
  const status = navStatus(navCount);
  const fontNow = navFontSize(navCount, device);
  const actCount = h.actions.length;
  const aMax = actionMax(device);
  const navDnd = useDnd((from, to) => setNav(move(h.navLinks, from, to)));
  const actDnd = useDnd((from, to) => setActions(move(h.actions, from, to)));

  const [shellOpen, setShellOpen] = useState(false);
  const rowRefs = useRef({});
  useEffect(() => {
    if (!sel?.element) return;
    const el = rowRefs.current[sel.element];
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); el.classList.remove("row-flash"); void el.offsetWidth; el.classList.add("row-flash"); }
  }, [sel]);
  const setRef = (el) => (node) => { if (node) rowRefs.current[el] = node; };

  const addLink = () => { if (navCount >= NAV_MAX) return; setNav([...h.navLinks, { label: "Nuevo", href: "#", normalColor: "#EAF2EC", hoverColor: "#3FC16F", activeColor: "#3FC16F" }]); };
  const removeLink = (i) => setNav(h.navLinks.filter((_, idx) => idx !== i));
  const updateLink = (i, patch) => setNav(h.navLinks.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const addPreset = (p) => { if (actCount >= 3) return; setActions([...h.actions, { type: p.type, preset: p.key, label: p.label, href: "#", bg: p.bg, color: p.color, icon: p.icon }]); };
  const removeAction = (i) => setActions(h.actions.filter((_, idx) => idx !== i));
  const updateAction = (i, patch) => setActions(h.actions.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));

  const LogoBody = (
    <div ref={setRef("logo")}>
      {sel?.element === "logo" && (
        <div className="mt-3 space-y-3">
          <Segmented value={h.logo.mode} onChange={(v) => setLogo({ mode: v })} testid="logo-mode" cols={3}
            options={[{ value: "image", label: "Imagen" }, { value: "text", label: "Texto" }, { value: "image-text", label: "Ambos" }]} />
          {(h.logo.mode === "text" || h.logo.mode === "image-text") && <TextInput value={h.logo.text} onChange={(v) => setLogo({ text: v })} placeholder="Nombre marca" testid="logo-text" />}
          {(h.logo.mode === "image" || h.logo.mode === "image-text") && <TextInput value={h.logo.image} onChange={(v) => setLogo({ image: v })} placeholder="URL de imagen" testid="logo-image" />}
          <Segmented value={h.logo.position} onChange={(v) => setLogo({ position: v })} testid="logo-position" options={[{ value: "inside", label: "Dentro" }, { value: "outside", label: "Sobresale" }]} />
          <SwitchRow label="Centrar logo" checked={h.logo.center} onChange={(v) => setLogo({ center: v })} testid="logo-center" />
          <SliderRow label="Tamaño" value={h.logo.size} min={14} max={44} suffix="px" onChange={(v) => setLogo({ size: v })} testid="logo-size" />
          <div className="grid grid-cols-2 gap-2">
            <SliderRow label="Ajuste X" value={h.logo.offsetX} min={-40} max={40} suffix="px" onChange={(v) => setLogo({ offsetX: v })} testid="logo-x" />
            <SliderRow label="Ajuste Y" value={h.logo.offsetY} min={-20} max={20} suffix="px" onChange={(v) => setLogo({ offsetY: v })} testid="logo-y" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1"><SwitchRow label="Insignia verificado" checked={h.logo.verified} onChange={(v) => setLogo({ verified: v })} testid="logo-verified" /></div>
            {h.logo.verified && <div className="w-20"><EmojiInput value={h.logo.verifiedIcon === "check" ? "✔️" : h.logo.verifiedIcon} onChange={(v) => setLogo({ verifiedIcon: v })} testid="logo-verified-icon" /></div>}
          </div>
        </div>
      )}
    </div>
  );

  const NavBody = (
    <div className="mt-2.5 space-y-2.5">
      <div className="flex items-center justify-between"><span className="text-[11px] text-[#6B7A70]">Enlaces</span><div className="w-24"><FitMeter status={status} count={navCount} max={NAV_MAX} /></div></div>
      {navCount >= 6 && (
        <div className={cx("flex items-start gap-2 rounded-lg px-3 py-2 text-[11px] font-medium", navCount >= NAV_MAX ? "bg-[#FDECEC] text-[#C4362F]" : "bg-[#FFF6E5] text-[#8A6300]")} data-testid="nav-capacity-warning">
          <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />{navCount >= NAV_MAX ? "Límite alcanzado" : "No caben más enlaces en desktop — quita uno o acorta el texto"}
        </div>
      )}
      {navCount > 5 && navCount < NAV_MAX && <p className="text-[10px] text-[#6B7A70]">Fuente reducida a {fontNow}px para que quepan.</p>}
      {h.navLinks.map((l, i) => (
        <RowCard key={i} testid={`hdr-row-nav-${i}`} active={sel?.element === `nav-${i}`} rowRef={setRef(`nav-${i}`)} onClick={() => onSelect?.("header", `nav-${i}`)} dragHandleProps={navDnd.handleProps(i)}>
          <div {...navDnd.rowProps(i)}>
            <div className="flex items-center gap-2">
              <TextInput value={l.label} onChange={(v) => updateLink(i, { label: v })} placeholder="Etiqueta" testid={`nav-label-${i}`} className="flex-1" />
              <button onClick={(e) => { e.stopPropagation(); removeLink(i); }} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#E3E9E5] text-[#B7C2BA] hover:border-[#E5484D] hover:text-[#E5484D]" data-testid={`nav-remove-${i}`}><Trash2 size={14} /></button>
            </div>
            {sel?.element === `nav-${i}` && (
              <div className="mt-2.5 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                <TextInput value={l.href} onChange={(v) => updateLink(i, { href: v })} placeholder="URL" testid={`nav-href-${i}`} />
                <ColorStates link={l} onChange={(patch) => updateLink(i, patch)} testidPrefix={`nav-colors-${i}`} />
              </div>
            )}
          </div>
        </RowCard>
      ))}
      <button onClick={addLink} disabled={navCount >= NAV_MAX} data-testid="nav-add" className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#CBD6CF] py-2.5 text-xs font-semibold text-[#4B5A50] transition-colors hover:bg-[#F1F5F2] disabled:opacity-40"><Plus size={14} /> Agregar enlace</button>
    </div>
  );

  const ActionsBody = (
    <div className="mt-2.5 space-y-2.5">
      <div className="flex items-center justify-between"><span className="text-[11px] text-[#6B7A70]">Acciones</span><span className="text-[11px] font-semibold text-[#6B7A70]" data-testid="action-count">{actCount}/{aMax}</span></div>
      {actCount > aMax && (
        <div className="flex items-start gap-2 rounded-lg bg-[#FFF6E5] px-3 py-2 text-[11px] font-medium text-[#8A6300]" data-testid="action-capacity-warning"><AlertTriangle size={13} className="mt-0.5" /> {device === "mobile" ? "Máx 2 acciones en móvil" : "Máx 3 acciones en desktop"}</div>
      )}
      {h.actions.map((a, i) => {
        const labelTooLong = device === "mobile" && (a.label || "").length > MOBILE_LABEL_MAX;
        return (
          <RowCard key={i} testid={`hdr-row-action-${i}`} active={sel?.element === `action-${i}`} rowRef={setRef(`action-${i}`)} onClick={() => onSelect?.("header", `action-${i}`)} dragHandleProps={actDnd.handleProps(i)}>
            <div {...actDnd.rowProps(i)}>
              <div className="flex items-center gap-2">
                <TextInput value={a.label} onChange={(v) => updateAction(i, { label: v })} placeholder="Etiqueta" testid={`action-label-${i}`} className="flex-1" />
                <button onClick={(e) => { e.stopPropagation(); removeAction(i); }} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#E3E9E5] text-[#B7C2BA] hover:border-[#E5484D] hover:text-[#E5484D]" data-testid={`action-remove-${i}`}><Trash2 size={14} /></button>
              </div>
              {device === "mobile" && <span className="mt-1.5 inline-block rounded-full bg-[#EAF2EC] px-2 py-0.5 text-[10px] font-semibold text-[#4B5A50]" data-testid={`action-mobile-badge-${i}`}>Móvil: iconos</span>}
              {labelTooLong && <p className="mt-1 text-[10px] font-medium text-[#C4362F]" data-testid={`action-label-warning-${i}`}>Etiqueta larga para móvil (máx 8)</p>}
              {sel?.element === `action-${i}` && (
                <div className="mt-2.5 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                  <Segmented value={a.type} onChange={(v) => updateAction(i, { type: v })} testid={`action-type-${i}`} cols={3} options={[{ value: "button", label: "Botón" }, { value: "icon", label: "Icono" }, { value: "icon-badge", label: "Badge" }]} />
                  <TextInput value={a.href} onChange={(v) => updateAction(i, { href: v })} placeholder="URL" testid={`action-href-${i}`} />
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>Fondo</Label><ColorInput value={a.bg} onChange={(v) => updateAction(i, { bg: v })} testid={`action-bg-${i}`} /></div>
                    <div><Label>Texto</Label><ColorInput value={a.color} onChange={(v) => updateAction(i, { color: v })} testid={`action-color-${i}`} /></div>
                  </div>
                  <div><Label>Icono</Label><EmojiInput value={a.icon} onChange={(v) => updateAction(i, { icon: v })} testid={`action-icon-${i}`} /></div>
                </div>
              )}
            </div>
          </RowCard>
        );
      })}
      <div className="flex flex-wrap gap-1.5" data-testid="action-presets">
        {ACTION_PRESETS.map((p) => (
          <button key={p.key} onClick={() => addPreset(p)} disabled={actCount >= 3} data-testid={`action-preset-${p.key}`} className="inline-flex items-center gap-1.5 rounded-full border border-[#E3E9E5] px-3 py-1.5 text-xs font-semibold text-[#4B5A50] transition-colors hover:border-[#3FC16F] hover:bg-[#EAF7EF] disabled:opacity-40"><p.Icon size={13} /> {p.label}</button>
        ))}
      </div>
    </div>
  );

  const BODIES = { logo: LogoBody, nav: NavBody, actions: ActionsBody };

  return (
    <div className="space-y-2.5" data-testid="header-inspector">
      <p className="px-1 text-[11px] text-[#6B7A70]">Arrastra los bloques para cambiar su posición en el header.</p>

      {order.map((id, idx) => {
        const meta = BLOCK_META[id];
        if (!meta) return null;
        const isLogoActive = id === "logo" && sel?.element === "logo";
        return (
          <div key={id} className={cx("overflow-hidden rounded-xl border bg-white", isLogoActive ? "border-[#3FC16F] ring-1 ring-[#3FC16F]" : "border-[#E3E9E5]")} data-testid={`hdr-block-${id}`}>
            <div {...blockDnd.rowProps(idx)} onClick={() => id === "logo" && onSelect?.("header", "logo")}
              className="flex items-center justify-between bg-[#F7F9F8] px-2.5 py-2">
              <div className="flex items-center gap-1.5">
                <span {...blockDnd.handleProps(idx)} className="flex cursor-grab items-center text-[#B7C2BA] active:cursor-grabbing" data-testid={`block-drag-${id}`} title="Arrastra para reordenar"><GripVertical size={15} /></span>
                <meta.Icon size={14} className="text-[#3FC16F]" />
                <span className="text-sm font-bold text-[#0B1510]">{meta.title}</span>
              </div>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8B978E]">{idx + 1}º · {posLabel(idx, order.length)}</span>
            </div>
            <div className="px-3 pb-3">{BODIES[id]}</div>
          </div>
        );
      })}

      {/* HEADER SHELL — collapsed accordion (no reordenable) */}
      <div className="rounded-xl border border-[#E3E9E5] bg-white" data-testid="hdr-row-shell" ref={setRef("shell")}>
        <button onClick={() => setShellOpen((o) => !o)} className="flex w-full items-center justify-between px-3 py-2.5" data-testid="shell-toggle">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-[#0B1510]"><Layers size={14} className="text-[#3FC16F]" /> Contenedor del header</span>
          <ChevronDown size={16} className={cx("text-[#6B7A70] transition-transform", shellOpen && "rotate-180")} />
        </button>
        {shellOpen && (
          <div className="space-y-3 border-t border-[#E3E9E5] p-3">
            <SliderRow label="Alto (padding)" value={h.shell.paddingY} min={6} max={40} suffix="px" onChange={(v) => setShell({ paddingY: v })} testid="shell-padding" />
            <SwitchRow label="Fijo al hacer scroll" checked={h.shell.sticky} onChange={(v) => setShell({ sticky: v })} testid="shell-sticky" />
            <SwitchRow label="Sombra" checked={h.shell.shadow} onChange={(v) => setShell({ shadow: v })} testid="shell-shadow" />
            <SwitchRow label="Modo píldora" checked={h.shell.pill} onChange={(v) => setShell({ pill: v })} testid="shell-pill" />
            <div><Label>Color de texto</Label><ColorInput value={h.shell.textColor} onChange={(v) => setShell({ textColor: v })} testid="shell-textcolor" /></div>
            <div><Label>Fondo</Label><BackgroundEngine value={h.shell.background} onChange={(v) => setShell({ background: v })} testidPrefix="shell-bg" /></div>
          </div>
        )}
      </div>
    </div>
  );
};
