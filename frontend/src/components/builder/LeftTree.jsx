import React from "react";
import { cx } from "./ui";
import { Megaphone, LayoutPanelTop, Menu as MenuIcon, LayoutGrid, PanelBottom, Palette, Blocks } from "lucide-react";

const ITEMS = [
  { section: "theme", label: "Tema", icon: Palette },
  { section: "blocks", label: "Bloques", icon: Blocks },
  { section: "announcementBar", label: "Barra de Anuncios", icon: Megaphone },
  { section: "header", label: "Encabezado", icon: LayoutPanelTop },
  { section: "header", element: "nav-0", label: "Menú", icon: MenuIcon, key: "menu" },
  { section: "sections", label: "Secciones", icon: LayoutGrid },
  { section: "footer", label: "Pie de página", icon: PanelBottom },
];

export const LeftTree = ({ sel, onSelect }) => {
  return (
    <aside className="flex w-[240px] flex-shrink-0 flex-col border-r border-[#E3E9E5] bg-white" data-testid="left-tree">
      <div className="flex-shrink-0 px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7A70]">Estructura</p>
      </div>
      <nav className="flex-1 space-y-1 px-2.5">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const isActive = it.key === "menu"
            ? sel?.section === "header" && String(sel?.element || "").startsWith("nav")
            : sel?.section === it.section && !String(sel?.element || "").startsWith("nav");
          return (
            <button
              key={it.key || it.section}
              onClick={() => onSelect(it.section, it.element || (it.section === "header" ? "shell" : null))}
              data-testid={`tree-${it.key || it.section}`}
              className={cx(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-[#EAF7EF] text-[#0B1510]" : "text-[#4B5A50] hover:bg-[#F1F5F2]"
              )}
            >
              <Icon size={16} className={isActive ? "text-[#3FC16F]" : "text-[#8B978E]"} />
              {it.label}
            </button>
          );
        })}
      </nav>
      <div className="flex-shrink-0 border-t border-[#E3E9E5] p-4">
        <p className="text-[10px] leading-relaxed text-[#8B978E]">Lo que está más arriba aparece más a la izquierda en el sitio.</p>
      </div>
    </aside>
  );
};
