"use client";

import React from "react";
import OverviewSection from "./OverviewSection";
import CaseStudyMedia from "./CaseStudyMedia";
import { getCaseStudyAssets, hasCaseStudyAssets } from "./caseStudyAssets";

const layouts = {
  4: [
    { grid: "lg:col-span-2 lg:row-span-2", single: false },
    { grid: "lg:col-span-2 lg:row-span-2", single: false },
    { grid: "lg:col-span-2 lg:row-span-2", single: false },
    { grid: "lg:col-span-2 lg:row-span-2", single: false },
  ],
  5: [
    { grid: "lg:col-span-2 lg:row-span-2", single: false },
    { grid: "lg:col-span-2 lg:row-span-2", single: false },
    { grid: "lg:col-span-2 lg:row-span-2", single: false },
    { grid: "lg:row-span-2", single: true },
    { grid: "lg:row-span-2", single: true },
  ],
  6: [
    { grid: "lg:row-span-2", single: true },
    { grid: "lg:row-span-2", single: true },
    { grid: "lg:col-span-2 lg:row-span-2", single: false },
    { grid: "lg:col-span-2 lg:row-span-2", single: false },
    { grid: "lg:row-span-2", single: true },
    { grid: "lg:row-span-2", single: true },
  ],
};

const Overview = ({ caseStudy }) => {
  const assets = getCaseStudyAssets(caseStudy);
  const hasAssets = hasCaseStudyAssets(caseStudy);
  const caseStudyTitle = caseStudy?.title || caseStudy?.name || "Case study";

  const count = hasAssets ? assets.length : 4;
  const gridClasses = layouts[count] ?? layouts[4];
  const slots = hasAssets ? assets : Array.from({ length: 4 }, () => "");

  return (
    <section className="w-full">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 md:auto-rows-[220px] lg:auto-rows-[250px]"
      >
        {slots.map((src, index) => {
          const { grid, single } = gridClasses[index] ?? gridClasses[0];
          const wrapperClassName = single
            ? "w-full h-full lg:h-1/2"
            : "w-full h-full min-h-full";
          return (
            <div key={index} className={`overflow-hidden ${grid}`}>
              <CaseStudyMedia
                src={src}
                alt={`${caseStudyTitle}—overview image ${index + 1}`}
                wrapperClassName={wrapperClassName}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
      <OverviewSection caseStudy={caseStudy} />
    </section>
  );
};

export default Overview;
