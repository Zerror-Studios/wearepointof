"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UniverseSidebar from "./UniverseSidebar";
import { CoverSlide, ManifestoSlide, WhatIsABrandSlide, ImmersionsSlide } from "./UniverseSlides";
import BrandStrategySlide from "./BrandStrategySlide";
import { universeSlides } from "@/helper/universeData";
import { scrollToId } from "@/helper/universeScroll";

const TOTAL = universeSlides.length;
const readyIds = universeSlides.filter((s) => s.ready).map((s) => s.id);

const UniverseShell = () => {
  const [activeId, setActiveId] = useState(readyIds[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Scroll-spy: the slide crossing the middle of the viewport is active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    readyIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navigate = useCallback((id) => {
    setDrawerOpen(false);
    scrollToId(id);
  }, []);

  const index = universeSlides.findIndex((s) => s.id === activeId) + 1;

  return (
    <div className="font-(family-name:--font-uni-mono)">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 z-30 w-[287px] h-svh bg-[#080808]">
        <UniverseSidebar activeId={activeId} onNavigate={navigate} />
      </aside>

      {/* Mobile / tablet: sidebar as a drawer */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-expanded={drawerOpen}
        aria-controls="universe-drawer"
        className="lg:hidden fixed bottom-5 left-5 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-[#080808]/90 backdrop-blur px-4 py-2.5 text-[13px] text-[#E8E8E1] cursor-pointer"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#E8E8E1]" />
        Sections
      </button>
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-[45] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              id="universe-drawer"
              className="lg:hidden fixed top-0 left-0 z-[46] w-[287px] max-w-[85vw] h-svh bg-[#080808]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            >
              <UniverseSidebar activeId={activeId} onNavigate={navigate} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="@container relative lg:ml-[287px] min-h-svh bg-[#141414] overflow-x-clip">
        <CoverSlide onNext={() => navigate("manifesto")} />
        <ManifestoSlide />
        <WhatIsABrandSlide />
        <ImmersionsSlide />
        <BrandStrategySlide onNavigate={navigate} />
      </main>

      {/* Slide counter */}
      <p
        aria-live="polite"
        className="hidden lg:block fixed z-30 right-[100px] bottom-[52px] text-[15px] tracking-[0.5px] text-[#E8E8E1] tabular-nums pointer-events-none"
      >
        {String(index).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </p>
    </div>
  );
};

export default UniverseShell;
