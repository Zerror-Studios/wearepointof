"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, heading, body, subheading, SectionIndex, MotionImage, COLUMN_SIZES } from "./shared";

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
      <Image
        src={item.image}
        alt=""
        width={520}
        height={618}
        sizes="(min-width: 768px) 23vw, 320px"
        className="block w-full aspect-[260/309] object-cover"
      />
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
      className="relative font-heading font-light text-[#E8E8E1]/80 text-[clamp(11px,1.56cqw,26px)]"
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
  <section id="positioning-and-audience" className="relative w-full px-6 md:px-0 pt-28 md:pt-[17.2cqw] pb-24 md:pb-[17cqw]">
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

    {/* Brand positioning over concentric contour rings. On md+ the copy is placed on the
        rings as in the design (heading inside the inner ring); phones stack it in flow. */}
    <div
      id="brand-positioning"
      className="relative -mx-6 md:mx-0 mt-6 md:-mt-[3.8cqw] px-6 md:px-0 py-24 md:py-0 md:h-[109.9cqw] overflow-hidden"
    >
      <MotionImage
        src="/universe/positioning-rings.webp"
        alt=""
        aria-hidden="true"
        width={1153}
        height={1267}
        sizes={COLUMN_SIZES}
        className="absolute inset-0 w-full h-full object-cover object-left"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.25 }}
      />

      <div className="relative md:absolute md:inset-x-0 md:top-[38.25cqw] md:flex">
        <motion.h3 className={`${heading} md:leading-[1.2] md:ml-[8.67cqw] md:w-[38.3cqw] shrink-0`} {...fadeUp}>
          Brand
          <br />
          Positioning
        </motion.h3>
        <motion.p className={`${body} mt-8 md:mt-[0.3cqw] md:w-[44.4cqw]`} {...fadeUp}>
          Point Of is a Mumbai-headquartered brand consultancy working with founders and enterprises around the world.
          Our practice covers strategy, design and technology, with marketing as the natural extension of the brand once
          it’s live.
          <br />
          Strategy comes first, always.
        </motion.p>
      </div>

      <motion.p
        className={`${body} relative mt-10 md:mt-0 md:absolute md:top-[72.8cqw] md:left-[26.45cqw] md:w-[47cqw]`}
        {...fadeUp}
      >
        <span className="text-[#E8E8E1]">We’re built for businesses that take brand seriously.</span> Most of our clients
        are at an inflection point: launching, scaling, repositioning, expanding into new markets, or merging. They come to
        us because the brand has to do real work, and they want a partner who builds it that way.
      </motion.p>
    </div>

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
  <section id="personality-and-voice" className="relative w-full px-6 md:px-0 pt-28 md:pt-[17.2cqw] pb-24 md:pb-[17cqw]">
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
