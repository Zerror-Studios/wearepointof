"use client";

import React from "react";
import { Spiral as Hamburger } from "hamburger-react";

export default function WorkFilterPanel({
  filterOverlayRef,
  filterPanelRef,
  isFilterOpen,
  setIsFilterOpen,
  filterOptions,
  activeFilters,
  toggleFilterItem,
  viewCount,
  onApply,
  onReset,
}) {
  return (
    <div
      ref={filterOverlayRef}
      className="fixed inset-0 w-full h-dvh flex items-end opacity-0 pointer-events-none bg-background/30 backdrop-blur-xs z-60"
    >
      <div
        ref={filterPanelRef}
        className="w-full h-dvh md:h-[55vh] relative bg-background will-change-transform"
        data-lenis-prevent
      >
        <div className="h-full w-full p-6 sm:p-10 md:px-12 lg:px-14 xl:px-20 md:py-8 text-white flex flex-col">
          <div className="absolute top-3 right-1 sm:right-10 lg:right-14 z-10">
            <Hamburger
              size={20}
              toggled={isFilterOpen}
              toggle={setIsFilterOpen}
              label="Close filter"
            />
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain pr-1 pb-28 md:pb-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-16">
              <div className="text-heading text-sm md:text-lg tracking-wide">Filter by:</div>

              <div>
                <div className="text-desc text-xs md:text-base tracking-wide mb-4">Services</div>
                <ul className="filter-ul space-y-2 text-sm text-heading">
                  {filterOptions.services.map((label) => (
                    <li
                      key={label}
                      className={`hover:text-white cursor-pointer w-fit ${
                        activeFilters.services.has(label) ? "active" : ""
                      }`}
                      onClick={() => toggleFilterItem("services", label)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") toggleFilterItem("services", label);
                      }}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-desc text-xs md:text-base tracking-wide mb-4">Industry</div>
                <ul className="filter-ul space-y-2 text-sm text-heading">
                  {filterOptions.industry.map((label) => (
                    <li
                      key={label}
                      className={`hover:text-white cursor-pointer w-fit ${
                        activeFilters.industry.has(label) ? "active" : ""
                      }`}
                      onClick={() => toggleFilterItem("industry", label)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") toggleFilterItem("industry", label);
                      }}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="absolute md:static bottom-0 left-0 right-0">
            <div className="px-6 sm:px-10 md:px-0 py-6 md:p-0 bg-background/90 backdrop-blur-sm md:bg-transparent md:backdrop-blur-0 flex items-center justify-between">
              <button
                type="button"
                className="heading-md text-heading transition-colors cursor-pointer"
                onClick={onApply}
              >
                View {viewCount} projects →
              </button>
              <button
                type="button"
                className="heading-md text-heading transition-colors cursor-pointer"
                onClick={onReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

