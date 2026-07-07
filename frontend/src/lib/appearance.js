// Appearance helpers: backgrounds (solid / gradient / pattern / emoji), banks

export function hexToRgba(hex, alpha) {
  const h = (hex || "#000000").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const PATTERNS = [
  { id: "none", label: "None" },
  { id: "dots", label: "Dots" },
  { id: "grid", label: "Grid" },
  { id: "diagonal", label: "Diagonal" },
  { id: "crosshatch", label: "Crosshatch" },
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

export const linkClass = (style) => {
  const anim = `lnk-${style?.animation || "none"}`;
  const border = `lnkb-${style?.border || "none"}`;
  return `lnk ${anim} ${border}`;
};

export const EMOJI_BANK = ["✦", "★", "✨", "🔥", "⚡", "💎", "🎉", "🛍️", "🚚", "🎁", "❤️", "👑", "🌿", "☀️", "🌙", "🏷️", "✔️", "→"];

export const GRADIENT_PRESETS = [
  { from: "#002FA7", to: "#0A0A0A", angle: 90 },
  { from: "#FF3B30", to: "#FF9500", angle: 90 },
  { from: "#0A0A0A", to: "#525252", angle: 135 },
  { from: "#34C759", to: "#002FA7", angle: 120 },
  { from: "#8E44AD", to: "#002FA7", angle: 90 },
  { from: "#FF9500", to: "#FF3B30", angle: 45 },
];
