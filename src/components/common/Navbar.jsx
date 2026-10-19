"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FullscreenMenu from "./FullscreenMenu";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/wearepointof" },
    { name: "LinkedIn", href: "https://linkedin.com/company/wearepointof" },
    { name: "Behance", href: "https://www.behance.net/wearepointof" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [logoLight, setLogoLight] = useState(true);
  const [landingActive, setLandingActive] = useState(false);
  const [showNavGradient, setShowNavGradient] = useState(true);
  const [navGradientSuppressed, setNavGradientSuppressed] = useState(false);
  const pathname = usePathname();
  const menuOpenRef = useRef(false);
  const overLightSectionRef = useRef(false);
  const logoDelayRef = useRef(null);
  const gradientDelayRef = useRef(null);

  const applyNavTheme = (invert) => {
    setLogoLight(!invert);
    setShowNavGradient(!invert);
  };

  // Hide navbar on excluded routes (e.g. Sanity Studio)
  const excludePaths = ["/admin"];
  if (pathname && excludePaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  // Home landing: keep navbar hidden until the hero landing overlay finishes.
  useEffect(() => {
    if (!pathname) return;
    setLandingActive(pathname === "/");

    const onDone = () => setLandingActive(false);
    window.addEventListener("hero-landing:done", onDone);

    // Safety fallback (in case the event is not fired for some reason).
    const fallback = window.setTimeout(() => {
      if (pathname === "/") setLandingActive(false);
    }, 2000);

    return () => {
      window.removeEventListener("hero-landing:done", onDone);
      window.clearTimeout(fallback);
    };
  }, [pathname]);

  // Sections (e.g. home About circle) can temporarily hide the gradient.
  useEffect(() => {
    const onSuppress = (e) => setNavGradientSuppressed(!!e.detail?.suppressed);
    window.addEventListener("nav-gradient:suppress", onSuppress);
    return () => {
      window.removeEventListener("nav-gradient:suppress", onSuppress);
      setNavGradientSuppressed(false);
    };
  }, [pathname]);

  const navRef = useRef(null);
  const tl = useRef(null);
  const refP = useRef(null);
  const refOINT = useRef(null);
  const refO = useRef(null);
  const refF = useRef(null);
  const logoRef = useRef(null);

  // Fullscreen menu animation
  useEffect(() => {
    if (!navRef.current) return;
    gsap.set(navRef.current, {
      top: "-100vh",
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
    });
    tl.current = gsap.timeline({ paused: true });
    tl.current
      .to(navRef.current, {
        top: 0,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.5,
        ease: "power4.out",
      })
      .from(
        navRef.current.querySelectorAll(".nav-item"),
        {
          x: 50,
          opacity: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "power4.out",
          clearProps: "transform",
        },
        "<"
      );
  }, []);

  const logoImgClass = (sizeClass) =>
    `${sizeClass} w-auto object-contain transition-[filter,opacity] duration-500 ease-in-out ${
      menuOpen || !logoLight ? "" : "invert"
    }`;

  const darkNavTreatment = menuOpen || !logoLight;

  menuOpenRef.current = menuOpen;

  // Invert navbar over light sections (e.g. Get in touch).
  useEffect(() => {
    const sections = gsap.utils.toArray("[data-nav-invert]");
    if (!sections.length) {
      overLightSectionRef.current = false;
      if (!menuOpenRef.current) applyNavTheme(false);
      return;
    }

    const active = new Set();
    const sync = () => {
      const invert = active.size > 0;
      overLightSectionRef.current = invert;
      if (!menuOpenRef.current) applyNavTheme(invert);
    };

    const triggers = sections.map((section, index) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 72",
        end: "bottom 72",
        onEnter: () => {
          active.add(index);
          sync();
        },
        onEnterBack: () => {
          active.add(index);
          sync();
        },
        onLeave: () => {
          active.delete(index);
          sync();
        },
        onLeaveBack: () => {
          active.delete(index);
          sync();
        },
      })
    );

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  // Use a dark navbar treatment against the light fullscreen menu,
  // then restore based on the section under the navbar after close.
  useEffect(() => {
    if (!tl.current) return;

    logoDelayRef.current?.kill();
    gradientDelayRef.current?.kill();
    logoDelayRef.current = null;
    gradientDelayRef.current = null;

    if (menuOpen) {
      applyNavTheme(true);
      tl.current.timeScale(1).play();
      document.body.style.overflow = "hidden";
    } else {
      const reverseDuration = tl.current.duration() / 1.8;
      const restoreDelay = reverseDuration * 0.6;
      logoDelayRef.current = gsap.delayedCall(restoreDelay, () => {
        if (!menuOpenRef.current) applyNavTheme(overLightSectionRef.current);
      });
      tl.current.timeScale(1.8).reverse();
      document.body.style.overflow = "auto";
    }

    return () => {
      logoDelayRef.current?.kill();
      gradientDelayRef.current?.kill();
    };
  }, [menuOpen]);

  // Scroll logo collapse
  useEffect(() => {
    if (!logoRef.current) return;
    // The logo-collapse animation relies on desktop spacing/measurements.
    // On small screens it can cause layout jitter, so we skip it.
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    let scrollTl;
    let resizeObserver;

    const buildTimeline = () => {
      // 1. Kill existing
      if (scrollTl) {
        scrollTl.scrollTrigger?.kill();
        scrollTl.kill();
      }

      // 2. Hard reset every transform so measurements are clean
      gsap.set([refOINT.current, refF.current], { clearProps: "all" });
      gsap.set(refP.current, { clearProps: "all" });
      gsap.set(refO.current, { clearProps: "all" });
      const span = refP.current?.querySelector("span");
      if (span) gsap.set(span, { opacity: 0 });

      // 3. Measure after DOM settles
      const pRect = refP.current.getBoundingClientRect();
      const oRect = refO.current.getBoundingClientRect();

      const pWidth = pRect.width;
      const oWidth = oRect.width;

      // Gap = full width of OINT (space between P right edge and O left edge)
      const gap = oRect.left - pRect.right;

      // P shifts right by its own full width
      // O shifts left by a third of its own width
      // Together they converge symmetrically toward the navbar center
      const pShift = pWidth;
      const oShift = -(oWidth / 3.5);

      // 4. Build timeline
      scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=400",
          scrub: true,
        },
      });

      // // Phase 1—fade OINT + F out
      // scrollTl.to(
      //   [refOINT.current, refF.current],
      //   { opacity: 0, ease: "power2.out", duration: 0.5 },
      //   0
      // );

      // Phase 2—collapse OINT width
      scrollTl.to(
        refOINT.current,
        { width: 0, opacity: 0, ease: "power2.inOut", duration: 0.5 },
        0.5
      );

      // Phase 2—collapse F width
      scrollTl.to(
        refF.current,
        { width: 0, opacity: 0, ease: "power2.inOut", duration: 0.5 },
        0.5
      );

      // Phase 2—P: move right + rise up
      scrollTl.to(
        refP.current,
        { x: pShift, y: "-80%", ease: "power2.inOut", duration: 0.5 },
        0.5
      );

      // Phase 2—dot under P fades in
      if (span) {
        scrollTl.to(
          span,
          { opacity: 1, ease: "power2.inOut", duration: 0.5 },
          0.5
        );
      }

      // Phase 2—O: nudge left to close the gap
      scrollTl.to(
        refO.current,
        { x: oShift, ease: "power2.inOut", duration: 0.5 },
        0.5
      );

      // Keep other triggers accurate after layout-affecting transforms.
      ScrollTrigger.refresh();
    };

    // Small debounce on resize to avoid thrashing
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildTimeline, 100);
    };

    buildTimeline();

    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.documentElement);

    return () => {
      clearTimeout(resizeTimer);
      if (scrollTl) {
        scrollTl.scrollTrigger?.kill();
        scrollTl.kill();
      }
      resizeObserver.disconnect();
    };
  }, []);

  const isHome = pathname === "/";
  const gradientEnabled = pathname !== "/work" && showNavGradient;

  return (
    <>
      {/* Home nav uses mix-blend-difference, which cancels a black gradient on
          the nav itself, so render the gradient as its own layer underneath. */}
      {isHome && (
        <div
          aria-hidden="true"
          className={`nav-gradient fixed top-0 left-0 w-full h-16 sm:h-20 z-49 pointer-events-none transition-opacity duration-500 ease-out ${
            gradientEnabled && !navGradientSuppressed && !landingActive
              ? "opacity-100"
              : "opacity-0"
          }`}
        />
      )}
      <nav
        id="site-nav"
        className={`fixed top-0 left-0 w-full z-50 text-foreground transition-opacity duration-200 ease-out ${
          gradientEnabled && !isHome ? "nav-gradient" : ""
        } ${isHome && !menuOpen ? "mix-blend-difference" : ""} ${
          landingActive ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="relative z-30 flex items-center justify-between h-16 sm:h-20 px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20">
          {/* Left spacer so hamburger doesn't shift center */}
          <div className="w-10 sm:w-12 md:w-0" />

          {/* Mobile/Tablet logo (single image, centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setMenuOpen(false)}
              title="Go to homepage"
            >
              <Image
                src="/logo/logo.png"
                alt="Point Of"
                width={140}
                height={40}
                priority
                className={logoImgClass("h-3")}
              />
            </Link>
          </div>

          {/* Desktop logo (animated, centered) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setMenuOpen(false)}
              ref={logoRef}
              title="Go to homepage"
            >
              {/* P */}
              <div ref={refP} className="relative shrink-0">
                <Image
                  src="/logo/p.png"
                  alt="P"
                  width={180}
                  height={100}
                  className={logoImgClass("h-4 sm:h-[15px] xl:h-[18px]")}
                  priority
                />
                <span
                  className={`absolute left-0 opacity-0 top-full mt-1 w-1 h-1 inline-block rounded-full transition-colors duration-500 ease-in-out ${
                    darkNavTreatment ? "bg-background" : "bg-heading"
                  }`}
                />
              </div>

              {/* OINT—fades then collapses */}
              <div
                ref={refOINT}
                className="shrink-0 overflow-hidden"
                style={{ whiteSpace: "nowrap" }}
              >
                <Image
                  src="/logo/oint.png"
                  alt="OINT"
                  width={180}
                  height={100}
                  className={logoImgClass("h-4 sm:h-[15px] xl:h-[18px]")}
                  priority
                />
              </div>

              {/* O */}
              <div ref={refO} className="shrink-0">
                <Image
                  src="/logo/o.png"
                  alt="O"
                  width={180}
                  height={100}
                  className={logoImgClass("h-4 sm:h-[15px] xl:h-[18px]")}
                  priority
                />
              </div>

              {/* F—fades then collapses */}
              <div ref={refF} className="shrink-0 overflow-hidden">
                <Image
                  src="/logo/f.png"
                  alt="F"
                  width={180}
                  height={100}
                  className={logoImgClass("h-4 sm:h-[15px] xl:h-[18px]")}
                  priority
                />
              </div>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`
              w-3 h-3 sm:w-4.5 sm:h-4.5 rounded-full cursor-pointer
              border-2 transition-[background-color,border-color] duration-500 ease-in-out
              ${
                darkNavTreatment
                  ? "border-background bg-background hover:bg-background hover:border-background"
                  : "border-heading bg-transparent hover:bg-heading hover:border-heading"
              }
            `}
          />
        </div>

      </nav>
      <FullscreenMenu
        ref={navRef}
        pathname={pathname}
        setMenuOpen={setMenuOpen}
        socialLinks={socialLinks}
      />
    </>
  );
}