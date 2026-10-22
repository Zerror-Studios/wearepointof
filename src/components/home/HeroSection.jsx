"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const headerData = [
  "creativity?",
  "design?",
  "storytelling?",
  "brand loyalty?",
  "craft?",
  "human-centred design?",
  "imagination?",
  "minimalism?",
  "design ethics?",
  "beauty?",
  "brand trust?",
  "emotional design?",
  "creative disruption?",
  "design for impact?",
  "doing it differently?",
];

const HeroSection = () => {
  const [landingPhase, setLandingPhase] = useState(0); // 0 = black/logo, 1 = move logo, 2 = reveal nav + hero
  const [startTyping, setStartTyping] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [centerLogoScale, setCenterLogoScale] = useState(2.0);
  const [centerLogoTopPx, setCenterLogoTopPx] = useState(32);
  const timersRef = useRef([]);

  const glowPalette = [
    "#FFD6A5", // warm peach
    "#BDE0FE", // cool sky
    "#FFE5B4", // warm champagne
    "#CDE7FF", // cool ice
    "#FFD1DC", // warm blush
    "#B8FFF1", // cool mint
    "#FFE9C8", // warm soft gold
    "#C8D7FF", // cool periwinkle
  ];

  const glowColor = glowPalette[textIndex % glowPalette.length];

 // Replace your useEffect with this:

useEffect(() => {
  document.body.dataset.heroLanding = "active";

  // Capture before modifying
  const prevHtmlOverflow = document.documentElement.style.overflow;
  const prevBodyOverflow = document.body.style.overflow;
  const prevScrollBehavior = document.documentElement.style.scrollBehavior;

  // Lock scroll
  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.scrollBehavior = "auto";
  };

  // Unlock scroll
  const unlockScroll = () => {
    document.documentElement.style.overflow = prevHtmlOverflow;
    document.body.style.overflow = prevBodyOverflow;
    document.documentElement.style.scrollBehavior = prevScrollBehavior;
  };

  // Prevent touch scroll on mobile
  const preventTouch = (e) => e.preventDefault();
  window.addEventListener("touchmove", preventTouch, { passive: false });

  lockScroll();

  const isMobile = window.innerWidth < 1280;
  setCenterLogoScale(isMobile ? 1.7 : 1.95);
  setCenterLogoTopPx(isMobile ? 24 : 32);

  const preloadImage = (src) =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.src = src;
      const done = () => resolve(true);
      img.onload = async () => {
        try { if (img.decode) await img.decode(); } catch {}
        done();
      };
      img.onerror = done;
      if (img.complete) done();
    });

  const fontsReady = document.fonts?.ready ?? Promise.resolve();

  const assetsReady = Promise.all([
    fontsReady,
    preloadImage("/home/graphic-home.webp"),
    preloadImage("/logo/logo.png"),
    preloadImage("/logo/p.png"),
    preloadImage("/logo/oint.png"),
    preloadImage("/logo/o.png"),
    preloadImage("/logo/f.png"),
  ]);

  const timeoutReady = new Promise((resolve) => window.setTimeout(resolve, 2500));

  let isUnmounted = false;

  const startTimersAfterReady = async () => {
    await Promise.race([assetsReady, timeoutReady]);

    if (isUnmounted) return;

    timersRef.current = [];

    timersRef.current.push(
      window.setTimeout(() => {
        if (!isUnmounted) setLandingPhase(1);
      }, 1000)
    );

    timersRef.current.push(
      window.setTimeout(() => {
        if (!isUnmounted) {
          document.body.dataset.heroLanding = "done";
          window.dispatchEvent(new Event("hero-landing:done"));
          setLandingPhase(2);
        }
      }, 1800)
    );

    timersRef.current.push(
      window.setTimeout(() => {
        if (!isUnmounted) {
          setStartTyping(true);
          // ✅ Unlock ONLY here, after animation fully completes
          unlockScroll();
          window.removeEventListener("touchmove", preventTouch);
        }
      }, 2100)
    );
  };

  startTimersAfterReady();

  return () => {
    isUnmounted = true;
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    delete document.body.dataset.heroLanding;

    // Always clean up on unmount, regardless of phase
    unlockScroll();
    window.removeEventListener("touchmove", preventTouch);
  };
}, []);

  useEffect(() => {
    if (!startTyping) return;
    const currentText = headerData[textIndex];

    let timeout;

    if (!isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }, 80);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length - 1));
      }, 40);
    }

    if (!isDeleting && displayText === currentText) {
      const isLast = textIndex === headerData.length - 1;
      timeout = setTimeout(() => setIsDeleting(true), isLast ? 4000 : 2500);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % headerData.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, startTyping]);

  return (
    <section className="relative bg-black w-full h-screen overflow-hidden">
      {/* Landing overlay: black screen + navbar logo centered */}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-100 bg-black"
        style={{ pointerEvents: landingPhase >= 2 ? "none" : "auto" }}
        initial={{ opacity: 1 }}
        animate={landingPhase >= 2 ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <motion.div
          style={{ position: "absolute", left: "50%" }}
          initial={{
            top: "50%",
            x: "-50%",
            y: "-50%",
            scale: centerLogoScale,
            opacity: 1,
          }}
          animate={
            landingPhase >= 1
              ? {
                  top: `${centerLogoTopPx}px`,
                  x: "-50%",
                  y: "0%",
                  scale: 1,
                  opacity: 1,
                }
              : {
                  top: "50%",
                  x: "-50%",
                  y: "-50%",
                  scale: centerLogoScale,
                  opacity: 1,
                }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile / tablet / iPad Pro: match navbar single logo */}
          <div className="xl:hidden">
            <Image
              src="/logo/logo.png"
              alt="Point Of"
              width={140}
              height={40}
              priority
              className="h-3 w-auto object-contain invert"
            />
          </div>

          {/* Desktop: match navbar's P + OINT + O + F assets */}
          <div className="hidden xl:flex items-center gap-0">
            <Image
              src="/logo/p.png"
              alt="P"
              width={180}
              height={100}
              priority
              className="h-[18px] w-auto invert object-contain"
            />
            <Image
              src="/logo/oint.png"
              alt="OINT"
              width={180}
              height={100}
              priority
              className="h-[18px] w-auto invert object-contain"
            />
            <Image
              src="/logo/o.png"
              alt="O"
              width={180}
              height={100}
              priority
              className="h-[18px] w-auto invert object-contain"
            />
            <Image
              src="/logo/f.png"
              alt="F"
              width={180}
              height={100}
              priority
              className="h-[18px] w-auto invert object-contain"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ROTATING IMAGE */}
      <motion.div
        className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 30 }}
        animate={startTyping ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <Image
          src="/home/graphic-home.webp"
          alt="hero"
          width={1000}
          height={1000}
          className="w-full object-contain spin-slow h-[140vh] sm:h-[180vh] xl:h-[220vh]"
          priority
        />
      </motion.div>

      {/* GRADIENT */}
      <div className="absolute bottom-0 left-0 w-full h-[12vh] bg-linear-to-t from-background via-background/60 to-transparent pointer-events-none" />
      {/* CONTENT */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20"
        initial={{ opacity: 0, y: 24 }}
        animate={startTyping ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.75, ease: "easeOut", delay: 0.05 }}
      >
        {/* First line */}
        <h1 className="font-thin tracking-[0.5px] leading-[1.2] font-heading mb-2 text-xl sm:text-2xl md:text-3xl lg:text-[2rem] xl:text-[2.2rem]">
          What is the Point Of
        </h1>

        {/* Typing line */}
        <p className="w-full max-w-5xl text-center font-medium leading-[1.15] tracking-[1px] uppercase font-heading text-xl sm:text-4xl md:text-[2.5rem] lg:text-[2.7rem] xl:text-[3rem]">
          <span
            className="text-white transition-[text-shadow] duration-700"
            style={{
              textShadow: `
                0 0 12px ${glowColor}55,
                0 0 28px ${glowColor}40,
                0 0 64px ${glowColor}2e
              `,
            }}
          >
            {displayText || "\u00A0"}
          </span>
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
