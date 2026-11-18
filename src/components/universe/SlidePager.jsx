"use client";
import React from "react";
import Link from "next/link";
import { universeSlides, slideHref } from "@/helper/universeData";
import { ArrowRight } from "./shared";
import { useUniverseNav } from "./UniverseShell";

/*
  Previous / next slide links at the foot of a Universe page. `from` is the last slide
  shown on the page (04 for /universe), so "next" is always the following page.
*/

const PagerLink = ({ slide, dir }) => {
  const navigate = useUniverseNav();
  const isNext = dir === "next";
  return (
    <Link
      href={slideHref(slide.id)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(slide.id);
      }}
      className={`group flex flex-col gap-2 md:gap-[0.8cqw] py-8 md:py-[3.5cqw] ${isNext ? "items-end text-right" : "items-start text-left"}`}
    >
      <span className="flex items-center gap-2 font-(family-name:--font-uni-mono) text-[12px] md:text-[clamp(11px,1.04cqw,16px)] tracking-[0.2px] text-[#8E8E8E]">
        {!isNext && <ArrowRight className="w-[0.9em] h-[1.1em] rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />}
        {isNext ? "Next" : "Previous"}
        {isNext && <ArrowRight className="w-[0.9em] h-[1.1em] transition-transform duration-300 group-hover:translate-x-1" />}
      </span>
      <span className="font-heading font-light text-[#E8E8E1] leading-[1.2] text-[20px] md:text-[clamp(18px,2.43cqw,40px)] transition-opacity duration-300 group-hover:opacity-70">
        {slide.n} {slide.label}
      </span>
    </Link>
  );
};

const SlidePager = ({ from, to = from }) => {
  const first = universeSlides.findIndex((s) => s.id === from);
  const last = universeSlides.findIndex((s) => s.id === to);
  const prev = universeSlides[first - 1];
  const next = universeSlides[last + 1];
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Universe slides"
      className="relative mx-6 md:mx-[8.67cqw] mb-20 md:mb-[8cqw] grid grid-cols-2 gap-6 border-t border-[#8E8E8E]/40"
    >
      <div>{prev && <PagerLink slide={prev} dir="prev" />}</div>
      <div>{next && <PagerLink slide={next} dir="next" />}</div>
    </nav>
  );
};

export default SlidePager;
