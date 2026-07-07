import React from "react";
import { Menu, Search, ShoppingCart, User, Ticket, CreditCard, HelpCircle, BadgeCheck } from "lucide-react";
import { backgroundStyle } from "@/lib/appearance";
import { navFontSize, actionMax } from "@/lib/headerFit";

const ICONS = { cart: ShoppingCart, user: User, ticket: Ticket, pay: CreditCard, help: HelpCircle };

const ActionIcon = ({ name, size = 18 }) => {
  const I = ICONS[name];
  if (I) return <I size={size} strokeWidth={1.7} />;
  if (name) return <span style={{ fontSize: size }}>{name}</span>;
  return <ShoppingCart size={size} strokeWidth={1.7} />;
};

export const StoreHeader = ({ config, cartCount = 0, onCartClick, editable, sel, onSelect, device = "desktop" }) => {
  const shell = config.shell || {};
  const logo = config.logo || {};
  const nav = config.navLinks || [];
  const actions = (config.actions || []).slice(0, actionMax(device));
  const isMobile = device === "mobile";
  const navSize = navFontSize(nav.length, device);

  const cx = (el, base = "") => {
    const selected = editable && sel?.section === "header" && sel?.element === el;
    return `${base} ${editable ? "sel-hover" : ""} ${selected ? "sel-el" : ""}`;
  };
  const pick = (el) => (editable ? { onClick: (e) => { e.stopPropagation(); onSelect?.("header", el); }, "data-testid": `store-${el}` } : {});

  const bgStyle = backgroundStyle(shell.background, "#0B1510");
  const pad = shell.paddingY ?? 16;

  const LogoEl = (
    <div {...pick("logo")} className={cx("logo", "flex items-center gap-2")} style={{ transform: `translate(${logo.offsetX || 0}px, ${logo.offsetY || 0}px)` }}>
      {(logo.mode === "image" || logo.mode === "image-text") && (
        logo.image ? (
          <img src={logo.image} alt="logo" style={{ height: logo.size || 22 }} className="w-auto object-contain" />
        ) : (
          <span className="flex items-center justify-center rounded-md bg-[#3FC16F] font-heading font-extrabold text-[#062012]" style={{ height: (logo.size || 22) + 8, width: (logo.size || 22) + 8, fontSize: (logo.size || 22) * 0.6 }}>L</span>
        )
      )}
      {(logo.mode === "text" || logo.mode === "image-text") && (
        <span className="font-heading font-extrabold tracking-tight" style={{ fontSize: (logo.size || 22), color: shell.textColor }}>{logo.text}</span>
      )}
      {logo.verified && <BadgeCheck size={(logo.size || 22) * 0.7} className="text-[#3FC16F]" strokeWidth={2} />}
    </div>
  );

  const NavEl = !isMobile && (
    <nav className="flex items-center gap-6" data-testid="store-nav">
      {nav.map((l, i) => (
        <a key={i} {...pick(`nav-${i}`)} href={l.href || "#"}
          className={cx(`nav-${i}`, "font-medium tracking-wide transition-colors")}
          style={{ fontSize: navSize, color: l.normalColor || shell.textColor, "--lnk": l.normalColor, "--lnk-hover": l.hoverColor }}
          onMouseEnter={(e) => (e.currentTarget.style.color = l.hoverColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = l.normalColor || shell.textColor)}>
          {l.label}
        </a>
      ))}
    </nav>
  );

  const ActionsEl = (
    <div className="flex items-center gap-2.5" data-testid="store-actions">
      {actions.map((a, i) => {
        const showLabel = a.type === "button" && !isMobile;
        const badge = a.type === "icon-badge";
        return (
          <a key={i} {...pick(`action-${i}`)} href={a.href || "#"}
            className={cx(`action-${i}`, `relative inline-flex items-center gap-2 font-semibold transition-all ${a.type === "button" ? "px-4 py-2 rounded-full" : "h-9 w-9 justify-center rounded-full"}`)}
            style={a.type === "button" ? { backgroundColor: a.bg, color: a.color, fontSize: 13 } : { color: a.color }}>
            <ActionIcon name={a.icon} size={a.type === "button" ? 15 : 19} />
            {showLabel && <span>{a.label}</span>}
            {badge && cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3FC16F] px-1 text-[10px] font-bold text-[#062012]">{cartCount}</span>
            )}
          </a>
        );
      })}
    </div>
  );

  const inner = logo.center && !isMobile ? (
    <div className="grid grid-cols-3 items-center" style={{ paddingTop: pad, paddingBottom: pad }}>
      <div className="flex justify-start">{NavEl}</div>
      <div className="flex justify-center">{LogoEl}</div>
      <div className="flex justify-end">{ActionsEl}</div>
    </div>
  ) : (
    <div className="flex items-center justify-between gap-4" style={{ paddingTop: pad, paddingBottom: pad }}>
      <div className="flex items-center gap-8">
        {isMobile && <button className="text-current" aria-label="Menú" data-testid="store-hamburger" style={{ color: shell.textColor }}><Menu size={22} /></button>}
        {LogoEl}
        {NavEl}
      </div>
      {ActionsEl}
    </div>
  );

  return (
    <header
      data-testid="store-header"
      onClick={editable ? (e) => { e.stopPropagation(); onSelect?.("header", "shell"); } : (onCartClick ? undefined : undefined)}
      className={`w-full ${shell.sticky ? "" : ""} ${shell.shadow ? "shadow-[0_8px_30px_rgba(0,0,0,0.25)]" : ""}`}
      style={{ ...bgStyle, color: shell.textColor, borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: logo.position === "outside" ? "visible" : "hidden" }}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">{inner}</div>
    </header>
  );
};
