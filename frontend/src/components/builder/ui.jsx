import React, { useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { PATTERNS, GRADIENT_PRESETS, EMOJI_BANK } from "@/lib/appearance";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const cx = (...a) => a.filter(Boolean).join(" ");
export const move = (arr, from, to) => { const n = [...arr]; const [x] = n.splice(from, 1); n.splice(to, 0, x); return n; };

export const Label = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6B7A70]">{children}</span>
);

export const TextInput = ({ value, onChange, placeholder, testid, className }) => (
  <input
    value={value ?? ""}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    data-testid={testid}
    className={cx("h-9 w-full rounded-lg border border-[#E3E9E5] bg-white px-3 text-sm text-[#0B1510] outline-none transition-colors focus:border-[#3FC16F] focus:ring-1 focus:ring-[#3FC16F]", className)}
  />
);

export const ColorInput = ({ value, onChange, testid }) => (
  <div className="flex items-center gap-2 rounded-lg border border-[#E3E9E5] bg-white">
    <label className="relative h-8 w-9 cursor-pointer rounded-l-lg border-r border-[#E3E9E5]" style={{ backgroundColor: value }}>
      <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" data-testid={testid} />
    </label>
    <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent px-1 py-1.5 text-xs uppercase text-[#0B1510] outline-none" />
  </div>
);

export const SliderRow = ({ label, value, min, max, step = 1, suffix = "", onChange, testid }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between">
      <Label>{label}</Label>
      <span className="text-xs font-medium text-[#0B1510]">{value}{suffix}</span>
    </div>
    <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} data-testid={testid} />
  </div>
);

export const SwitchRow = ({ label, checked, onChange, testid }) => (
  <div className="flex items-center justify-between py-0.5">
    <span className="text-sm font-medium text-[#0B1510]">{label}</span>
    <Switch checked={!!checked} onCheckedChange={onChange} data-testid={testid} />
  </div>
);

export const Segmented = ({ value, options, onChange, testid, cols }) => (
  <div className={cx("grid gap-1 rounded-lg bg-[#F1F5F2] p-1", cols ? `grid-cols-${cols}` : "grid-cols-2")} data-testid={testid}>
    {options.map((o) => (
      <button key={o.value} onClick={() => onChange(o.value)} data-testid={testid ? `${testid}-${o.value}` : undefined}
        className={cx("rounded-md px-2 py-1.5 text-xs font-semibold transition-all", value === o.value ? "bg-white text-[#0B1510] shadow-sm" : "text-[#6B7A70] hover:text-[#0B1510]")}>
        {o.label}
      </button>
    ))}
  </div>
);

export const FitMeter = ({ status, count, max }) => {
  const color = status === "green" ? "#3FC16F" : status === "amber" ? "#E0A106" : "#E5484D";
  const pct = Math.min(100, (count / max) * 100);
  return (
    <div className="flex items-center gap-2" data-testid="fit-meter" data-status={status}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EDF1EE]">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] font-semibold" style={{ color }}>{count}/{max}</span>
    </div>
  );
};

export const RowCard = ({ children, active, dragHandleProps, testid, onClick, rowRef }) => (
  <div
    ref={rowRef}
    onClick={onClick}
    data-testid={testid}
    className={cx("rounded-xl border bg-white transition-colors", active ? "border-[#3FC16F] ring-1 ring-[#3FC16F]" : "border-[#E3E9E5] hover:border-[#c9d4cd]")}
  >
    <div className="flex items-stretch">
      <div {...dragHandleProps} className="flex cursor-grab items-center px-1.5 text-[#B7C2BA] active:cursor-grabbing" title="Arrastra para reordenar">
        <GripVertical size={15} />
      </div>
      <div className="flex-1 py-2.5 pr-3">{children}</div>
    </div>
  </div>
);

export function useDnd(onReorder) {
  const dragIndex = useRef(null);
  const handleProps = (index) => ({
    draggable: true,
    onDragStart: (e) => { dragIndex.current = index; e.dataTransfer.effectAllowed = "move"; },
    onDragEnd: () => { dragIndex.current = null; },
  });
  const rowProps = (index) => ({
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => { e.preventDefault(); e.stopPropagation(); const from = dragIndex.current; if (from == null || from === index) return; onReorder(from, index); dragIndex.current = null; },
  });
  return { handleProps, rowProps };
}

export const EmojiInput = ({ value, onChange, testid }) => (
  <div className="flex items-center gap-2 rounded-lg border border-[#E3E9E5] bg-white">
    <input value={value ?? ""} placeholder="—" onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent px-2 py-1.5 text-sm outline-none" data-testid={testid} />
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-8 rounded-r-lg border-l border-[#E3E9E5] px-3 text-sm hover:bg-[#F1F5F2]" data-testid={testid ? `${testid}-open` : undefined}>{value || "😀"}</button>
      </PopoverTrigger>
      <PopoverContent className="w-56 rounded-lg border-[#E3E9E5] p-2">
        <div className="grid grid-cols-6 gap-1">
          {EMOJI_BANK.map((e) => (<button key={e} onClick={() => onChange(e)} className="flex h-8 w-8 items-center justify-center rounded text-lg hover:bg-[#F1F5F2]">{e}</button>))}
          <button onClick={() => onChange("")} className="col-span-6 rounded border border-[#E3E9E5] py-1 text-xs text-[#6B7A70] hover:bg-[#F1F5F2]">Limpiar</button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

export const ColorStates = ({ link, onChange, testidPrefix }) => {
  const [tab, setTab] = useState("normalColor");
  const tabs = [{ id: "normalColor", label: "Normal" }, { id: "hoverColor", label: "Hover" }, { id: "activeColor", label: "Activo" }];
  return (
    <div>
      <div className="mb-1.5 grid grid-cols-3 gap-1 rounded-lg bg-[#F1F5F2] p-1" data-testid={`${testidPrefix}-tabs`}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} data-testid={`${testidPrefix}-tab-${t.id}`}
            className={cx("rounded-md px-2 py-1 text-[11px] font-semibold transition-all", tab === t.id ? "bg-white text-[#0B1510] shadow-sm" : "text-[#6B7A70]")}>
            {t.label}
          </button>
        ))}
      </div>
      <ColorInput value={link[tab]} onChange={(v) => onChange({ [tab]: v })} testid={`${testidPrefix}-${tab}`} />
    </div>
  );
};

export const BackgroundEngine = ({ value, onChange, testidPrefix }) => {
  const bg = value || { type: "solid", color: "#0B1510" };
  const set = (patch) => onChange({ ...bg, ...patch });
  const setGradient = (patch) => onChange({ ...bg, gradient: { ...(bg.gradient || {}), ...patch } });
  const setPattern = (patch) => onChange({ ...bg, pattern: { ...(bg.pattern || {}), ...patch } });
  return (
    <div className="space-y-3" data-testid={testidPrefix}>
      <Segmented value={bg.type} onChange={(v) => set({ type: v })} testid={`${testidPrefix}-type`} cols={3}
        options={[{ value: "solid", label: "Sólido" }, { value: "gradient", label: "Degradado" }, { value: "pattern", label: "Patrón" }]} />
      {bg.type === "solid" && <ColorInput value={bg.color} onChange={(v) => set({ color: v })} testid={`${testidPrefix}-color`} />}
      {bg.type === "gradient" && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Desde</Label><ColorInput value={bg.gradient?.from} onChange={(v) => setGradient({ from: v })} /></div>
            <div><Label>Hasta</Label><ColorInput value={bg.gradient?.to} onChange={(v) => setGradient({ to: v })} /></div>
          </div>
          <SliderRow label="Ángulo" value={bg.gradient?.angle ?? 90} min={0} max={360} step={5} suffix="°" onChange={(v) => setGradient({ angle: v })} />
          <div className="flex flex-wrap gap-1.5">
            {GRADIENT_PRESETS.map((g, i) => (<button key={i} onClick={() => setGradient(g)} className="h-6 w-6 rounded border border-[#E3E9E5]" style={{ backgroundImage: `linear-gradient(${g.angle}deg, ${g.from}, ${g.to})` }} />))}
          </div>
        </div>
      )}
      {bg.type === "pattern" && (
        <div className="space-y-2.5">
          <div><Label>Color base</Label><ColorInput value={bg.color} onChange={(v) => set({ color: v })} /></div>
          <div className="grid grid-cols-4 gap-1" data-testid={`${testidPrefix}-patterns`}>
            {PATTERNS.map((p) => (
              <button key={p.id} onClick={() => setPattern({ id: p.id })}
                className={cx("rounded-md border px-1 py-1.5 text-[10px] font-semibold", bg.pattern?.id === p.id ? "border-[#3FC16F] bg-[#EAF7EF] text-[#0B1510]" : "border-[#E3E9E5] text-[#6B7A70] hover:bg-[#F1F5F2]")}>
                {p.label}
              </button>
            ))}
          </div>
          {bg.pattern?.id === "emoji" ? (
            <div><Label>Emoji</Label><EmojiInput value={bg.pattern?.emoji} onChange={(v) => setPattern({ emoji: v })} /></div>
          ) : bg.pattern?.id && bg.pattern?.id !== "none" ? (
            <div><Label>Color patrón</Label><ColorInput value={bg.pattern?.patternColor} onChange={(v) => setPattern({ patternColor: v })} /></div>
          ) : null}
          {bg.pattern?.id && bg.pattern?.id !== "none" && (
            <>
              <SliderRow label="Opacidad" value={Math.round((bg.pattern?.opacity ?? 0.12) * 100)} min={2} max={100} step={2} suffix="%" onChange={(v) => setPattern({ opacity: v / 100 })} />
              <SliderRow label="Escala" value={bg.pattern?.size ?? 20} min={8} max={80} step={2} suffix="px" onChange={(v) => setPattern({ size: v })} />
            </>
          )}
        </div>
      )}
    </div>
  );
};
