"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeUp, heading, body, subheading, SectionIndex } from "./shared";

/*
  06 Positioning & Audience + 07 Personality & Voice. The design runs them as one
  "Positioning, Audience & Voice" page; they are two sibling sections here so the
  sidebar scroll-spy can light up each one.
*/

/* ------------------------------------ Data ------------------------------------ */

const index = [
  { label: "Brand Positioning Statement", target: "brand-positioning" },
  { label: "Primary Audience", target: "primary-audience" },
  { label: "Brand Voice & Tone", target: "personality-and-voice" },
];

const audiences = [
  {
    title: "Founders and leaders building from zero or scaling fast.",
    body: "First-time founders, second-time founders, and the leaders running fast-growing companies. They need a brand that earns trust quickly and scales without breaking. They come to us because they've outgrown the freelance phase and need a real partner.",
    image: "/universe/audience-1.webp",
  },
  {
    title: "Established businesses at an inflection point.",
    body: "Businesses passing to the next generation, mid-size companies expanding into new markets, brands that have grown faster than their identity has. They come to us when the brand has stopped doing what it used to do.",
    image: "/universe/audience-2.webp",
  },
  {
    title: "Brand and marketing leaders inside larger organisations.",
    body: "CMOs, brand directors and marketing leads who need a senior creative partner, not a vendor. They come to us when the in-house team is good but the brief is bigger than the team can take on.",
    image: "/universe/audience-3.webp",
  },
];

// Overlapping circles: left edge + diameter in cqw, fading out to the right
const voiceCircles = [
  { label: "Confident", left: 5.4, size: 18.87, o: 1 },
  { label: "Plain", left: 22.25, size: 19.5, o: 0.84 },
  { label: "Considered", left: 39.12, size: 20.1, o: 0.68 },
  { label: "Warm", left: 55.98, size: 20.73, o: 0.52 },
  { label: "Specific", left: 73.45, size: 20.73, o: 0.19 },
];

const voiceRules = [
  { title: ["Confident,", "not loud."], desc: "We back our work with reasoning. We don't shout to be heard." },
  {
    title: ["Plain,", "not casual."],
    desc: "Clear sentences over clever ones. We earn the right to a clever line by writing twenty plain ones first.",
  },
  { title: ["Considered,", "not careful."], desc: "We have opinions and we share them. Hedging is what unconfident agencies do." },
  { title: ["Warm,", "not corporate."], desc: "We sound like people who actually like the work, because we do." },
  {
    title: ["Specific,", "not abstract."],
    desc: "“We helped them launch in three new markets” beats “we drive transformative growth.”",
  },
];

/* ---------------------------------- Pieces ------------------------------------ */

const AudienceCard = ({ item, i }) => (
  <motion.article
    className="flex flex-col max-w-[320px] md:max-w-none md:min-h-[63cqw]"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="overflow-hidden">
      <img src={item.image} alt="" decoding="async" className="block w-full aspect-[260/309] object-cover" />
    </div>
    <h4 className={`${subheading} text-[#E8E8E1]/80 mt-6 md:mt-[3.1cqw] md:max-w-[21.5cqw]`}>{item.title}</h4>
    <p className={`${body} text-[#E8E8E1]/80! mt-4 md:mt-auto md:pt-[3cqw] md:max-w-[21.2cqw] md:text-[clamp(12px,1.39cqw,23px)] md:leading-[1.83]`}>
      {item.body}
    </p>
  </motion.article>
);

const VoiceCircle = ({ c, i }) => (
  <div
    className="absolute top-1/2 -translate-y-1/2 aspect-square flex items-center justify-center"
    style={{ left: `${c.left}cqw`, width: `${c.size}cqw` }}
  >
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full overflow-visible"
      fill="none"
      aria-hidden="true"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
      style={{ opacity: c.o }}
    >
      <defs>
        <linearGradient id={`voiceShade${i}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8E8E1" />
          <stop offset="0.6" stopColor="#E8E8E1" stopOpacity="0.7" />
          <stop offset="1" stopColor="#E8E8E1" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="50"
        cy="50"
        r="49.7"
        stroke={`url(#voiceShade${i})`}
        strokeWidth="0.6"
        vectorEffect="non-scaling-stroke"
        transform="rotate(-90 50 50)"
        variants={{
          hidden: { pathLength: 0 },
          shown: { pathLength: 1, transition: { duration: 1.6, ease: "easeInOut", delay: i * 0.15 } },
        }}
      />
    </motion.svg>
    <motion.span
      className="relative font-heading font-light text-[#E8E8E1]/80 text-[clamp(10px,1.56cqw,26px)]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 + i * 0.15 }}
      viewport={{ once: true, amount: 0.5 }}
    >
      {c.label}
    </motion.span>
  </div>
);

const VoiceRow = ({ rule, i }) => (
  <motion.li
    className="border-b border-[#E8E8E1]/40 py-6 md:py-0 md:pt-[3.1cqw] md:min-h-[13.3cqw] md:grid md:grid-cols-[47.18cqw_1fr]"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.05 }}
    viewport={{ once: true, amount: 0.6 }}
  >
    <h4 className="font-heading font-light text-[#E8E8E1] leading-[1.3] text-[22px] md:text-[clamp(18px,2.43cqw,40px)]">
      {rule.title[0]}
      <br />
      {rule.title[1]}
    </h4>
    <p className={`${body} text-[#E8E8E1]! mt-3 md:mt-[1.2cqw] md:max-w-[25cqw]`}>{rule.desc}</p>
  </motion.li>
);

/* ----------------------------------- Slides ----------------------------------- */

export const PositioningSlide = ({ onNavigate }) => (
  <section id="positioning-and-audience" className="relative w-full px-6 md:px-0 pt-28 md:pt-[17.2cqw]">
    <div className="relative z-10">
      <SectionIndex
        title={
          <>
            Positioning,
            <br />
            Audience &amp; Voice
          </>
        }
        titleClass="md:leading-[1.7]"
        listClass="md:mt-[12.75cqw]"
        items={index}
        onNavigate={onNavigate}
      />
    </div>

    {/* Positioning: concentric contour rings */}
    <motion.div
      id="brand-positioning"
      className="relative -mx-6 md:mx-0 mt-6 md:-mt-[3.8cqw] h-[109.9cqw] overflow-hidden"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <img
        src="/universe/positioning-rings.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-left"
      />
    </motion.div>

    {/* Primary audience */}
    <div id="primary-audience" className="relative mt-16 md:mt-[10.15cqw]">
      <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
        Audience
      </motion.h3>
      <div className="mt-10 md:mt-[16.4cqw] grid grid-cols-1 gap-14 md:ml-[8.67cqw] md:grid-cols-[repeat(3,22.55cqw)] md:gap-[7.55cqw]">
        {audiences.map((item, i) => (
          <AudienceCard key={item.image} item={item} i={i} />
        ))}
      </div>
    </div>
  </section>
);

export const VoiceSlide = () => (
  <section id="personality-and-voice" className="relative w-full px-6 md:px-0 pt-28 md:pt-[35cqw] pb-28 md:pb-[34.7cqw]">
    <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
      Brand Voice &amp; Tone
    </motion.h3>

    <div className="relative -mx-6 md:mx-0 mt-10 md:mt-[9.5cqw] h-[21cqw]">
      {voiceCircles.map((c, i) => (
        <VoiceCircle key={c.label} c={c} i={i} />
      ))}
    </div>

    <ul className="mt-12 md:mt-[8.67cqw] md:ml-[8.67cqw] md:w-[82.74cqw] border-t border-[#E8E8E1]/40">
      {voiceRules.map((rule, i) => (
        <VoiceRow key={rule.title[0]} rule={rule} i={i} />
      ))}
    </ul>
  </section>
);
