"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { arrowDown } from "@/helper/universeArt";
import { MotionImage, COLUMN_SIZES } from "./shared";

/*
  05 Brand Strategy → Universe & Core.
  Like the other slides, tablet/desktop sizes are in cqw of the main column
  (design px / 11.53); phones get a stacked layout in px.
*/

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
  viewport: { once: true, amount: 0.4 },
};

const heading = "font-heading font-light text-[#E8E8E1] leading-[1.15] text-[30px] md:text-[3.82cqw]";
const lead = "font-heading font-light text-[#BEBEB8] leading-[1.3] text-[19px] md:text-[clamp(16px,2.08cqw,34px)]";
// Mission + purpose statement run slightly larger than the Vision paragraph in the design
const leadLg = "font-heading font-light text-[#BEBEB8] leading-[1.25] text-[20px] md:text-[clamp(17px,2.2cqw,36px)]";
const body = "font-body text-[#BEBEB8] leading-[1.7] text-[15px] md:leading-[1.61] md:text-[clamp(13px,1.56cqw,26px)]";

/* ------------------------------------ Data ------------------------------------ */

const strategyCards = [
  { n: "05", title: ["Universe &", "Core"], count: 6, image: "/universe/strategy-card1.webp", target: "universe-core-index" },
  { n: "06", title: ["Positioning,", "Audience & Voice"], count: 3, image: "/universe/strategy-card2.webp", target: "positioning-and-audience" },
];

const coreIndex = [
  { label: "Brand Vision", target: "brand-vision" },
  { label: "Brand Mission", target: "brand-mission" },
  { label: "Brand Values", target: "brand-values" },
  { label: "Brand USP", target: "brand-usp" },
  { label: "Brand Story / Background", target: "brand-background" },
];

const coreValues = [
  { title: "Curiosity", desc: "We ask before we answer. Always. Every project begins by treating the business as a question worth taking seriously." },
  { title: "Rigour", desc: "We pressure-test our own thinking before we share it. The strategy has to hold up under questioning, or we go back and sharpen it." },
  { title: "Craft", desc: "Every detail earns its place, or it doesn't make it into the final cut. Nothing ships half-finished." },
  { title: "Impact", desc: "The work has to do something for the business. If it can't be tied back to a commercial reason, we cut it." },
  { title: "Evolution", desc: "A brand that stops moving stops working. We build systems that grow with the company, and we stay close enough to help them grow." },
];

// Positions are the design's own (main-column px), converted to cqw
const uspCards = [
  {
    title: ["Strategy is the", "foundation, not a stage."],
    body: "We sell strategy as its own service, paid for properly, because the rest of the work compounds from it. Skipping it costs more later, and we'd rather not be hired than be hired to skip it.",
    place: "md:absolute md:left-[13.96cqw] md:top-0",
    bodyWidth: "md:max-w-[22.7cqw]",
  },
  {
    title: ["One team, end to end."],
    body: "From the first strategy session to the marketing campaign two years in, the people who built the brand are the people running it. Nothing gets handed off, nothing gets translated through three layers, nothing gets lost.",
    place: "md:absolute md:left-[54.38cqw] md:top-[24.11cqw] sm:ml-auto",
    bodyWidth: "md:max-w-[22.7cqw]",
  },
  {
    title: ["A studio that stays."],
    body: "Most of our clients come back for a second or third engagement. We design the relationship so we can keep shaping the brand as the business changes.",
    place: "md:ml-[24.11cqw] md:mt-[64.96cqw]",
    bodyWidth: "md:max-w-[20.4cqw]",
  },
];

const background = [
  "Point Of is a brand consultancy headquartered in Mumbai, working with founders, scaling businesses and enterprises around the world. Since 2019, we've shaped over 130 brands across eleven countries, with work spanning the USA, Europe, Asia and the Middle East.",
  "We started as a digital studio and grew into a full-service consultancy because the brief kept getting bigger. Founders wanted a partner who could think with them about the business, name the thing, give it a voice, design how it shows up, build the products and channels it lives in, and stay close enough to keep shaping it as the company grew.",
  "Our work has launched brands, products, books, websites, campaigns and experiences for partners that range from global tech and retail companies to independent artists and cultural institutions. Five years in, we're still building.",
];

/* ------------------------------------ Art ------------------------------------- */

const ArrowRight = ({ className }) => (
  <svg viewBox="854 937 19 23" className={`-rotate-90 ${className}`} fill="currentColor" aria-hidden="true">
    <path d={arrowDown} />
  </svg>
);

// 23 offset ellipses that fan out to the right
const VISION = { cx: 764.303, step: 9.046, cy: 2313.5, rx: 231.87, ry: 224.74, count: 23 };

const VisionRings = () => (
  <motion.svg
    viewBox="528 2085 672 458"
    className="w-full md:w-[58.28cqw] md:ml-[20.9cqw] h-auto"
    fill="none"
    aria-hidden="true"
    initial="hidden"
    whileInView="shown"
    viewport={{ once: true, amount: 0.4 }}
  >
    <defs>
      <linearGradient id="visionShade" x1="532" y1="2089" x2="1195" y2="2538" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#E8E8E1" stopOpacity="0.75" />
        <stop offset="0.5" stopColor="#E8E8E1" stopOpacity="0.32" />
        <stop offset="1" stopColor="#E8E8E1" stopOpacity="0.08" />
      </linearGradient>
    </defs>
    {Array.from({ length: VISION.count }, (_, i) => (
      <motion.ellipse
        key={i}
        cx={VISION.cx + i * VISION.step}
        cy={VISION.cy}
        rx={VISION.rx}
        ry={VISION.ry}
        stroke="url(#visionShade)"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        variants={{
          hidden: { x: -i * VISION.step, opacity: i === 0 ? 1 : 0 },
          shown: { x: 0, opacity: 1, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
        }}
      />
    ))}
  </motion.svg>
);

const MISSION = [
  { cx: 560.58, r: 173.1, o: 0.75 },
  { cx: 875.44, r: 178.8, o: 0.5 },
  { cx: 1190.46, r: 184.5, o: 0.45 },
  { cx: 1505.48, r: 190.1, o: 0.4 },
  { cx: 1820.5, r: 195.9, o: 0.35 },
];

const MissionRings = () => (
  <motion.svg
    viewBox="385 3170 1055 392"
    className="w-[170%] md:w-[91.5cqw] md:ml-[8.5cqw] h-auto max-w-none"
    fill="none"
    aria-hidden="true"
    initial="hidden"
    whileInView="shown"
    viewport={{ once: true, amount: 0.4 }}
  >
    <defs>
      <linearGradient id="missionShade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E8E8E1" />
        <stop offset="0.55" stopColor="#E8E8E1" stopOpacity="0.8" />
        <stop offset="1" stopColor="#E8E8E1" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {MISSION.map((c, i) => (
      <motion.circle
        key={c.cx}
        cx={c.cx}
        cy={3365.15}
        r={c.r}
        stroke="url(#missionShade)"
        strokeOpacity={c.o}
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        // Start the stroke at the top so it draws clockwise from 12 o'clock
        transform={`rotate(-90 ${c.cx} 3365.15)`}
        variants={{
          hidden: { pathLength: 0 },
          shown: { pathLength: 1, transition: { duration: 1.8, ease: "easeInOut", delay: i * 0.18 } },
        }}
      />
    ))}
  </motion.svg>
);

// Ticket-style top edge of the USP cards: five half-round notches
const scallop = (() => {
  let d = "M0 0.5";
  for (let k = 0; k < 5; k++) {
    const s = 12.916 + 59 * k;
    d += ` H${s} C${s + 2.549} 8.61 ${s + 10.129} 14.5 ${s + 19.084} 14.5 C${s + 28.039} 14.5 ${s + 35.619} 8.61 ${s + 38.168} 0.5`;
  }
  return `${d} H310`;
})();

/* ---------------------------------- Pieces ------------------------------------ */

const StrategyCard = ({ card, onNavigate }) => {
  const ready = Boolean(card.target);
  return (
    <button
      type="button"
      onClick={() => ready && onNavigate(card.target)}
      aria-disabled={!ready || undefined}
      title={ready ? undefined : "Coming soon"}
      className={`group relative block w-full aspect-[468/352] overflow-hidden text-left ${
        ready ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <Image
        src={card.image}
        alt=""
        width={936}
        height={704}
        sizes="(min-width: 640px) 41vw, 100vw"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
      />
      <span className="relative flex h-full flex-col justify-between p-5 md:p-[2.08cqw]">
        <span className="font-heading font-light text-subheading leading-[1.32] text-[19px] md:text-[clamp(14px,1.91cqw,32px)]">
          {card.n} {card.title[0]}
          <br />
          {card.title[1]}
        </span>
        <span className="flex items-center gap-[1ch] font-(family-name:--font-uni-mono) text-[#A4A49F] text-[13px] md:text-[clamp(11px,1.3cqw,20px)] tracking-[0.2px]">
          {card.count} elements
          <ArrowRight className="w-[0.9em] h-[1.1em] transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </button>
  );
};

const ValueRow = ({ value, i }) => (
  <motion.li
    className="flex items-start gap-4 md:gap-[2.8cqw]"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06 }}
    viewport={{ once: true, amount: 0.6 }}
  >
    <span className="shrink-0 flex items-center justify-center w-[56px] h-[56px] md:w-[8.27cqw] md:h-[8.27cqw] md:mt-[0.55cqw] rounded-full border-[0.6px] border-[#E4E4E4]/80 font-heading font-extralight text-[#BEBEB8] text-[26px] md:text-[3.82cqw] leading-none">
      {i + 1}
    </span>
    <div className="md:max-w-[51cqw]">
      <h4 className="font-heading font-light text-[#BEBEB8] leading-[1.2] text-[22px] md:text-[clamp(20px,3.1cqw,52px)]">{value.title}</h4>
      <p className={`${body} mt-2 md:mt-[0.95cqw]`}>{value.desc}</p>
    </div>
  </motion.li>
);

const UspCard = ({ card, i }) => (
  <motion.article
    className={`relative flex flex-col justify-between gap-10 w-full max-w-[340px] sm:w-[310px] md:w-[26.89cqw] md:max-w-none md:min-h-[31.57cqw] border-x border-b border-[#E8E8E1]/30 px-6 md:px-[2.08cqw] pt-10 md:pt-[3.5cqw] pb-6 md:pb-[1.7cqw] ${card.place}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.08 }}
    viewport={{ once: true, amount: 0.3 }}
  >
    <svg viewBox="0 0 310 15" preserveAspectRatio="none" className="absolute -left-px top-0 w-[calc(100%+2px)] h-auto" fill="none" aria-hidden="true">
      <path d={scallop} stroke="#E8E8E1" strokeOpacity="0.3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
    <h4 className="font-heading font-light text-[#E8E8E1] leading-[1.32] text-[20px] md:text-[clamp(14px,1.91cqw,32px)]">
      {card.title.map((line, j) => (
        <React.Fragment key={j}>
          {j > 0 && <br className="hidden md:block" />}
          {j > 0 && " "}
          {line}
        </React.Fragment>
      ))}
    </h4>
    <p className={`${body} text-[#E8E8E1]! ${card.bodyWidth}`}>{card.body}</p>
  </motion.article>
);

/* ----------------------------------- Slide ------------------------------------ */

const BrandStrategySlide = ({ onNavigate }) => (
  <section id="universe-and-core" className="relative w-full px-6 md:px-0 pb-24 md:pb-[17cqw]">
    {/* Glow + swirl behind the Brand Strategy intro and the Universe & Core index */}
    <Image
      src="/universe/strategy-bg.webp"
      alt=""
      aria-hidden="true"
      width={1153}
      height={1900}
      sizes={COLUMN_SIZES}
      className="pointer-events-none absolute left-0 top-0 w-full h-[1000px] md:h-[164.8cqw] object-cover object-top"
      style={{ maskImage: "linear-gradient(to bottom, #000 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 85%, transparent)" }}
    />

    {/* Brand Strategy */}
    <div className="relative pt-28 md:pt-[22.4cqw]">
      <motion.h2 className={`${heading} text-center`} {...fadeUp}>
        Brand Strategy
      </motion.h2>
      <motion.div
        className="mt-10 md:mt-[9.08cqw] grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-[1.56cqw] md:mx-[8.59cqw]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {strategyCards.map((card) => (
          <StrategyCard key={card.n} card={card} onNavigate={onNavigate} />
        ))}
      </motion.div>
    </div>

    {/* Universe & Core index */}
    <div id="universe-core-index" className="relative mt-32 md:mt-[33.74cqw] md:flex">
      <motion.h3 className={`${heading} md:ml-[8.67cqw] md:leading-[1.37] md:w-[38.3cqw] shrink-0`} {...fadeUp}>
        Universe &amp;
        <br />
        Core
      </motion.h3>
      <ul className="mt-8 md:mt-[9.71cqw] md:w-[44.4cqw]">
        {coreIndex.map((item, i) => (
          <motion.li
            key={item.target}
            className="border-b border-[#8E8E8E]/60"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            <button
              type="button"
              onClick={() => onNavigate(item.target)}
              className="group flex items-center justify-between w-full h-[60px] md:h-[7.29cqw] text-left font-heading font-light text-[#8E8E8E] text-[17px] md:text-[clamp(15px,1.91cqw,32px)] cursor-pointer transition-colors duration-300 hover:text-[#E8E8E1]"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-2">{item.label}</span>
              <ArrowRight className="w-[0.7em] h-[0.85em] opacity-0 -translate-x-2 transition-[opacity,translate] duration-300 group-hover:opacity-60 group-hover:translate-x-0" />
            </button>
          </motion.li>
        ))}
      </ul>
    </div>

    {/* Vision */}
    <div id="brand-vision" className="relative mt-28 md:mt-[34.43cqw]">
      <div className="relative">
        <VisionRings />
        <motion.h3
          className={`${heading} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          Vision
        </motion.h3>
      </div>
      <motion.p className={`${lead} mt-10 md:mt-[9.02cqw] md:ml-[8.67cqw] md:max-w-[64cqw]`} {...fadeUp}>
        To build a consultancy that proves Indian creative work belongs in any room, against any competitor. Our long-term
        ambition is to be the studio international founders choose first, and the studio Indian founders trust when the
        brand has to compete at the highest level.
      </motion.p>
    </div>

    {/* Mission */}
    <div id="brand-mission" className="relative mt-28 md:mt-[34.6cqw]">
      <div className="relative">
        <MissionRings />
        <motion.h3
          className={`${heading} absolute left-[28.3%] md:left-[23.73cqw] top-1/2 -translate-x-1/2 -translate-y-1/2`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          Mission
        </motion.h3>
      </div>
      <motion.div className="mt-10 md:mt-[7.8cqw] md:ml-[33.48cqw] md:max-w-[58cqw]" {...fadeUp}>
        <p className={leadLg}>We help businesses figure out who they are, then express it with discipline.</p>
        <p className={`${body} mt-3 md:mt-[1.39cqw] md:max-w-[57.5cqw]`}>
          That means strategy before design. Decisions before deliverables. A clear thesis the company can build on for
          the next ten years, not a refresh that needs another refresh in two.
        </p>
      </motion.div>
    </div>

    {/* Purpose statement */}
    <motion.p className={`${leadLg} mt-20 md:mt-[17.9cqw] md:ml-[31.05cqw]`} {...fadeUp}>
      We exist to give brands a point of view,
      <br className="hidden sm:block" /> and the system to defend it.
    </motion.p>

    {/* Core values */}
    <div id="brand-values" className="relative mt-28 md:mt-[33.9cqw] md:ml-[8.67cqw]">
      <motion.h3 className={`${heading} md:text-[#D0D0D0]`} {...fadeUp}>
        Core Values
      </motion.h3>
      <ol className="mt-10 md:mt-[8.24cqw] space-y-8 md:space-y-[4.05cqw]">
        {coreValues.map((value, i) => (
          <ValueRow key={value.title} value={value} i={i} />
        ))}
      </ol>
    </div>

    {/* USP */}
    <div id="brand-usp" className="relative mt-28 md:mt-[35.3cqw]">
      <motion.h3 className={`${heading} text-center`} {...fadeUp}>
        Unique Selling Proposition
      </motion.h3>
      <div className="relative mt-12 md:mt-[10.4cqw] flex flex-col gap-10 sm:gap-14 md:flow-root">
        {uspCards.map((card, i) => (
          <UspCard key={card.title[0]} card={card} i={i} />
        ))}
      </div>
    </div>

    {/* Background / story */}
    <div id="brand-background" className="relative mt-28 md:mt-[21.2cqw]">
      <MotionImage
        src="/universe/background-sphere.webp"
        alt=""
        aria-hidden="true"
        width={1186}
        height={1186}
        sizes="(min-width: 768px) 52vw, 78vw"
        className="pointer-events-none absolute -left-[22vw] -top-[18vw] w-[78vw] md:-left-[5.46cqw] md:top-0 md:w-[51.43cqw] max-w-none"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      />
      <motion.h3 className={`${heading} relative pt-[22vw] md:pt-[30.2cqw] md:ml-[22.55cqw]`} {...fadeUp}>
        Background
      </motion.h3>
      <div className="relative mt-12 md:mt-[19.5cqw] md:ml-[28.62cqw] md:max-w-[62.6cqw] space-y-5 md:space-y-[2.95cqw]">
        {background.map((para, i) => (
          <motion.p
            key={i}
            className={body}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.08 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {para}
          </motion.p>
        ))}
      </div>
    </div>
  </section>
);

export default BrandStrategySlide;
