"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import UniverseSidebar from "./UniverseSidebar";
import {
  universeIntro,
  findSlide,
  slidePath,
  slideHref,
  UNIVERSE_BASE,
} from "@/helper/universeData";
import { scrollToId } from "@/helper/universeScroll";
import { getExitPath } from "@/helper/universeExit";

const introIds = universeIntro.map((s) => s.id);

/*
  Shared frame for /universe and /universe/<slide>: sidebar (or drawer), main column and
  Close button. Rendered from app/universe/layout.js, so it stays mounted between pages.
*/

const UniverseNavContext = createContext(() => {});

// navigate(id): a slide id goes to that slide's page (or scrolls to it when it is already
// on screen); any other id is an anchor on the current page.
export const useUniverseNav = () => useContext(UniverseNavContext);

const UniverseShell = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Slide pages: the slug is the active slide. /universe: scroll-spy over slides 01-04.
  const pageSlide = pathname.startsWith(`${UNIVERSE_BASE}/`) ? pathname.slice(UNIVERSE_BASE.length + 1) : null;
  const [spyId, setSpyId] = useState(introIds[0]);
  const activeId = pageSlide ?? spyId;

  useEffect(() => {
    if (pageSlide) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSpyId(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    introIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pageSlide]);

  // Close the drawer whenever the page changes
  useEffect(() => setDrawerOpen(false), [pathname]);

  const navigate = useCallback(
    (id) => {
      setDrawerOpen(false);
      if (!id) return;
      const slide = findSlide(id);
      if (!slide) return scrollToId(id);
      if (slidePath(id) === pathname) {
        // Already on this slide's page: intro slides scroll to their section, pages to the top
        if (pageSlide) window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.2 }) : window.scrollTo({ top: 0, behavior: "smooth" });
        else scrollToId(id);
        return;
      }
      router.push(slideHref(id));
    },
    [pathname, pageSlide, router]
  );

  return (
    <UniverseNavContext.Provider value={navigate}>
      <div className="font-(family-name:--font-uni-mono)">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block fixed top-0 left-0 z-30 w-[287px] h-svh bg-[#080808]">
          <UniverseSidebar activeId={activeId} onNavigate={navigate} />
        </aside>

        {/* Close: Universe has no site navbar, this is the way back out */}
        <button
          type="button"
          onClick={() => router.push(getExitPath())}
          aria-label="Close Universe"
          title="Close Universe"
          className="fixed top-5 right-5 lg:top-[30px] lg:right-10 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-[#080808]/90 backdrop-blur px-4 py-2.5 text-[13px] text-[#E8E8E1] cursor-pointer transition-colors duration-300 hover:bg-[#2a2a2a]"
        >
          Close
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M1 1l8 8M9 1L1 9" />
          </svg>
        </button>

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

        {/* Slides size themselves off this column (cqw). Past 1640px their text has hit its max
            size while images and spacing would keep growing, so the column stops there and
            centres; backgrounds marked .uni-bg fade out at its sides. */}
        <main className="relative lg:ml-[287px] min-h-svh bg-[#141414] overflow-x-clip">
          <div className="@container relative mx-auto w-full max-w-[1640px] overflow-x-clip">{children}</div>
        </main>
      </div>
    </UniverseNavContext.Provider>
  );
};

export default UniverseShell;
