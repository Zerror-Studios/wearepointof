"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { universeSlides, slideHref } from "@/helper/universeData";
import { ArrowRight } from "./shared";
import { useUniverseNav } from "./UniverseShell";

/*
  Previous / next slide links at the foot of a Universe page. `from` is the last slide
  shown on the page (04 for /universe), so "next" is always the following page.

  Pull on to the next slide: once the page has reached its end it stays put, and further
  scroll input (wheel / trackpad, a touch drag, ↓ PgDn Space) fills a bar along the
  pager's top border; full opens the next slide. Scrolling up empties it, and it eases
  back if the visitor stops halfway. Trackpad momentum from the flick that reached the
  end is ignored: momentum arrives as steadily shrinking wheel deltas, so once settled at
  the end any input that isn't shrinking (mouse-wheel notches, a fresh swipe) counts.

  The fill is drawn from one CSS variable, --p (0-1) on the nav, eased every frame: the
  bar and its glowing tip, a slight lift of the pager, the Next arrow edging forward and
  the Previous side dimming (.uni-pull-* in globals.css). It pulls against a little
  resistance as it fills, and on completion the tip flashes before the page changes.
*/

// Scroll distance (px of wheel / drag) that fills the bar, before resistance
const FILL_PX = 520;
// How much heavier the pull gets towards full (0 = none)
const RESISTANCE = 0.45;
// Easing time constant of the drawn bar chasing the input (ms): lower is snappier
const SMOOTH_MS = 85;
// Idle time before a part-filled bar eases back, and the time constant of that return
const RELEASE_AFTER_MS = 650;
const RELEASE_MS = 260;
// Beat between the bar completing and the next slide opening
const COMPLETE_HOLD_MS = 280;
// After arriving at the end, ignore forward wheel input this long while the scroll settles
const SETTLE_MS = 200;
// A pause this long between wheel events always starts a fresh gesture
const GESTURE_GAP_MS = 120;

const PagerLink = ({ slide, dir }) => {
  const navigate = useUniverseNav();
  const isNext = dir === "next";
  return (
    <Link
      href={slideHref(slide.id)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(slide.id);
      }}
      aria-label={`${isNext ? "Next" : "Previous"}: ${slide.label}`}
      className={`group flex items-center gap-3 md:gap-[1.2cqw] pt-8 pb-6 md:pt-[3.5cqw] md:pb-[2cqw] font-heading font-light text-[#E8E8E1] leading-[1.2] text-[20px] md:text-[clamp(18px,2.43cqw,40px)] ${isNext ? "justify-end text-right" : "justify-start text-left"}`}
    >
      {!isNext && <ArrowRight className="shrink-0 w-[0.6em] h-[0.7em] -scale-y-100 transition-transform duration-300 group-hover:-translate-x-1" />}
      <span className="transition-opacity duration-300 group-hover:opacity-70">{slide.label}</span>
      {isNext && <ArrowRight className="shrink-0 w-[0.6em] h-[0.7em] transition-transform duration-300 group-hover:translate-x-1" />}
    </Link>
  );
};

const SlidePager = ({ from, to = from }) => {
  const navigate = useUniverseNav();
  const navRef = useRef(null);
  const hintRef = useRef(null);

  const first = universeSlides.findIndex((s) => s.id === from);
  const last = universeSlides.findIndex((s) => s.id === to);
  const prev = universeSlides[first - 1];
  const next = universeSlides[last + 1];

  useEffect(() => {
    const nav = navRef.current;
    const hint = hintRef.current;
    if (!next || !nav || !hint) return;

    let target = 0; // where the input has pushed the bar (0-1)
    let shown = 0; // what is drawn, eased towards target
    let raf = 0;
    let lastFrame = 0;
    let lastInput = 0;
    let lastWheel = 0;
    let lastAbs = 0; // size of the previous wheel delta, to spot decaying momentum
    let arrivedAt = 0;
    let atEnd = false;
    let armed = false; // a fresh gesture has started since arriving at the end
    let done = false;
    let touchY = null;
    let finishTimer = 0;

    const tick = (now) => {
      const dt = Math.min(64, now - lastFrame);
      lastFrame = now;
      // Let go halfway: ease back to empty (exponential, so it settles softly)
      if (!done && target > 0 && now - lastInput > RELEASE_AFTER_MS) {
        target *= Math.exp(-dt / RELEASE_MS);
        if (target < 0.002) target = 0;
      }
      // Drawn value chases the input, frame-rate independent
      shown += (target - shown) * (1 - Math.exp(-dt / SMOOTH_MS));
      if (Math.abs(target - shown) < 0.0005) shown = target;
      nav.style.setProperty("--p", shown.toFixed(4));

      if (!done && target >= 1 && shown > 0.995) {
        done = true;
        nav.classList.add("is-complete");
        finishTimer = window.setTimeout(() => navigate(next.id), COMPLETE_HOLD_MS);
      }
      raf = !done && (shown > 0 || target > 0) ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (raf) return;
      lastFrame = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const push = (amount) => {
      if (done) return;
      lastInput = performance.now();
      // Forward pulls get heavier as the bar fills; pulling back is never resisted
      const step = amount > 0 ? amount * (1 - RESISTANCE * target) : amount;
      target = Math.min(1, Math.max(0, target + step));
      kick();
    };

    const onScroll = () => {
      const end = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (end === atEnd) return;
      atEnd = end;
      armed = false;
      arrivedAt = performance.now();
      hint.style.opacity = end ? "1" : "0";
      if (!end) {
        target = 0;
        kick();
      }
    };
    const onWheel = (e) => {
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      const abs = Math.abs(dy);
      const decaying = gap < GESTURE_GAP_MS && abs < lastAbs * 0.97;
      lastAbs = abs;
      if (!atEnd) return;
      if (dy < 0) return push(dy / FILL_PX);
      if (!armed) {
        // Still settling, or the shrinking tail of the momentum that got here: not a pull
        if (now - arrivedAt < SETTLE_MS || decaying) return;
        armed = true;
      }
      push(dy / FILL_PX);
    };
    const onTouchStart = (e) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e) => {
      const y = e.touches[0]?.clientY;
      if (touchY === null || y === undefined) return;
      if (atEnd) push((touchY - y) / FILL_PX);
      touchY = y;
    };
    const onKeyDown = (e) => {
      if (!atEnd || e.target.closest?.("input, textarea, select, [contenteditable]")) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) push(0.34);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Capture phase: no element on the page can swallow the wheel before the pager sees it
    window.addEventListener("wheel", onWheel, { passive: true, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      clearTimeout(finishTimer);
    };
  }, [next, navigate]);

  if (!prev && !next) return null;

  return (
    <nav
      ref={navRef}
      aria-label="Universe slides"
      className={`relative mx-6 md:mx-[8.67cqw] mb-12 md:mb-[2.5cqw] grid grid-cols-2 gap-6 border-t border-[#8E8E8E]/40 ${
        next ? "uni-pull" : ""
      }`}
    >
      {next && (
        <>
          <span
            ref={hintRef}
            aria-hidden="true"
            className="pointer-events-none absolute right-0 bottom-full mb-3 md:mb-[1cqw] font-(family-name:--font-uni-mono) text-[12px] md:text-[clamp(11px,1.04cqw,16px)] tracking-[0.2px] text-[#8E8E8E] transition-opacity duration-500"
            style={{ opacity: 0 }}
          >
            Keep scrolling
          </span>
          <span aria-hidden="true" className="uni-pull-bar" />
          <span aria-hidden="true" className="uni-pull-tip" />
        </>
      )}
      <div className={next ? "uni-pull-prev" : undefined}>{prev && <PagerLink slide={prev} dir="prev" />}</div>
      <div className={next ? "uni-pull-next" : undefined}>{next && <PagerLink slide={next} dir="next" />}</div>
    </nav>
  );
};

export default SlidePager;
