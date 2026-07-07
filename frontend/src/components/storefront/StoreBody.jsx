import React from "react";
import { sorteos, ganadores, comoPasos } from "@/lib/siteData";
import { Ticket, ArrowRight, ShieldCheck, Radio } from "lucide-react";

const SorteosSection = ({ onAdd }) => (
  <section id="sorteos" className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16">
    <div className="mb-8 flex items-end justify-between">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3FC16F]">Sorteos Activos</span>
        <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-white">Elige y gana</h2>
      </div>
      <a href="#" className="hidden items-center gap-1 text-sm font-semibold text-[#3FC16F] sm:inline-flex">Ver todos <ArrowRight size={15} /></a>
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sorteos.map((s) => (
        <div key={s.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101B14]" data-testid={`sorteo-${s.id}`}>
          <div className="relative aspect-[16/11] overflow-hidden">
            <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute left-3 top-3 rounded-full bg-[#3FC16F] px-2.5 py-1 text-[11px] font-bold text-[#062012]">{s.tag}</span>
          </div>
          <div className="p-5">
            <p className="text-xs text-white/50">{s.subtitle}</p>
            <h3 className="mt-1 font-heading text-lg font-bold text-white">{s.title}</h3>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[11px] text-white/50"><span>Vendidos</span><span>{s.sold}%</span></div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#3FC16F]" style={{ width: `${s.sold}%` }} /></div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-heading text-xl font-extrabold text-white">${s.price}<span className="text-xs font-normal text-white/50"> /boleto</span></span>
              <button onClick={() => onAdd(s)} data-testid={`sorteo-add-${s.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#3FC16F] px-4 py-2 text-sm font-bold text-[#062012] transition-transform hover:scale-105">
                <Ticket size={15} /> Comprar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const ComoSection = () => (
  <section id="como" className="border-y border-white/10 bg-[#0C1610]">
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3FC16F]">Cómo Participar</span>
      <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-white">Ganar es muy fácil</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {comoPasos.map((p) => (
          <div key={p.n} className="rounded-2xl border border-white/10 bg-[#101B14] p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3FC16F] font-heading text-lg font-extrabold text-[#062012]">{p.n}</span>
            <h3 className="mt-4 font-heading text-lg font-bold text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const GanadoresSection = () => (
  <section id="ganadores" className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16">
    <div className="flex items-center gap-2 text-[#3FC16F]"><Radio size={16} /><span className="text-[11px] font-semibold uppercase tracking-[0.16em]">Ganadores Reales</span></div>
    <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-white">Ellos ya ganaron</h2>
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      {ganadores.map((g) => (
        <div key={g.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#101B14] p-4">
          <img src={g.image} alt={g.name} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
          <div>
            <h3 className="font-heading text-lg font-bold text-white">{g.name}</h3>
            <p className="text-sm text-[#3FC16F]">Ganó: {g.prize}</p>
            <p className="text-xs text-white/50">{g.city}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const RENDERERS = { sorteos: SorteosSection, como: ComoSection, ganadores: GanadoresSection };

export const StoreBody = ({ sections = [], onAdd }) => (
  <div className="bg-[#0B1510]">
    {/* Static hero banner (demo content) */}
    <section className="relative overflow-hidden border-b border-white/10">
      <img src={sorteos[0].image} alt="hero" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,21,16,0.75), rgba(11,21,16,0.96))" }} />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 py-20 lg:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#3FC16F]/40 bg-[#3FC16F]/10 px-3 py-1 text-xs font-semibold text-[#3FC16F]"><ShieldCheck size={13} /> Sorteo auditado — Permiso SEGOB</span>
        <h1 className="mt-5 max-w-2xl font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.03]">Gana un Mercedes-AMG desde <span className="text-[#3FC16F]">$250</span></h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">Participa en el sorteo más grande de México. Boletos limitados, transmisión en vivo con la Lotería Nacional.</p>
        <div className="mt-8 flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-[#3FC16F] px-7 py-3.5 text-sm font-bold text-[#062012] transition-transform hover:scale-105"><Ticket size={16} /> Comprar boletos</button>
          <button className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/5">Ver bases</button>
        </div>
      </div>
    </section>

    {sections.filter((s) => s.enabled !== false).map((s) => {
      const R = RENDERERS[s.id];
      return R ? <R key={s.id} onAdd={onAdd} /> : null;
    })}
  </div>
);
