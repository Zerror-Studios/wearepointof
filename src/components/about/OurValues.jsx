"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const circles = [
  { r: 347, cx: 1050, cy: 1650, label: "EVOLUTION",  pathId: "circlePath1", path: "M703,1650 A337,337 0 0,1 1397,1650" },
  { r: 497, cx: 1050, cy: 1500, label: "IMPACT",     pathId: "circlePath2", path: "M553,1500 A487,487 0 0,1 1547,1500" },
  { r: 647, cx: 1050, cy: 1350, label: "CRAFT",      pathId: "circlePath3", path: "M403,1350 A637,637 0 0,1 1697,1350" },
  { r: 797, cx: 1050, cy: 1200, label: "RIGOUR",     pathId: "circlePath4", path: "M253,1200 A787,787 0 0,1 1847,1200" },
  { r: 947, cx: 1050, cy: 1050, label: "CURIOSITY",  pathId: "circlePath5", path: "M103,1050 A937,937 0 0,1 1997,1050" },
];

function CircleItem({ circle, index, scrollYProgress }) {
  const sliceSize = 1 / circles.length;
  const start = index * sliceSize;
  const mid = start + sliceSize * 0.5;
  const end = start + sliceSize;

  const circumference = 2 * Math.PI * circle.r;

  const dashOffset = useTransform(scrollYProgress, [start, end], [circumference, 0]);
  const textOpacity = useTransform(scrollYProgress, [mid, end], [0, 1]);

  return (
    <g>
      <motion.circle
        cx={circle.cx}
        cy={circle.cy}
        r={circle.r}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth={2}
        strokeDasharray={circumference}
        className="text-[#c0bfbf]"
        style={{
          strokeDashoffset: dashOffset,
          transformOrigin: "center",
          transformBox: "fill-box",
          rotate: 90,
        }}
      />
      <motion.text
        dy="15"
        style={{ opacity: textOpacity }}
        fill="#c0bfbf"
        stroke="#0a0a0a"
        strokeWidth={22}
        fontSize="52"
        letterSpacing={6}
        paintOrder="stroke fill"
        fontFamily="inherit"
      >
        <textPath href={`#${circle.pathId}`} startOffset="50%" textAnchor="middle">
          {circle.label}
        </textPath>
      </motion.text>
    </g>
  );
}

function CircleItemStatic({ circle }) {
  return (
    <g>
      <circle
        cx={circle.cx}
        cy={circle.cy}
        r={circle.r}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth={2}
        className="text-[#c0bfbf]"
        style={{
          transformOrigin: "center",
          transformBox: "fill-box",
          rotate: 90,
        }}
      />
      <text
        dy="15"
        fill="#c0bfbf"
        stroke="#0a0a0a"
        strokeWidth={22}
        fontSize="52"
        letterSpacing={6}
        paintOrder="stroke fill"
        fontFamily="inherit"
      >
        <textPath href={`#${circle.pathId}`} startOffset="50%" textAnchor="middle">
          {circle.label}
        </textPath>
      </text>
    </g>
  );
}

export default function OurValues() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    // Layout comes from CSS breakpoints (not isMobile) so the first paint is already the right
    // height; switching 600vh → auto after hydration caused a big reflow + ScrollTrigger refresh.
    <section ref={sectionRef} className="relative py-16 md:py-0 md:h-[600vh]">

      {/* Sticky wrapper (md+) */}
      <div className="flex w-full items-center pt-6 justify-center overflow-hidden md:sticky md:top-0 md:h-svh">

        {/*
          Heading + SVG share one sized box so "Our Values" stays
          centered in the innermost circle on every aspect ratio
          (incl. iPad Pro), not relative to the viewport.
        */}
        <div className="relative w-[96vw] h-[96vw] sm:w-[min(90vh,90vw)] sm:h-[min(90vh,90vw)] shrink-0">
          {/*
            Innermost circle center is at y=1650 in a 2100 viewBox
            → ~21.4% from the bottom of the SVG.
          */}
          <h2 className="absolute z-10 text-center heading-lg text-subheading pointer-events-none left-1/2 bottom-[9%] sm:bottom-[13%] lg:bottom-[12%] xl:bottom-[8%] -translate-x-1/2 -translate-y-1/2">
            Our <br /> Values
          </h2>

          <svg
            className="h-full w-full overflow-visible"
            viewBox="0 0 2100 2100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {circles.map((c) => (
                <path key={c.pathId} id={c.pathId} d={c.path} />
              ))}
            </defs>

            {isMobile
              ? circles.map((circle) => <CircleItemStatic key={circle.pathId} circle={circle} />)
              : circles.map((circle, i) => (
                  <CircleItem
                    key={circle.label}
                    circle={circle}
                    index={i}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
