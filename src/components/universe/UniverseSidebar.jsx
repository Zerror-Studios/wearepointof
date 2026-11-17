"use client";
import React, { useState } from "react";
import { saturn, chevron } from "@/helper/universeArt";
import { universeIntro, universeGroups } from "@/helper/universeData";

const SaturnIcon = () => (
  <svg viewBox="23 33 32 20" className="w-[31px] h-[19px] shrink-0" fill="#E8E8E0" aria-hidden="true">
    {saturn.map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

const Chevron = ({ open }) => (
  <svg
    viewBox="236 334 15 10"
    className={`w-[14px] h-[9px] transition-transform duration-300 ${open ? "" : "-rotate-90"}`}
    fill="#E8E8E1"
    fillOpacity="0.5"
    aria-hidden="true"
  >
    <path d={chevron} />
  </svg>
);

const NavItem = ({ item, active, onNavigate }) => (
  <li>
    <button
      type="button"
      onClick={() => item.ready && onNavigate(item.id)}
      aria-current={active ? "true" : undefined}
      aria-disabled={!item.ready || undefined}
      title={item.ready ? undefined : "Coming soon"}
      className={`w-full h-[47px] flex items-center gap-[1ch] pl-[25px] pr-4 text-left text-[15px] tracking-[0.2px] text-[#E8E8E1] transition-colors duration-300 ${
        active ? "bg-[#2a2a2a]" : item.ready ? "hover:bg-white/5 cursor-pointer" : "cursor-default"
      }`}
    >
      <span>{item.n}</span>
      <span className="truncate">{item.label}</span>
    </button>
  </li>
);

const Group = ({ group, activeId, onNavigate }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-[23px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full h-[47px] flex items-center justify-between pl-[27px] pr-[37px] cursor-pointer"
      >
        <span className="text-[19px] font-bold tracking-[0.2px] text-[#E8E8E1]">{group.title}</span>
        <Chevron open={open} />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-400 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <ul className="overflow-hidden">
          {group.items.map((item) => (
            <NavItem key={item.id} item={item} active={activeId === item.id} onNavigate={onNavigate} />
          ))}
        </ul>
      </div>
    </div>
  );
};

const UniverseSidebar = ({ activeId, onNavigate }) => (
  <nav aria-label="Universe sections" className="h-full overflow-y-auto pb-10" data-lenis-prevent>
    <div className="flex items-center gap-2 h-[86px] pl-6">
      <SaturnIcon />
      <span className="font-heading font-light text-[22px] text-[#E8E8E0] leading-none">Universe</span>
    </div>

    <ul className="mt-[18px]">
      {universeIntro.map((item) => (
        <NavItem key={item.id} item={item} active={activeId === item.id} onNavigate={onNavigate} />
      ))}
    </ul>

    {universeGroups.map((group) => (
      <Group key={group.title} group={group} activeId={activeId} onNavigate={onNavigate} />
    ))}
  </nav>
);

export default UniverseSidebar;
