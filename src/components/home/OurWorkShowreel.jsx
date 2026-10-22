"use client";

import {
  useRef,
  useLayoutEffect,
  useState,
  useMemo,
} from "react";
import Link from "next/link";
import Image from "next/image";
import WorkCard from "../work/WorkCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  RiPauseMiniFill,
  RiPlayMiniFill,
} from "@remixicon/react";

gsap.registerPlugin(ScrollTrigger);

export default function OurWorkShowreel({ posts = [] }) {
  // ── OurWork refs ──────────────────────────────────────────────────────────
  const sectionRef        = useRef(null);   // outer wrapper (both sections)
  const ourWorkRef        = useRef(null);   // sticky our-work scene
  const trackRef          = useRef(null);
  const buttonCircleRef   = useRef(null);
  const buttonArrowRef    = useRef(null);
  const buttonTextRef     = useRef(null);
  const buttonUnderlineRef= useRef(null);

  const [maxTranslate, setMaxTranslate] = useState(0);
  const naturalOffsetRef  = useRef(0);

  // ── Showreel refs ─────────────────────────────────────────────────────────
  const showreelPanelRef  = useRef(null);   // clip-path reveal panel
  const videoWrapRef      = useRef(null);
  const videoElRef        = useRef(null);
  const overlayRef        = useRef(null);
  const centerDotRef      = useRef(null);   // shared growing dot

  const [isMuted,  setIsMuted]  = useState(true);
  const [playing,  setPlaying]  = useState(true);

  // ── Volume icon ───────────────────────────────────────────────────────────
  const VolumeIcon = useMemo(() => {
    const common = {
      className: "w-4 h-4 sm:w-[17px] sm:h-[17px]",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
    };
    if (isMuted) {
      return (
        <svg {...common} aria-hidden="true">
          <path d="M11 5L6 9H3V15H6L11 19V5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M16 9L21 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M21 9L16 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg {...common} aria-hidden="true">
        <path d="M11 5L6 9H3V15H6L11 19V5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M15.5 8.5C17.1569 9.48528 18.25 10.9132 18.25 12C18.25 13.0868 17.1569 14.5147 15.5 15.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }, [isMuted]);

  // ── Measure button circle position for horizontal scroll ──────────────────
  useLayoutEffect(() => {
    const calculate = () => {
      if (!trackRef.current || !buttonCircleRef.current) return;
      const trackRect  = trackRef.current.getBoundingClientRect();
      const circleRect = buttonCircleRef.current.getBoundingClientRect();
      const circleCenterInTrack = circleRect.left - trackRect.left + circleRect.width / 2;
      const viewportCenter = window.innerWidth / 2;
      setMaxTranslate(circleCenterInTrack - viewportCenter);
      naturalOffsetRef.current = (circleRect.left + circleRect.width / 2) - viewportCenter;
    };
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  // ── Master timeline: OurWork → clip-path reveal → Showreel ───────────────
  useLayoutEffect(() => {
    if (
      !sectionRef.current ||
      !trackRef.current ||
      !buttonCircleRef.current ||
      !buttonTextRef.current ||
      !buttonUnderlineRef.current ||
      !showreelPanelRef.current ||
      !videoWrapRef.current ||
      !overlayRef.current
    ) return;

    const track       = trackRef.current;
    const circle      = buttonCircleRef.current;
    const arrow       = buttonArrowRef.current;
    const textEl      = buttonTextRef.current;
    const underlineEl = buttonUnderlineRef.current;
    const showreel    = showreelPanelRef.current;
    const videoWrap   = videoWrapRef.current;
    const overlay     = overlayRef.current;
    const centerDot   = centerDotRef.current;
    const cards       = gsap.utils.toArray(track.querySelectorAll(".work-card"));

    // ── Timings ──
    const DUR_SCROLL_TO_CENTER = 1.5;
    const DUR_GROW             = 0.4;
    const DUR_HOLD_40          = 0.25;
    const DUR_TEXT_HIDE        = 0.35;
    const DUR_DOT_SCALE        = 3;    // how long the dot scales before clip-path kicks in
    const DUR_CLIP_REVEAL      = 1.2;  // clip-path wipe from bottom to full
    const DUR_SHOWREEL_TILT1   = 1.5;
    const DUR_SHOWREEL_TILT2   = 1.5;
    const DUR_OVERLAY_SCROLL   = 4;
    const DUR_SHOWREEL_TILT3   = 1.5;
    const DUR_SHOWREEL_CENTER  = 1.5;
    const DOT_SCALE_SIZE       = 50;

    const useMobileShowreel = window.innerWidth < 1280;

    const ctx = gsap.context(() => {
      // ── Initial states ──
      gsap.set(track,        { x: 0 });
      gsap.set(circle,       { width: 8, height: 8 });
      if (arrow) gsap.set(arrow, { opacity: 0, scale: 0.4 });
      gsap.set(textEl,       { opacity: 1 });
      gsap.set(underlineEl,  { width: "100%", opacity: 1 });
      gsap.set(centerDot,    { opacity: 0, width: 8, height: 8 });

      // Showreel panel: hidden below (clip-path reveals upward)
      gsap.set(showreel, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });

      // Showreel video wrap initial
      if (useMobileShowreel) {
        gsap.set(videoWrap, {
          transform: "translate(-50%,-50%) scale(4.5) rotateY(0deg) rotateX(0deg)",
        });
      }

      // Overlay starts below viewport
      gsap.set(overlay, { top: "100%" });

      // ── Navbar gradient: hide just before the dot scales, bring back once
      //    this section has scrolled away and partnerships reaches the top ──
      let tl;
      let sectionEnd;
      let gradientHidden = false;
      const syncNavGradient = () => {
        if (!tl || !sectionEnd || tl.labels.hide === undefined) return;
        const hidden = tl.time() >= tl.labels.hide && sectionEnd.progress < 1;
        if (hidden === gradientHidden) return;
        gradientHidden = hidden;
        window.dispatchEvent(
          new CustomEvent("nav-gradient:suppress", { detail: { suppressed: hidden } })
        );
      };

      sectionEnd = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: syncNavGradient,
        onLeave: syncNavGradient,
        onEnterBack: syncNavGradient,
      });

      // ── Master timeline (scrub against whole wrapper section) ──
      tl = gsap.timeline({
        onUpdate: syncNavGradient,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1) Horizontal slide until button circle reaches viewport center
      tl.to(track, {
        x: () => -maxTranslate,
        duration: DUR_SCROLL_TO_CENTER,
        ease: "none",
      }, 0);

      // 2) Circle + center dot grow to 40 px
      tl.to(circle, {
        width: 40, height: 40,
        duration: DUR_GROW,
        ease: "power2.out",
      }, ">=0");

      tl.to(centerDot, {
        opacity: 1,
        width: 40, height: 40,
        duration: DUR_GROW,
        ease: "power2.out",
      }, "<");

      if (arrow) {
        tl.to(arrow, {
          opacity: 1, scale: 1,
          duration: 0.25,
          ease: "power2.out",
        }, "<+0.12");
      }

      // Hold at 40 px
      tl.to(centerDot, { width: 40, height: 40, duration: DUR_HOLD_40, ease: "none" });

      // 3) Text + underline + circle fade
      tl.to(textEl,      { opacity: 0,   duration: DUR_TEXT_HIDE, ease: "power2.out" }, "hide");
      tl.to(underlineEl, { width: "0%", opacity: 0, duration: DUR_TEXT_HIDE, ease: "power2.out" }, "hide");
      tl.to(circle,      { opacity: 0,   duration: 0.25, ease: "power2.out" }, "hide+=0.05");

      // Cards move out
      if (cards.length) {
        tl.to(cards, {
          y: -100, opacity: 0,
          duration: DUR_DOT_SCALE - 1,
          ease: "power2.out",
          stagger: 0.03,
        }, "hide+=0.25");
      }

      // 4) Center dot scales up (stays centered)
      tl.to(centerDot, {
        scale: DOT_SCALE_SIZE,
        duration: DUR_DOT_SCALE,
        ease: "power2.inOut",
      }, "hide+=0.25");

      // 5) Clip-path reveal of Showreel panel wipes up from bottom
      //    Starts once the dot has grown large enough to obscure everything
      tl.to(showreel, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: DUR_CLIP_REVEAL,
        ease: "power3.inOut",
      }, `>-${DUR_CLIP_REVEAL * 0.4}`);


      // ── Showreel animations (mirror original component's timeline) ──
      if (useMobileShowreel) {
        tl.to(videoWrap, {
          transform: "translate(-50%,-50%) scale(0.9) rotateY(0deg) rotateX(0deg)",
          duration: 2,
          ease: "power3.out",
        });
        tl.to(overlay, { top: "-300%", duration: DUR_OVERLAY_SCROLL });
        tl.to(videoWrap, {
          transform: "translate(-50%,-50%) scale(4.5) rotateY(-20deg) rotateX(-2deg)",
          duration: DUR_SHOWREEL_TILT3,
        });
        tl.to(videoWrap, {
          transform: "translate(-50%,-50%) scale(4.5)",
          duration: DUR_SHOWREEL_CENTER,
        });
      } else {
        tl.to(videoWrap, {
          transform: "translate(-50%,-50%) scale(.6) rotateY(-20deg) rotateX(-2deg)",
          duration: DUR_SHOWREEL_TILT1,
        });
        tl.to(videoWrap, {
          transform: "translate(-50%,-50%) scale(.5) rotateY(20deg) rotateX(2deg)",
          duration: DUR_SHOWREEL_TILT2,
        });
        tl.to(overlay, { top: "-300%", duration: DUR_OVERLAY_SCROLL });
        tl.to(videoWrap, {
          transform: "translate(-50%,-50%) scale(.6) rotateY(-20deg) rotateX(-2deg)",
          duration: DUR_SHOWREEL_TILT3,
        });
        tl.to(videoWrap, {
          transform: "translate(-50%,-50%)",
          duration: DUR_SHOWREEL_CENTER,
        });
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        sectionEnd.kill();
        if (gradientHidden) {
          window.dispatchEvent(
            new CustomEvent("nav-gradient:suppress", { detail: { suppressed: false } })
          );
        }
      };
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [maxTranslate]);

  // ── Showreel controls ─────────────────────────────────────────────────────
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (videoElRef.current) videoElRef.current.muted = next;
  };

  const togglePlay = () => {
    if (!videoElRef.current) return;
    if (videoElRef.current.paused) {
      videoElRef.current.play();
      setPlaying(true);
    } else {
      videoElRef.current.pause();
      setPlaying(false);
    }
  };

  // ── Total scroll height = OurWork (300vh) + Showreel equivalent (~350vh) ──
  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "650vh" }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          OUR WORK—sticky scene
      ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={ourWorkRef}
        className="sticky top-0 z-10 h-screen flex items-center overflow-hidden"
      >
        {/* Center growing dot (positioned absolutely at viewport center) */}
        <div
          ref={centerDotRef}
          id="centerDot"
          className="pointer-events-none absolute z-0 rounded-full bg-secondary"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            opacity: 0,
          }}
        />

        {/* TRACK */}
        <div
          ref={trackRef}
          className="flex items-center z-50 relative gap-22 px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20"
        >
          {/* CARDS */}
          {(posts ?? []).map((post, index) => (
            <div
              key={post.slug ?? index}
              className="work-card shrink-0 w-[85vw] max-w-[380px] sm:w-[320px] sm:max-w-none xl:w-[400px] md:pointer-coarse:w-[min(460px,62vh)]! xl:pointer-coarse:w-[min(480px,55vh)]!"
            >
              <WorkCard
                slug={post.slug}
                title={post.title}
                image={post.coverImage}
                video={post.microanimation}
                videoOnTouch
                className="lg:pointer-coarse:w-full!"
              />
            </div>
          ))}

          {/* VIEW ALL WORK BUTTON */}
          <div className="min-w-[220px] sm:min-w-[300px] xl:min-w-[400px] flex items-center justify-center ml-10 sm:ml-24 xl:ml-40">
            <Link
              href="/work"
              className="group cursor-pointer flex items-center gap-3 text-sm font-semibold uppercase tracking-wide"
              title="View all work"
            >
              {/* Circle */}
              <span
                ref={buttonCircleRef}
                className="relative flex items-center justify-center rounded-full"
              >
                <svg
                  ref={buttonArrowRef}
                  style={{ opacity: 0, transform: "scale(0.4)" }}
                  className="w-4 h-4 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>

              {/* Text */}
              <span
                ref={buttonTextRef}
                className="relative whitespace-nowrap text-[11px] md:text-sm"
              >
                VIEW ALL WORK
                <span
                  ref={buttonUnderlineRef}
                  className="absolute right-0 -bottom-1 h-px bg-white transition-all duration-300"
                  style={{ width: "100%" }}
                />
              </span>
            </Link>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            SHOWREEL—clip-path panel layered on top of OurWork scene,
            revealed via clip-path wipe from bottom to top
        ═════════════════════════════════════════════════════════════ */}
        <div
          ref={showreelPanelRef}
          className="absolute inset-0 z-99 bg-foreground overflow-hidden"
          style={{
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            perspective: "4000px",
          }}
        >
          {/* Fixed controls */}
          <div className="absolute right-4 bottom-4 z-999 sm:right-6 sm:bottom-6 md:right-8 md:bottom-8">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="group flex h-11 items-center gap-2 rounded-full border border-white/15 bg-black/70 px-2.5 pr-3.5 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-black/60 sm:h-12 sm:gap-2.5 sm:px-3 sm:pr-4"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-105 sm:h-8 sm:w-8">
                  {playing ? (
                    <RiPauseMiniFill className="size-3.5 sm:size-4" />
                  ) : (
                    <RiPlayMiniFill className="size-3.5 sm:size-4" />
                  )}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7px] uppercase tracking-[0.2em] text-white/45 sm:text-[8px]">
                    Showreel
                  </span>
                  <span className="mt-1 text-[10px] font-medium tracking-[-0.01em] text-white sm:text-xs">
                    {playing ? "Pause video" : "Play video"}
                  </span>
                </div>
              </button>

              {/* Mute */}
              <button
                onClick={toggleMute}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:bg-black/60 sm:h-12 sm:w-12"
              >
                {VolumeIcon}
              </button>
            </div>
          </div>

          {/* VIDEO */}
          <div
            ref={videoWrapRef}
            className="aspect-video h-auto w-full overflow-hidden xl:h-full xl:aspect-auto"
            style={{
              transformOrigin: "center center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%) scale(1) rotateY(0deg) rotateX(0deg)",
            }}
          >
            <video
              ref={videoElRef}
              src="/home/showreel.mp4"
              className="h-auto w-full object-cover xl:h-full"
              muted={isMuted}
              loop
              playsInline
              autoPlay
            />
          </div>

          {/* OVERLAY PANELS (sticker panels) */}
          <div
            ref={overlayRef}
            className="absolute left-0 w-full"
            style={{ top: "100%", height: "300vh" }}
          >
            {/* Panel 1 */}
            <div className="relative flex h-screen items-center justify-center">
              <Image src="/home/sticker1.png" alt="sticker" width={200} height={200} sizes="(max-width: 640px) 96px, (max-width: 1279px) 140px, 200px" className="absolute top-6 left-4 h-auto w-24 rotate-[-10deg] sm:top-10 sm:left-8 sm:w-32 md:w-40 xl:left-10 xl:w-48" />
              <Image src="/home/sticker2.png" alt="sticker" width={200} height={200} sizes="(max-width: 640px) 96px, (max-width: 1279px) 140px, 200px" className="absolute right-4 bottom-6 h-auto w-24 rotate-10 sm:right-8 sm:bottom-10 sm:w-32 md:w-40 xl:right-10 xl:w-48" />
            </div>

            {/* Panel 2 */}
            <div className="relative flex h-screen items-center justify-center">
              <Image src="/home/sticker3.png" alt="sticker" width={200} height={200} sizes="(max-width: 640px) 96px, (max-width: 1279px) 140px, 200px" className="absolute top-6 left-4 h-auto w-24 -rotate-6 sm:top-10 sm:left-16 sm:w-32 md:w-40 xl:left-28 xl:w-48" />
              <Image src="/home/sticker4.png" alt="sticker" width={200} height={200} sizes="(max-width: 640px) 96px, (max-width: 1279px) 140px, 200px" className="absolute right-4 bottom-6 h-auto w-24 rotate-[8deg] sm:right-8 sm:bottom-10 sm:w-32 md:w-40 xl:right-10 xl:w-48" />
            </div>

            {/* Panel 3 */}
            <div className="relative flex h-screen items-center justify-center">
              <Image src="/home/sticker5.png" alt="sticker" width={200} height={200} sizes="(max-width: 640px) 96px, (max-width: 1279px) 140px, 200px" className="absolute top-6 left-4 h-auto w-24 -rotate-12 sm:top-10 sm:left-8 sm:w-32 md:w-40 xl:left-10 xl:w-48" />
              <Image src="/home/sticker6.png" alt="sticker" width={200} height={200} sizes="(max-width: 640px) 96px, (max-width: 1279px) 140px, 200px" className="absolute right-4 bottom-6 h-auto w-24 rotate-12 sm:right-8 sm:bottom-10 sm:w-32 md:w-40 xl:right-10 xl:w-48" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}