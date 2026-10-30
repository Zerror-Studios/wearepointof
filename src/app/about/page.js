import React from "react";
import Experience from "@/components/about/Experience";
import FoundersSection from "@/components/about/FoundersSection";
import GridSection from "@/components/about/GridSection";
import HeroSection from "@/components/about/HeroSection";
import OurValues from "@/components/about/OurValues";
import CTASection from "@/components/home/CTASection";
import StudioConsultancy from "@/components/about/StudioConsultancy";
import OfficesSection from "@/components/about/OfficesSection";
import { foundersData, teamImages, cultureValues } from "@/helper/aboutData";

export const metadata = {
  title: "About",
  description:
    "Point Of is an independent brand & strategic design consultancy. Meet the studio, our values, and the people behind the work.",
  keywords: ["Point Of", "About", "Design studio", "Brand strategy", "Mumbai", "Consultancy"],
  alternates: { canonical: "/about" },
};

const heroLines = [
  { body: "Most brands miss the point." },
  { body: "We build the ones that don't." },
];

const Studio = () => {
  return (
    <>
      <HeroSection
        useGradientBlinds
        lines={heroLines}
        btntitle={"OUR BRANDS"}
        href="/brands"
        enableTextParallax={true}
      />
      <Experience />
      <StudioConsultancy />
      <FoundersSection data={foundersData} team={teamImages} />
      <OfficesSection />
      <OurValues />
      <GridSection
        title={
          <>
            Driven by Design. <br /> Defined by Culture.
          </>
        }
        data={cultureValues}
      />
      <CTASection
        heading={<>Every brand has a moment that defines it.
          <br />
          We find it, build it, and stay
          <br />
          for what comes next.
        </>}
        buttonTitle={"Let's find yours"}
      />
    </>
  );
};

export default Studio;
