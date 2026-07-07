import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";

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
