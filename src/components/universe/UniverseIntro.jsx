"use client";
import React from "react";
import HashScrollToId from "@/components/common/HashScrollToId";
import { CoverSlide, ManifestoSlide, WhatIsABrandSlide, ImmersionsSlide } from "./UniverseSlides";
import SlidePager from "./SlidePager";
import { useUniverseNav } from "./UniverseShell";

/* /universe: slides 01-04 as one scrolling page, then a link on to slide 05 */
const UniverseIntro = () => {
  const navigate = useUniverseNav();
  return (
    <>
      {/* /universe#manifesto etc. (from the sidebar on a slide page) lands on that section */}
      <HashScrollToId offset={0} />
      <CoverSlide onNext={() => navigate("manifesto")} />
      <ManifestoSlide />
      <WhatIsABrandSlide />
      <ImmersionsSlide />
      <SlidePager from="cover" to="immersions" />
    </>
  );
};

export default UniverseIntro;
