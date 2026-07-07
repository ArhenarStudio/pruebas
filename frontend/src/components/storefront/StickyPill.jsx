import React from "react";
import { ShoppingBag } from "lucide-react";

export const StickyPill = ({ config, visible, cartCount = 0, onCartClick }) => {
  if (!config?.enabled) return null;
  const isPill = config.style === "pill";

  const baseStyle = {
    backgroundColor: config.blur ? hexToRgba(config.bgColor, 0.72) : config.bgColor,
    color: config.textColor,
    backdropFilter: config.blur ? "blur(16px)" : "none",
    WebkitBackdropFilter: config.blur ? "blur(16px)" : "none",
  };

  return (
    <div
      data-testid="store-sticky-header"
      className={`pointer-events-none absolute left-0 right-0 top-0 z-40 flex justify-center transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`pointer-events-auto mt-4 flex items-center gap-4 border ${
          isPill ? "rounded-full px-5 py-2.5" : "rounded-none w-[92%] max-w-[1200px] justify-between px-6 py-3"
        }`}
        style={{ ...baseStyle, borderColor: "rgba(0,0,0,0.08)" }}
      >
        <span className="font-heading text-sm font-semibold tracking-tight" data-testid="store-sticky-label">
          {config.pillLabel}
        </span>
        {!isPill && (
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium">
            <span className="opacity-60">New In</span>
            <span className="opacity-60">Furniture</span>
            <span className="opacity-60">Lighting</span>
          </nav>
        )}
        <button
          onClick={onCartClick}
          data-testid="store-sticky-cart"
          className="flex items-center gap-2 text-[13px] font-medium hover:opacity-70 transition-opacity"
        >
          <ShoppingBag size={16} strokeWidth={1.6} />
          {config.pillCtaLabel}
          {cartCount > 0 && <span className="text-[11px]">({cartCount})</span>}
        </button>
      </div>
    </div>
  );
};

function hexToRgba(hex, alpha) {
  const h = (hex || "#FFFFFF").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
