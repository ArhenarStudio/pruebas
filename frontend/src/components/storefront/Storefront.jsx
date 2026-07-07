import React, { useState, useRef, useCallback } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { StoreHeader } from "./StoreHeader";
import { StickyPill } from "./StickyPill";
import { StoreFooter } from "./StoreFooter";
import { CartDrawer } from "./CartDrawer";
import { mockProducts } from "@/lib/siteData";
import { ArrowRight, Plus } from "lucide-react";

export const Storefront = ({ config }) => {
  const [dismissed, setDismissed] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [stickyVisible, setStickyVisible] = useState(false);
  const scrollRef = useRef(null);

  const onScroll = useCallback(
    (e) => {
      setStickyVisible(e.target.scrollTop > (config.stickyHeader?.showAfter || 240));
    },
    [config.stickyHeader]
  );

  const addToCart = (p) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };
  const inc = (id) => setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id) => setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));
  const remove = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white text-[#0A0A0A]">
      <StickyPill
        config={config.stickyHeader}
        visible={stickyVisible}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <div ref={scrollRef} onScroll={onScroll} className="h-full w-full overflow-y-auto cms-scroll">
        <AnnouncementBar config={config.announcementBar} dismissed={dismissed} onDismiss={() => setDismissed(true)} />
        <StoreHeader config={config.header} cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

        {/* Hero */}
        <section className="border-b border-[#E5E5E5]">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-16 lg:py-28">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#525252]">
                Spring Collection 2026
              </span>
              <h1 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[1.02]">
                Objects made to<br />outlast the trend.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#525252]">
                Meridian designs furniture and lighting with an obsession for material honesty and quiet permanence.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <button className="inline-flex items-center gap-2 bg-[#0A0A0A] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#262626]">
                  Shop Collection <ArrowRight size={16} />
                </button>
                <button className="text-sm font-semibold underline underline-offset-4 hover:opacity-60">Our story</button>
              </div>
            </div>
            <div className="relative min-h-[320px] bg-[#F7F7F7] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1648994517760-19afc8c7ba00"
                alt="Featured"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section className="mx-auto max-w-[1400px] px-6 py-16 lg:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#525252]">Best Sellers</span>
              <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">Featured pieces</h2>
            </div>
            <a href="#" className="hidden sm:inline text-sm font-semibold underline underline-offset-4 hover:opacity-60">View all</a>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {mockProducts.map((p) => (
              <div key={p.id} className="group" data-testid={`store-product-${p.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F7]">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <button
                    onClick={() => addToCart(p)}
                    data-testid={`store-add-${p.id}`}
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-white text-[#0A0A0A] opacity-0 transition-all duration-300 hover:bg-[#0A0A0A] hover:text-white group-hover:opacity-100"
                    aria-label="Add to cart"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-[#525252]">{p.category}</p>
                  </div>
                  <p className="text-sm font-semibold">${p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <StoreFooter config={config.footer} />
      </div>

      <CartDrawer
        config={config.cart}
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={items}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
      />
    </div>
  );
};
