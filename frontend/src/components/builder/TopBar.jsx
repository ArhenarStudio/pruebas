import React from "react";
import { cx } from "./ui";
import { Monitor, Tablet, Smartphone, Undo2, Redo2, Eye, Check, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const TopBar = ({ device, setDevice, undo, redo, canUndo, canRedo, dirty, saving, onSave, onReset }) => {
  const devices = [
    { id: "desktop", Icon: Monitor },
    { id: "tablet", Icon: Tablet },
    { id: "mobile", Icon: Smartphone },
  ];
  const handleSave = async () => {
    const ok = await onSave();
    toast[ok ? "success" : "error"](ok ? "Cambios publicados" : "Error al publicar");
  };
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#E3E9E5] bg-white px-4" data-testid="top-bar">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3FC16F] font-heading text-base font-extrabold text-[#062012]">S</div>
        <div className="leading-none">
          <p className="font-heading text-sm font-bold tracking-tight text-[#0B1510]">Sorthea Studio</p>
          <p className="text-[10px] text-[#8B978E]">Visual Order · v2</p>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-xl bg-[#F1F5F2] p-1" data-testid="device-toggle">
        {devices.map(({ id, Icon }) => (
          <button key={id} onClick={() => setDevice(id)} data-testid={`device-${id}`}
            className={cx("flex h-8 w-9 items-center justify-center rounded-lg transition-all", device === id ? "bg-white text-[#0B1510] shadow-sm" : "text-[#8B978E] hover:text-[#0B1510]")}>
            <Icon size={16} />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-[#E3E9E5]">
          <button onClick={undo} disabled={!canUndo} className="flex h-8 w-8 items-center justify-center text-[#4B5A50] hover:bg-[#F1F5F2] disabled:opacity-30" data-testid="undo" title="Deshacer"><Undo2 size={15} /></button>
          <button onClick={redo} disabled={!canRedo} className="flex h-8 w-8 items-center justify-center border-l border-[#E3E9E5] text-[#4B5A50] hover:bg-[#F1F5F2] disabled:opacity-30" data-testid="redo" title="Rehacer"><Redo2 size={15} /></button>
        </div>
        <button onClick={onReset} className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E3E9E5] px-3 text-[13px] font-medium text-[#4B5A50] hover:bg-[#F1F5F2]" data-testid="reset" title="Restablecer"><RotateCcw size={14} /></button>
        <a href="/store" target="_blank" rel="noreferrer" className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E3E9E5] px-3 text-[13px] font-semibold text-[#0B1510] hover:bg-[#F1F5F2]" data-testid="preview"><Eye size={15} /> Vista previa</a>
        <button onClick={handleSave} disabled={saving || !dirty} className="flex h-8 items-center gap-1.5 rounded-lg bg-[#3FC16F] px-4 text-[13px] font-bold text-[#062012] transition-colors hover:bg-[#34A85F] disabled:opacity-40" data-testid="publish">
          {saving ? <Loader2 size={14} className="animate-spin" /> : dirty ? null : <Check size={14} />}
          {dirty ? "Publicar" : "Publicado"}
        </button>
      </div>
    </header>
  );
};
