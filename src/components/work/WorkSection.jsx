"use client";
import gsap from 'gsap';
import Flip from "gsap/src/Flip";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from "react-dom";
import WorkGridOverlay from "./WorkGridOverlay";
import WorkFilterPanel from "./WorkFilterPanel";
import WorkBackgroundSlides from "./WorkBackgroundSlides";
import WorkCenterForeground from "./WorkCenterForeground";
import { CLIP_HIDDEN_BOTTOM, CLIP_HIDDEN_TOP, CLIP_VISIBLE } from "./workClip";

gsap.registerPlugin(Flip);

// BG scale/objectPosition states
// DOWN: current exits  → scale 1, 50% 50% → 50% -20%  (drifts up)
//       next  enters   → scale 1.5, 50% 20% → 50% 50%  (zooms out, settles)
// UP:   current exits  → scale 1, 50% 50% → 50% 20%   (drifts down)
//       next  enters   → scale 1.5, 50% -20% → 50% 50% (zooms out, settles)
const BG_REST = { scale: 1, objectPosition: "50% 50%" };
const BG_EXIT_DOWN = { scale: 1.5, objectPosition: "50% 20%" };
const BG_ENTER_DOWN_FROM = { scale: 1.5, objectPosition: "50% 20%" };
const BG_EXIT_UP = { scale: 1.5, objectPosition: "50% 20%" };
const BG_ENTER_UP_FROM = { scale: 1.5, objectPosition: "50% 20%" };

// Center scale/objectPosition states (same behavior as BG)
const CTR_REST = BG_REST;
const CTR_EXIT_DOWN = BG_EXIT_DOWN;
const CTR_ENTER_DOWN_FROM = BG_ENTER_DOWN_FROM;
const CTR_EXIT_UP = BG_EXIT_UP;
const CTR_ENTER_UP_FROM = BG_ENTER_UP_FROM;

const TITLE_TRANSFORM_ORIGIN = "left center";

const toSlug = (value = "") =>
  String(value).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");


const WorkSection = ({ projects }) => {
  const router = useRouter();
  const items = useMemo(
    () => (projects ?? []).map((project) => ({
      ...project,
      slug: project.slug || toSlug(project.name || "project"),
    })),
    [projects]
  );

  const containerRef = useRef(null);
  const touchStartYRef = useRef(null);
  const cooldownRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const isGridOpenRef = useRef(false);
  const centerWrapperRef = useRef(null);

  // clip-path lives on the WRAPPER div—separate from the img
  const bgWrapRefs = useRef([]);   // wrapper divs  (clip-path animated here)
  const bgRefs = useRef([]);   // <img> elements (scale + objectPosition animated here)
  const centerRefs = useRef([]);   // center wrapper divs (clip-path)
  const centerImgRefs = useRef([]);  // center <img> elements (no extra anim needed)
  const textRefs = useRef([]);
  const descRefs = useRef([]);
  const counterRefs = useRef([]);
  const gridListRef = useRef(null);
  const filterOverlayRef = useRef(null);
  const filterPanelRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandingIndex, setExpandingIndex] = useState(null);
  const [activeFilters, setActiveFilters] = useState(() => ({
    services: new Set(), industry: new Set(),
  }));

  const handleCenterCardClick = (e, index, slug) => {
    // Let default browser behavior work for new-tab / modified clicks.
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    // Only run the fullscreen Flip on xl+ screens.
    // On smaller screens (incl. iPad Pro), keep default link navigation.
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      return;
    }

    e.preventDefault();
    if (expandingIndex !== null) return;

    const href = `/work/${slug}`;
    const el = centerWrapperRef.current;
    if (!el) {
      router.push(href);
      return;
    }

    const navEl = document.getElementById("site-nav");
    if (navEl) {
      gsap.to(navEl, {
        opacity: 0,
        y: -30,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
        pointerEvents: "none",
      });
    }

    // IMPORTANT: animate the OUTER wrapper to avoid "fixed inside transformed parent" issues.
    gsap.set(el, { transformOrigin: "50% 50%" });
    const state = Flip.getState(el);
    flushSync(() => setExpandingIndex(index));

    Flip.from(state, {
      duration: 0.8,
      ease: "power3.inOut",
      absolute: true,
      transformOrigin: "50% 50%",
      onComplete: () => router.push(href),
    });
  };

  const filterOptions = useMemo(() => {
    const uniq = (arr) => [...new Set(arr.filter(Boolean).map((v) => String(v).trim()).filter(Boolean))];
    const base = projects ?? [];
    const services = uniq(base.flatMap((p) => Array.isArray(p?.filtersServices) ? p.filtersServices : []));
    const industry = uniq(base.flatMap((p) => Array.isArray(p?.filtersIndustry) ? p.filtersIndustry : []));
    return {
      services: services.sort((a, b) => a.localeCompare(b)),
      industry: industry.sort((a, b) => a.localeCompare(b)),
    };
  }, [projects]);

  useEffect(() => { isGridOpenRef.current = isGridOpen; }, [isGridOpen]);

  // Filter panel animation
  useEffect(() => {
    const overlay = filterOverlayRef.current;
    const panel = filterPanelRef.current;
    if (!overlay || !panel) return;
    const tl = gsap.timeline({ defaults: { overwrite: true } });
    if (isFilterOpen) {
      tl.set(panel, { yPercent: 100 });
      tl.to(overlay, { opacity: 1, duration: 0.25, ease: "power2.out", onComplete: () => gsap.set(overlay, { pointerEvents: "auto" }) });
      tl.to(panel, { yPercent: 0, duration: 0.55, ease: "power3.inOut" });
    } else {
      tl.set(panel, { yPercent: 0 });
      tl.to(panel, { yPercent: 100, duration: 0.45, ease: "power3.inOut" });
      tl.to(overlay, { opacity: 0, duration: 0.25, ease: "power2.inOut", onComplete: () => gsap.set(overlay, { pointerEvents: "none" }) });
    }
    return () => tl.kill();
  }, [isFilterOpen]);

  const toggleFilter = () => setIsFilterOpen((v) => !v);
  const toggleFilterItem = (group, value) => {
    setActiveFilters((prev) => {
      if (group === "industry") {
        const isOn = prev.industry.has(value);
        return { ...prev, industry: isOn ? new Set() : new Set([value]) };
      }
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
  };

  const filteredCaseStudy = useMemo(() => {
    const { services, industry } = activeFilters;
    const base = projects ?? [];
    if (!services.size && !industry.size) return base;
    return base.filter((p) => {
      if (services.size && !(Array.isArray(p?.filtersServices) ? p.filtersServices : []).some((v) => services.has(String(v)))) return false;
      if (industry.size && !(Array.isArray(p?.filtersIndustry) ? p.filtersIndustry : []).some((v) => industry.has(String(v)))) return false;
      return true;
    });
  }, [activeFilters, projects]);

  const onApplyFilters = () => setIsFilterOpen(false);
  const onResetFilters = () => setActiveFilters({ services: new Set(), industry: new Set() });

  // ── helpers ──────────────────────────────────────────────────
  const isLgUp = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches;

  const getTitleEls = (index) =>
    (textRefs.current[index] ?? []).filter(Boolean);

  const getTitleTransformOrigin = () => TITLE_TRANSFORM_ORIGIN;

  const getDescTransformOrigin = () => "left center";

  const applyTextCounterRestState = (activeIdx, forward) => {
    for (let i = 0; i < items.length; i++) {
      const h1s = getTitleEls(i);
      if (h1s?.length) {
        if (i === activeIdx) {
          gsap.set(h1s, {
            x: 0,
            rotate: 0,
            y: "0%",
            opacity: 1,
            transformOrigin: getTitleTransformOrigin(),
          });
        } else {
          gsap.set(h1s, {
            x: 0,
            rotate: forward ? 5 : -5,
            y: forward ? "100%" : "-100%",
            opacity: 0,
            transformOrigin: getTitleTransformOrigin(),
          });
        }
      }
      const desc = descRefs.current[i];
      if (desc) {
        if (i === activeIdx) {
          gsap.set(desc, {
            x: 0,
            y: "0%",
            opacity: 1,
            transformOrigin: getDescTransformOrigin(),
          });
        } else {
          gsap.set(desc, {
            x: 0,
            y: forward ? "100%" : "-100%",
            opacity: 0,
            transformOrigin: getDescTransformOrigin(),
          });
        }
      }
      const cnt = counterRefs.current[i];
      if (cnt) {
        if (i === activeIdx) gsap.set(cnt, { top: "0%", opacity: 0.7 });
        else gsap.set(cnt, { top: forward ? "100%" : "-100%", opacity: 0 });
      }
    }
  };

  const applyBgRestState = () => {
    bgRefs.current.forEach((el) => {
      if (el) gsap.set(el, { scale: BG_REST.scale, objectPosition: BG_REST.objectPosition });
    });

  };

  const applyCenterRestState = () => {
    centerImgRefs.current.forEach((el) => {
      if (el) gsap.set(el, { scale: CTR_REST.scale, objectPosition: CTR_REST.objectPosition });
    });
  };

  useEffect(() => {
    if (!items.length) return;
    applyTextCounterRestState(0, true);
    applyBgRestState();
    applyCenterRestState();

    const mqLg = window.matchMedia("(min-width: 1024px)");
    const onBreakpointChange = () => {
      applyTextCounterRestState(currentIndexRef.current, true);
    };
    mqLg.addEventListener("change", onBreakpointChange);
    return () => mqLg.removeEventListener("change", onBreakpointChange);
  }, [items]);

  // ── grid toggle ──────────────────────────────────────────────
  const toggleGridList = () => {
    const el = gridListRef.current;
    if (!el) return;
    if (!isGridOpen) {
      el.scrollTop = 0;
      setActiveFilters({ services: new Set(), industry: new Set() });
      setIsFilterOpen(false);
      isGridOpenRef.current = true;
      gsap.fromTo(el,
        { clipPath: CLIP_HIDDEN_BOTTOM, webkitClipPath: CLIP_HIDDEN_BOTTOM },
        { clipPath: CLIP_VISIBLE, webkitClipPath: CLIP_VISIBLE, duration: 0.6, ease: "power3.inOut" }
      );
      setIsGridOpen(true);
    } else {
      isGridOpenRef.current = false;
      gsap.to(el, {
        clipPath: CLIP_HIDDEN_TOP, webkitClipPath: CLIP_HIDDEN_TOP, duration: 0.55, ease: "power3.inOut",
        onComplete: () => gsap.set(el, { clipPath: CLIP_HIDDEN_BOTTOM, webkitClipPath: CLIP_HIDDEN_BOTTOM }),
      });
      setIsGridOpen(false);
    }
  };

  // ── DOWN ─────────────────────────────────────────────────────
  const runDownAnimations = () => {
    if (isAnimatingRef.current) return null;
    const total = items.length;
    if (!total) return null;

    const current = currentIndexRef.current % total;
    const next = (current + 1) % total;

    const bgWrapCurrent = bgWrapRefs.current[current];
    const bgWrapNext = bgWrapRefs.current[next];
    const bgCurrent = bgRefs.current[current];
    const bgNext = bgRefs.current[next];
    const ctrCurrent = centerRefs.current[current];
    const ctrNext = centerRefs.current[next];
    const ctrImgCurrent = centerImgRefs.current[current];
    const ctrImgNext = centerImgRefs.current[next];
    if (!bgWrapCurrent || !bgWrapNext || !bgCurrent || !bgNext || !ctrCurrent || !ctrNext || !ctrImgCurrent || !ctrImgNext) return null;

    const h1sPrev = getTitleEls(current);
    const h1sNext = getTitleEls(next);
    const descPrev = descRefs.current[current];
    const descNext = descRefs.current[next];
    const cntPrev = counterRefs.current[current];
    const cntNext = counterRefs.current[next];

    // clip-path starting states—on wrappers
    bgWrapRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        clipPath: i === current ? CLIP_VISIBLE : CLIP_HIDDEN_BOTTOM,
        webkitClipPath: i === current ? CLIP_VISIBLE : CLIP_HIDDEN_BOTTOM,
        zIndex: i === current ? 2 : 0,
      });
    });
    gsap.set(bgWrapNext, { zIndex: 1, clipPath: CLIP_HIDDEN_BOTTOM, webkitClipPath: CLIP_HIDDEN_BOTTOM });

    centerRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        clipPath: i === current ? CLIP_VISIBLE : CLIP_HIDDEN_TOP,
        webkitClipPath: i === current ? CLIP_VISIBLE : CLIP_HIDDEN_TOP,
        zIndex: i === current ? 2 : 0,
      });
    });
    gsap.set(ctrNext, { zIndex: 1, clipPath: CLIP_HIDDEN_TOP, webkitClipPath: CLIP_HIDDEN_TOP });

    // scale + objectPosition starting states—on images
    gsap.set(bgCurrent, { scale: BG_REST.scale, objectPosition: BG_REST.objectPosition });
    gsap.set(bgNext, { scale: BG_ENTER_DOWN_FROM.scale, objectPosition: BG_ENTER_DOWN_FROM.objectPosition });

    // Center zoom + object-position (DOWN)
    gsap.set(ctrImgCurrent, { scale: CTR_REST.scale, objectPosition: CTR_REST.objectPosition });
    gsap.set(ctrImgNext, { scale: CTR_ENTER_DOWN_FROM.scale, objectPosition: CTR_ENTER_DOWN_FROM.objectPosition });

    if (h1sNext?.length) {
      gsap.set(h1sNext, {
        x: 0,
        rotate: 5,
        y: "100%",
        opacity: 0,
        transformOrigin: getTitleTransformOrigin(),
      });
    }
    if (descNext) gsap.set(descNext, { x: 0, y: "100%", opacity: 0 });
    if (cntNext) gsap.set(cntNext, { top: "100%", opacity: 0 });

    isAnimatingRef.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        currentIndexRef.current = next;
        setActiveIndex(next);
        bgWrapRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, {
            clipPath: i === next ? CLIP_VISIBLE : CLIP_HIDDEN_BOTTOM,
            webkitClipPath: i === next ? CLIP_VISIBLE : CLIP_HIDDEN_BOTTOM,
            zIndex: i === next ? 1 : 0,
          });
        });
        centerRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, {
            clipPath: i === next ? CLIP_VISIBLE : CLIP_HIDDEN_TOP,
            webkitClipPath: i === next ? CLIP_VISIBLE : CLIP_HIDDEN_TOP,
            zIndex: i === next ? 1 : 0,
          });
        });
        applyBgRestState();
        applyCenterRestState();
        applyTextCounterRestState(next, true);
        isAnimatingRef.current = false;
      },
      onInterrupt: () => { isAnimatingRef.current = false; },
    });

    // clip-path on wrappers
    tl.to(bgWrapCurrent, { clipPath: CLIP_HIDDEN_TOP, webkitClipPath: CLIP_HIDDEN_TOP, duration: 1 }, 0);
    tl.to(bgWrapNext, { clipPath: CLIP_VISIBLE, webkitClipPath: CLIP_VISIBLE, duration: 1 }, 0);
    tl.to(ctrCurrent, { clipPath: CLIP_HIDDEN_BOTTOM, webkitClipPath: CLIP_HIDDEN_BOTTOM, duration: 1 }, 0);
    tl.to(ctrNext, { clipPath: CLIP_VISIBLE, webkitClipPath: CLIP_VISIBLE, duration: 1 }, 0);

    // scale + objectPosition on images
    tl.to(bgCurrent, { scale: BG_EXIT_DOWN.scale, objectPosition: BG_EXIT_DOWN.objectPosition, duration: 1, ease: "power2.inOut" }, 0);
    tl.to(bgNext, { scale: BG_REST.scale, objectPosition: BG_REST.objectPosition, duration: 1, ease: "power2.inOut" }, 0);

    tl.to(ctrImgCurrent, { scale: CTR_EXIT_DOWN.scale, objectPosition: CTR_EXIT_DOWN.objectPosition, duration: 1, ease: "power2.inOut" }, 0);
    tl.to(ctrImgNext, { scale: CTR_REST.scale, objectPosition: CTR_REST.objectPosition, duration: 1, ease: "power2.inOut" }, 0);

    // text
    if (h1sPrev?.length) {
      tl.to(
        h1sPrev,
        {
          x: 0,
          rotate: -5,
          y: "-100%",
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          transformOrigin: getTitleTransformOrigin(),
          onComplete() {
            gsap.set(h1sPrev, {
              x: 0,
              rotate: 5,
              y: "100%",
              transformOrigin: getTitleTransformOrigin(),
            });
          },
        },
        0
      );
    }
    if (h1sNext?.length) {
      tl.to(
        h1sNext,
        {
          x: 0,
          rotate: 0,
          y: "0%",
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          transformOrigin: getTitleTransformOrigin(),
        },
        0
      );
    }
    if (descPrev) tl.to(descPrev, { x: 0, y: "-100%", opacity: 0, duration: 0.8, ease: "power2.out" }, 0);
    if (descNext) tl.to(descNext, { x: 0, y: "0%", opacity: 1, duration: 0.8, ease: "power2.out" }, 0);
    if (cntPrev) {
      tl.to(cntPrev, {
        top: "-100%", opacity: 0, duration: 0.8,
        onComplete() { gsap.set(cntPrev, { top: "100%", opacity: 0 }); }
      }, 0);
    }
    if (cntNext) tl.to(cntNext, { top: "0%", opacity: 0.7, duration: 0.8 }, 0);

    return tl;
  };

  // ── UP ───────────────────────────────────────────────────────
  const runUpAnimations = () => {
    if (isAnimatingRef.current) return null;
    const total = items.length;
    if (!total) return null;

    const current = currentIndexRef.current % total;
    const prev = (current - 1 + total) % total;

    const bgWrapCurrent = bgWrapRefs.current[current];
    const bgWrapPrev = bgWrapRefs.current[prev];
    const bgCurrent = bgRefs.current[current];
    const bgPrev = bgRefs.current[prev];
    const ctrCurrent = centerRefs.current[current];
    const ctrPrev = centerRefs.current[prev];
    const ctrImgCurrent = centerImgRefs.current[current];
    const ctrImgPrev = centerImgRefs.current[prev];
    if (!bgWrapCurrent || !bgWrapPrev || !bgCurrent || !bgPrev || !ctrCurrent || !ctrPrev || !ctrImgCurrent || !ctrImgPrev) return null;

    const h1sPrev = getTitleEls(current);
    const h1sNext = getTitleEls(prev);
    const descPrev = descRefs.current[current];
    const descNext = descRefs.current[prev];
    const cntPrev = counterRefs.current[current];
    const cntNext = counterRefs.current[prev];

    bgWrapRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        clipPath: i === current ? CLIP_VISIBLE : CLIP_HIDDEN_TOP,
        webkitClipPath: i === current ? CLIP_VISIBLE : CLIP_HIDDEN_TOP,
        zIndex: i === current ? 2 : 0,
      });
    });
    gsap.set(bgWrapPrev, { zIndex: 1, clipPath: CLIP_HIDDEN_TOP, webkitClipPath: CLIP_HIDDEN_TOP });

    centerRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        clipPath: i === current ? CLIP_VISIBLE : CLIP_HIDDEN_BOTTOM,
        webkitClipPath: i === current ? CLIP_VISIBLE : CLIP_HIDDEN_BOTTOM,
        zIndex: i === current ? 2 : 0,
      });
    });
    gsap.set(ctrPrev, { zIndex: 1, clipPath: CLIP_HIDDEN_BOTTOM, webkitClipPath: CLIP_HIDDEN_BOTTOM });

    gsap.set(bgCurrent, { scale: BG_REST.scale, objectPosition: BG_REST.objectPosition });
    gsap.set(bgPrev, { scale: BG_ENTER_UP_FROM.scale, objectPosition: BG_ENTER_UP_FROM.objectPosition });

    // Center zoom + object-position (UP)
    gsap.set(ctrImgCurrent, { scale: CTR_REST.scale, objectPosition: CTR_REST.objectPosition });
    gsap.set(ctrImgPrev, { scale: CTR_ENTER_UP_FROM.scale, objectPosition: CTR_ENTER_UP_FROM.objectPosition });

    if (h1sNext?.length) {
      gsap.set(h1sNext, {
        x: 0,
        rotate: -5,
        y: "-100%",
        opacity: 0,
        transformOrigin: getTitleTransformOrigin(),
      });
    }
    if (descNext) gsap.set(descNext, { x: 0, y: "-100%", opacity: 0 });
    if (cntNext) gsap.set(cntNext, { top: "-100%", opacity: 0 });

    isAnimatingRef.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        currentIndexRef.current = prev;
        setActiveIndex(prev);
        bgWrapRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, {
            clipPath: i === prev ? CLIP_VISIBLE : CLIP_HIDDEN_TOP,
            webkitClipPath: i === prev ? CLIP_VISIBLE : CLIP_HIDDEN_TOP,
            zIndex: i === prev ? 1 : 0,
          });
        });
        centerRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, {
            clipPath: i === prev ? CLIP_VISIBLE : CLIP_HIDDEN_BOTTOM,
            webkitClipPath: i === prev ? CLIP_VISIBLE : CLIP_HIDDEN_BOTTOM,
            zIndex: i === prev ? 1 : 0,
          });
        });
        applyBgRestState();
        applyCenterRestState();
        applyTextCounterRestState(prev, false);
        isAnimatingRef.current = false;
      },
      onInterrupt: () => { isAnimatingRef.current = false; },
    });

    tl.to(bgWrapCurrent, { clipPath: CLIP_HIDDEN_BOTTOM, webkitClipPath: CLIP_HIDDEN_BOTTOM, duration: 1 }, 0);
    tl.to(bgWrapPrev, { clipPath: CLIP_VISIBLE, webkitClipPath: CLIP_VISIBLE, duration: 1 }, 0);
    tl.to(ctrCurrent, { clipPath: CLIP_HIDDEN_TOP, webkitClipPath: CLIP_HIDDEN_TOP, duration: 1 }, 0);
    tl.to(ctrPrev, { clipPath: CLIP_VISIBLE, webkitClipPath: CLIP_VISIBLE, duration: 1 }, 0);

    tl.to(bgCurrent, { scale: BG_EXIT_UP.scale, objectPosition: BG_EXIT_UP.objectPosition, duration: 1, ease: "power2.inOut" }, 0);
    tl.to(bgPrev, { scale: BG_REST.scale, objectPosition: BG_REST.objectPosition, duration: 1, ease: "power2.inOut" }, 0);

    tl.to(ctrImgCurrent, { scale: CTR_EXIT_UP.scale, objectPosition: CTR_EXIT_UP.objectPosition, duration: 1, ease: "power2.inOut" }, 0);
    tl.to(ctrImgPrev, { scale: CTR_REST.scale, objectPosition: CTR_REST.objectPosition, duration: 1, ease: "power2.inOut" }, 0);

    if (h1sPrev?.length) {
      tl.to(
        h1sPrev,
        {
          x: 0,
          rotate: 5,
          y: "100%",
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          transformOrigin: getTitleTransformOrigin(),
          onComplete() {
            gsap.set(h1sPrev, {
              x: 0,
              rotate: -5,
              y: "-100%",
              transformOrigin: getTitleTransformOrigin(),
            });
          },
        },
        0
      );
    }
    if (h1sNext?.length) {
      tl.to(
        h1sNext,
        {
          x: 0,
          rotate: 0,
          y: "0%",
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          transformOrigin: getTitleTransformOrigin(),
        },
        0
      );
    }
    if (descPrev) tl.to(descPrev, { x: 0, y: "100%", opacity: 0, duration: 0.8, ease: "power2.out" }, 0);
    if (descNext) tl.to(descNext, { x: 0, y: "0%", opacity: 1, duration: 0.8, ease: "power2.out" }, 0);
    if (cntPrev) {
      tl.to(cntPrev, {
        top: "100%", opacity: 0, duration: 0.8,
        onComplete() { gsap.set(cntPrev, { top: "-100%", opacity: 0 }); }
      }, 0);
    }
    if (cntNext) tl.to(cntNext, { top: "0%", opacity: 0.7, duration: 0.8 }, 0);

    return tl;
  };

  const handleScrollDirection = (dir) => {
    if (!dir || isAnimatingRef.current || isGridOpenRef.current) return;
    if (dir === "up") runUpAnimations();
    if (dir === "down") runDownAnimations();
  };

  useEffect(() => {
    const el = containerRef.current;
    const gridEl = gridListRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (isGridOpenRef.current) return;
      const dy = e.deltaY;
      if (Math.abs(dy) < 8) return;
      e.preventDefault();
      if (isAnimatingRef.current) return;
      if (Date.now() < cooldownRef.current) return;
      cooldownRef.current = Date.now() + 900;
      handleScrollDirection(dy > 0 ? "down" : "up");
    };

    const stopGridPropagation = (e) => { e.stopPropagation(); };

    const onTouchStart = (e) => { touchStartYRef.current = e.touches?.[0]?.clientY ?? null; };
    const onTouchEnd = (e) => {
      if (isGridOpenRef.current) return;
      const startY = touchStartYRef.current;
      const endY = e.changedTouches?.[0]?.clientY;
      touchStartYRef.current = null;
      if (typeof startY !== 'number' || typeof endY !== 'number') return;
      const dy = endY - startY;
      if (Math.abs(dy) < 40) return;
      if (isAnimatingRef.current) return;
      if (Date.now() < cooldownRef.current) return;
      cooldownRef.current = Date.now() + 900;
      handleScrollDirection(dy < 0 ? "down" : "up");
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    gridEl?.addEventListener('wheel', stopGridPropagation, { passive: true });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      gridEl?.removeEventListener('wheel', stopGridPropagation);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);


  return (
    <div
      ref={containerRef}
      className="relative w-screen h-svh overflow-hidden touch-none select-none"
    >

      <WorkBackgroundSlides
        items={items}
        wrapRefs={bgWrapRefs}
        imgRefs={bgRefs}
      />

      <WorkCenterForeground
        items={items}
        wrapperRef={centerWrapperRef}
        slideRefs={centerRefs}
        imgRefs={centerImgRefs}
        counterRefs={counterRefs}
        activeIndex={activeIndex}
        expandingIndex={expandingIndex}
        isGridOpen={isGridOpen}
        onCenterCardClick={handleCenterCardClick}
        onToggleGrid={toggleGridList}
      />

      <WorkGridOverlay
        gridListRef={gridListRef}
        toggleGridList={toggleGridList}
        toggleFilter={toggleFilter}
        projects={filteredCaseStudy}
        isGridOpen={isGridOpen}
      />

      <WorkFilterPanel
        filterOverlayRef={filterOverlayRef}
        filterPanelRef={filterPanelRef}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        toggleFilterItem={toggleFilterItem}
        viewCount={filteredCaseStudy.length}
        onApply={onApplyFilters}
        onReset={onResetFilters}
      />

      {/* ── Side text: heading(s) first, gist second ──
          Below lg it sits 1rem above the centred card (300px, 350px from md) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-visible">
        {items.map((project, i) => (
          <div
            key={`text-${i}`}
            className="absolute left-0 right-0 max-md:bottom-[calc(50%+150px+1rem)] md:max-lg:bottom-[calc(50%+175px+1rem)] max-md:max-h-[calc(50%-150px-6rem)] md:max-lg:max-h-[calc(50%-175px-6rem)] items-start text-left max-lg:overflow-hidden lg:left-16 lg:right-auto xl:left-20 lg:top-1/2 lg:-translate-y-1/2 lg:items-start lg:text-left w-full max-lg:max-w-none lg:w-[min(500px,calc(50vw-135px-5.5rem))] xl:w-[min(500px,calc(50vw-200px-7rem))] min-w-0 flex flex-col"
          >

            <div className="w-full min-w-0 flex flex-col items-start lg:items-stretch lg:text-left">
              {/* Title — width matches WorkCenterForeground on mobile/tablet */}
              <div className="w-full max-w-[300px] md:max-w-[350px] mx-auto min-w-0 overflow-hidden px-0 pb-[0.12em] lg:max-w-none lg:mx-0 lg:pl-4">
                <h2
                  ref={(el) => {
                    textRefs.current[i] = [el];
                  }}
                  className="m-0 block w-full min-w-0 heading-xl text-[22px] md:text-[28px] lg:text-[38px] xl:text-[3.2vw] text-heading text-left py-px break-words"
                  style={{
                    willChange: "transform, opacity",
                    transformOrigin: getTitleTransformOrigin(),
                    transform:
                      i === 0
                        ? "translate(0px, 0%) rotate(0deg)"
                        : "translate(0px, 100%) rotate(5deg)",
                    opacity: i === 0 ? 1 : 0,
                  }}
                >
                  {project.name}
                </h2>
              </div>

              {/* Description */}
              <div className="w-full max-w-[300px] md:max-w-[350px] mx-auto overflow-hidden mt-0 sm:mt-1 pb-1 px-0 lg:max-w-none lg:mx-0 lg:pl-4">
                <p
                  ref={(el) => {
                    descRefs.current[i] = el;
                  }}
                  className="m-0 block w-full text-white/60 para max-w-[42ch] sm:max-w-[46ch] text-left lg:max-w-none py-px"
                  style={{
                    willChange: "transform, opacity",
                    transform: i === 0 ? "translate(0px, 0%)" : "translate(0px, 100%)",
                    opacity: i === 0 ? 1 : 0,
                  }}
                >
                  {project.gist}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WorkSection;
