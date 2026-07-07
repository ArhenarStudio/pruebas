import React from "react";
import { useConfig } from "@/context/ConfigContext";
import { TextField, TextAreaField, ColorField, SwitchRow, SliderField, SelectField, LinkListEditor, LabelRow } from "./controls";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

export const AnnouncementEditor = () => {
  const { config, updateSection } = useConfig();
  const c = config.announcementBar;
  const set = (p) => updateSection("announcementBar", p);
  return (
    <div className="space-y-4">
      <SwitchRow label="Show announcement bar" checked={c.enabled} onChange={(v) => set({ enabled: v })} testid="ann-enabled" />
      <TextAreaField label="Message" value={c.text} onChange={(v) => set({ text: v })} testid="ann-text" />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Link label" value={c.linkLabel} onChange={(v) => set({ linkLabel: v })} testid="ann-link-label" />
        <TextField label="Link URL" value={c.link} onChange={(v) => set({ link: v })} testid="ann-link-url" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ColorField label="Background" value={c.bgColor} onChange={(v) => set({ bgColor: v })} testid="ann-bg" />
        <ColorField label="Text" value={c.textColor} onChange={(v) => set({ textColor: v })} testid="ann-text-color" />
      </div>
      <SwitchRow label="Dismissible" checked={c.dismissible} onChange={(v) => set({ dismissible: v })} testid="ann-dismissible" />
    </div>
  );
};

export const HeaderEditor = () => {
  const { config, updateSection } = useConfig();
  const c = config.header;
  const set = (p) => updateSection("header", p);
  return (
    <div className="space-y-4">
      <TextField label="Logo text" value={c.logoText} onChange={(v) => set({ logoText: v })} testid="hdr-logo-text" />
      <TextField label="Logo image URL (optional)" value={c.logoImage} onChange={(v) => set({ logoImage: v })} testid="hdr-logo-img" />
      <SelectField label="Layout" value={c.layout} onChange={(v) => set({ layout: v })} options={[{ value: "logo-left", label: "Logo Left" }, { value: "logo-center", label: "Logo Center" }]} testid="hdr-layout" />
      <LinkListEditor label="Navigation links" items={c.navLinks} onChange={(v) => set({ navLinks: v })} testidPrefix="hdr-nav" />
      <div className="grid grid-cols-2 gap-3">
        <ColorField label="Background" value={c.bgColor} onChange={(v) => set({ bgColor: v })} testid="hdr-bg" />
        <ColorField label="Text" value={c.textColor} onChange={(v) => set({ textColor: v })} testid="hdr-text" />
      </div>
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
                <button onClick={() => removeColumn(i)} className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-[#E5E5E5] text-[#A3A3A3] hover:text-[#FF3B30]" data-testid={`ftr-col-remove-${i}`}>
                  <Trash2 size={13} />
                </button>
              </div>
              <LinkListEditor label="" items={col.links} onChange={(links) => updateColumn(i, { links })} testidPrefix={`ftr-col-${i}-link`} />
            </div>
          ))}
          <button onClick={addColumn} className="flex w-full items-center justify-center gap-1.5 border border-dashed border-[#D4D4D4] py-2 text-xs font-medium text-[#525252] hover:bg-[#F7F7F7]" data-testid="ftr-col-add">
            <Plus size={13} /> Add column
          </button>
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
