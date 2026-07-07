import React from "react";
import { useConfig } from "@/context/ConfigContext";
import { Label, TextInput, ColorInput, SliderRow, SwitchRow, Segmented, RowCard, useDnd, move, BackgroundEngine } from "./ui";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export const AnnouncementInspector = () => {
  const { config, updateSection } = useConfig();
  const c = config.announcementBar;
  const set = (patch) => updateSection("announcementBar", patch);
  const list = c.announcements || [];
  const setList = (l) => set({ announcements: l });
  const update = (i, patch) => setList(list.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  const dnd = useDnd((from, to) => setList(move(list, from, to)));

  return (
    <div className="space-y-3" data-testid="announcement-inspector">
      <SwitchRow label="Mostrar barra" checked={c.enabled} onChange={(v) => set({ enabled: v })} testid="ann-enabled" />

      <Label>Mensajes (orden = rotación)</Label>
      {list.map((a, i) => (
        <RowCard key={i} testid={`ann-row-${i}`} dragHandleProps={dnd.handleProps(i)}>
          <div {...dnd.rowProps(i)}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6B7A70]">#{i + 1}</span>
              <button onClick={() => setList(list.filter((_, idx) => idx !== i))} className="text-[#B7C2BA] hover:text-[#E5484D]" data-testid={`ann-remove-${i}`}><Trash2 size={14} /></button>
            </div>
            <Textarea value={a.text || ""} onChange={(e) => update(i, { text: e.target.value })} className="mb-2 min-h-[48px] rounded-lg border-[#E3E9E5] text-sm focus-visible:ring-[#3FC16F]" data-testid={`ann-text-${i}`} />
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={a.linkLabel} onChange={(v) => update(i, { linkLabel: v })} placeholder="Texto enlace" />
              <TextInput value={a.link} onChange={(v) => update(i, { link: v })} placeholder="URL" />
            </div>
          </div>
        </RowCard>
      ))}
      <button onClick={() => setList([...list, { text: "Nuevo anuncio", linkLabel: "", link: "#" }])} data-testid="ann-add"
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#CBD6CF] py-2.5 text-xs font-semibold text-[#4B5A50] hover:bg-[#F1F5F2]"><Plus size={14} /> Agregar mensaje</button>

      <div><Label>Transición</Label>
        <Segmented value={c.transition} onChange={(v) => set({ transition: v })} testid="ann-transition" cols={4}
          options={[{ value: "slide", label: "Slide" }, { value: "fade", label: "Fade" }, { value: "marquee", label: "Marq." }, { value: "none", label: "Fija" }]} />
      </div>
      {c.transition !== "marquee" && c.transition !== "none" && (
        <SliderRow label="Intervalo" value={c.interval} min={1500} max={10000} step={500} suffix="ms" onChange={(v) => set({ interval: v })} testid="ann-interval" />
      )}
      <SliderRow label="Alto (padding)" value={c.paddingY} min={4} max={28} suffix="px" onChange={(v) => set({ paddingY: v })} testid="ann-padding" />
      <div><Label>Fondo</Label><BackgroundEngine value={c.background} onChange={(v) => set({ background: v })} testidPrefix="ann-bg" /></div>
      <div><Label>Color de texto</Label><ColorInput value={c.textColor} onChange={(v) => set({ textColor: v })} testid="ann-textcolor" /></div>
      <SwitchRow label="Se puede cerrar" checked={c.dismissible} onChange={(v) => set({ dismissible: v })} testid="ann-dismissible" />
    </div>
  );
};

export const FooterInspector = () => {
  const { config, updateSection } = useConfig();
  const c = config.footer;
  const set = (patch) => updateSection("footer", patch);
  const updateCol = (i, patch) => set({ columns: c.columns.map((col, idx) => (idx === i ? { ...col, ...patch } : col)) });
  const updateLink = (ci, li, patch) => updateCol(ci, { links: c.columns[ci].links.map((l, idx) => (idx === li ? { ...l, ...patch } : l)) });

  return (
    <div className="space-y-3" data-testid="footer-inspector">
      <div><Label>Marca</Label><TextInput value={c.brandName} onChange={(v) => set({ brandName: v })} testid="ftr-brand" /></div>
      <div><Label>Descripción</Label><Textarea value={c.tagline} onChange={(e) => set({ tagline: e.target.value })} className="min-h-[56px] rounded-lg border-[#E3E9E5] text-sm focus-visible:ring-[#3FC16F]" data-testid="ftr-tagline" /></div>
      <div><Label>Fondo</Label><BackgroundEngine value={c.background} onChange={(v) => set({ background: v })} testidPrefix="ftr-bg" /></div>
      <div><Label>Color de texto</Label><ColorInput value={c.textColor} onChange={(v) => set({ textColor: v })} testid="ftr-textcolor" /></div>
      <Label>Columnas</Label>
      {c.columns.map((col, ci) => (
        <div key={ci} className="rounded-xl border border-[#E3E9E5] bg-white p-3" data-testid={`ftr-col-${ci}`}>
          <TextInput value={col.title} onChange={(v) => updateCol(ci, { title: v })} testid={`ftr-col-title-${ci}`} className="mb-2 font-semibold" />
          <div className="space-y-1.5">
            {col.links.map((l, li) => (
              <div key={li} className="flex gap-1.5">
                <TextInput value={l.label} onChange={(v) => updateLink(ci, li, { label: v })} placeholder="Etiqueta" />
                <TextInput value={l.href} onChange={(v) => updateLink(ci, li, { href: v })} placeholder="URL" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div><Label>Copyright</Label><TextInput value={c.copyright} onChange={(v) => set({ copyright: v })} testid="ftr-copyright" /></div>
    </div>
  );
};

export const SectionsInspector = () => {
  const { config, setSection } = useConfig();
  const list = config.sections || [];
  const dnd = useDnd((from, to) => setSection("sections", move(list, from, to)));
  const toggle = (i) => setSection("sections", list.map((s, idx) => (idx === i ? { ...s, enabled: !s.enabled } : s)));

  return (
    <div className="space-y-2.5" data-testid="sections-inspector">
      <p className="px-1 text-xs text-[#6B7A70]">El orden vertical = el orden en el sitio.</p>
      {list.map((s, i) => (
        <RowCard key={s.id} testid={`sec-row-${s.id}`} dragHandleProps={dnd.handleProps(i)}>
          <div {...dnd.rowProps(i)} className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#0B1510]">{s.label}</span>
            <SwitchRow label="" checked={s.enabled} onChange={() => toggle(i)} testid={`sec-toggle-${s.id}`} />
          </div>
        </RowCard>
      ))}
    </div>
  );
};
