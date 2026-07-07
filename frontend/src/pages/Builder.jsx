import React, { useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { Storefront } from "@/components/storefront/Storefront";
import { AnnouncementEditor, HeaderEditor, StickyEditor, FooterEditor, CartEditor } from "@/components/builder/SectionEditors";
import { Megaphone, LayoutPanelTop, Pin, PanelBottom, ShoppingCart, Monitor, Smartphone, Save, RotateCcw, ExternalLink, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SECTIONS = [
  { id: "announcementBar", label: "Announcement", icon: Megaphone, Editor: AnnouncementEditor },
  { id: "header", label: "Header", icon: LayoutPanelTop, Editor: HeaderEditor },
  { id: "stickyHeader", label: "Sticky Header", icon: Pin, Editor: StickyEditor },
  { id: "footer", label: "Footer", icon: PanelBottom, Editor: FooterEditor },
  { id: "cart", label: "Cart", icon: ShoppingCart, Editor: CartEditor },
];

export default function Builder() {
  const { config, loading, saving, dirty, save, reset, discard } = useConfig();
  const [active, setActive] = useState("announcementBar");
  const [device, setDevice] = useState("desktop");

  const activeSection = SECTIONS.find((s) => s.id === active);
  const Editor = activeSection.Editor;

  const handleSave = async () => {
    const ok = await save();
    toast[ok ? "success" : "error"](ok ? "Changes published to storefront" : "Failed to save");
  };
  const handleReset = async () => {
    await reset();
    toast.success("Reset to defaults");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7F7F7]">
        <Loader2 className="animate-spin text-[#525252]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Top bar */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#E5E5E5] px-4" data-testid="cms-topbar">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center bg-[#0A0A0A] text-white font-heading text-sm font-bold">S</div>
          <div className="leading-none">
            <p className="font-heading text-sm font-semibold tracking-tight">Sitecraft CMS</p>
            <p className="text-[10px] text-[#525252]">Storefront Builder</p>
          </div>
          {dirty && (
            <span className="ml-2 flex items-center gap-1.5 border border-[#E5E5E5] px-2 py-0.5 text-[11px] text-[#525252]" data-testid="cms-dirty-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#002FA7]" /> Unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-1 flex border border-[#E5E5E5]">
            <button onClick={() => setDevice("desktop")} className={`flex h-8 w-8 items-center justify-center ${device === "desktop" ? "bg-[#0A0A0A] text-white" : "text-[#525252] hover:bg-[#F7F7F7]"}`} data-testid="cms-device-desktop">
              <Monitor size={15} />
            </button>
            <button onClick={() => setDevice("mobile")} className={`flex h-8 w-8 items-center justify-center ${device === "mobile" ? "bg-[#0A0A0A] text-white" : "text-[#525252] hover:bg-[#F7F7F7]"}`} data-testid="cms-device-mobile">
              <Smartphone size={15} />
            </button>
          </div>
          <a href="/store" target="_blank" rel="noreferrer" className="flex h-8 items-center gap-1.5 border border-[#E5E5E5] px-3 text-[13px] font-medium text-[#0A0A0A] hover:bg-[#F7F7F7]" data-testid="cms-view-store">
            <ExternalLink size={14} /> View store
          </a>
          <button onClick={handleReset} className="flex h-8 items-center gap-1.5 border border-[#E5E5E5] px-3 text-[13px] font-medium text-[#525252] hover:bg-[#F7F7F7]" data-testid="cms-reset">
            <RotateCcw size={14} /> Reset
          </button>
          {dirty && (
            <button onClick={discard} className="flex h-8 items-center px-3 text-[13px] font-medium text-[#525252] hover:text-[#0A0A0A]" data-testid="cms-discard">
              Discard
            </button>
          )}
          <button onClick={handleSave} disabled={saving || !dirty} className="flex h-8 items-center gap-1.5 bg-[#002FA7] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#00247D] disabled:opacity-40" data-testid="cms-save">
            {saving ? <Loader2 size={14} className="animate-spin" /> : dirty ? <Save size={14} /> : <Check size={14} />}
            {dirty ? "Publish" : "Saved"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-[340px] flex-shrink-0 flex-col border-r border-[#E5E5E5]" data-testid="cms-sidebar">
          <div className="flex flex-wrap gap-1.5 border-b border-[#E5E5E5] p-3">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  data-testid={`cms-section-${s.id}`}
                  className={`flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    active === s.id ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E5E5E5] text-[#525252] hover:bg-[#F7F7F7]"
                  }`}
                >
                  <Icon size={13} /> {s.label}
                </button>
              );
            })}
          </div>
          <div className="flex-1 overflow-y-auto cms-scroll p-5">
            <h2 className="font-heading text-lg font-semibold tracking-tight mb-1">{activeSection.label}</h2>
            <p className="text-xs text-[#525252] mb-5">Edit settings — the preview updates live.</p>
            <Editor />
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex flex-1 flex-col overflow-hidden bg-[#F7F7F7] p-6" data-testid="cms-canvas">
          <div className={`mx-auto flex h-full w-full flex-col overflow-hidden border border-[#E5E5E5] bg-white transition-all duration-300 ${device === "mobile" ? "max-w-[400px]" : "max-w-full"}`}>
            <div className="flex h-9 flex-shrink-0 items-center gap-2 border-b border-[#E5E5E5] bg-white px-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
              </div>
              <div className="mx-auto flex items-center rounded-sm bg-[#F7F7F7] px-3 py-0.5 text-[11px] text-[#525252]">
                meridian.store
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <Storefront config={config} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
