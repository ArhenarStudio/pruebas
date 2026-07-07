import React from "react";
import { Instagram, Facebook, Youtube, Twitter, ShieldCheck } from "lucide-react";
import { backgroundStyle } from "@/lib/appearance";

const ICONS = { instagram: Instagram, facebook: Facebook, youtube: Youtube, twitter: Twitter };

export const StoreFooter = ({ config, editable, selected, onSelect }) => {
  const bgStyle = backgroundStyle(config.background, "#081109");
  return (
    <footer
      data-testid="store-footer"
      onClick={editable ? (e) => { e.stopPropagation(); onSelect?.("footer"); } : undefined}
      className={`w-full ${editable ? "sel-hover" : ""} ${selected ? "sel-el" : ""}`}
      style={{ ...bgStyle, color: config.textColor }}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h3 className="font-heading text-4xl font-extrabold tracking-tight" data-testid="store-footer-brand">{config.brandName}</h3>
            <p className="mt-4 max-w-xs text-sm opacity-70 leading-relaxed">{config.tagline}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <ShieldCheck size={14} className="text-[#3FC16F]" /> Sorteo auditado y con permiso oficial
            </div>
            <div className="mt-6 flex items-center gap-3">
              {(config.socials || []).map((s, i) => {
                const Icon = ICONS[s.platform] || Instagram;
                return (
                  <a key={i} href={s.href || "#"} className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-[#3FC16F] hover:text-[#062012]" style={{ borderColor: "rgba(255,255,255,0.2)" }} aria-label={s.platform}>
                    <Icon size={16} strokeWidth={1.6} />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3">
            {(config.columns || []).map((col, i) => (
              <div key={i}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-60">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {(col.links || []).map((l, j) => (
                    <li key={j}><a href={l.href || "#"} className="text-sm opacity-80 transition-opacity hover:opacity-100 hover:text-[#3FC16F]">{l.label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t pt-6 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <span data-testid="store-footer-copyright">{config.copyright}</span>
          <span>Aviso de Privacidad · Términos · Bases</span>
        </div>
      </div>
    </footer>
  );
};
