"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "../common/Button";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GradientBlinds from "../GradientBlinds";

gsap.registerPlugin(ScrollTrigger);

/* ─── tiny sub-component so clock state is isolated ─── */
const Clock = ({ clockCountry, clockTimeZone }) => {
  const [country, setCountry] = useState(clockCountry || "India");
  const [timeZone, setTimeZone] = useState(clockTimeZone || "Asia/Kolkata");
  const [now, setNow] = useState(Date.now);

  useEffect(() => { setCountry(clockCountry || "India"); }, [clockCountry]);
  useEffect(() => { setTimeZone(clockTimeZone || "Asia/Kolkata"); }, [clockTimeZone]);

  useEffect(() => {
    if (clockCountry || clockTimeZone) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const { country_name, timezone } = await res.json();
        if (!cancelled) {
          if (country_name) setCountry(country_name);
          if (timezone)     setTimeZone(timezone);
        }
      } catch { /* keep fallback */ }
    })();
    return () => { cancelled = true; };
  }, [clockCountry, clockTimeZone]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeText = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(now));
    } catch {
      return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(now));
    }
  }, [now, timeZone]);

  return (
    <div
      id="clock-container"
      className="absolute -top-16 md:-top-80 xl:-top-60 left-6 md:left-12 xl:left-98 h-32 w-32 sm:h-48 sm:w-48 rounded-full"
    >
      <Image
        src="/contact/clock.png"
        alt="clock"
        width={1000}
        height={1000}
        priority
        className="w-full h-full object-cover spin-slow"
      />
      <div className="w-full h-full rounded-full absolute top-0 left-0 flex flex-col items-center justify-center">
        <span className="uppercase leading-none font-body font-regular text-xs tracking-[1px] text-heading">
          {country}
        </span>
        <span className="uppercase font-body font-regular text-xs tracking-[1px] text-heading">
          {timeText}
        </span>
      </div>
    </div>
  );
};

/* ─── main component ─── */
const HeroSection = ({
  bgImage = "",
  title = "",
  btntitle = "",
  onClick = () => {},
  href = "",
  imgClass = "",
  clockCountry = "",
  clockTimeZone = "",
  showClock = false,
  enableBgParallax = false,
  enableTextParallax = false,
  useGradientBlinds = false,
  /* Pass an array of line configs to enable staggered reveal:
     lines = [
       { prefix: "Point of ", word: "origin.", italic: false },
       { prefix: "Point of ", word: "difference.", italic: false },
       { prefix: "Point of ", word: "no return.", italic: true, extraDelay: 0.2 },
       { body: "We are Point Of—…", italic: false },   // plain body line
     ]
  */
  lines = null,
}) => {
  const rootRef      = useRef(null);
  const bgWrapRef    = useRef(null);
  const bgRef        = useRef(null);
  const contentRef   = useRef(null);
  const headlineRef  = useRef(null);
  const ctaRef       = useRef(null);
  const lineRefs     = useRef([]);

  useEffect(() => {
    if (!rootRef.current) return;

    const root    = rootRef.current;
    const bgWrap  = bgWrapRef.current;
    const bg      = bgRef.current;
    const cleanupFns = [];

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (reduceMotion) {
        const all = [bgWrap, headlineRef.current, ctaRef.current, ...lineRefs.current].filter(Boolean);
        gsap.set(all, { autoAlpha: 1, clearProps: "transform" });
      } else {
        // 1. Background fade + scale-in
        if (bgWrap) {
          introTl.fromTo(
            bgWrap,
            { autoAlpha: 0, scale: 1.06 },
            { autoAlpha: 1, scale: 1, duration: 1.2 }
          );
        }

        // 2a. Staggered lines (when `lines` prop is used)
        if (lines && lineRefs.current.length) {
          const lineEls = lineRefs.current.filter(Boolean);
          lineEls.forEach((el, i) => {
            const cfg = lines[i];
            const delay = cfg?.extraDelay ?? 0;
            introTl.fromTo(
              el,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
                delay,
                ease: "power3.out",
              },
              // each line starts 0.3s after the previous, offset from bg end
              bgWrap ? `-=0.5` : i === 0 ? 0 : "-=0.45"
            );
          });

          // CTA after all lines
          introTl.fromTo(
            ctaRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.6 },
            "-=0.3"
          );
        } else {
          // 2b. Original single-block headline + CTA
          const introItems = [
            root.querySelector("#clock-container"),
            headlineRef.current,
            ctaRef.current,
          ].filter(Boolean);

          introTl.fromTo(
            introItems,
            { autoAlpha: 0, y: 36 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
            },
            bgWrap ? "-=0.65" : 0
          );
        }
      }

      // Content parallax on scroll (optional)
      if (enableTextParallax && contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 1,
          y: -200,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "top -100%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }

      // Subtle background parallax on mouse move
      if (enableBgParallax && bg) {
        const handleMouseMove = (e) => {
          const pageRect = root.getBoundingClientRect();
          const x = (e.clientX - pageRect.left) / pageRect.width;
          const y = (e.clientY - pageRect.top) / pageRect.height;
          const moveAmount = 20;

          gsap.to(bg, {
            x: -(x * moveAmount),
            y: -(y * moveAmount),
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        root.addEventListener("mousemove", handleMouseMove);
        cleanupFns.push(() => root.removeEventListener("mousemove", handleMouseMove));
      }
    }, rootRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, [bgImage, enableBgParallax, enableTextParallax, lines]);

  return (
    <div
      ref={rootRef}
      className="relative h-svh w-full overflow-hidden"
    >
      {/* Full-bleed hero background */}
      {useGradientBlinds ? (
        <div
          ref={bgWrapRef}
          className="pointer-events-auto absolute inset-0 z-0 h-full w-full bg-black"
        >
          <GradientBlinds
            className="h-full w-full min-h-full min-w-full"
            gradientColors={["#A5AB8A"]}
            angle={0}
            noise={0.025}
            blindCount={44}
            blindMinWidth={8}
            spotlightRadius={0.3}
            spotlightSoftness={0.7}
            spotlightOpacity={1}
            mouseDampening={0.22}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="normal"
            cornerGlow
            mouseDarken
          />
        </div>
      ) : bgImage ? (
        <div
          ref={bgWrapRef}
          className="absolute inset-0 z-0 flex h-full w-full items-center justify-center"
        >
          <Image
            ref={bgRef}
            width={1000}
            height={1000}
            src={bgImage}
            alt={typeof title === "string" && title.trim() ? title : "Point Of background image"}
            className={`max-w-none shrink-0 w-full h-full object-cover object-center ${imgClass}`}
            priority
          />
        </div>
      ) : null}

      {/* Content — pass mouse through so GradientBlinds stays interactive */}
      <div className="pointer-events-none relative z-10 h-full flex items-center xl:items-end">
        <div
          ref={contentRef}
          className="w-full relative px-6 sm:px-10 md:px-12 xl:pl-80 2xl:pl-120 xl:pr-6 pt-36 sm:pt-40 md:pt-0 md:pb-0 xl:pb-28 2xl:pb-40"
        >
          {showClock && (
            <div className="pointer-events-auto">
              <Clock clockCountry={clockCountry} clockTimeZone={clockTimeZone} />
            </div>
          )}

          {/* ── Staggered lines mode ── */}
          {lines ? (
            <h2 className="heading-xl text-subheading max-sm:text-[min(24px,calc((100vw-48px)/12.6))] sm:max-w-[80%] md:max-w-[700px] xl:max-w-[900px]">
              {/* Phones: font sized so each line (longest ≈ 12.23em in Lausanne 200) fits on one line */}
              {lines.map((line, i) => (
                <span
                  key={i}
                  ref={(el) => { lineRefs.current[i] = el; }}
                  className="block"
                  style={{ opacity: 0 }} // GSAP takes over immediately
                >
                  {line.body ? (
                    // Plain prose line (e.g. the tagline sentence)
                    <span className={line.italic ? "italic" : ""}>{line.body}</span>
                  ) : (
                    // "Point of ___" line
                    <>
                      <span className="font-thin">{line.prefix}</span>
                      <span className={line.italic ? "italic" : ""}>{line.word}</span>
                    </>
                  )}
                </span>
              ))}
            </h2>
          ) : (
            /* ── Original freeform title mode ── */
            <h2
              ref={headlineRef}
              className="heading-xl text-subheading max-w-[90%] sm:max-w-[80%] md:max-w-[700px] xl:max-w-[900px] [&_br]:hidden sm:[&_br]:block"
            >
              {title}
            </h2>
          )}

          <div ref={ctaRef} data-hero-cta className="pointer-events-auto" style={lines ? { opacity: 0 } : {}}>
            <Button title={btntitle} onClick={onClick} href={href} />
          </div>
        </div>
      </div>

      {/* Bottom fade — same as navbar gradient (flipped) */}
      <div
        className="nav-gradient nav-gradient-reverse pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-24 sm:h-28 md:h-32"
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroSection;
