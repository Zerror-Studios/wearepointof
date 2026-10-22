"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

// Mobile/tablet path: bends alternate left/right every MOBILE_BEND_GAP units.
// Handles at 0.3634 × gap make each half-wave match a sine curve.
const MOBILE_VIEW_W = 741;
const MOBILE_VIEW_H = 3760;
const MOBILE_BEND_GAP = 540;
const MOBILE_BEND_X = [210.5, 530.5];
const MOBILE_PATH_Y = Array.from({ length: 7 }, (_, i) => 200 + i * MOBILE_BEND_GAP);
// Last curve runs out to the left text edge (5%) so the dot drops in line with the left column
const MOBILE_END_X = MOBILE_VIEW_W * 0.05;
const MOBILE_PATH_D = MOBILE_PATH_Y.reduce((d, y, i) => {
  const x = i === MOBILE_PATH_Y.length - 1 ? MOBILE_END_X : MOBILE_BEND_X[i % 2];
  if (i === 0) return `M${x} ${y}`;
  const prevX = MOBILE_BEND_X[(i - 1) % 2];
  const handle = MOBILE_BEND_GAP * 0.3634;
  return `${d} C${prevX} ${y - MOBILE_BEND_GAP + handle} ${x} ${y - handle} ${x} ${y}`;
}, "");

const MOBILE_STEPS = [
  {
    title: "Discovery",
    desc: "We dive deep into your brand, business, and objectives to create a clear and strategic roadmap that aligns with your goals.",
  },
  {
    title: "Strategy",
    desc: "We align brand strategy with your vision—backed by research, insight, and creative clarity.",
  },
  {
    title: "Creative Development",
    desc: "We explore design references, create moodboards, and define a shared visual direction.",
  },
  {
    title: "Design & Refine",
    desc: "We design, present concepts, and refine them through collaborative rounds of feedback.",
  },
  {
    title: "Optimisation & Handoff",
    desc: "We package up final assets, document everything, and ensure your team is set up to scale.",
  },
  {
    title: "Media Production",
    desc: "Production that captures and conveys brand narratives with precision, ensuring clarity and engagement across platforms.",
  },
  {
    title: "Support",
    desc: "Need more? We offer ongoing design support through flexible, collaborative retainer options.",
  },
];

const OurProcess = () => {
  const sectionRef = useRef(null);
  const svgContainerRef = useRef(null);
  const circleRef = useRef(null);
  const circleShadowRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const textsRef = useRef([]);

  // Mobile refs—outer wrap for exit tween; inner group for motionPath only (avoids transform fights)
  const mobileCircleWrapRef = useRef(null);
  const mobileCircleGroupRef = useRef(null);
  const mobileCircleRef = useRef(null);
  const mobilePathRef = useRef(null);
  const mobileStepsRef = useRef([]);

  useGSAP(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const mm = gsap.matchMedia();

    // xl (1280px) and up: wide desktop journey—unchanged behavior
    mm.add("(min-width: 1280px)", () => {
      const ctx = gsap.context(() => {
        const pathScroller = sectionRef.current;
        const panel = svgContainerRef.current;
        const circle = circleRef.current;
        const circleShadow = circleShadowRef.current;
        const path = pathRef.current;
        const newCircle = dotRef.current;
        const textElements = textsRef.current;
        const circleGroup = [circle, circleShadow];

        if (!path || !circle) return;

        const circleBounds = circle.getBoundingClientRect();
        newCircle.style.width = `${circleBounds.width}px`;
        newCircle.style.height = `${circleBounds.height}px`;

        gsap.set(textElements, { opacity: 0.1 });
        gsap.set(textElements[0], { opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pathScroller,
            scroller: "body",
            start: "top 0%",
            end: "top -350%",
            scrub: 1,
            pin: true,
          },
        });

        tl.to(
          circleGroup,
          {
            motionPath: {
              path: path,
              align: path,
              alignOrigin: [0.5, 0.5],
              start: 0,
              end: 1,
            },
            duration: 4,
            ease: "none",
            onUpdate: () => {
              const circleX =
                circle.getBoundingClientRect().left +
                circle.getBoundingClientRect().width / 2;

              textElements.forEach((text) => {
                if (!text) return;
                const textX =
                  text.getBoundingClientRect().left +
                  text.getBoundingClientRect().width / 2;
                const distanceX = Math.abs(circleX - textX);
                const opacity = Math.max(
                  0.1,
                  1 - distanceX / (window.innerWidth / 2.2)
                );
                gsap.to(text, { opacity, immediateRender: false });
              });
            },
          },
          "a"
        )
          .to(
            panel,
            {
              x: "-112.8vw",
              duration: 3,
            },
            "a"
          )
          .to(
            panel,
            {
              y: "-100vh",
              duration: 1.5,
              delay: 2.5,
            },
            "a"
          );

        // Hand the dot off to Our Approach's first dot (.apr-circle1) while #page4 scrolls in:
        // the fixed overlay dot travels from the path's end to the target, so it reads as one dot.
        const page4 = document.querySelector("#page4");
        const target = document.querySelector(".apr-circle1");
        if (page4 && target) {
          const centerOf = (el) => {
            const r = el.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width };
          };
          const ease = gsap.parseEase("power2.inOut");
          // Process dot (#f2f2ee) → Approach dot (--secondary) so the swap is invisible
          const tint = gsap.utils.interpolate("#f2f2ee", "#E8E8E1");

          const setHandoff = (p) => {
            gsap.set(circleGroup, { visibility: p > 0 ? "hidden" : "visible" });
            gsap.set(target, { visibility: p >= 1 ? "visible" : "hidden" });
            if (p <= 0 || p >= 1) {
              gsap.set(newCircle, { opacity: 0 });
              return;
            }
            const from = centerOf(circle);
            const to = centerOf(target);
            const e = ease(p);
            const size = from.size + (to.size - from.size) * e;
            gsap.set(newCircle, {
              opacity: 1,
              backgroundColor: tint(e),
              width: size,
              height: size,
              x: from.x + (to.x - from.x) * e - size / 2,
              y: from.y + (to.y - from.y) * e - size / 2,
            });
          };

          ScrollTrigger.create({
            trigger: page4,
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => setHandoff(self.progress),
            onRefresh: (self) => setHandoff(self.progress),
            onLeave: () => setHandoff(1),
            onLeaveBack: () => setHandoff(0),
          });
        }
      });

      return () => ctx.revert();
    });

    // < xl: phones + tablets (incl. iPad Pro)—vertical scroll path
    mm.add("(max-width: 1279px)", () => {
      const onLoadRefresh = () => ScrollTrigger.refresh();
      const ctx = gsap.context(() => {
        const circle = mobileCircleRef.current;
        const path = mobilePathRef.current;
        const steps = mobileStepsRef.current;
        const circleGroup = mobileCircleGroupRef.current;
        const circleWrap = mobileCircleWrapRef.current;

        if (!circle || !path || !circleGroup || !circleWrap || steps.length === 0)
          return;

        const isTablet =
          typeof window !== "undefined" &&
          window.matchMedia("(min-width: 768px) and (max-width: 1279px)").matches;
        const scrubMotion = isTablet ? 0.32 : 0.25;

        gsap.set(circleWrap, { y: 0, opacity: 1, force3D: true });
        gsap.set(circleGroup, {
          force3D: true,
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
            start: 0,
            end: 0,
          },
        });

        const motionPathCommon = {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        };

        let focusedStep = null;
        function updateTextGlow() {
          const circleRect = circle.getBoundingClientRect();
          const circleY = circleRect.top + circleRect.height / 2;
          let closestStep = null;
          let minDistance = Infinity;

          steps.forEach((step) => {
            if (!step) return;
            const rect = step.getBoundingClientRect();
            const distanceY = Math.abs(circleY - (rect.top + rect.height / 2));
            if (distanceY < minDistance) {
              minDistance = distanceY;
              closestStep = step;
            }
          });

          if (closestStep === focusedStep) return;
          focusedStep = closestStep;
          steps.forEach((step) => {
            if (!step) return;
            step.style.opacity = step === closestStep ? "1" : "0.2";
          });
        }

        gsap.to(circleGroup, {
          scrollTrigger: {
            trigger: "#svg-mobile",
            start: "top top",
            end: "bottom bottom",
            scrub: scrubMotion,
            invalidateOnRefresh: true,
            onUpdate: updateTextGlow,
          },
          motionPath: {
            ...motionPathCommon,
            end: 1,
          },
          ease: "none",
        });

        // Hand the dot off to Our Approach's first rail dot: the fixed overlay dot travels from
        // the path's end to it, landing as the rail starts filling (its "center 65%" start).
        const newCircle = dotRef.current;
        const target = document.querySelector(".approach-mobile .approach-dot");
        if (newCircle && target) {
          const centerOf = (el) => {
            const r = el.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width };
          };
          const ease = gsap.parseEase("power2.inOut");
          const tint = gsap.utils.interpolate("#ffffff", "#E8E8E1");

          const setHandoff = (p) => {
            gsap.set(circleWrap, { visibility: p > 0 ? "hidden" : "visible" });
            gsap.set(target, { visibility: p >= 1 ? "visible" : "hidden" });
            if (p <= 0 || p >= 1) {
              gsap.set(newCircle, { opacity: 0 });
              return;
            }
            const from = centerOf(circle);
            const to = centerOf(target);
            const e = ease(p);
            const size = from.size + (to.size - from.size) * e;
            gsap.set(newCircle, {
              opacity: 1,
              backgroundColor: tint(e),
              width: size,
              height: size,
              x: from.x + (to.x - from.x) * e - size / 2,
              y: from.y + (to.y - from.y) * e - size / 2,
            });
          };

          ScrollTrigger.create({
            trigger: "#svg-mobile",
            start: "bottom bottom",
            endTrigger: target,
            end: "center 65%",
            invalidateOnRefresh: true,
            onUpdate: (self) => setHandoff(self.progress),
            onRefresh: (self) => setHandoff(self.progress),
            onLeave: () => setHandoff(1),
            onLeaveBack: () => setHandoff(0),
          });
        }

        updateTextGlow();
        requestAnimationFrame(onLoadRefresh);
        window.addEventListener("load", onLoadRefresh);
      });

      return () => {
        window.removeEventListener("load", onLoadRefresh);
        ctx.revert();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* Dot overlay */}
      <div
        ref={dotRef}
        style={{
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          top: 0,
          left: 0,
          position: "fixed",
          backgroundColor: "#f2f2ee",
          zIndex: 999999,
          transition: "none",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* ─── DESKTOP SECTION (original, unchanged) ─── */}
      <section
        ref={sectionRef}
        style={{
          height: "100vh",
          paddingTop: "10vh",
          paddingBottom: 0,
          width: "100vw",
          overflow: "hidden",
          backgroundColor: "black",
          position: "relative",
          zIndex: 9,
        }}
        className="our-process-desktop"
      >
        <style>{`
          .our-process-desktop { display: none !important; }
          .our-process-mobile  { display: block !important; }
          @media (min-width: 1280px) {
            .our-process-desktop { display: block !important; }
            .our-process-mobile  { display: none !important; }
          }
          @media (min-width: 768px) and (max-width: 1279px) {
            .our-process-scroll-svg-wrap {
              max-width: min(92vw, 920px);
              margin-left: auto;
              margin-right: auto;
            }
            #svg-mobile .our-process-scroll-path {
              stroke-width: 12;
            }
            #svg-mobile .our-process-scroll-dot {
              r: 9;
            }
            #svg-mobile .our-process-scroll-glow {
              r: 120;
            }
          }
        `}</style>

        <div
          ref={svgContainerRef}
          style={{ width: "200vw", height: "200vh" }}
        >
          <svg
            version="1.1"
            className="journeyPath--desktop"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 3501.8 1885"
            style={{
              enableBackground: "new 0 0 3501.8 1885",
              overflow: "visible",
            }}
            xmlSpace="preserve"
          >
            <defs>
              <filter
                id="shadow"
                x="-5000%"
                y="-5000%"
                width="10000%"
                height="10000%"
              >
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="200"
                  floodColor="#f2f2ee"
                  floodOpacity="1"
                />
              </filter>
              <radialGradient
                id="whiteToTransparent"
                cx="50%"
                cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop
                  offset="20%"
                  style={{ stopColor: "#f2f2ee", stopOpacity: 0.5 }}
                />
                <stop
                  offset="70%"
                  style={{ stopColor: "#f2f2ee", stopOpacity: 0 }}
                />
              </radialGradient>
            </defs>

            <style>{`
              .jp1 {
                fill: none;
                stroke: #121212cc;
                stroke-width: 26;
                stroke-miterlimit: 10;
                stroke-linecap: round;
              }
              .jp3 { fill: #f2f2ee; }
              .jp4 {
                fill: var(--color-heading);
              }
              .jp6 {
                fill: var(--color-desc);
              }
            `}</style>

            <g>
              <path
                ref={pathRef}
                className="theLine jp1"
                d="M268,452C379.3,443.2,445,436.8,511,430.4c65.6-6.4,134.6,10.4,192.6,39.4c20.9,10.4,40.8,22.5,59.6,36
                c49.9,35.9,82,75.4,125.4,112.4c42.3,36.4,96.1,67.9,150.4,85.5c170.7,59,270.4-69.1,352.7-227.9c30.2-56.4,53.3-114.8,91.2-164.9
                c97.3-130.1,301.5-137.1,435.1-25.7c46.4,37.9,85.6,87.5,130.9,126.8c144.5,132,317.3,42.2,445.7-65.5
                c39.8-33.2,73.1-68.9,109.6-104.6c129.4-132.2,293.2-187,461.6-155.6c86.3,15.4,161.9,57,227.4,114
                c274.5,235.8,302.7,652.8,72.1,909.9c-308.6,312.8-549.9,161.2-901.2,266.8c-193,58-161.2,47.4-368.1,136.8"
              />
            </g>

            {/* Moving circle */}
            <circle
              ref={circleRef}
              className="theCircle jp3"
              cx="673.1"
              cy="530.9"
              r="14"
              filter="url(#shadow)"
              transform="matrix(1,0,0,1,-602.49999,105.09976)"
            />

            {/* Glow shadow */}
            <circle
              ref={circleShadowRef}
              style={{ opacity: 0.2 }}
              className="theCircleShadow"
              cx="693.1"
              cy="530.9"
              r="220"
              fill="url(#whiteToTransparent)"
              transform="matrix(1,0,0,1,-622.50006,105.09968)"
            />

            {/* Text labels */}
            {[
              {
                transform: "matrix(1 0 0 1 230.7241 182.4585)",
                title: "Discovery",
                lines: [
                  "We dig deep into your brand, business, and goals",
                  "to craft a thoughtful project roadmap.",
                ],
                x: 22,
              },
              {
                transform: "matrix(1 0 0 1 744.5525 327.1489)",
                title: "Strategy",
                lines: [
                  "We align brand strategy with your vision—backed",
                  "by research, insight, and creative clarity.",
                ],
                x: 100,
              },
              {
                transform: "matrix(1 0 0 1 1413.1023 443.2568)",
                title: "Creative Development",
                lines: [
                  "We explore design references, create moodboards,",
                  "and define a shared visual direction.",
                ],
                x: 120,
              },
              {
                transform: "matrix(1 0 0 1 1917.6821 113.2364)",
                title: "Design & Refine",
                lines: [
                  "We design, present concepts, and refine them",
                  "through collaborative rounds of feedback.",
                ],
                x: 120,
              },
              {
                transform: "matrix(1 0 0 1 2690.7517 208.5494)",
                title: "Optimisation & Handoff",
                lines: [
                  "We package up final assets, document everything,",
                  "and ensure your team is set up to scale.",
                ],
                x: 120,
              },
              {
                transform: "matrix(1 0 0 1 2849.9114 703.7327)",
                title: "Media Production",
                lines: [
                  "Production that captures and conveys",
                  "brand narratives with precision, ensuring",
                  "clarity and engagement across platforms.",
                ],
                x: 0,
              },
              {
                transform: "matrix(1 0 0 1 2296.9211 1015.5708)",
                title: "Support",
                lines: [
                  "Need more? We offer ongoing design support",
                  "through flexible, collaborative retainer options.",
                ],
                x: 0,
              },
            ].map((item, i) => (
              <text
                key={i}
                ref={(el) => (textsRef.current[i] = el)}
                transform={item.transform}
                style={{ opacity: 0.1 }}
              >
                <tspan x={item.x} y="22.1" className="jp2 jp4 heading-lg text-heading">
                  {item.title}
                </tspan>
                {item.lines.map((line, j) => (
                  <tspan
                    key={j}
                    x={item.x}
                    // Following lines step by the .para line-height (1.6), in em so it tracks the font size
                    {...(j === 0 ? { y: 58.1 } : { dy: "1.6em" })}
                    className="jp2 jp5 jp6 text-desc! para"
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            ))}
          </svg>
        </div>
      </section>

      {/* ─── MOBILE SECTION ─── */}
      <div
        className="our-process-mobile"
        style={{ width: "100%", height: "auto", backgroundColor: "black" }}
      >
        {/* Path + dot are SVG; step text is HTML on top so it uses the site type scale.
            Each step sits at a bend of the path (MOBILE_PATH_Y), on the opposite side. */}
        <div id="svg-mobile" className="our-process-scroll-svg-wrap relative">
          <svg
            width={MOBILE_VIEW_W}
            height={MOBILE_VIEW_H}
            viewBox={`0 0 ${MOBILE_VIEW_W} ${MOBILE_VIEW_H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <defs>
              <radialGradient
                id="shadowFill"
                cx="50%"
                cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop offset="20%" stopColor="#f2f2ee" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#f2f2ee" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Snake path—even S-curves, vertical tangent at every bend */}
            <path
              ref={mobilePathRef}
              className="theLine our-process-scroll-path"
              d={MOBILE_PATH_D}
              stroke="#292929"
              strokeWidth="16"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />

            {/* Circle: outer wrap = exit motion; inner = motionPath (separate transforms = smooth scroll sync) */}
            <g id="circleWrap" ref={mobileCircleWrapRef} style={{ willChange: "transform" }}>
              <g id="circleGroup" ref={mobileCircleGroupRef} style={{ willChange: "transform" }}>
                <circle
                  ref={mobileCircleRef}
                  className="theCircle our-process-scroll-dot"
                  r="11"
                  fill="white"
                />
                <circle
                  className="theCircleShadow our-process-scroll-glow"
                  r="150"
                  opacity="0.05"
                  fill="url(#shadowFill)"
                />
              </g>
            </g>
          </svg>

          {MOBILE_STEPS.map((step, i) => {
            // Bends alternate left/right starting on the left, so text alternates right/left
            const onRight = i % 2 === 0;
            return (
              <div
                key={step.title}
                ref={(el) => (mobileStepsRef.current[i] = el)}
                className={`step absolute w-[52%] max-w-[24rem] -translate-y-1/2 transition-opacity duration-500 ease-out ${
                  onRight ? "right-[5%] text-right" : "left-[5%] text-left"
                }`}
                style={{ top: `${(MOBILE_PATH_Y[i] / MOBILE_VIEW_H) * 100}%`, opacity: 0.2 }}
              >
                <h3 className="heading-md text-heading">{step.title}</h3>
                <p className="para text-desc mt-2 md:mt-3">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OurProcess;
