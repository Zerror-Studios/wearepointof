"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp, heading, SectionIndex, MotionImage, COLUMN_SIZES } from "./shared";

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

const gradients = Array.from({ length: 13 }, (_, i) => `${V}/gradient-v2-${i + 1}.webp`);

/* A gallery image that fades up as it enters, with a slow zoom on hover.
   size = intrinsic [width, height] of the exported file; sizes = its rendered width. */
const Tile = ({ src, className = "", size, sizes, i = 0 }) => (
  <motion.div
    className={`group overflow-hidden ${className}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: (i % 5) * 0.06 }}
    viewport={{ once: true, amount: 0.25 }}
  >
    <Image
      src={src}
      alt=""
      width={size[0]}
      height={size[1]}
      sizes={sizes}
      className="block w-full h-auto transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
    />
  </motion.div>
);

const Art = ({ src, size, className = "" }) => (
  <MotionImage
    src={src}
    alt=""
    aria-hidden="true"
    width={size[0]}
    height={size[1]}
    sizes={COLUMN_SIZES}
    className={`block w-full h-auto ${className}`}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1.4, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.15 }}
  />
);

const VisualLanguageSlide = ({ onNavigate }) => (
  <section id="visual-language" className="relative w-full px-6 md:px-0 pt-28 md:pt-[16.8cqw] pb-24 md:pb-[17cqw]">
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
          <Tile key={src} src={src} size={[324, 452]} sizes="(min-width: 640px) 15vw, 33vw" i={i} className={i === 10 ? "sm:col-start-2" : ""} />
        ))}
      </div>
    </div>

    {/* Grains */}
    <div id="visual-grains" className="relative mt-28 md:mt-[35.6cqw]">
      <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
        Grains
      </motion.h3>
      <div className="mt-10 md:mt-[7cqw] md:ml-[13.88cqw] md:w-[72.3cqw] space-y-4 md:space-y-[9.2cqw]">
        <Tile src={`${V}/grain-1.webp`} size={[1251, 714]} sizes="(min-width: 768px) 72vw, 100vw" />
        <Tile src={`${V}/grain-2.webp`} size={[1251, 714]} sizes="(min-width: 768px) 72vw, 100vw" />
        <div className="grid grid-cols-3 gap-3 md:gap-[2.34cqw]">
          {[3, 4, 5].map((n, i) => (
            <Tile key={n} src={`${V}/grain-${n}.webp`} size={[390, 693]} sizes="(min-width: 768px) 23vw, 33vw" i={i} />
          ))}
        </div>
      </div>
    </div>

    {/* Lines */}
    <div id="visual-lines" className="relative mt-28 md:mt-[33.9cqw]">
      <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
        Lines
      </motion.h3>
      <Art src={`${V}/lines.webp`} size={[1730, 2460]} className="-mx-6 w-[calc(100%+48px)] md:mx-0 md:w-full mt-6 md:mt-[4.4cqw]" />
    </div>

    {/* Circular motion */}
    <div id="visual-circular-motion" className="relative mt-20 md:mt-[33.9cqw]">
      <motion.h3 className={`${heading} md:ml-[8.67cqw]`} {...fadeUp}>
        Circular Motion
      </motion.h3>
      <Art
        src={`${V}/circular-motion.webp`}
        size={[1730, 870]}
        className="-mx-6 w-[calc(100%+48px)] md:mx-0 md:w-full mt-8 md:mt-[9.4cqw]"
      />
    </div>

    {/* Glass & holographic */}
    <div id="visual-glass" className="relative mt-28 md:mt-[36.5cqw] md:mx-[8.67cqw]">
      <motion.h3 className={heading} {...fadeUp}>
        Glass &amp; Holographic Effects
      </motion.h3>
      <div className="mt-10 md:mt-[7.5cqw] grid grid-cols-2 gap-3 md:gap-[4.34cqw]">
        <Tile src={`${V}/glass-1.webp`} size={[678, 1205]} sizes="(min-width: 768px) 40vw, 50vw" />
        <Tile src={`${V}/glass-2.webp`} size={[678, 1205]} sizes="(min-width: 768px) 40vw, 50vw" i={1} />
      </div>
      <Tile src={`${V}/glass-3.webp`} size={[1431, 804]} sizes="(min-width: 768px) 83vw, 100vw" className="mt-3 md:mt-[9.2cqw]" />
    </div>
  </section>
);

export default VisualLanguageSlide;
