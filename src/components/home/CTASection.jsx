"use client";
import React, { useEffect, useRef } from "react";
import Button from "../common/Button";
import Image from "next/image";
const CTASection = ({
  heading = (
    <>
      Got a project in mind?
      <br />
      Learn how we can help.
    </>
  ),
  buttonTitle = "LET’S TALK",
  graphic = false,
  br = false,
  href = "/connect",
  paddingClass = "py-16 sm:py-20 md:py-28 lg:py-32",
} = {}) => {
  const graphicRef = useRef(null);

  useEffect(() => {
    if (!graphic) return;
    if (typeof window === "undefined") return;
    // Desktop-only to avoid touch jank.
    if (window.innerWidth < 1280) return;

    const el = graphicRef.current;
    if (!el) return;

    let raf = 0;
    let latest = { x: 0, y: 0 };

    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1..1
      const dy = (e.clientY - cy) / cy; // -1..1

      // Small offsets for subtle parallax.
      latest = { x: dx * 14, y: dy * 14 };
      if (raf) return;

      raf = window.requestAnimationFrame(() => {
        raf = 0;
        el.style.transform = `translate3d(${latest.x}px, ${latest.y}px, 0)`;
      });
    };

    const reset = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      el.style.transform = "translate3d(0px, 0px, 0)";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", reset);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", reset);
      reset();
    };
  }, [graphic]);

  return (
    <section
      className={`w-full bg-background relative flex items-center justify-center px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 ${paddingClass}`}
    >
      <div className="w-full text-left flex flex-col items-start sm:w-auto sm:text-center sm:items-center">
        {/* HEADING */}
        <p className={`heading-xl text-desc ${!br ? '[&_br]:hidden':'' } sm:[&_br]:block`}>{heading}</p>
        {/* CTA */}
        <Button title={buttonTitle} href={href} />
        {graphic && (
        <Image
          ref={graphicRef}
          src="/expertise/graphic_expertise.webp"
          alt="graphic_expertise"
          width={1000}
          height={1000}
          className="hidden sm:block w-40 h-40 md:w-48 md:h-48 xl:w-56 xl:h-56 object-contain mt-12 md:mt-16 xl:mt-20 will-change-transform"
        />
        )}
      </div>

    </section>
  );
};

export default CTASection;
