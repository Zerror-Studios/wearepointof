"use client";
import React from "react";
import BrandStrategySlide from "./BrandStrategySlide";
import { PositioningSlide, VoiceSlide } from "./PositioningSlide";
import IdentityDesignSlide from "./IdentityDesignSlide";
import ColourTypographySlide from "./ColourTypographySlide";
import VisualLanguageSlide from "./VisualLanguageSlide";
import DeliverablesSlide from "./DeliverablesSlide";
import SlidePager from "./SlidePager";
import { useUniverseNav } from "./UniverseShell";

// One page per slide from 05 on; keys match the slide ids in universeData
const SLIDES = {
  "universe-and-core": BrandStrategySlide,
  "positioning-and-audience": PositioningSlide,
  "personality-and-voice": VoiceSlide,
  "identity-design": IdentityDesignSlide,
  "colour-and-typography": ColourTypographySlide,
  "visual-language": VisualLanguageSlide,
  deliverables: DeliverablesSlide,
};

const UniverseSlidePage = ({ slug }) => {
  const navigate = useUniverseNav();
  const Slide = SLIDES[slug];
  return (
    <>
      <Slide onNavigate={navigate} />
      <SlidePager from={slug} />
    </>
  );
};

export default UniverseSlidePage;
