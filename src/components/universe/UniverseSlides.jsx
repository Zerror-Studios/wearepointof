"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rings, quoteOutline, quoteOpen, quoteClose, arrowDown } from "@/helper/universeArt";
import { immersions } from "@/helper/universeData";

gsap.registerPlugin(ScrollTrigger);

/*
  All slides are sized off the main column (a CSS container), so 1cqw = 1% of its
  width. The design frame's main column is 1153px wide: px / 11.53 = cqw.
*/

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
  viewport: { once: true, amount: 0.4 },
};

/* ---------------------------------- 01 Cover ---------------------------------- */

const flareLine = "rgba(142,142,142,0.5)";

export const CoverSlide = ({ onNext }) => (
  <section id="cover" className="relative min-h-svh flex items-center justify-center pb-[13svh] pt-24">
    <div className="w-fit mx-auto">
      <motion.h1
        className="font-heading font-normal leading-[0.8] tracking-[-0.01em] text-[#E8E8E1] text-[clamp(64px,15.8cqw,290px)]"
        style={{ textShadow: "0 0 12px rgba(232,232,225,0.35)" }}
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      >
        UNIVERSE
      </motion.h1>

      <motion.div
        className="flex justify-between gap-6 mt-[clamp(14px,2cqw,32px)] font-heading font-light text-subheading text-[clamp(13px,1.56cqw,26px)] leading-[1.33]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
      >
        <p>
          The Point Of Brand
          <br />
          System
        </p>
        <p className="relative text-right">
          Everything we are.
          <br />
          Everything we build with.
          {/* Lens-flare cross */}
          <span aria-hidden="true" className="absolute -left-[11px] top-[calc(100%+8px)] pointer-events-none">
            <span
              className="absolute left-0 -top-[86px] w-px h-[173px]"
              style={{ background: `linear-gradient(to bottom, transparent, ${flareLine}, transparent)` }}
            />
            <span
              className="absolute -left-[86px] top-0 h-px w-[173px]"
              style={{ background: `linear-gradient(to right, transparent, ${flareLine}, transparent)` }}
            />
          </span>
        </p>
      </motion.div>
    </div>

    <button
      type="button"
      onClick={onNext}
      aria-label="Scroll to the next slide"
      className="group absolute bottom-[34px] left-1/2 -translate-x-1/2 w-[46px] h-[46px] rounded-full border border-white/20 bg-white/[0.03] flex items-center justify-center cursor-pointer transition-colors duration-300 hover:border-white/50"
    >
      <svg viewBox="854 937 19 23" className="w-[17px] h-[20px] transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true">
        <path d={arrowDown} fill="#E8E8E1" fillOpacity="0.8" />
      </svg>
    </button>
  </section>
);

/* -------------------------------- 02 Manifesto -------------------------------- */

export const ManifestoSlide = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Inner rings twist further than outer ones as the slide scrolls past.
    // CSS (fill-box) rotation keeps each ring turning around its own centre.
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        sectionRef.current?.style.setProperty("--twist", `${(self.progress - 0.5) * 2.8}deg`);
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section id="manifesto" ref={sectionRef} className="relative w-full h-[97.2cqw] min-h-[420px] overflow-hidden">
      <svg
        viewBox="263 1005 1210 1121"
        className="absolute top-0 left-[-2.08cqw] w-[104.9cqw] h-[97.2cqw] overflow-visible"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ringShade" x1="263" y1="1005" x2="1473" y2="2126" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#E8E8E1" stopOpacity="0.55" />
            <stop offset="0.45" stopColor="#E8E8E1" stopOpacity="1" />
            <stop offset="0.75" stopColor="#E8E8E1" stopOpacity="0.45" />
            <stop offset="1" stopColor="#E8E8E1" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {rings.map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: `rotate(calc(var(--twist, 0deg) * ${i}))`,
            }}
            stroke="url(#ringShade)"
            strokeOpacity={0.14 + (i / (rings.length - 1)) * 0.42}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <motion.div className="absolute left-[38.1cqw] top-1/2 -translate-y-1/2" {...fadeUp}>
        <h2 className="font-heading font-light text-[#E8E8E1] leading-[1.15] text-[clamp(26px,3.82cqw,66px)]">
          Who are you?
        </h2>
        <p className="font-heading font-light uppercase text-[#8E8E8E] text-[clamp(12px,1.47cqw,24px)] mt-[clamp(8px,1.2cqw,20px)]">
          Authenticity.
        </p>
      </motion.div>
    </section>
  );
};

/* ------------------------------ 03 What Is A Brand ----------------------------- */

const QuoteMarks = ({ paths, viewBox, className }) => (
  <svg viewBox={viewBox} className={className} fill="#E8E8E1" aria-hidden="true">
    {paths.map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

const promise = (
  <>
    A brand is a promise
    <br />
    performed consistently over time.
  </>
);

const pointQuote = (
  <>
    The point of
    <br />
    every brand
    <br />
    is to be
    <br />
    understood.
  </>
);

export const WhatIsABrandSlide = () => (
  <section id="what-is-a-brand" className="relative w-full">
    {/* Tablet & desktop: placed on the design's own grid */}
    <div className="relative hidden md:block h-[93.2cqw]">
      <motion.svg
        viewBox="287 2125 1153 1075"
        className="absolute inset-0 w-full h-full"
        fill="none"
        aria-hidden="true"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.35 }}
      >
        <defs>
          <linearGradient id="quoteEdge" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#333333" />
            <stop offset="0.7" stopColor="#999999" />
          </linearGradient>
        </defs>
        {quoteOutline.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="url(#quoteEdge)"
            strokeOpacity="0.3"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            variants={{
              hidden: { pathLength: 0 },
              shown: { pathLength: 1, transition: { duration: 2, ease: "easeInOut", delay: i * 0.25 } },
            }}
          />
        ))}
      </motion.svg>

      <motion.h2
        className="absolute left-[8.67cqw] top-[14.75cqw] font-heading font-light text-[#E8E8E1] leading-[1.25] text-[3.82cqw]"
        {...fadeUp}
      >
        {promise}
      </motion.h2>

      <motion.figure
        className="absolute left-[63.1cqw] top-[38cqw] w-[26.7cqw]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <QuoteMarks paths={quoteOpen} viewBox="1014 2563 65 43" className="w-[5.64cqw]" />
        <blockquote className="font-heading font-light text-[#8E8E8E] leading-[1.39] text-[2.69cqw] ml-[2.69cqw] mt-[1.4cqw]">
          {pointQuote}
        </blockquote>
        <QuoteMarks paths={quoteClose} viewBox="1233 2804 91 59" className="w-[7.85cqw] ml-auto -mt-[0.3cqw]" />
      </motion.figure>
    </div>

    {/* Mobile: stacked */}
    <div className="md:hidden px-6 py-20">
      <motion.h2 className="font-heading font-light text-[#E8E8E1] leading-[1.25] text-[26px]" {...fadeUp}>
        {promise}
      </motion.h2>
      <motion.figure className="mt-16 ml-auto w-fit" {...fadeUp}>
        <QuoteMarks paths={quoteOpen} viewBox="1014 2563 65 43" className="w-[42px]" />
        <blockquote className="font-heading font-light text-[#8E8E8E] leading-[1.35] text-[24px] ml-5 mt-3">
          {pointQuote}
        </blockquote>
        <QuoteMarks paths={quoteClose} viewBox="1233 2804 91 59" className="w-[58px] ml-auto" />
      </motion.figure>
    </div>
  </section>
);

/* --------------------------------- 04 Immersions ------------------------------- */

export const ImmersionsSlide = () => (
  <section id="immersions" className="relative w-full px-6 md:px-[8.67cqw] pt-16 md:pt-[6cqw] pb-24 md:pb-[31cqw]">
    <motion.h2 className="font-heading font-light text-[#E8E8E1] leading-[1.25] text-[26px] md:text-[3.82cqw]" {...fadeUp}>
      Immersions
    </motion.h2>

    <ol className="mt-10 md:mt-[8.4cqw]">
      {immersions.map((label, i) => (
        <motion.li
          key={label}
          className="group flex items-center h-[56px] md:h-[clamp(52px,5.2cqw,80px)] border-b border-[#8E8E8E]/50 font-body text-[15px] md:text-[clamp(15px,1.56cqw,24px)]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          <span className="w-[48px] md:w-[5.3cqw] shrink-0 tabular-nums text-[#8E8E8E] transition-colors duration-300 group-hover:text-[#E8E8E1]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[#E8E8E1] transition-transform duration-300 group-hover:translate-x-2">{label}</span>
        </motion.li>
      ))}
    </ol>
  </section>
);
