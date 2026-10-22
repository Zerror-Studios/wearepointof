"use client";

import React, { useEffect, useRef } from "react";
import Tempus from "@studio-freight/tempus";
import Lenis from "@studio-freight/lenis";
import GridButton from "../common/GridButton";
import WorkCard from "./WorkCard";

export default function WorkGridOverlay({
  gridListRef,
  toggleGridList,
  toggleFilter,
  projects,
  isGridOpen,
}) {
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const col3Map = ["lg:justify-start", "lg:justify-center", "lg:justify-end"];
  const col2Map = ["md:justify-start", "md:justify-end"];

  useEffect(() => {
    const wrapper = gridListRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      wrapper,
      content,
      smoothWheel: !prefersReducedMotion,
      duration: prefersReducedMotion ? 0 : 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: "vertical",
      gestureOrientation: "vertical",
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenis.stop();
    lenisRef.current = lenis;

    const unsubscribe = Tempus.add((time) => {
      lenis.raf(time);
    });

    return () => {
      unsubscribe();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [gridListRef]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (isGridOpen) {
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
      lenis.resize();
    } else {
      lenis.stop();
    }
  }, [isGridOpen]);

  useEffect(() => {
    lenisRef.current?.resize();
  }, [projects]);

  return (
    <div
      id="grid-list"
      ref={gridListRef}
      className="w-full h-full bg-background absolute top-0 left-0 z-30 overflow-y-auto overscroll-contain touch-auto"
      style={{
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        WebkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        willChange: "clip-path",
      }}
      data-lenis-prevent
    >
      <div ref={contentRef}>
        <div className="nav-gradient pointer-events-none fixed inset-x-0 top-0 z-20 h-24" />
        <div className="nav-gradient nav-gradient-reverse pointer-events-none fixed inset-x-0 bottom-0 z-20 h-24" />

        <div className="w-full flex items-center justify-between fixed bottom-0 left-0 z-30 px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 pb-6 sm:pb-10 md:pb-10">
          <GridButton title={"GALLERY VIEW"} onClick={toggleGridList} className={"mt-0!"} />
          <GridButton title={"FILTER"} onClick={toggleFilter} className={"mt-0!"} />
        </div>

        {/* xl: rows are the 400px card + half the leftover viewport, so the gap between rows is half of
            what a full-screen row gave; the top/bottom padding keeps the first and last cards centred */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 lg:gap-0 lg:grid-cols-3 px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 pt-20 sm:pt-24 lg:pt-28 xl:pt-[calc(25vh-100px)] pb-24 sm:pb-28 lg:pb-28 xl:pb-[calc(25vh-100px)]">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className={`w-full h-auto py-10 sm:py-14 lg:py-20 xl:h-[calc(50vh+200px)] xl:py-0 flex items-center justify-center ${col2Map[index % 2]} ${col3Map[index % 3]}`}
            >
              <WorkCard
                slug={project.slug}
                title={project.name}
                image={project.coverImage}
                video={project.microanimation}
                enableFlipTransition
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
