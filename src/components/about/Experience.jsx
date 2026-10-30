"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const START_YEAR = 2019;
const END_YEAR = 2026;
// Share of the scroll range that holds on START_YEAR before counting up
const HOLD = 0.35;

const Experience = () => {
  const sectionRef = useRef(null);
  const tickerRef = useRef(null);
  const lineRef = useRef(null);
  const yearDesktopRef = useRef(null);
  const yearMobileRef = useRef(null);
  const copyMobileRef = useRef(null);
  const copyDesktopRef = useRef(null);

  useEffect(() => {
    const years = () => [yearDesktopRef.current, yearMobileRef.current].filter(Boolean);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [copyMobileRef.current, copyDesktopRef.current].filter(Boolean),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        lineRef.current,
        { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: tickerRef.current,
            start: "top 90%",
            end: "top 30%",
            scrub: 0.3,
          },
        }
      );

      gsap.fromTo(years(),
        { opacity: 0.6 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: tickerRef.current,
            start: "top 90%",
            end: "top 30%",
            scrub: true,
          },
        }
      );

      ScrollTrigger.create({
        trigger: tickerRef.current,
        start: "top 90%",
        end: "top 30%",
        scrub: true,
        onUpdate: (self) => {
          const steps = END_YEAR - START_YEAR;
          const t = (self.progress - HOLD) / (1 - HOLD);
          const value = String(
            t <= 0
              ? START_YEAR
              : START_YEAR + Math.min(steps, Math.floor(t * steps) + 1)
          );
          years().forEach((el) => {
            el.textContent = value;
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const yearStyle = {
    color: "rgba(255,255,255,0.2)",
    letterSpacing: "-0.04em",
    lineHeight: 0.68,
  };

  return (
    <div ref={sectionRef} className="relative w-full">
      <div className="w-full px-6 sm:px-10 md:px-12 xl:pl-80 2xl:pl-120 xl:pr-6 py-16 sm:py-20 md:py-28 lg:py-32">
        <div ref={tickerRef}>

        {/* Mobile */}
        <div className="flex flex-col space-y-6 min-[700px]:hidden">
          <span
            ref={yearMobileRef}
            className="font-bold leading-none tracking-tight select-none tabular-nums"
            style={{
              ...yearStyle,
              fontSize: "clamp(56px, 15vw, 96px)",
              lineHeight: 1,
            }}
          >
            {START_YEAR}
          </span>
          <div className="h-px w-full bg-white/20" />
          <div ref={copyMobileRef} className="max-w-[560px]" style={{ opacity: 0 }}>
            <p className="para text-desc">
              <span className="text-white">Point Of was founded in 2019 by Piran Tarapore and Pearl Jain —</span> with a belief that design is most powerful when it starts with a question, not an answer.
            </p>
            <p className="para text-desc mt-4">
              Born in Mumbai, grown across five continents. Years of building a consultancy that doesn't just create brands, it grows with them. From the first naming session to the hundredth campaign, we stay in the room.
            </p>
          </div>
        </div>

        {/* Tablet: year | line | text in one row at full width.
            Desktop (xl): year + line hang in the left gutter beside the text. */}
        <div className="relative hidden min-[700px]:flex xl:block">
          <div className="flex flex-row items-stretch shrink-0 pr-6 lg:pr-10 xl:absolute xl:inset-y-0 xl:right-full xl:h-full">
            <div className="flex flex-col items-end pr-4 lg:pr-6">
              <span
                ref={yearDesktopRef}
                className="font-bold leading-none tracking-tight select-none tabular-nums"
                style={{
                  ...yearStyle,
                  fontSize: "clamp(48px, 7vw, 96px)",
                }}
              >
                {START_YEAR}
              </span>
            </div>
            <div className="relative w-px h-full self-stretch shrink-0">
              <div className="absolute inset-0" />
              <div
                ref={lineRef}
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                className="absolute inset-0 z-30 bg-linear-to-b from-transparent to-foreground"
              >
                <span className="w-[3px] h-[3px] bg-foreground rounded-full absolute bottom-0 left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </div>

          <div ref={copyDesktopRef} className="min-w-0 flex-1 xl:max-w-[560px]" style={{ opacity: 0 }}>
            <p className="para text-desc">
              <span className="text-white">Point Of was founded in 2019 by Piran Tarapore and Pearl Jain —</span> with a belief that design is most powerful when it starts with a question, not an answer.
            </p>
            <p className="para text-desc mt-4">
              Born in Mumbai, grown across five continents. Years of building a consultancy that doesn't just create brands, it grows with them. From the first naming session to the hundredth campaign, we stay in the room.
            </p>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};


export default Experience;
