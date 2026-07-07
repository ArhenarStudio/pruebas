// Appearance system: backgrounds, fonts, buttons, link/button banks, block presets

export function hexToRgba(hex, alpha) {
  const h = (hex || "#000000").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ---------------- Fonts ---------------- */
export const FONTS = [
  "Outfit", "Inter", "Space Grotesk", "Playfair Display", "Sora", "DM Sans",
  "Archivo", "Bricolage Grotesque", "Poppins", "Manrope", "Syne", "Fraunces",
];

/* ---------------- Backgrounds ---------------- */
export const PATTERNS = [
  { id: "none", label: "None" },
  { id: "dots", label: "Dots" },
  { id: "grid", label: "Grid" },
  { id: "diagonal", label: "Diagonal" },
  { id: "crosshatch", label: "Cross" },
  { id: "vstripes", label: "Stripes" },
  { id: "zigzag", label: "Zigzag" },
  { id: "emoji", label: "Emoji" },
];

function patternImage(id, color, opacity, size) {
  const c = hexToRgba(color, opacity);
  switch (id) {
    case "dots":
      return { backgroundImage: `radial-gradient(${c} 1.5px, transparent 1.5px)`, backgroundSize: `${size}px ${size}px` };
    case "grid":
      return { backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`, backgroundSize: `${size}px ${size}px` };
    case "diagonal":
      return { backgroundImage: `repeating-linear-gradient(45deg, ${c} 0, ${c} 1px, transparent 1px, transparent ${size / 2}px)` };
    case "crosshatch":
      return { backgroundImage: `repeating-linear-gradient(45deg, ${c} 0, ${c} 1px, transparent 1px, transparent ${size / 2}px), repeating-linear-gradient(-45deg, ${c} 0, ${c} 1px, transparent 1px, transparent ${size / 2}px)` };
    case "vstripes":
      return { backgroundImage: `repeating-linear-gradient(90deg, ${c} 0, ${c} 2px, transparent 2px, transparent ${size}px)` };
    case "zigzag":
      return { backgroundImage: `linear-gradient(135deg, ${c} 25%, transparent 25%), linear-gradient(225deg, ${c} 25%, transparent 25%), linear-gradient(45deg, ${c} 25%, transparent 25%), linear-gradient(315deg, ${c} 25%, transparent 25%)`, backgroundSize: `${size}px ${size}px`, backgroundPosition: `${size / 2}px 0, ${size / 2}px 0, 0 0, 0 0` };
    default:
      return {};
  }
}

function emojiImage(emoji, opacity, size) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><text x='50%' y='50%' font-size='${Math.round(size * 0.6)}' text-anchor='middle' dominant-baseline='central' opacity='${opacity}'>${emoji || "✦"}</text></svg>`;
  return { backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, backgroundSize: `${size}px ${size}px` };
}

export function backgroundStyle(bg, fallbackColor = "#FFFFFF") {
  if (!bg || bg.type === "solid") return { backgroundColor: bg?.color || fallbackColor };
  if (bg.type === "gradient") {
    const g = bg.gradient || {};
    return { backgroundImage: `linear-gradient(${g.angle ?? 90}deg, ${g.from || "#000"}, ${g.to || "#333"})` };
  }
  if (bg.type === "pattern") {
    const base = bg.color || fallbackColor;
    const p = bg.pattern || {};
    if (p.id === "emoji") return { backgroundColor: base, ...emojiImage(p.emoji, p.opacity ?? 0.12, p.size || 32) };
    if (p.id && p.id !== "none") return { backgroundColor: base, ...patternImage(p.id, p.patternColor || "#FFFFFF", p.opacity ?? 0.12, p.size || 20) };
    return { backgroundColor: base };
  }
  return { backgroundColor: fallbackColor };
}

/* ---------------- Link banks ---------------- */
export const LINK_ANIMATIONS = [
  { id: "none", label: "None" },
  { id: "underline", label: "Underline" },
  { id: "scale", label: "Scale" },
  { id: "slide-up", label: "Slide Up" },
  { id: "glow", label: "Glow" },
  { id: "highlight", label: "Highlight" },
];

export const LINK_BORDERS = [
  { id: "none", label: "None" },
  { id: "box", label: "Box" },
  { id: "pill", label: "Pill" },
  { id: "bottom", label: "Bottom" },
];

export const linkClass = (style) => `lnk lnk-${style?.animation || "none"} lnkb-${style?.border || "none"}`;

/* ---------------- Button bank ---------------- */
export const BUTTON_VARIANTS = [
  { id: "solid", label: "Solid" },
  { id: "outline", label: "Outline" },
  { id: "ghost", label: "Ghost" },
  { id: "soft", label: "Soft" },
];
export const BUTTON_SIZES = [
  { id: "sm", label: "S" },
  { id: "md", label: "M" },
  { id: "lg", label: "L" },
];
export const BUTTON_ANIMATIONS = [
  { id: "none", label: "None" },
  { id: "lift", label: "Lift" },
  { id: "scale", label: "Scale" },
  { id: "fill", label: "Fill" },
  { id: "shadow", label: "Ring" },
  { id: "slide", label: "Arrow Slide" },
];

export function buttonProps(bs = {}, theme = {}) {
  const variant = bs.variant || "solid";
  const bg = bs.bg || theme.accent || "#0A0A0A";
  const color = bs.color || "#FFFFFF";
  const hover = bs.hoverColor || bg;
  const size = bs.size || "md";
  const pad = { sm: "px-4 py-2 text-xs", md: "px-7 py-3.5 text-sm", lg: "px-9 py-4 text-[15px]" }[size];
  const radius = bs.radius != null ? bs.radius : (theme.radius ?? 0);
  const style = { borderRadius: variant === "pill" ? 9999 : radius, "--btn-bg": bg, "--btn-hover": hover, "--btn-color": color };
  if (variant === "solid") { style.backgroundColor = bg; style.color = color; }
  else if (variant === "outline") { style.border = `1px solid ${bg}`; style.color = bg; style.backgroundColor = "transparent"; }
  else if (variant === "ghost") { style.color = bg; style.backgroundColor = "transparent"; }
  else if (variant === "soft") { style.backgroundColor = hexToRgba(bg, 0.12); style.color = bg; }
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer";
  return { className: `${base} ${pad} btn-${bs.animation || "none"}`, style };
}

export const EMOJI_BANK = ["✦", "★", "✨", "🔥", "⚡", "💎", "🎉", "🛍️", "🚚", "🎁", "❤️", "👑", "🌿", "☀️", "🌙", "🏷️", "✔️", "→", "➜", "🛒", "🔔", "%"];

export const GRADIENT_PRESETS = [
  { from: "#002FA7", to: "#0A0A0A", angle: 90 },
  { from: "#FF3B30", to: "#FF9500", angle: 90 },
  { from: "#0A0A0A", to: "#525252", angle: 135 },
  { from: "#34C759", to: "#002FA7", angle: 120 },
  { from: "#8E44AD", to: "#002FA7", angle: 90 },
  { from: "#FF9500", to: "#FF3B30", angle: 45 },
];

/* ---------------- Block preset banks ---------------- */
export const ANNOUNCEMENT_PRESETS = [
  { name: "Midnight", patch: { background: { type: "solid", color: "#0A0A0A" }, textColor: "#FFFFFF", transition: "slide" } },
  { name: "Electric", patch: { background: { type: "gradient", gradient: { from: "#002FA7", to: "#0A0A0A", angle: 90 } }, textColor: "#FFFFFF", transition: "fade" } },
  { name: "Sunset", patch: { background: { type: "gradient", gradient: { from: "#FF3B30", to: "#FF9500", angle: 90 } }, textColor: "#FFFFFF", transition: "marquee" } },
  { name: "Confetti", patch: { background: { type: "pattern", color: "#0A0A0A", pattern: { id: "emoji", emoji: "✦", opacity: 0.2, size: 30 } }, textColor: "#FFFFFF", transition: "slide" } },
  { name: "Paper", patch: { background: { type: "pattern", color: "#F7F7F7", pattern: { id: "dots", patternColor: "#0A0A0A", opacity: 0.15, size: 16 } }, textColor: "#0A0A0A", transition: "fade" } },
];

export const HEADER_PRESETS = [
  { name: "Clean", patch: { background: { type: "solid", color: "#FFFFFF" }, textColor: "#0A0A0A", layout: "logo-left", linkStyle: { animation: "underline", border: "none", hoverColor: "#002FA7" } } },
  { name: "Dark", patch: { background: { type: "solid", color: "#0A0A0A" }, textColor: "#FFFFFF", layout: "logo-left", linkStyle: { animation: "highlight", border: "none", hoverColor: "#002FA7" } } },
  { name: "Centered", patch: { background: { type: "solid", color: "#FFFFFF" }, textColor: "#0A0A0A", layout: "logo-center", linkStyle: { animation: "slide-up", border: "bottom", hoverColor: "#0A0A0A" } } },
  { name: "Pilled", patch: { background: { type: "solid", color: "#F7F7F7" }, textColor: "#0A0A0A", layout: "logo-left", linkStyle: { animation: "none", border: "pill", hoverColor: "#0A0A0A" } } },
];

export const FOOTER_PRESETS = [
  { name: "Noir", patch: { background: { type: "solid", color: "#0A0A0A" }, textColor: "#FFFFFF" } },
  { name: "Blueprint", patch: { background: { type: "pattern", color: "#0A0A0A", pattern: { id: "grid", patternColor: "#FFFFFF", opacity: 0.08, size: 28 } }, textColor: "#FFFFFF" } },
  { name: "Ivory", patch: { background: { type: "solid", color: "#F7F7F7" }, textColor: "#0A0A0A" } },
  { name: "Deep Blue", patch: { background: { type: "gradient", gradient: { from: "#002FA7", to: "#0A0A0A", angle: 160 } }, textColor: "#FFFFFF" } },
];

export const BUTTON_PRESETS = [
  { name: "Ink", patch: { variant: "solid", bg: "#0A0A0A", color: "#FFFFFF", hoverColor: "#262626", radius: 0, animation: "slide" } },
  { name: "Accent", patch: { variant: "solid", bg: "#002FA7", color: "#FFFFFF", hoverColor: "#00247D", radius: 4, animation: "lift" } },
  { name: "Pill", patch: { variant: "solid", bg: "#0A0A0A", color: "#FFFFFF", radius: 9999, animation: "scale" } },
  { name: "Outline", patch: { variant: "outline", bg: "#0A0A0A", color: "#0A0A0A", radius: 0, animation: "fill", hoverColor: "#0A0A0A" } },
  { name: "Soft", patch: { variant: "soft", bg: "#002FA7", radius: 6, animation: "none" } },
];
