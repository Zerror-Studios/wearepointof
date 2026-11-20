"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, heading, body, ArrowRight, SectionIndex, MotionImage, COLUMN_SIZES } from "./shared";
import { ambient } from "@/helper/universeAmbient";

/*
  Brand Identity intro + 08 Identity Design. The logo diagrams are exported from the
  design as vector SVGs (public/universe/identity); the do / don't examples as images.
*/

const A = "/universe/identity";

/* ------------------------------------ Data ------------------------------------ */

const identityCards = [
  { n: "08", title: ["Identity", "Design"], count: 6, image: `${A}/identity-tile-8.webp`, target: "identity-design-index" },
  { n: "09", title: ["Colour", "& Typography"], count: 7, image: `${A}/identity-tile-9.webp`, target: "colour-and-typography" },
  // The Visual Language artwork is exported with near-white line highlights (the others top out
  // at ~28% grey), so it's toned down to sit at the same level as the rest of the row
  { n: "10", title: ["Visual", "Language"], count: 5, image: `${A}/identity-tile-10.webp`, target: "visual-language", tone: 0.55 },
  { n: "11", title: ["Deliverables"], count: 5, image: `${A}/identity-tile-11.webp`, target: "deliverables" },
];

const index = [
  { label: "Logo Concept", target: "logo-concept" },
  { label: "Logo Formation", target: "logo-formation" },
  { label: "Size & Spacing", target: "logo-size-spacing" },
  { label: "Logo Lockups", target: "logo-lockups" },
  { label: "Logo Do’s & Don’ts", target: "logo-dos-donts" },
];

const dos = [
  { image: `${A}/logo-do-1.webp`, caption: "Logo should be used in B&W colour." },
  { image: `${A}/logo-do-2.webp`, caption: "Logo should be used in B&W colour." },
  { image: `${A}/logo-do-3.webp`, caption: "Use the submark in White or Antique Pearl\ncolour only on dark backgrounds." },
];

const donts = [
  "Don’t stretch or distort any part\nof the logo.",
  "Don’t edit any space in the logo.",
  "Don’t outline or fill any part of the logo.",
  "Don’t rotate or change the angle\nof the logo.",
  "Don’t skew the logo.",
  "Don’t invent new lockup.",
  "Don’t use low contrast.",
  "Don’t hatch the logo.",
  "Don’t put the submark next to\nthe logo.",
  "Don’t add effects like shadows,\ngradients, or textures to the logo.",
  "Don’t make the corners rounded.",
].map((caption, i) => ({ image: `${A}/logo-dont-${i + 1}.webp`, caption }));

/* ---------------------------------- Pieces ------------------------------------ */

const IdentityCard = ({ card, i, onNavigate }) => (
  <motion.button
    type="button"
    onClick={() => onNavigate(card.target)}
    className="group relative block w-full aspect-[229/289] overflow-hidden text-left cursor-pointer outline-none"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.08 }}
    viewport={{ once: true, amount: 0.3 }}
  >
    <Image
      src={card.image}
      alt=""
      width={454}
      height={574}
      sizes="(min-width: 640px) 20vw, 50vw"
      style={{ "--tone": card.tone ?? 1 }}
      className="absolute inset-0 w-full h-full object-cover brightness-[calc(var(--tone)*0.85)] transition-[transform,filter] duration-[1200ms] ease-out group-hover:scale-[1.04] group-hover:brightness-[calc(var(--tone)*1.6)] group-focus-visible:brightness-[calc(var(--tone)*1.6)]"
    />
    <span className="relative flex h-full flex-col justify-end px-3 pb-2.5 md:px-[1.17cqw] md:pb-[0.9cqw]">
      <span className="font-heading font-light text-[#C1BFBF] leading-[1.25] text-[17px] md:text-[clamp(13px,1.91cqw,32px)]">
        {card.n} {card.title[0]}
        {card.title[1] && (
          <>
            <br />
            {card.title[1]}
          </>
        )}
      </span>
      <span className="flex items-center justify-between mt-1.5 md:mt-[0.6cqw] font-(family-name:--font-uni-mono) text-[#E8E8E1]/60 text-[12px] md:text-[clamp(11px,1.3cqw,20px)] tracking-[0.2px]">
        {card.count} elements
        <ArrowRight className="w-[0.9em] h-[1.1em] transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </span>
  </motion.button>
);

// Intrinsic sizes of the exported diagram SVGs (served as-is: next/image skips SVG optimisation)
const DIAGRAM_SIZE = {
  "logo-concept.svg": [604, 144],
  "submark-concept.svg": [404, 144],
  "logo-formation.svg": [928, 234],
  "logo-spacing.svg": [779, 405],
  "submark-spacing.svg": [296, 399],
  "lockup-logo.svg": [678, 219],
  "lockup-submark.svg": [367, 174],
};

const Diagram = ({ src, className, delay = 0 }) => (
  <MotionImage
    src={src}
    alt=""
    aria-hidden="true"
    width={DIAGRAM_SIZE[src.split("/").pop()][0]}
    height={DIAGRAM_SIZE[src.split("/").pop()][1]}
    className={`block h-auto max-w-full ${className}`}
    initial={{ opacity: 0, scale: 0.97 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, ease: "easeOut", delay }}
    viewport={{ once: true, amount: 0.4 }}
  />
);

const caption = "font-body text-[#E8E8E1]/80 leading-[1.6] text-[13px] md:text-[clamp(11px,1.21cqw,20px)] md:whitespace-pre-line";

const DontMark = () => (
  <svg viewBox="0 0 10 10" className="shrink-0 w-[10px] h-[10px] md:w-[0.87cqw] md:h-[0.87cqw] mt-[0.4em]" aria-label="Don't">
    <circle cx="5" cy="5" r="5" fill="#E0262E" />
    <path d="M7.27 2.74L2.73 7.27M7.27 7.27L2.73 2.74" stroke="#fff" strokeWidth="0.75" />
  </svg>
);

const ExampleCard = ({ item, i, dont }) => (
  <motion.figure
    className="md:min-h-[24.46cqw]"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: (i % 3) * 0.08 }}
    viewport={{ once: true, amount: 0.4 }}
  >
    <Image
      src={item.image}
      alt=""
      width={576}
      height={310}
      sizes="(min-width: 640px) 25vw, 100vw"
      className="block w-full h-auto aspect-[288/155]"
    />
    <figcaption className="flex items-start justify-between gap-3 mt-2 md:mt-[0.5cqw] md:pr-[0.4cqw]">
      <span className={caption}>{item.caption}</span>
      {dont && <DontMark />}
    </figcaption>
  </motion.figure>
);

/* Two-line spacing note: the opening line reads brighter than the rest */
const SpacingNote = ({ lead, paras, className }) => (
  <motion.div className={`space-y-5 md:space-y-[3.56cqw] ${className}`} {...fadeUp}>
    <p className={`${body} text-[#E8E8E1]/80!`}>
      <span className="text-[#E8E8E1]">{lead}</span>
      <br />
      {paras[0]}
    </p>
    {paras.slice(1).map((p) => (
      <p key={p} className={`${body} text-[#E8E8E1]/80!`}>
        {p}
      </p>
    ))}
  </motion.div>
);

const Caption = ({ title, note, className }) => (
  <motion.p
    className={`font-body text-[#E8E8E1] leading-[1.75] text-[14px] md:text-[clamp(12px,1.39cqw,22px)] ${className}`}
    {...fadeUp}
  >
    {title}
    <br />
    {note}
  </motion.p>
);

/* ----------------------------------- Slide ------------------------------------ */

const IdentityDesignSlide = ({ onNavigate }) => (
  <section id="identity-design" className="relative w-full px-6 md:px-0 pb-24 md:pb-[17cqw]">
    {/* Tinted glow behind the Brand Identity intro */}
    <Image
      src={`${A}/identity-bg.webp`}
      alt=""
      aria-hidden="true"
      width={1153}
      height={1197}
      sizes={COLUMN_SIZES}
      ref={ambient}
      className="uni-bg uni-amb uni-amb-breathe pointer-events-none absolute left-0 top-0 w-full h-[900px] md:h-[103.8cqw] object-cover object-top"
      style={{ "--uni-fade-y": "linear-gradient(to bottom, #000 85%, transparent)", "--amb-dur": "10s" }}
    />

    {/* Brand Identity */}
    <div className="relative pt-28 md:pt-[20.5cqw]">
      <motion.h2 className={`${heading} text-center`} {...fadeUp}>
        Brand Identity
      </motion.h2>
      <div className="mt-10 md:mt-[9cqw] grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-[1.04cqw] md:mx-[8.67cqw]">
        {identityCards.map((card, i) => (
          <IdentityCard key={card.n} card={card} i={i} onNavigate={onNavigate} />
        ))}
      </div>
    </div>

    {/* Identity Design index (z-10: stays above the Concept glow that rises behind it) */}
    <div className="relative z-10 mt-32 md:mt-[32.4cqw]">
      <SectionIndex
        id="identity-design-index"
        title={
          <>
            Identity
            <br />
            Design
          </>
        }
        titleClass="md:leading-[1.37]"
        listClass="md:mt-[11.1cqw]"
        items={index}
        onNavigate={onNavigate}
      />
    </div>

    {/* Concept */}
    <div id="logo-concept" className="relative mt-28 md:mt-[33.8cqw]">
      {/* Flattened on the page colour, so no blend mode is needed (blend modes force a costly
          composite on every scroll frame); the index above sits on top via z-10 */}
      <Image
        src={`${A}/concept-glow.webp`}
        alt=""
        aria-hidden="true"
        width={1153}
        height={941}
        sizes={COLUMN_SIZES}
        ref={ambient}
        style={{ "--amb-dur": "8s", "--amb-min": 0.6 }}
        className="uni-bg uni-amb uni-amb-breathe pointer-events-none absolute -left-6 -right-6 md:left-0 md:right-0 -top-[59.3cqw] w-[calc(100%+48px)] md:w-full max-w-none h-[81.6cqw] object-cover"
      />
      <motion.h3 className={`${heading} relative md:ml-[8.67cqw]`} {...fadeUp}>
        Concept
      </motion.h3>
      <Diagram src={`${A}/logo-concept.svg`} className="relative mt-12 md:mt-[11cqw] mx-auto md:mx-0 md:ml-[23.85cqw] w-full md:w-[52.38cqw]" />
      <motion.p className={`${body} text-[#E8E8E1]/80! relative mt-12 md:mt-[10.3cqw] md:ml-[8.67cqw] md:max-w-[63cqw]`} {...fadeUp}>
        The Point Of logo embodies clarity, precision, and transformation, aligning with the brand’s strategic approach.
        The minimalist design and spaced typography contribute to the overall sophistication, while the N subtly
        transforms the conventional into the extraordinary. Clean and versatile, it reflects the professionalism and the
        brand’s ability to craft meaningful brand experiences.
      </motion.p>
      <Diagram src={`${A}/submark-concept.svg`} className="mt-16 md:mt-[13.1cqw] mx-auto md:mx-0 md:ml-[32.52cqw] w-[70%] md:w-[35.04cqw]" />
      <motion.p className={`${body} text-[#E8E8E1]/80! mt-12 md:mt-[10.3cqw] md:ml-[8.67cqw] md:max-w-[60cqw]`} {...fadeUp}>
        The Point Of submark is a compact, versatile extension of our primary logo, ensuring visibility in smaller spaces
        without losing clarity. While the main logo represents our full identity, the submark maintains recognition and
        consistency across digital and print applications. Sleek, simple, and memorable, it reinforces our presence where
        space is limited but impact is key.
      </motion.p>
    </div>

    {/* Formation */}
    <div id="logo-formation" className="relative mt-28 md:mt-[34.4cqw]">
      <motion.h3 className={`${heading} text-center`} {...fadeUp}>
        Logo Formation
      </motion.h3>
      <Diagram src={`${A}/logo-formation.svg`} className="mt-12 md:mt-[15.35cqw] md:ml-[8.33cqw] w-full md:w-[80.5cqw]" />
    </div>

    {/* Size & spacing */}
    <div id="logo-size-spacing" className="relative mt-28 md:mt-[34cqw]">
      <motion.h3 className={`${heading} text-center`} {...fadeUp}>
        Size &amp; Spacing
      </motion.h3>
      <Diagram src={`${A}/logo-spacing.svg`} className="mt-12 md:mt-[18cqw] mx-auto md:mx-0 md:ml-[16.22cqw] w-full md:w-[67.56cqw]" />
      <SpacingNote
        className="mt-12 md:mt-[9cqw] md:ml-[15.87cqw] md:max-w-[64.4cqw]"
        lead="At Point Of, Logo spacing isn’t just a guideline—it’s a strategic choice."
        paras={[
          "By ensuring a dedicated clear area around our logo, free from any design elements or text, we preserve its clarity, impact, and presence. This deliberate spacing allows the logo to command attention, maintaining its legibility and strength, even in the most dynamic or visually complex environments.",
          "It is especially important when the logo is used in smaller sizes, as the clear space reinforces brand recognition and consistency across all applications.",
        ]}
      />
      <Diagram src={`${A}/submark-spacing.svg`} className="mt-20 md:mt-[18cqw] mx-auto md:mx-0 md:ml-[37.64cqw] w-[60%] md:w-[25.67cqw]" />
      <SpacingNote
        className="mt-12 md:mt-[9.1cqw] md:ml-[17.09cqw] md:max-w-[66.8cqw] md:text-justify"
        lead="At Point Of, Submark spacing isn’t just a guideline—it’s a strategic choice."
        paras={[
          "Clear space is essential to maintaining the integrity and impact of our submark. It must remain isolated from typography, artwork, or visual elements to ensure clarity, legibility, and brand consistency.",
          "This becomes even more crucial at smaller sizes, where clear space reinforces recognition and coherence across all applications, strengthening Point Of’s commitment to transformative branding and design solutions.",
        ]}
      />
    </div>

    {/* Lockups */}
    <div id="logo-lockups" className="relative mt-28 md:mt-[34.8cqw]">
      <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
        Logo Lockups
      </motion.h3>
      <Diagram src={`${A}/lockup-logo.svg`} className="mt-12 md:mt-[10.4cqw] mx-auto md:mx-0 md:ml-[20.56cqw] w-full md:w-[58.8cqw]" />
      <Caption
        className="mt-8 md:mt-[8.9cqw] md:ml-[8.67cqw]"
        title="Logo partnership lockup"
        note="Note: The Point Of logo is always placed first"
      />
      <Diagram src={`${A}/lockup-submark.svg`} className="mt-16 md:mt-[18.7cqw] mx-auto md:mx-0 md:ml-[34.08cqw] w-[75%] md:w-[31.83cqw]" />
      <Caption
        className="mt-8 md:mt-[9.2cqw] md:ml-[8.67cqw]"
        title="Submark partnership lockup"
        note="Note: The PO Submark is always placed first"
      />
    </div>

    {/* Do's & don'ts */}
    <div id="logo-dos-donts" className="relative mt-28 md:mt-[34.4cqw] md:mx-[8.67cqw]">
      <motion.h3 className={heading} {...fadeUp}>
        Logo Do’s
      </motion.h3>
      <div className="mt-10 md:mt-[10.75cqw] grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-x-4 md:gap-x-[3.64cqw]">
        {dos.map((item, i) => (
          <ExampleCard key={item.image} item={item} i={i} />
        ))}
      </div>

      <motion.h3 className={`${heading} mt-24 md:mt-[26.1cqw]`} {...fadeUp}>
        Logo Don’ts
      </motion.h3>
      <div className="mt-10 md:mt-[10.7cqw] grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-x-4 md:gap-x-[3.64cqw] md:gap-y-0">
        {donts.map((item, i) => (
          <ExampleCard key={item.image} item={item} i={i} dont />
        ))}
      </div>
    </div>
  </section>
);

export default IdentityDesignSlide;
