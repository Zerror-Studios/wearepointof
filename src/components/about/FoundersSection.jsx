
"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import ArrowButton from "../common/ArrowButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { IMAGE_PLACEHOLDER_BG } from "@/components/workDets/imagePlaceholder";

gsap.registerPlugin(ScrollTrigger);

// Hide trailing photos that would leave a partial last row at each breakpoint
// (grid is 2 / sm:3 / lg:6 columns). Class names are static so Tailwind picks them up.
const teamVisibility = (index, total) => {
  const fits = (cols) => index < total - (total % cols);
  return [
    fits(2) ? "block" : "hidden",
    fits(3) ? "sm:block" : "sm:hidden",
    fits(6) ? "lg:block" : "lg:hidden",
  ].join(" ");
};

const FoundersSection = ({ data, team = [] }) => {
  const rootRef = useRef(null);
  const mediaRefs = useRef([]);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      mediaRefs.current.filter(Boolean).forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement, // overflow-hidden image box
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="w-full px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 py-16 sm:py-20 md:py-28 lg:py-32">
      {/* Header: heading left, intro right */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 md:gap-12 mb-14 sm:mb-16 md:mb-24 lg:mb-32">
        <h2 className="heading-xl text-heading">Two minds. One vision</h2>
        <p className="para text-subheading leading-[1.35] md:max-w-[340px] lg:max-w-[440px] xl:max-w-[31vw] md:pt-2">
          Point Of was built by two people who see the same problem differently. Which is exactly why it works.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-4">
        {data.map((item, index) => (
          <div key={index} className="w-full">
            <motion.div
              className={`w-full aspect-square overflow-hidden mb-8 md:mb-10 ${IMAGE_PLACEHOLDER_BG}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.35 }}
            >
              <div
                ref={(el) => { mediaRefs.current[index] = el; }}
                className="w-full h-full will-change-transform"
              >
                <Image
                  width={1000}
                  height={1000}
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-full object-cover ${item.objectPosition}`}
                />
              </div>
            </motion.div>

            <h3 className="heading-lg font-light! text-heading mb-3 md:mb-4">
              {item.name}
            </h3>

            <p className="para-acc uppercase tracking-[0.5px] font-medium text-subheading mb-6 md:mb-8">
              {item.role}
            </p>

            <div className="para-acc leading-[1.8] text-desc space-y-4 md:pr-6 lg:pr-10">
              {String(item.desc ?? "")
                .split(/\n\s*\n/)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>

            <ArrowButton title={item.buttonText || "CONNECT"} link={item.link} />
          </div>
        ))}
      </div>

      {team.length > 0 && (
        <div className="mt-28 sm:mt-32 md:mt-40 lg:mt-56">
          <h2 className="heading-lg text-heading mb-12 sm:mb-16 md:mb-24 lg:mb-28">
            Many minds. One point of view.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className={`w-full aspect-4/5 overflow-hidden ${IMAGE_PLACEHOLDER_BG} ${teamVisibility(index, team.length)}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: (index % 6) * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Image
                  width={400}
                  height={500}
                  // Already pre-compressed WebPs—skip Next's second re-encode
                  unoptimized
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default FoundersSection;