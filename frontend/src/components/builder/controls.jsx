import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import { PATTERNS, GRADIENT_PRESETS, EMOJI_BANK, LINK_ANIMATIONS, LINK_BORDERS } from "@/lib/appearance";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const inputCls = "rounded-none border-[#E5E5E5] focus-visible:ring-1 focus-visible:ring-black text-sm";

export const LabelRow = ({ children }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#525252] mb-1.5">{children}</p>
);

export const TextField = ({ label, value, onChange, placeholder, testid }) => (
  <div>
    <LabelRow>{label}</LabelRow>
    <Input value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} data-testid={testid} />
  </div>
);

export const TextAreaField = ({ label, value, onChange, testid }) => (
  <div>
    <LabelRow>{label}</LabelRow>
    <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} className={`${inputCls} min-h-[70px]`} data-testid={testid} />
  </div>
);

export const ColorField = ({ label, value, onChange, testid }) => (
  <div>
    <LabelRow>{label}</LabelRow>
    <div className="flex items-center gap-2 border border-[#E5E5E5]">
      <label className="relative h-9 w-11 cursor-pointer border-r border-[#E5E5E5]" style={{ backgroundColor: value }}>
        <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" data-testid={testid} />
      </label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent px-2 py-2 text-sm outline-none uppercase" />
    </div>
  </div>
);

export const SwitchRow = ({ label, checked, onChange, testid }) => (
  <div className="flex items-center justify-between py-1">
    <Label className="text-sm font-medium text-[#0A0A0A]">{label}</Label>
    <Switch checked={!!checked} onCheckedChange={onChange} data-testid={testid} />
  </div>
);

export const SliderField = ({ label, value, min, max, step, onChange, suffix, testid }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <LabelRow>{label}</LabelRow>
      <span className="text-xs text-[#525252]">{value}{suffix}</span>
    </div>
    <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} data-testid={testid} />
  </div>
);

export const SelectField = ({ label, value, options, onChange, testid }) => (
  <div>
    <LabelRow>{label}</LabelRow>
    <div className="grid grid-cols-2 gap-1.5" data-testid={testid}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`border px-3 py-2 text-xs font-medium transition-colors ${
            value === o.value ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E5E5E5] text-[#525252] hover:bg-[#F7F7F7]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

export const LinkListEditor = ({ label, items, onChange, fields = ["label", "href"], testidPrefix }) => {
  const update = (i, key, val) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const add = () => onChange([...items, fields.reduce((a, f) => ({ ...a, [f]: f === "href" ? "#" : "New" }), {})]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <LabelRow>{label}</LabelRow>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-1.5" data-testid={`${testidPrefix}-item-${i}`}>
            {fields.map((f) => (
              <Input
                key={f}
                value={it[f] || ""}
                placeholder={f}
                onChange={(e) => update(i, f, e.target.value)}
                className={`${inputCls} h-8`}
              />
            ))}
            <button onClick={() => remove(i)} className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-[#E5E5E5] text-[#A3A3A3] hover:bg-[#F7F7F7] hover:text-[#FF3B30]" data-testid={`${testidPrefix}-remove-${i}`}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <button onClick={add} className="flex w-full items-center justify-center gap-1.5 border border-dashed border-[#D4D4D4] py-2 text-xs font-medium text-[#525252] hover:bg-[#F7F7F7]" data-testid={`${testidPrefix}-add`}>
          <Plus size={13} /> Add
        </button>
      </div>
    </div>
  );
};

export const EmojiField = ({ label, value, onChange, testid }) => (
  <div>
    {label ? <LabelRow>{label}</LabelRow> : null}
    <div className="flex items-center gap-2 border border-[#E5E5E5]">
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="none" className="flex-1 bg-transparent px-2 py-2 text-sm outline-none" data-testid={testid} />
      <Popover>
        <PopoverTrigger asChild>
          <button className="h-9 border-l border-[#E5E5E5] px-3 text-sm hover:bg-[#F7F7F7]" data-testid={`${testid}-open`}>{value || "😀"}</button>
        </PopoverTrigger>
        <PopoverContent className="w-56 rounded-none border-[#E5E5E5] p-2">
          <div className="grid grid-cols-6 gap-1">
            {EMOJI_BANK.map((e) => (
              <button key={e} onClick={() => onChange(e)} className="flex h-8 w-8 items-center justify-center text-lg hover:bg-[#F7F7F7]">{e}</button>
            ))}
            <button onClick={() => onChange("")} className="col-span-6 border border-[#E5E5E5] py-1 text-xs text-[#525252] hover:bg-[#F7F7F7]">Clear</button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
);

export const BackgroundControl = ({ label, value, onChange, testidPrefix }) => {
  const bg = value || { type: "solid", color: "#000000" };
  const set = (patch) => onChange({ ...bg, ...patch });
  const setGradient = (patch) => onChange({ ...bg, gradient: { ...(bg.gradient || {}), ...patch } });
  const setPattern = (patch) => onChange({ ...bg, pattern: { ...(bg.pattern || {}), ...patch } });
  const tabs = [{ id: "solid", label: "Solid" }, { id: "gradient", label: "Gradient" }, { id: "pattern", label: "Pattern" }];

  return (
    <div className="border border-[#E5E5E5] p-3" data-testid={testidPrefix}>
      <LabelRow>{label}</LabelRow>
      <div className="mb-3 grid grid-cols-3 gap-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => set({ type: t.id })} data-testid={`${testidPrefix}-type-${t.id}`}
            className={`border px-2 py-1.5 text-xs font-medium transition-colors ${bg.type === t.id ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E5E5E5] text-[#525252] hover:bg-[#F7F7F7]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {bg.type === "solid" && (
        <ColorField label="Color" value={bg.color} onChange={(v) => set({ color: v })} testid={`${testidPrefix}-color`} />
      )}

      {bg.type === "gradient" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ColorField label="From" value={bg.gradient?.from} onChange={(v) => setGradient({ from: v })} />
            <ColorField label="To" value={bg.gradient?.to} onChange={(v) => setGradient({ to: v })} />
          </div>
          <SliderField label="Angle" value={bg.gradient?.angle ?? 90} min={0} max={360} step={5} suffix="°" onChange={(v) => setGradient({ angle: v })} />
          <div className="flex flex-wrap gap-1.5">
            {GRADIENT_PRESETS.map((g, i) => (
              <button key={i} onClick={() => setGradient(g)} className="h-7 w-7 border border-[#E5E5E5]" style={{ backgroundImage: `linear-gradient(${g.angle}deg, ${g.from}, ${g.to})` }} title="preset" />
            ))}
          </div>
        </div>
      )}

      {bg.type === "pattern" && (
        <div className="space-y-3">
          <ColorField label="Base color" value={bg.color} onChange={(v) => set({ color: v })} />
          <div>
            <LabelRow>Pattern</LabelRow>
            <div className="grid grid-cols-4 gap-1" data-testid={`${testidPrefix}-patterns`}>
              {PATTERNS.map((p) => (
                <button key={p.id} onClick={() => setPattern({ id: p.id })}
                  className={`border px-1 py-1.5 text-[10px] font-medium ${bg.pattern?.id === p.id ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E5E5E5] text-[#525252] hover:bg-[#F7F7F7]"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {bg.pattern?.id === "emoji" ? (
            <EmojiField label="Emoji" value={bg.pattern?.emoji} onChange={(v) => setPattern({ emoji: v })} testid={`${testidPrefix}-emoji`} />
          ) : bg.pattern?.id && bg.pattern?.id !== "none" ? (
            <ColorField label="Pattern color" value={bg.pattern?.patternColor} onChange={(v) => setPattern({ patternColor: v })} />
          ) : null}
          {bg.pattern?.id && bg.pattern?.id !== "none" && (
            <>
              <SliderField label="Opacity" value={Math.round((bg.pattern?.opacity ?? 0.12) * 100)} min={2} max={100} step={2} suffix="%" onChange={(v) => setPattern({ opacity: v / 100 })} />
              <SliderField label="Scale" value={bg.pattern?.size ?? 20} min={8} max={80} step={2} suffix="px" onChange={(v) => setPattern({ size: v })} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const LinkStyleControl = ({ value, onChange, testidPrefix }) => {
  const s = value || {};
  const set = (patch) => onChange({ ...s, ...patch });
  return (
    <div className="space-y-4">
      <div>
        <LabelRow>Hover animation</LabelRow>
        <div className="grid grid-cols-3 gap-1" data-testid={`${testidPrefix}-anim`}>
          {LINK_ANIMATIONS.map((a) => (
            <button key={a.id} onClick={() => set({ animation: a.id })}
              className={`border px-2 py-1.5 text-[11px] font-medium ${s.animation === a.id ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E5E5E5] text-[#525252] hover:bg-[#F7F7F7]"}`}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <LabelRow>Border style</LabelRow>
        <div className="grid grid-cols-4 gap-1" data-testid={`${testidPrefix}-border`}>
          {LINK_BORDERS.map((b) => (
            <button key={b.id} onClick={() => set({ border: b.id })}
              className={`border px-2 py-1.5 text-[11px] font-medium ${s.border === b.id ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E5E5E5] text-[#525252] hover:bg-[#F7F7F7]"}`}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <ColorField label="Hover color" value={s.hoverColor} onChange={(v) => set({ hoverColor: v })} testid={`${testidPrefix}-hovercolor`} />
      <SwitchRow label="Show link icons" checked={s.showIcon} onChange={(v) => set({ showIcon: v })} testid={`${testidPrefix}-showicon`} />
    </div>
  );
};
