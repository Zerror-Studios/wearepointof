"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeUp, heading, SectionIndex } from "./shared";

/*
  10 Visual Language: a gallery of the brand's gradients, grains, line work, circular
  motion and glass effects. Tiles are exported from the design (public/universe/visual).
*/

const V = "/universe/visual";

const index = [
  { label: "Gradients", target: "visual-gradients" },
  { label: "Grains", target: "visual-grains" },
  { label: "Lines", target: "visual-lines" },
  { label: "Circular Motion", target: "visual-circular-motion" },
  { label: "Glass & Holographic Effects", target: "visual-glass" },
];

const gradients = Array.from({ length: 13 }, (_, i) => `${V}/gradient-${i + 1}.webp`);

/* A gallery image that fades up as it enters, with a slow zoom on hover */
const Tile = ({ src, className = "", ratio, i = 0 }) => (
  <motion.div
    className={`group overflow-hidden ${className}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: (i % 5) * 0.06 }}
    viewport={{ once: true, amount: 0.25 }}
  >
    <img
      src={src}
      alt=""
      decoding="async"
      loading="lazy"
      className="block w-full h-auto transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      style={{ aspectRatio: ratio }}
    />
  </motion.div>
);

const Art = ({ src, ratio, className = "" }) => (
  <motion.img
    src={src}
    alt=""
    aria-hidden="true"
    decoding="async"
    loading="lazy"
    className={`block w-full h-auto ${className}`}
    style={{ aspectRatio: ratio }}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1.4, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.15 }}
  />
);

const VisualLanguageSlide = ({ onNavigate }) => (
  <section id="visual-language" className="relative w-full px-6 md:px-0 pt-28 md:pt-[16.8cqw] pb-28 md:pb-[34.7cqw]">
    <SectionIndex
      title={
        <>
          Visual
          <br />
          Language
        </>
      }
      titleClass="md:leading-[1.37]"
      listClass="md:mt-[10.9cqw]"
      items={index}
      onNavigate={onNavigate}
    />

    {/* Gradients */}
    <div id="visual-gradients" className="relative mt-28 md:mt-[35.3cqw] md:mx-[8.67cqw]">
      <motion.h3 className={heading} {...fadeUp}>
        Gradients
      </motion.h3>
      <div className="mt-10 md:mt-[7cqw] grid grid-cols-3 sm:grid-cols-5 gap-3 md:gap-x-[3.12cqw] md:gap-y-[9.19cqw]">
        {gradients.map((src, i) => (
          <Tile key={src} src={src} ratio="162 / 226" i={i} className={i === 10 ? "sm:col-start-2" : ""} />
        ))}
      </div>
    </div>

    {/* Grains */}
    <div id="visual-grains" className="relative mt-28 md:mt-[35.6cqw]">
      <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
        Grains
      </motion.h3>
      <div className="mt-10 md:mt-[7cqw] md:ml-[13.88cqw] md:w-[72.3cqw] space-y-4 md:space-y-[9.2cqw]">
        <Tile src={`${V}/grain-1.webp`} ratio="834 / 476" />
        <Tile src={`${V}/grain-2.webp`} ratio="834 / 476" />
        <div className="grid grid-cols-3 gap-3 md:gap-[2.34cqw]">
          {[3, 4, 5].map((n, i) => (
            <Tile key={n} src={`${V}/grain-${n}.webp`} ratio="260 / 462" i={i} />
          ))}
        </div>
      </div>
    </div>

    {/* Lines */}
    <div id="visual-lines" className="relative mt-28 md:mt-[33.9cqw]">
      <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
        Lines
      </motion.h3>
      <Art src={`${V}/lines.webp`} ratio="1153 / 1640" className="-mx-6 w-[calc(100%+48px)] md:mx-0 md:w-full mt-6 md:mt-[4.4cqw]" />
    </div>

    {/* Circular motion */}
    <div id="visual-circular-motion" className="relative mt-20 md:mt-[33.9cqw]">
      <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
        Circular Motion
      </motion.h3>
      <Art
        src={`${V}/circular-motion.webp`}
        ratio="1153 / 580"
        className="-mx-6 w-[calc(100%+48px)] md:mx-0 md:w-full mt-8 md:mt-[9.4cqw]"
      />
    </div>

    {/* Glass & holographic */}
    <div id="visual-glass" className="relative mt-28 md:mt-[36.5cqw] md:mx-[8.67cqw]">
      <motion.h3 className={heading} {...fadeUp}>
        Glass &amp; Holographic Effects
      </motion.h3>
      <div className="mt-10 md:mt-[7.5cqw] grid grid-cols-2 gap-3 md:gap-[4.34cqw]">
        <Tile src={`${V}/glass-1.webp`} ratio="452 / 803" />
        <Tile src={`${V}/glass-2.webp`} ratio="452 / 803" i={1} />
      </div>
      <Tile src={`${V}/glass-3.webp`} ratio="954 / 536" className="mt-3 md:mt-[9.2cqw]" />
    </div>
  </section>
);

export default VisualLanguageSlide;
