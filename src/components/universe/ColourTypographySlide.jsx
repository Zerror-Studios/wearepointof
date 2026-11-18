"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeUp, heading, SectionIndex } from "./shared";

/*
  09 Colour & Typography. Swatches and type specimens are live HTML (the brand fonts
  are already loaded as font-heading / font-body), so they stay sharp at any size.
*/

/* ------------------------------------ Data ------------------------------------ */

const index = [
  { label: "Primary Colour", target: "primary-colour" },
  { label: "Secondary Colour", target: "secondary-colour" },
  { label: "Primary Typography", target: "primary-typography" },
  { label: "Secondary Typography", target: "secondary-typography" },
  { label: "Type Hierarchy", target: null },
];

const primaryLarge = [
  { name: "Black", hex: ["#000000"], bg: "#000000", ink: "#FFFFFF" },
  { name: "Gradient", hex: ["#000000", "#E8E8E1"], bg: "linear-gradient(to right, #000000, #3B3B39)", ink: "#FFFFFF" },
];

const primarySmall = [
  { name: ["Field", "Drab"], hex: "#776C3F", ink: "#FFFFFF" },
  { name: ["Delft", "Blue"], hex: "#2A3275", ink: "#FFFFFF" },
  { name: ["Antique", "Pearl"], hex: "#E8E8E1", ink: "#000000" },
  { name: ["Battleship", "Grey"], hex: "#8E8E8E", ink: "#FFFFFF" },
];

const secondary = [
  { name: "Sage Green", hex: "#A5AB8A", ink: "#FFFFFF" },
  { name: "Cinnabar Orange", hex: "#DE4A24", ink: "#FFFFFF" },
  { name: "Soft Grey", hex: "#DCDDDE", ink: "#000000" },
  { name: "Silver Mist", hex: "#C0BFBF", ink: "#000000" },
  { name: "Charcoal Grey", hex: "#323232", ink: "#FFFFFF" },
];

const tints = [0.8, 0.6, 0.4, 0.2];

const typefaces = [
  {
    id: "primary-typography",
    heading: "Primary Type",
    name: ["TWK", "Lausanne"],
    family: "font-heading",
    nameClass: "font-medium leading-[0.96] text-[64px] md:text-[9.7cqw] tracking-[-0.01em]",
    nameTop: "md:pt-[8.67cqw]",
    intro: "TWK Lausanne",
    body: " is the primary typeface for the Point Of brand. Consistent use of this font is essential for building brand recognition and trust. With its extensive font-family, TWK Lausanne provides versatility and will be used for headers in brochures, website banners, and print ads to maintain a strong and cohesive visual identity.",
  },
  {
    id: "secondary-typography",
    heading: "Secondary Type",
    name: ["Satoshi"],
    family: "font-body",
    nameClass: "font-medium leading-none text-[72px] md:text-[11.5cqw] tracking-[-0.02em]",
    nameTop: "md:pt-[14.4cqw]",
    intro: "Satoshi,",
    body: " our secondary typeface, is a clean and legible sans-serif designed for clarity and readability. Use it across all weights and styles for body copy, detailed explanations, captions, disclaimers, and website subtext. It ensures a polished and professional tone throughout all brand communications.",
  },
];

// Weight columns: left edge in cqw (from the column start), label, weight
const weights = [
  { left: 0, right: 9.1, label: "Light", weight: 300 },
  { left: 9.1, right: 18.04, label: "Regular", weight: 400 },
  { left: 18.04, right: null, label: "Medium", weight: 500 },
];

/* ---------------------------------- Pieces ------------------------------------ */

const swatchName = "font-heading font-light italic leading-[1.15]";
const hexText = "font-heading font-light leading-none";

const LargeSwatch = ({ s, i }) => (
  <motion.div
    className="relative h-[220px] md:h-[30.79cqw] p-5 md:px-[4.86cqw] md:pt-[5.2cqw] md:pb-[4.4cqw] flex flex-col justify-between"
    style={{ background: s.bg, color: s.ink }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.08 }}
    viewport={{ once: true, amount: 0.3 }}
  >
    <span className={`${swatchName} text-[24px] md:text-[2.69cqw]`}>{s.name}</span>
    <span className={`flex ${s.hex.length > 1 ? "justify-between" : "justify-end"} ${hexText} text-[15px] md:text-[1.73cqw]`}>
      {s.hex.map((h) => (
        <span key={h}>{h}</span>
      ))}
    </span>
  </motion.div>
);

const SmallSwatch = ({ s, i }) => (
  <motion.div
    className="relative h-[160px] md:h-[24.1cqw] p-4 md:p-[2.69cqw] md:pr-[2.69cqw] flex flex-col justify-between"
    style={{ background: s.hex, color: s.ink }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + i * 0.06 }}
    viewport={{ once: true, amount: 0.3 }}
  >
    <span className={`${swatchName} text-[18px] md:text-[1.82cqw]`}>
      {s.name[0]}
      <br />
      {s.name[1]}
    </span>
    <span className={`${hexText} self-end text-[13px] md:text-[1.39cqw]`}>{s.hex}</span>
  </motion.div>
);

const SecondarySwatch = ({ s, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.07 }}
    viewport={{ once: true, amount: 0.3 }}
    style={{ color: s.ink }}
  >
    <div className="h-[200px] md:h-[34.26cqw] px-1.5 pt-2 md:px-[0.55cqw] md:pt-[0.87cqw]" style={{ background: s.hex }}>
      <p className={`${swatchName} text-[13px] md:text-[1.21cqw]`}>{s.name}</p>
      <p className="font-heading font-light text-[10px] md:text-[0.95cqw] mt-0.5">{s.hex}</p>
    </div>
    {tints.map((t) => (
      <div
        key={t}
        className="relative h-[28px] md:h-[3.04cqw] flex items-center px-1.5 md:px-[0.6cqw] font-heading font-light text-[10px] md:text-[0.95cqw]"
      >
        <span className="absolute inset-0" style={{ background: s.hex, opacity: t }} />
        <span className="relative opacity-80">{Math.round(t * 100)}%</span>
      </div>
    ))}
  </motion.div>
);

const alphabet = ["ABCDEFGHIJKLMNOPQRSTUVW", "XYZabcdefghijklmnopqrstuvwxyz", "0123456789"];

const TypeSpecimen = ({ face }) => (
  <div id={face.id} className="relative mt-28 md:mt-[34cqw]">
    <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
      {face.heading}
    </motion.h3>

    <div className="relative mt-10 md:mt-[9.6cqw] md:h-[88.7cqw]">
      {/* Name, description and character set */}
      <div className={`relative z-10 flex flex-col md:h-full md:ml-[8.67cqw] md:w-[42.9cqw] md:pb-[6.5cqw] ${face.nameTop}`}>
        <motion.p className={`${face.family} ${face.nameClass} text-[#E8E8E1] md:text-right`} {...fadeUp}>
          {face.name.map((line, i) => (
            <React.Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </motion.p>
        <motion.p
          className="font-body font-light text-[#E8E8E1]/80 leading-[1.45] text-[15px] md:text-[clamp(12px,1.56cqw,26px)] mt-5 md:mt-[1.6cqw] md:text-justify"
          {...fadeUp}
        >
          <span className="font-normal text-[#E8E8E1]">{face.intro}</span>
          {face.body}
        </motion.p>

        <motion.div className="mt-12 md:mt-auto border-t border-[#8E8E8E]/60 pt-6 md:pt-[2.6cqw]" {...fadeUp}>
          <p className="font-body font-light text-[#E8E8E1]/80 text-[14px] md:text-[clamp(11px,1.39cqw,22px)]">Overview</p>
          <p
            className={`${face.family} font-light text-[#E8E8E1] leading-[1.12] tracking-[0.02em] text-[20px] md:text-[2.75cqw] mt-4 md:mt-[2.6cqw] break-all`}
          >
            {alphabet.map((line, i) => (
              <React.Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        </motion.div>
      </div>

      {/* Weight columns, each "a" cut off by the next column (desktop only) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-[52.6cqw] right-0">
        {weights.map((w, i) => (
          <div
            key={w.label}
            className="absolute top-0 bottom-0 overflow-hidden border-l border-[#8E8E8E]/60"
            style={{ left: `${w.left}cqw`, right: w.right === null ? 0 : `calc(100% - ${w.right}cqw)` }}
          >
            <p
              className={`absolute top-[2.2cqw] flex items-center gap-[4.6cqw] whitespace-nowrap font-body font-light text-[#E8E8E1]/80 text-[clamp(11px,1.39cqw,22px)] ${
                w.right === null ? "left-[1.82cqw]" : "left-0 right-0 justify-center"
              }`}
            >
              {w.label}
              {w.weight === 500 && (
                <>
                  <span className="w-[1.65cqw] h-px bg-[#8E8E8E]" />
                  500
                </>
              )}
            </p>
            <motion.span
              aria-hidden="true"
              className={`absolute left-[0.75cqw] bottom-[4.3cqw] ${face.family} leading-[0.75] text-[#E8E8E1] text-[42cqw]`}
              style={{ fontWeight: w.weight }}
              initial={{ opacity: 0, y: "6%" }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.15 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              a
            </motion.span>
          </div>
        ))}
      </div>

      {/* Phones: a compact weight strip */}
      <div className="md:hidden mt-10 grid grid-cols-3 border-t border-[#8E8E8E]/60">
        {weights.map((w) => (
          <div key={w.label} className="border-l first:border-l-0 border-[#8E8E8E]/60 pl-3 pt-3">
            <p className="font-body font-light text-[#E8E8E1]/80 text-[13px]">{w.label}</p>
            <p className={`${face.family} text-[#E8E8E1] text-[88px] leading-none`} style={{ fontWeight: w.weight }}>
              a
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ----------------------------------- Slide ------------------------------------ */

const ColourTypographySlide = ({ onNavigate }) => (
  <section id="colour-and-typography" className="relative w-full px-6 md:px-0 pt-28 md:pt-[16.65cqw] pb-28 md:pb-[34.7cqw]">
    {/* Fine swirl behind the title + index */}
    <img
      src="/universe/colour-swirl.webp"
      alt=""
      aria-hidden="true"
      decoding="async"
      className="pointer-events-none absolute left-0 top-0 w-full h-[700px] md:h-[95.4cqw] object-cover object-top"
      style={{ maskImage: "linear-gradient(to bottom, #000 80%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 80%, transparent)" }}
    />

    <div className="relative">
      <SectionIndex
        title={
          <>
            Colours &amp;
            <br />
            Typography
          </>
        }
        titleClass="md:leading-[1.37]"
        listClass="md:mt-[10.9cqw]"
        items={index}
        onNavigate={onNavigate}
      />
    </div>

    {/* Primary colour */}
    <div id="primary-colour" className="relative mt-28 md:mt-[34cqw] md:mx-[8.67cqw]">
      <motion.h3 className={heading} {...fadeUp}>
        Primary Colour
      </motion.h3>
      <div className="mt-10 md:mt-[9.55cqw] grid grid-cols-1 sm:grid-cols-[47.4fr_33.48fr] gap-3 md:gap-[1.86cqw]">
        {primaryLarge.map((s, i) => (
          <LargeSwatch key={s.name} s={s} i={i} />
        ))}
      </div>
      <div className="mt-3 md:mt-[1.65cqw] grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-[1.86cqw]">
        {primarySmall.map((s, i) => (
          <SmallSwatch key={s.hex} s={s} i={i} />
        ))}
      </div>
    </div>

    {/* Secondary colour */}
    <div id="secondary-colour" className="relative mt-28 md:mt-[34cqw] md:mx-[8.67cqw]">
      <motion.h3 className={heading} {...fadeUp}>
        Secondary Colour
      </motion.h3>
      <div className="mt-10 md:mt-[8.6cqw] grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-[1.86cqw]">
        {secondary.map((s, i) => (
          <SecondarySwatch key={s.hex} s={s} i={i} />
        ))}
      </div>
    </div>

    {typefaces.map((face) => (
      <TypeSpecimen key={face.id} face={face} />
    ))}
  </section>
);

export default ColourTypographySlide;
