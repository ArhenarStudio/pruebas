import React, { useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { Storefront } from "@/components/storefront/Storefront";
import { TopBar } from "@/components/builder/TopBar";
import { LeftTree } from "@/components/builder/LeftTree";
import { Inspector } from "@/components/builder/Inspector";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const FRAME_W = { desktop: "100%", tablet: "834px", mobile: "400px" };

export default function Builder() {
  const { config, loading, saving, dirty, save, reset, undo, redo, canUndo, canRedo } = useConfig();
  const [device, setDevice] = useState("desktop");
  const [sel, setSel] = useState({ section: "header", element: "shell" });

  const onSelect = (section, element = null) => setSel(section ? { section, element } : { section: null, element: null });

  const handleReset = async () => { await reset(); toast.success("Restablecido"); };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#F7F9F8]"><Loader2 className="animate-spin text-[#3FC16F]" /></div>;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F7F9F8]">
      <TopBar device={device} setDevice={setDevice} undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} dirty={dirty} saving={saving} onSave={save} onReset={handleReset} />

      <div className="flex flex-1 overflow-hidden">
        <LeftTree sel={sel} onSelect={onSelect} />

        <main className="flex flex-1 flex-col overflow-hidden bg-[#EDF1EE] p-5" data-testid="canvas">
          <div className="mx-auto flex h-full flex-col overflow-hidden rounded-2xl border border-[#E3E9E5] bg-white shadow-sm transition-all duration-300" style={{ width: FRAME_W[device], maxWidth: "100%" }}>
            <div className="flex h-9 flex-shrink-0 items-center gap-2 border-b border-[#E3E9E5] px-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E3E9E5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E3E9E5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E3E9E5]" />
              </div>
              <div className="mx-auto flex items-center rounded-md bg-[#F1F5F2] px-3 py-0.5 text-[11px] text-[#6B7A70]">lotocorp.mx</div>
            </div>
            <div className="flex-1 overflow-hidden">
              <Storefront config={config} editable sel={sel} onSelect={onSelect} device={device} />
            </div>
          </div>
        </main>

        <aside className="w-[360px] flex-shrink-0 border-l border-[#E3E9E5] bg-white" data-testid="right-inspector">
          <Inspector sel={sel} device={device} onSelect={onSelect} />
        </aside>
      </div>
    </div>
  );
}
