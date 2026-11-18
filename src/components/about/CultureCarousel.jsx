"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Angle between neighbouring values on the arc
const STEP = 32;
const AUTOPLAY_MS = 5000;

const OrbitIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12 md:w-15 md:h-15 shrink-0" fill="none" aria-hidden="true">
    <g stroke="#E8E8E1" strokeOpacity="0.85" strokeWidth="1">
      <circle cx="32" cy="32" r="30" />
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="14" />
      <circle cx="32" cy="32" r="6" />
    </g>
    <g fill="#E8E8E1" className="origin-center animate-[spin_18s_linear_infinite]">
      <circle cx="8" cy="15" r="2" />
      <circle cx="54" cy="51" r="2" />
      <circle cx="32" cy="10" r="1.5" />
      <circle cx="46" cy="32" r="1.5" />
    </g>
  </svg>
);

const CultureCarousel = ({ title, data = [] }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || data.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % data.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, data.length]);

  const current = data[active];

  return (
    <section className="w-full pt-16 sm:pt-20 md:pt-28 lg:pt-36">
      {title && (
        <h2 className="heading-xl text-heading px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 mb-16 sm:mb-20 md:mb-28 lg:mb-36">
          {title}
        </h2>
      )}

      <div
        className="relative w-full overflow-hidden h-[460px] sm:h-[500px] md:h-[540px]"
        style={{ "--r": "clamp(520px, 66vw, 1400px)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Warm glow rising from the bottom edge */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 90% at 50% 100%, rgba(125,118,86,0.95) 0%, rgba(82,77,54,0.6) 35%, rgba(30,28,20,0.25) 65%, rgba(0,0,0,0) 85%)",
          }}
        />

        {/* Rotating dotted arc; the active value sits at its top */}
        <div
          className="absolute left-1/2 top-[90px] md:top-[100px] w-[calc(var(--r)*2)] h-[calc(var(--r)*2)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: `translateX(-50%) rotate(${-active * STEP}deg)` }}
        >
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
            <circle
              cx="100"
              cy="100"
              r="100"
              fill="none"
              stroke="#E8E8E1"
              strokeOpacity="0.45"
              strokeWidth="2"
              strokeDasharray="0.01 11"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {data.map((item, i) => {
            const offset = i - active;
            return (
              <div
                key={item.title}
                className="absolute left-1/2 top-1/2 w-0 h-0"
                style={{ transform: `rotate(${i * STEP}deg) translateY(calc(var(--r) * -1))` }}
              >
                {/* Counter-rotate so the chip always reads upright */}
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show value: ${item.title}`}
                  aria-current={offset === 0}
                  tabIndex={-1}
                  className="absolute left-0 top-0 flex items-center cursor-pointer transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${-offset * STEP}deg)`,
                    opacity: offset === 0 ? 1 : 0,
                    pointerEvents: offset === 0 ? "auto" : "none",
                  }}
                >
                  <OrbitIcon />
                  <span className="w-3 md:w-5 h-px bg-heading/50" />
                  <span className="whitespace-nowrap border border-heading/40 bg-black px-5 md:px-7 py-3 md:py-4 heading-md font-normal! text-heading">
                    {item.title}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Description */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[170px] md:top-[161px] w-[calc(100%-48px)] max-w-[466px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={current?.title}
              className="border border-heading/40 px-6 md:px-8 py-6 md:py-8 text-center para-acc leading-[1.8] text-subheading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              {current?.desc}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="absolute bottom-[84px] left-6 sm:left-10 md:left-12 lg:left-14 xl:left-20 flex items-center gap-2">
          {data.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show value ${i + 1}: ${item.title}`}
              aria-current={i === active}
              className="p-1 -m-1 cursor-pointer"
            >
              <span
                className={`block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i === active ? "bg-heading" : "bg-heading/35"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CultureCarousel;
