import React from "react";
import { HeaderInspector } from "./HeaderInspector";
import { AnnouncementInspector, FooterInspector, SectionsInspector } from "./OtherInspectors";
import { ThemeInspector, BlocksInspector } from "./ThemeBlocks";
import { MousePointerClick } from "lucide-react";

const TITLES = {
  theme: "Tema y Tipografía",
  blocks: "Banco de Bloques",
  announcementBar: "Barra de Anuncios",
  header: "Encabezado",
  footer: "Pie de página",
  sections: "Secciones",
};

export const Inspector = ({ sel, device, onSelect }) => {
  const section = sel?.section;

  if (!section) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center" data-testid="inspector-empty">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7EF]"><MousePointerClick className="text-[#3FC16F]" /></div>
        <p className="mt-4 text-sm font-medium text-[#0B1510]">Selecciona un elemento en el lienzo</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col" data-testid="inspector">
      <div className="flex-shrink-0 border-b border-[#E3E9E5] px-5 py-4">
        <h2 className="font-heading text-lg font-bold tracking-tight text-[#0B1510]" data-testid="inspector-title">{TITLES[section]}</h2>
      </div>
      <div className="flex-1 overflow-y-auto cms-scroll p-4">
        {section === "header" && <HeaderInspector device={device} sel={sel} onSelect={onSelect} />}
        {section === "theme" && <ThemeInspector />}
        {section === "blocks" && <BlocksInspector />}
        {section === "announcementBar" && <AnnouncementInspector />}
        {section === "footer" && <FooterInspector />}
        {section === "sections" && <SectionsInspector />}
      </div>
    </div>
  );
};
