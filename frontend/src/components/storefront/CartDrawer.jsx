import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

export const CartDrawer = ({ config, open, onOpenChange, items, onInc, onDec, onRemove }) => {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const threshold = config.freeShippingThreshold || 0;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = threshold ? Math.min(100, (subtotal / threshold) * 100) : 100;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col rounded-none border-l border-[#E5E5E5]"
        data-testid="store-cart-drawer"
      >
        <SheetHeader className="px-6 py-5 border-b border-[#E5E5E5]">
          <SheetTitle className="font-heading text-lg font-semibold tracking-tight flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.6} /> {config.title}
            <span className="text-sm font-normal text-[#525252]">({items.reduce((s, i) => s + i.qty, 0)})</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Review the items in your shopping cart and proceed to checkout.</SheetDescription>
        </SheetHeader>

        {threshold > 0 && items.length > 0 && (
          <div className="px-6 py-3 border-b border-[#E5E5E5] bg-[#F7F7F7]">
            <p className="text-xs text-[#525252] mb-2">
              {remaining > 0 ? `Add $${remaining.toFixed(0)} for free shipping` : "You've unlocked free shipping!"}
            </p>
            <div className="h-1 w-full bg-[#E5E5E5]">
              <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: config.accentColor }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto cms-scroll px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-20" data-testid="store-cart-empty">
              <ShoppingBag size={40} strokeWidth={1} className="text-[#D4D4D4]" />
              <p className="mt-4 text-sm text-[#525252]">{config.emptyText}</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#E5E5E5]">
              {items.map((it) => (
                <li key={it.id} className="flex gap-4 py-4" data-testid={`store-cart-item-${it.id}`}>
                  {config.showImages && (
                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-[#F7F7F7]">
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-medium text-[#0A0A0A]">{it.name}</p>
                      <button onClick={() => onRemove(it.id)} className="text-[#A3A3A3] hover:text-[#0A0A0A]" aria-label="Remove" data-testid={`cart-remove-${it.id}`}>
                        <X size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-[#525252]">${it.price.toFixed(2)}</p>
                    <div className="mt-auto flex items-center gap-2">
                      <button onClick={() => onDec(it.id)} className="flex h-6 w-6 items-center justify-center border border-[#E5E5E5] hover:bg-[#F7F7F7]" aria-label="Decrease" data-testid={`cart-dec-${it.id}`}>
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm">{it.qty}</span>
                      <button onClick={() => onInc(it.id)} className="flex h-6 w-6 items-center justify-center border border-[#E5E5E5] hover:bg-[#F7F7F7]" aria-label="Increase" data-testid={`cart-inc-${it.id}`}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-[#E5E5E5] px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-[#525252]">Subtotal</span>
            <span className="font-heading text-lg font-semibold" data-testid="store-cart-subtotal">${subtotal.toFixed(2)}</span>
          </div>
          <button
            disabled={items.length === 0}
            data-testid="store-cart-checkout"
            className="w-full py-3.5 text-sm font-semibold text-white transition-colors disabled:opacity-40"
            style={{ backgroundColor: config.accentColor }}
          >
            {config.checkoutLabel}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
