import React from "react";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { backgroundStyle, linkClass } from "@/lib/appearance";

export const StoreHeader = ({ config, cartCount = 0, onCartClick }) => {
  const ls = config.linkStyle || {};
  const logo = config.logoImage ? (
    <img src={config.logoImage} alt="logo" className="h-7 w-auto object-contain" data-testid="store-header-logo-img" />
  ) : (
    <span className="font-heading text-xl font-semibold tracking-tight" data-testid="store-header-logo">
      {config.logoText}
    </span>
  );

  const nav = (
    <nav className="hidden md:flex items-center gap-7" data-testid="store-header-nav">
      {(config.navLinks || []).map((l, i) => (
        <a
          key={i}
          href={l.href || "#"}
          className={`${linkClass(ls)} text-[13px] font-medium tracking-wide`}
          style={{ "--lnk": config.textColor, "--lnk-hover": ls.hoverColor || config.textColor }}
        >
          {ls.showIcon && l.icon ? <span>{l.icon}</span> : null}
          {l.label}
        </a>
      ))}
    </nav>
  );

  const actions = (
    <div className="flex items-center gap-4">
      {config.showSearch && (
        <button className="hover:opacity-60 transition-opacity" aria-label="Search" data-testid="store-header-search">
          <Search size={19} strokeWidth={1.5} />
        </button>
      )}
      {config.ctaLabel ? <span className="hidden sm:inline text-[13px] font-medium">{config.ctaLabel}</span> : null}
      {config.showCart && (
        <button onClick={onCartClick} data-testid="store-header-cart" className="relative hover:opacity-60 transition-opacity" aria-label="Cart">
          <ShoppingBag size={20} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#002FA7] px-1 text-[10px] font-semibold text-white" data-testid="store-header-cart-count">
              {cartCount}
            </span>
          )}
        </button>
      )}
    </div>
  );

  const centered = config.layout === "logo-center";
  const pad = config.paddingY ?? 16;
  const bgStyle = backgroundStyle(config.background, config.bgColor);

  return (
    <header data-testid="store-header" className="w-full border-b" style={{ ...bgStyle, color: config.textColor, borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {centered ? (
          <div className="grid grid-cols-3 items-center" style={{ paddingTop: pad, paddingBottom: pad }}>
            <div className="flex justify-start">{nav}</div>
            <div className="flex justify-center">{logo}</div>
            <div className="flex justify-end">{actions}</div>
          </div>
        ) : (
          <div className="flex items-center justify-between" style={{ paddingTop: pad, paddingBottom: pad }}>
            <div className="flex items-center gap-10">
              <button className="md:hidden" aria-label="Menu"><Menu size={20} /></button>
              {logo}
              {nav}
            </div>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
