"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const BOTTOM_COPY =
  "From global technology companies to independent artists and cultural institutions we've helped launch brands, campaigns, digital experiences, and ideas that needed to exist in the world.";

const stats = [
  {
    number: "170+",
    label: "Brands",
    desc: "Brands across industries, from first-time founders to established names.",
  },
  {
    number: "350+",
    label: "Projects",
    desc: "Projects spanning brand strategy, identity, digital, and campaigns.",
  },
  {
    number: "11+",
    label: "Countries",
    desc: "Countries across 5 continents; Asia, Europe, the Americas, Africa and the Middle East.",
  },
  {
    number: "7+",
    label: "Years",
    desc: "Years building brands that adapt, endure, and stay culturally relevant.",
  },
];

const DIGITS = Array.from({ length: 10 }, (_, i) => i);
const SCROLL_DURATION = 1.6;
const STAGGER = 0.08;

/* ---------- Utils ---------- */

const parseStatNumber = (raw) => {
  const match = raw.match(/^(\d+)(\+)?$/);
  return {
    value: match ? parseInt(match[1], 10) : 0,
    suffix: match?.[2] || "",
  };
};

/* ---------- Digit Column ---------- */

function DigitColumn({ digit, active, index, total }) {
  const delay = active
    ? index * STAGGER
    : (total - index - 1) * STAGGER;

  return (
    <span className="relative inline-grid overflow-hidden h-[1em]">
      <motion.span
        className="flex flex-col"
        initial={{ y: "0%" }}
        animate={{ y: active ? `${-digit * 10}%` : "0%" }}
        transition={{
          duration: SCROLL_DURATION,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {DIGITS.map((n) => (
          <span
            key={n}
            className="h-[1em] flex items-center justify-center"
          >
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/* ---------- Odometer ---------- */

function OdometerStatNumber({ raw, active, className }) {
  const { value, suffix } = useMemo(
    () => parseStatNumber(raw),
    [raw]
  );

  const digits = useMemo(
    () => String(value).split("").map(Number),
    [value]
  );

  return (
    <h3 className={className}>
      <span className="inline-flex">
        {digits.map((d, i) => (
          <DigitColumn
            key={i}
            digit={d}
            active={active}
            index={i}
            total={digits.length}
          />
        ))}
      </span>
      {suffix}
    </h3>
  );
}

/* Odometer that rolls in/out with its own visibility (mobile/tablet: stats sit one per row) */
function InViewOdometer({ raw, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  return (
    <div ref={ref}>
      <OdometerStatNumber raw={raw} active={inView} className={className} />
    </div>
  );
}

/* ---------- Main ---------- */

function StaticStatsSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-background px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28 xl:px-40 xl:py-32">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full"
      >
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: index * 0.12,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
            >
              <div className="flex items-baseline gap-3">
                {/* Number */}
                <InViewOdometer
                  raw={item.number}
                  className="text-3xl font-heading font-medium leading-[1.1] tracking-[1px] text-heading sm:text-4xl"
                />

                {/* Label */}
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                    duration: 0.8,
                  }}
                  className="heading-md text-heading"
                >
                  {item.label}
                </motion.p>
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.25 + index * 0.08,
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-4 h-px w-full origin-left bg-foreground/20"
              />

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.35 + index * 0.1,
                  duration: 0.8,
                }}
                className="para mt-4 max-w-[60ch] text-desc"
              >
                {item.desc}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Copy */}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            delay: 0.35,
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-14 md:mt-20"
        >
          <p className="heading-lg m-0 w-full max-w-none text-left leading-[1.45] text-heading">
            {BOTTOM_COPY}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

function AnimatedStatsSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    /* Intersection Observer */
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    /* GSAP Context (fix) */
    const ctx = gsap.context(() => {
      const split = new SplitType(textRef.current, {
        types: "lines, words",
        lineClass: "line",
        wordClass: "wordspan",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
        },
      });

      tl.to(".line-fill", {
        width: "100%",
        duration: 1,
      }).from(split.lines, {
        x: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
      });

      return () => split.revert();
    }, sectionRef);

    return () => {
      observer.disconnect();
      ctx.revert(); // important
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10  w-full bg-background py-16 md:py-24 px-6 sm:px-8 md:px-40 lg:px-14 xl:px-40"
    >
      <div className="flex flex-col md:items-end w-full">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full">
          {stats.map((item, i) => (
            <div key={i} className="min-w-0">
              <OdometerStatNumber
                raw={item.number}
                active={inView}
                className="text-2xl md:text-4xl xl:text-[4rem] tracking-[1px] font-heading font-medium leading-[1.3]"
              />
              <p className="heading-md text-heading mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Line */}
        <div className="relative my-12 md:my-6 h-px w-full bg-foreground/20 overflow-hidden">
          <div className="line-fill h-full w-0 bg-foreground" />
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full">
          {stats.map((item, i) => (
            <p key={i} className="para text-desc min-w-0">
              {item.desc}
            </p>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="mt-16 md:mt-30 w-full grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 min-w-0">
          <div className="col-span-2 md:col-start-2 md:col-span-3 min-w-0 overflow-visible [&_.line]:block [font-kerning:none]">
            <p
              ref={textRef}
              className="heading-lg text-heading m-0 w-full max-w-none text-left leading-[1.45]"
            >
              {BOTTOM_COPY}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const StatsSection = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return isDesktop ? <AnimatedStatsSection /> : <StaticStatsSection />;
};

export default StatsSection;
