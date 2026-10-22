"use client";
import React, { useEffect, useRef } from "react";

const StudioConsultancy = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            leftRef.current?.classList.add("animate-in-left");
            rightRef.current?.classList.add("animate-in-right");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <style>{`
        .slide-left {
          opacity: 0;
          transform: translateX(-60px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .slide-right {
          opacity: 0;
          transform: translateX(60px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-in-left {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        .animate-in-right {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>

      <div className="px-6 sm:px-10 md:pl-12 xl:pl-48 2xl:pl-[30rem] md:pr-[max(3.5rem,calc((100%-1350px)/2+3.5rem))] py-16 sm:py-20 md:py-28 lg:py-32">

        {/* Intro heading */}
        <h2 className="heading-xl text-heading mb-16 md:mb-20 max-w-4xl">
        We work with brands at two distinct moments, and across everything in between.
        </h2>

        {/* Two columns */}
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">

          {/* Studio—slides in from left */}
          <div ref={leftRef} className="slide-left flex flex-col gap-4">
            <h3 className="heading-lg text-heading">
              The Studio
            </h3>
            <span className="text-sm md:text-base xl:text-sm text-desc tracking-wide">0→1 (Foundation)</span>
            <p className="para text-desc">
              This is where brands are born. We take an idea—sometimes just a conviction and a name—and build it into something real. Strategy, positioning, identity, digital, print. The full creative foundation, built to hold weight from day one.
            </p>
          </div>

          {/* Consultancy—slides in from right */}
          <div ref={rightRef} className="slide-right flex flex-col gap-4">
            <h3 className="heading-lg text-heading">
              The Consultancy
            </h3>
            <span className="text-sm md:text-base xl:text-sm text-desc tracking-wide">1→100 (Growth)</span>
            <p className="para text-desc">
              This is where brands grow. Once the foundation is set, we stay in—as creative partner, strategic counsel, and fractional CMO. Brand strategy, media production, social, campaigns, events, performance. Whatever the brand needs to scale, we're already in the room.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudioConsultancy;