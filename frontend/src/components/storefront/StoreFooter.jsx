import React from "react";
import { Instagram, Twitter, Facebook, Youtube, Linkedin } from "lucide-react";

const ICONS = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
};

export const StoreFooter = ({ config }) => {
  return (
    <footer
      data-testid="store-footer"
      className="w-full"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h3 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tighter" data-testid="store-footer-brand">
              {config.brandName}
            </h3>
            <p className="mt-4 max-w-xs text-sm opacity-70 leading-relaxed">{config.tagline}</p>
            <div className="mt-6 flex items-center gap-3" data-testid="store-footer-socials">
              {(config.socials || []).map((s, i) => {
                const Icon = ICONS[s.platform] || Instagram;
                return (
                  <a
                    key={i}
                    href={s.href || "#"}
                    className="flex h-9 w-9 items-center justify-center border transition-colors hover:bg-white/10"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}
                    aria-label={s.platform}
                  >
                    <Icon size={16} strokeWidth={1.5} />
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
                    <li key={j}>
                      <a href={l.href || "#"} className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-16 flex flex-col gap-2 border-t pt-6 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          <span data-testid="store-footer-copyright">{config.copyright}</span>
          <span>Privacy · Terms · Cookies</span>
        </div>
      </div>
    </footer>
  );
};
