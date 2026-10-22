"use client";

import AboutStudio from "@/components/home/AboutStudio";
import Expertise from "@/components/home/Expertise";
import AccordionSection from "@/components/connect/AccordionSection";
import { expertiseItems } from "@/helper/expertise-items";

/**
 * Single continuous block for About → Expertise so the shared circle
 * stays in one stacking context (avoids white flash / missing handoff).
 */
export default function AboutExpertiseSection() {
  return (
    <section id="about-expertise" className="relative w-full">
      {/* Shared circle behind About (mix-blend) then travels into Expertise */}
      <div
        id="circle2"
        className="hidden xl:block fixed w-[200vw] h-[200vw] opacity-0 bg-secondary rounded-full pointer-events-none top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <AboutStudio />

      {/* Mobile / tablet / iPad Pro: accordion */}
      <div className="xl:hidden relative z-[1] bg-background">
        <AccordionSection
          padding="footer"
          flushBottom
          title="Expertise"
          data={expertiseItems.map((it) => ({
            title: it.title,
            description: it.content,
          }))}
        />
      </div>

      <div className="hidden xl:block relative z-[1]">
        <Expertise />
      </div>
    </section>
  );
}
