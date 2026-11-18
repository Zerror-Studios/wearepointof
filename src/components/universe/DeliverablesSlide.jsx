"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, heading } from "./shared";

/* 11 Deliverables + the closing statement that ends the Universe page */

const deliverables = [
  "Brand Guidelines",
  "Image, Icon & Illustration Guidelines",
  "Starter Image Library",
  "Brand Illustrations",
  "Corporate Communication",
];

const glow = { textShadow: "0 0 12px rgba(232,232,225,0.35)" };

const DeliverablesSlide = () => (
  <section id="deliverables" className="relative w-full px-6 md:px-0">
    {/* Eclipse glow behind the heading */}
    <img
      src="/universe/deliverables-eclipse.webp"
      alt=""
      aria-hidden="true"
      decoding="async"
      className="pointer-events-none absolute left-0 top-0 w-full h-[560px] md:h-[78.4cqw] object-cover object-left-top"
    />

    <div className="relative pt-28 md:pt-[27.4cqw] md:flex md:min-h-[78.4cqw]">
      <motion.h2 className={`${heading} md:ml-[8.67cqw] md:w-[34.93cqw] shrink-0`} {...fadeUp}>
        Deliverables
      </motion.h2>
      <ul className="mt-8 md:mt-[8.4cqw] md:w-[47.8cqw] self-start">
        {deliverables.map((item, i) => (
          <motion.li
            key={item}
            className="group flex items-center h-[56px] md:h-[5.9cqw] border-b border-[#8E8E8E]/60 font-heading font-light text-[#E8E8E1] text-[17px] md:text-[clamp(15px,1.91cqw,32px)]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            {/* Dot slides in on hover, as in the design's hover state */}
            <span className="w-0 h-[0.7em] mr-0 rounded-full bg-[#E8E8E1] scale-0 transition-[width,margin,scale] duration-300 group-hover:w-[0.7em] group-hover:mr-[0.35em] group-hover:scale-100" />
            {item}
          </motion.li>
        ))}
      </ul>
    </div>

    {/* Closing statement */}
    <div className="relative -mx-6 md:mx-0 px-6 md:px-0 pt-32 md:pt-[19.4cqw] pb-20 md:pb-[9.9cqw]">
      <img
        src="/universe/closing-bg.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover"
      />
      <motion.p
        className="relative font-heading font-light text-[#E8E8E1] leading-[1.37] text-[30px] md:text-[3.82cqw] md:ml-[8.67cqw]"
        style={glow}
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.6 }}
      >
        The Point Of
        <br />
        every brand is to be
        <br />
        understood.
      </motion.p>
      <motion.p
        className="relative mt-20 md:mt-[16cqw] ml-auto md:mr-[8.6cqw] max-w-[300px] md:max-w-[37cqw] text-right font-heading font-light text-[#E8E8E1] leading-[1.42] text-[22px] md:text-[2.6cqw]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.6 }}
      >
        Strategy is what makes that possible.
      </motion.p>
      <motion.div
        className="relative mt-28 md:mt-[30.4cqw] text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: true, amount: 0.8 }}
      >
        <Link
          href="/"
          className="font-heading font-light text-[#E8E8E1] text-[18px] md:text-[2cqw] transition-opacity duration-300 hover:opacity-70"
        >
          wearepointof.com
        </Link>
      </motion.div>
    </div>
  </section>
);

export default DeliverablesSlide;
