import React, { useState, useCallback } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { StoreHeader } from "./StoreHeader";
import { StoreBody } from "./StoreBody";
import { StoreFooter } from "./StoreFooter";
import { CartDrawer } from "./CartDrawer";

export const Storefront = ({ config, editable = false, sel, onSelect, device = "desktop" }) => {
  const [dismissed, setDismissed] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([]);

  const addToCart = (p) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
    if (!editable) setCartOpen(true);
  };
  const inc = (id) => setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id) => setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));
  const remove = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const theme = config.theme || {};
  const shell = config.header?.shell || {};

  const wrapClick = useCallback(() => { if (editable) onSelect?.(null, null); }, [editable, onSelect]);

  return (
    <div
      onClick={wrapClick}
      className="relative h-full w-full overflow-y-auto cms-scroll bg-[#0B1510]"
      style={{ fontFamily: `'${theme.bodyFont || "Inter"}', sans-serif`, "--font-heading": `'${theme.headingFont || "Sora"}'` }}
    >
      <AnnouncementBar
        config={config.announcementBar}
        dismissed={dismissed}
        onDismiss={() => setDismissed(true)}
        editable={editable}
        selected={editable && sel?.section === "announcementBar"}
        onSelect={onSelect}
      />

      <div className={shell.sticky ? "sticky top-0 z-40" : "relative z-40"}>
        <StoreHeader
          config={config.header}
          cartCount={cartCount}
          onCartClick={() => setCartOpen(true)}
          editable={editable}
          sel={sel}
          onSelect={onSelect}
          device={device}
        />
      </div>

      <StoreBody sections={config.sections} onAdd={addToCart} />

      <StoreFooter
        config={config.footer}
        editable={editable}
        selected={editable && sel?.section === "footer"}
        onSelect={onSelect}
      />

      <CartDrawer config={config.cart} open={cartOpen} onOpenChange={setCartOpen} items={items} onInc={inc} onDec={dec} onRemove={remove} />
    </div>
  );
};
