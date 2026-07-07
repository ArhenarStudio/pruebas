import React from "react";
import { useConfig } from "@/context/ConfigContext";
import { Label, ColorInput, SliderRow, cx } from "./ui";
import { FONTS, THEME_PRESETS, backgroundStyle } from "@/lib/appearance";
import { Check } from "lucide-react";

const ANN_BLOCKS = [
  { name: "Verde sólido", patch: { background: { type: "solid", color: "#3FC16F" }, textColor: "#062012", transition: "slide" } },
  { name: "Degradado", patch: { background: { type: "gradient", gradient: { from: "#3FC16F", to: "#0B1510", angle: 90 } }, textColor: "#FFFFFF", transition: "fade" } },
  { name: "Marquesina", patch: { background: { type: "solid", color: "#0B1510" }, textColor: "#3FC16F", transition: "marquee" } },
  { name: "Confeti", patch: { background: { type: "pattern", color: "#0B1510", pattern: { id: "emoji", emoji: "🎉", opacity: 0.22, size: 30 } }, textColor: "#FFFFFF", transition: "slide" } },
];
const HEADER_BLOCKS = [
  { name: "Oscuro", patch: { shell: { background: { type: "solid", color: "#0B1510" }, textColor: "#EAF2EC", pill: false } } },
  { name: "Claro", patch: { shell: { background: { type: "solid", color: "#FFFFFF" }, textColor: "#0B1510", pill: false } } },
  { name: "Degradado", patch: { shell: { background: { type: "gradient", gradient: { from: "#0B1510", to: "#122018", angle: 120 } }, textColor: "#EAF2EC" } } },
  { name: "Rejilla", patch: { shell: { background: { type: "pattern", color: "#0B1510", pattern: { id: "grid", patternColor: "#3FC16F", opacity: 0.1, size: 26 } }, textColor: "#EAF2EC" } } },
];
const FOOTER_BLOCKS = [
  { name: "Noir", patch: { background: { type: "solid", color: "#081109" }, textColor: "#EAF2EC" } },
  { name: "Marfil", patch: { background: { type: "solid", color: "#F1F1EE" }, textColor: "#0B1510" } },
  { name: "Degradado", patch: { background: { type: "gradient", gradient: { from: "#0B1510", to: "#122018", angle: 160 } }, textColor: "#EAF2EC" } },
  { name: "Diagonales", patch: { background: { type: "pattern", color: "#081109", pattern: { id: "diagonal", patternColor: "#3FC16F", opacity: 0.12, size: 20 } }, textColor: "#EAF2EC" } },
];

const BlockCard = ({ name, bg, onClick, testid }) => (
  <button onClick={onClick} data-testid={testid} className="group overflow-hidden rounded-xl border border-[#E3E9E5] text-left transition-colors hover:border-[#3FC16F]">
    <div className="h-12 w-full" style={backgroundStyle(bg, "#0B1510")} />
    <div className="px-3 py-2 text-xs font-semibold text-[#0B1510]">{name}</div>
  </button>
);

export const BlocksInspector = () => {
  const { applyPatch } = useConfig();
  const apply = (section, patch) => applyPatch({ [section]: patch });
  return (
    <div className="space-y-5" data-testid="blocks-inspector">
      <div>
        <Label>Barra de anuncios</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {ANN_BLOCKS.map((b, i) => <BlockCard key={i} name={b.name} bg={b.patch.background} onClick={() => apply("announcementBar", b.patch)} testid={`block-ann-${i}`} />)}
        </div>
      </div>
      <div>
        <Label>Encabezado</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {HEADER_BLOCKS.map((b, i) => <BlockCard key={i} name={b.name} bg={b.patch.shell.background} onClick={() => apply("header", b.patch)} testid={`block-header-${i}`} />)}
        </div>
      </div>
      <div>
        <Label>Pie de página</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {FOOTER_BLOCKS.map((b, i) => <BlockCard key={i} name={b.name} bg={b.patch.background} onClick={() => apply("footer", b.patch)} testid={`block-footer-${i}`} />)}
        </div>
      </div>
    </div>
  );
};

const FontGrid = ({ value, onChange, testidPrefix }) => (
  <div className="grid grid-cols-2 gap-1.5" data-testid={testidPrefix}>
    {FONTS.map((f) => (
      <button key={f} onClick={() => onChange(f)} data-testid={`${testidPrefix}-${f.replace(/\s+/g, "-")}`}
        style={{ fontFamily: `'${f}', sans-serif` }}
        className={cx("truncate rounded-lg border px-3 py-2 text-sm font-semibold transition-colors", value === f ? "border-[#3FC16F] bg-[#EAF7EF] text-[#0B1510]" : "border-[#E3E9E5] text-[#4B5A50] hover:bg-[#F1F5F2]")}>
        {f}
      </button>
    ))}
  </div>
);

export const ThemeInspector = () => {
  const { config, updateSection, applyPatch } = useConfig();
  const t = config.theme || {};

  const applyTheme = (p) => {
    const nav = (config.header.navLinks || []).map((l) => ({ ...l, normalColor: p.header.text, hoverColor: p.accent, activeColor: p.accent }));
    const actions = (config.header.actions || []).map((a) => (a.type === "button" ? { ...a, bg: p.accent, color: p.ann.text } : { ...a, color: p.header.text }));
    applyPatch({
      theme: { headingFont: p.headingFont, bodyFont: p.bodyFont, accent: p.accent },
      announcementBar: { background: { type: "solid", color: p.ann.color }, textColor: p.ann.text },
      header: { navLinks: nav, actions, shell: { background: { type: "solid", color: p.header.color }, textColor: p.header.text } },
      footer: { background: { type: "solid", color: p.footer.color }, textColor: p.footer.text },
      cart: { accentColor: p.accent },
    });
  };

  return (
    <div className="space-y-5" data-testid="theme-inspector">
      <div>
        <Label>Temas guardados</Label>
        <div className="mt-2 grid grid-cols-2 gap-2" data-testid="theme-presets">
          {THEME_PRESETS.map((p) => {
            const activeTheme = t.headingFont === p.headingFont && t.accent === p.accent;
            return (
              <button key={p.name} onClick={() => applyTheme(p)} data-testid={`theme-${p.name.replace(/\s+/g, "-")}`}
                className={cx("overflow-hidden rounded-xl border text-left transition-colors", activeTheme ? "border-[#3FC16F] ring-1 ring-[#3FC16F]" : "border-[#E3E9E5] hover:border-[#3FC16F]")}>
                <div className="flex h-10 w-full">
                  <div className="flex-1" style={{ background: p.header.color }} />
                  <div className="w-6" style={{ background: p.ann.color }} />
                  <div className="w-4" style={{ background: p.accent }} />
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs font-semibold text-[#0B1510]" style={{ fontFamily: `'${p.headingFont}'` }}>{p.name}</span>
                  {activeTheme && <Check size={13} className="text-[#3FC16F]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Fuente de títulos</Label>
        <div className="mt-2"><FontGrid value={t.headingFont} onChange={(v) => updateSection("theme", { headingFont: v })} testidPrefix="heading-font" /></div>
      </div>
      <div>
        <Label>Fuente de texto</Label>
        <div className="mt-2"><FontGrid value={t.bodyFont} onChange={(v) => updateSection("theme", { bodyFont: v })} testidPrefix="body-font" /></div>
      </div>

      <div><Label>Color de acento</Label><div className="mt-1.5"><ColorInput value={t.accent} onChange={(v) => updateSection("theme", { accent: v })} testid="theme-accent" /></div></div>
      <SliderRow label="Redondeo global" value={t.radius ?? 10} min={0} max={28} suffix="px" onChange={(v) => updateSection("theme", { radius: v })} testid="theme-radius" />
    </div>
  );
};
