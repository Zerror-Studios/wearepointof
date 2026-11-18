"use client";
import React, { useId, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { arrowDown } from "@/helper/universeArt";

// next/image that framer-motion can animate (whileInView fades etc.)
export const MotionImage = motion.create(Image);

// Common `sizes` for images that span the main column (sidebar is 287px from lg up)
export const COLUMN_SIZES = "(min-width: 1024px) calc(100vw - 287px), 100vw";

/*
  Pieces shared by the Universe slides. Tablet/desktop sizes are in cqw of the main
  column (design px / 11.53); phones get a stacked layout in px.
*/

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
  viewport: { once: true, amount: 0.4 },
};

export const heading = "font-heading font-light text-[#E8E8E1] leading-[1.15] text-[30px] md:text-[3.82cqw]";
export const body = "font-body text-[#BEBEB8] leading-[1.7] text-[15px] md:leading-[1.61] md:text-[clamp(13px,1.56cqw,26px)]";
// 22px card / row titles in the design
export const subheading = "font-heading font-light leading-[1.32] text-[19px] md:text-[clamp(14px,1.91cqw,32px)]";

/*
  A ring whose line tapers from thick (top-left) to hairline (bottom-right), filled with a
  fading gradient. Drawn as a filled shape (outer circle minus an offset inner circle), so
  it renders the same at any size. Must sit inside an svg with initial="hidden" /
  whileInView="shown": it draws in clockwise from 12 o'clock through a mask, and the mask
  is dropped once the draw finishes so the ring is always closed.
*/
const circlePath = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

export const TaperRing = ({ cx, cy, r, thick, thin, opacity = 1, delay = 0, duration = 1.6, color = "#E8E8E1" }) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [drawn, setDrawn] = useState(false);
  const band = (thick + thin) / 2; // average line width
  const shift = (thick - thin) / 2 / Math.SQRT2; // inner circle moves toward the thin side
  const d = circlePath(cx, cy, r) + circlePath(cx + shift, cy + shift, r - band);

  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={`taper-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="0.55" stopColor={color} stopOpacity="0.75" />
          <stop offset="1" stopColor={color} stopOpacity="0.25" />
        </linearGradient>
        {!drawn && (
          <mask id={`taper-mask-${uid}`}>
            <motion.circle
              cx={cx}
              cy={cy}
              r={r - band / 2}
              fill="none"
              stroke="#fff"
              strokeWidth={thick * 3 + 2}
              transform={`rotate(-90 ${cx} ${cy})`}
              variants={{
                hidden: { pathLength: 0 },
                shown: { pathLength: 1, transition: { duration, ease: "easeInOut", delay } },
              }}
              onAnimationComplete={(def) => def === "shown" && setDrawn(true)}
            />
          </mask>
        )}
      </defs>
      <path d={d} fillRule="evenodd" fill={`url(#taper-${uid})`} mask={drawn ? undefined : `url(#taper-mask-${uid})`} />
    </g>
  );
};

export const ArrowRight = ({ className }) => (
  <svg viewBox="854 937 19 23" className={`-rotate-90 ${className}`} fill="currentColor" aria-hidden="true">
    <path d={arrowDown} />
  </svg>
);

/* Section title on the left, a list of jump links on the right (the design's "index" pages) */
export const SectionIndex = ({ id, title, items, onNavigate, titleClass = "", listClass = "md:mt-[9.71cqw]" }) => (
  <div id={id} className="relative md:flex">
    <motion.h3 className={`${heading} md:ml-[8.67cqw] md:w-[38.3cqw] shrink-0 ${titleClass}`} {...fadeUp}>
      {title}
    </motion.h3>
    <ul className={`mt-8 md:w-[44.4cqw] ${listClass}`}>
      {items.map((item, i) => (
        <motion.li
          key={item.label}
          className="border-b border-[#8E8E8E]/60"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          <button
            type="button"
            onClick={() => item.target && onNavigate(item.target)}
            className="group flex items-center justify-between w-full h-[60px] md:h-[7.29cqw] text-left font-heading font-light text-[#8E8E8E] text-[17px] md:text-[clamp(15px,1.91cqw,32px)] cursor-pointer transition-colors duration-300 hover:text-[#E8E8E1]"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-2">{item.label}</span>
            <ArrowRight className="w-[0.7em] h-[0.85em] opacity-0 -translate-x-2 transition-[opacity,translate] duration-300 group-hover:opacity-60 group-hover:translate-x-0" />
          </button>
        </motion.li>
      ))}
    </ul>
  </div>
);
