import React from "react";
import { useConfig } from "@/context/ConfigContext";
import { TextField, TextAreaField, ColorField, SwitchRow, SliderField, SelectField, LinkListEditor, LabelRow, BackgroundControl, LinkStyleControl, EmojiField } from "./controls";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

const TRANSITIONS = [
  { value: "slide", label: "Slide" },
  { value: "fade", label: "Fade" },
  { value: "marquee", label: "Marquee" },
  { value: "none", label: "None" },
];

export const AnnouncementEditor = () => {
  const { config, updateSection } = useConfig();
  const c = config.announcementBar;
  const set = (p) => updateSection("announcementBar", p);
  const list = c.announcements || [];
  const updateItem = (i, patch) => set({ announcements: list.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const addItem = () => set({ announcements: [...list, { text: "New announcement", linkLabel: "", link: "#" }] });
  const removeItem = (i) => set({ announcements: list.filter((_, idx) => idx !== i) });
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    set({ announcements: next });
  };

  return (
    <div className="space-y-4">
      <SwitchRow label="Show announcement bar" checked={c.enabled} onChange={(v) => set({ enabled: v })} testid="ann-enabled" />

      <div>
        <LabelRow>Announcements</LabelRow>
        <div className="space-y-2">
          {list.map((a, i) => (
            <div key={i} className="border border-[#E5E5E5] p-2.5" data-testid={`ann-item-${i}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#525252]">#{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => move(i, -1)} className="px-1 text-xs text-[#A3A3A3] hover:text-[#0A0A0A]">↑</button>
                  <button onClick={() => move(i, 1)} className="px-1 text-xs text-[#A3A3A3] hover:text-[#0A0A0A]">↓</button>
                  <button onClick={() => removeItem(i)} className="flex h-6 w-6 items-center justify-center text-[#A3A3A3] hover:text-[#FF3B30]" data-testid={`ann-remove-${i}`}><Trash2 size={13} /></button>
                </div>
              </div>
              <Textarea value={a.text || ""} onChange={(e) => updateItem(i, { text: e.target.value })} className="mb-2 min-h-[52px] rounded-none border-[#E5E5E5] text-sm" data-testid={`ann-text-${i}`} />
              <div className="grid grid-cols-2 gap-1.5">
                <Input value={a.linkLabel || ""} placeholder="Link label" onChange={(e) => updateItem(i, { linkLabel: e.target.value })} className="h-8 rounded-none border-[#E5E5E5] text-sm" />
                <Input value={a.link || ""} placeholder="URL" onChange={(e) => updateItem(i, { link: e.target.value })} className="h-8 rounded-none border-[#E5E5E5] text-sm" />
              </div>
            </div>
          ))}
          <button onClick={addItem} className="flex w-full items-center justify-center gap-1.5 border border-dashed border-[#D4D4D4] py-2 text-xs font-medium text-[#525252] hover:bg-[#F7F7F7]" data-testid="ann-add">
            <Plus size={13} /> Add announcement
          </button>
        </div>
      </div>

      <SelectField label="Transition" value={c.transition} options={TRANSITIONS} onChange={(v) => set({ transition: v })} testid="ann-transition" />
      {c.transition !== "marquee" && c.transition !== "none" && (
        <SliderField label="Auto-rotate interval" value={c.interval} min={1500} max={10000} step={500} suffix="ms" onChange={(v) => set({ interval: v })} testid="ann-interval" />
      )}
      <SliderField label="Height (padding)" value={c.paddingY} min={4} max={28} step={1} suffix="px" onChange={(v) => set({ paddingY: v })} testid="ann-padding" />
      <BackgroundControl label="Background" value={c.background} onChange={(v) => set({ background: v })} testidPrefix="ann-bg" />
      <ColorField label="Text color" value={c.textColor} onChange={(v) => set({ textColor: v })} testid="ann-text-color" />
      <SwitchRow label="Dismissible" checked={c.dismissible} onChange={(v) => set({ dismissible: v })} testid="ann-dismissible" />
    </div>
  );
};

export const HeaderEditor = () => {
  const { config, updateSection } = useConfig();
  const c = config.header;
  const set = (p) => updateSection("header", p);
  const nav = c.navLinks || [];
  const updateLink = (i, patch) => set({ navLinks: nav.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const addLink = () => set({ navLinks: [...nav, { label: "New", href: "#", icon: "" }] });
  const removeLink = (i) => set({ navLinks: nav.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <TextField label="Logo text" value={c.logoText} onChange={(v) => set({ logoText: v })} testid="hdr-logo-text" />
      <TextField label="Logo image URL (optional)" value={c.logoImage} onChange={(v) => set({ logoImage: v })} testid="hdr-logo-img" />
      <SelectField label="Layout" value={c.layout} onChange={(v) => set({ layout: v })} options={[{ value: "logo-left", label: "Logo Left" }, { value: "logo-center", label: "Logo Center" }]} testid="hdr-layout" />

      <div>
        <LabelRow>Navigation links</LabelRow>
        <div className="space-y-2">
          {nav.map((l, i) => (
            <div key={i} className="flex items-center gap-1.5" data-testid={`hdr-nav-item-${i}`}>
              {c.linkStyle?.showIcon && (
                <div className="w-14 flex-shrink-0">
                  <EmojiField value={l.icon} onChange={(v) => updateLink(i, { icon: v })} testid={`hdr-nav-icon-${i}`} />
                </div>
              )}
              <Input value={l.label} placeholder="label" onChange={(e) => updateLink(i, { label: e.target.value })} className="h-9 rounded-none border-[#E5E5E5] text-sm" />
              <Input value={l.href} placeholder="href" onChange={(e) => updateLink(i, { href: e.target.value })} className="h-9 rounded-none border-[#E5E5E5] text-sm" />
              <button onClick={() => removeLink(i)} className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-[#E5E5E5] text-[#A3A3A3] hover:text-[#FF3B30]" data-testid={`hdr-nav-remove-${i}`}><Trash2 size={13} /></button>
            </div>
          ))}
          <button onClick={addLink} className="flex w-full items-center justify-center gap-1.5 border border-dashed border-[#D4D4D4] py-2 text-xs font-medium text-[#525252] hover:bg-[#F7F7F7]" data-testid="hdr-nav-add"><Plus size={13} /> Add link</button>
        </div>
      </div>

      <div className="border-t border-[#E5E5E5] pt-4">
        <LabelRow>Link states & banks</LabelRow>
        <LinkStyleControl value={c.linkStyle} onChange={(v) => set({ linkStyle: v })} testidPrefix="hdr-linkstyle" />
      </div>

      <SliderField label="Height (padding)" value={c.paddingY} min={6} max={40} step={1} suffix="px" onChange={(v) => set({ paddingY: v })} testid="hdr-padding" />
      <BackgroundControl label="Background" value={c.background} onChange={(v) => set({ background: v })} testidPrefix="hdr-bg" />
      <ColorField label="Text color" value={c.textColor} onChange={(v) => set({ textColor: v })} testid="hdr-text" />
      <TextField label="CTA text (optional)" value={c.ctaLabel} onChange={(v) => set({ ctaLabel: v })} testid="hdr-cta" />
      <SwitchRow label="Show search icon" checked={c.showSearch} onChange={(v) => set({ showSearch: v })} testid="hdr-search" />
      <SwitchRow label="Show cart icon" checked={c.showCart} onChange={(v) => set({ showCart: v })} testid="hdr-cart" />
    </div>
  );
};

export const StickyEditor = () => {
  const { config, updateSection } = useConfig();
  const c = config.stickyHeader;
  const set = (p) => updateSection("stickyHeader", p);
  return (
    <div className="space-y-4">
      <SwitchRow label="Enable sticky header" checked={c.enabled} onChange={(v) => set({ enabled: v })} testid="stk-enabled" />
      <SelectField label="Style" value={c.style} onChange={(v) => set({ style: v })} options={[{ value: "pill", label: "Floating Pill" }, { value: "bar", label: "Full Bar" }]} testid="stk-style" />
      <SliderField label="Appear after scroll" value={c.showAfter} min={50} max={800} step={10} suffix="px" onChange={(v) => set({ showAfter: v })} testid="stk-showafter" />
      <TextField label="Pill label" value={c.pillLabel} onChange={(v) => set({ pillLabel: v })} testid="stk-label" />
      <TextField label="Pill CTA label" value={c.pillCtaLabel} onChange={(v) => set({ pillCtaLabel: v })} testid="stk-cta" />
      <div className="grid grid-cols-2 gap-3">
        <ColorField label="Background" value={c.bgColor} onChange={(v) => set({ bgColor: v })} testid="stk-bg" />
        <ColorField label="Text" value={c.textColor} onChange={(v) => set({ textColor: v })} testid="stk-text" />
      </div>
      <SwitchRow label="Glass blur effect" checked={c.blur} onChange={(v) => set({ blur: v })} testid="stk-blur" />
    </div>
  );
};

export const FooterEditor = () => {
  const { config, updateSection } = useConfig();
  const c = config.footer;
  const set = (p) => updateSection("footer", p);
  const updateColumn = (i, patch) => set({ columns: c.columns.map((col, idx) => (idx === i ? { ...col, ...patch } : col)) });
  const addColumn = () => set({ columns: [...c.columns, { title: "New", links: [{ label: "Link", href: "#" }] }] });
  const removeColumn = (i) => set({ columns: c.columns.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <TextField label="Brand name" value={c.brandName} onChange={(v) => set({ brandName: v })} testid="ftr-brand" />
      <TextAreaField label="Tagline" value={c.tagline} onChange={(v) => set({ tagline: v })} testid="ftr-tagline" />
      <div className="grid grid-cols-2 gap-3">
        <ColorField label="Background" value={c.bgColor} onChange={(v) => set({ bgColor: v })} testid="ftr-bg" />
        <ColorField label="Text" value={c.textColor} onChange={(v) => set({ textColor: v })} testid="ftr-text" />
      </div>
      <div>
        <LabelRow>Footer columns</LabelRow>
        <div className="space-y-3">
          {c.columns.map((col, i) => (
            <div key={i} className="border border-[#E5E5E5] p-3" data-testid={`ftr-col-${i}`}>
              <div className="mb-2 flex items-center gap-1.5">
                <Input value={col.title} onChange={(e) => updateColumn(i, { title: e.target.value })} className="h-8 rounded-none border-[#E5E5E5] text-sm font-semibold" />
                <button onClick={() => removeColumn(i)} className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-[#E5E5E5] text-[#A3A3A3] hover:text-[#FF3B30]" data-testid={`ftr-col-remove-${i}`}><Trash2 size={13} /></button>
              </div>
              <LinkListEditor label="" items={col.links} onChange={(links) => updateColumn(i, { links })} testidPrefix={`ftr-col-${i}-link`} />
            </div>
          ))}
          <button onClick={addColumn} className="flex w-full items-center justify-center gap-1.5 border border-dashed border-[#D4D4D4] py-2 text-xs font-medium text-[#525252] hover:bg-[#F7F7F7]" data-testid="ftr-col-add"><Plus size={13} /> Add column</button>
        </div>
      </div>
      <LinkListEditor label="Social links" items={c.socials} onChange={(v) => set({ socials: v })} fields={["platform", "href"]} testidPrefix="ftr-social" />
      <TextField label="Copyright" value={c.copyright} onChange={(v) => set({ copyright: v })} testid="ftr-copyright" />
    </div>
  );
};

export const CartEditor = () => {
  const { config, updateSection } = useConfig();
  const c = config.cart;
  const set = (p) => updateSection("cart", p);
  return (
    <div className="space-y-4">
      <TextField label="Drawer title" value={c.title} onChange={(v) => set({ title: v })} testid="cart-title" />
      <TextField label="Empty cart text" value={c.emptyText} onChange={(v) => set({ emptyText: v })} testid="cart-empty" />
      <TextField label="Checkout button label" value={c.checkoutLabel} onChange={(v) => set({ checkoutLabel: v })} testid="cart-checkout" />
      <ColorField label="Accent color" value={c.accentColor} onChange={(v) => set({ accentColor: v })} testid="cart-accent" />
      <SliderField label="Free shipping threshold" value={c.freeShippingThreshold} min={0} max={500} step={10} suffix="$" onChange={(v) => set({ freeShippingThreshold: v })} testid="cart-threshold" />
      <SwitchRow label="Show product images" checked={c.showImages} onChange={(v) => set({ showImages: v })} testid="cart-images" />
    </div>
  );
};
