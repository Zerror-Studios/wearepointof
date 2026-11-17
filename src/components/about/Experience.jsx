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
  const yearRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        copyRef.current,
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

      // Year label counts 2019 → 2026 as the section scrolls into view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 90%",
        end: "top 30%",
        scrub: true,
        onUpdate: (self) => {
          const steps = END_YEAR - START_YEAR;
          const t = (self.progress - HOLD) / (1 - HOLD);
          if (yearRef.current) {
            yearRef.current.textContent = String(
              t <= 0 ? START_YEAR : START_YEAR + Math.min(steps, Math.floor(t * steps) + 1)
            );
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 py-16 sm:py-20 md:py-28 lg:py-36">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-x-6">
        <div className="md:col-span-5 flex items-center gap-3 md:items-start md:pt-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-heading shrink-0" />
          <span ref={yearRef} className="para-acc text-heading tabular-nums leading-none">
            {START_YEAR}
          </span>
        </div>

        <div ref={copyRef} className="md:col-span-7 max-w-[720px]" style={{ opacity: 0 }}>
          <p className="para text-desc">
            <span className="text-heading">Piran Tarapore founded the studio in 2019 as Savoir,</span> with a belief that design is most powerful when it starts with a question, not an answer. In 2024 it became Point Of, and Pearl Jain joined as co-founder.
          </p>
          <p className="para text-desc mt-6 md:mt-10">
            Born in Mumbai, grown across five continents. Years of building a consultancy that doesn't just create brands, it grows with them. From the first naming session to the hundredth campaign, we stay in the room.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;
