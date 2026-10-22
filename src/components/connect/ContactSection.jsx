"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GetInTouch from "./GetInTouch";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const rootRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    if (!root || !line) return;

    // Line runs from the hero CTA's dot down to the "Email" label, measured so it fits every viewport.
    // Section top == root top while unstuck, so hero positions are taken in document space.
    const section = root.querySelector("#contact-section");
    const emailLabel = root.querySelector("[data-email-label]");
    const heroCta = root.previousElementSibling?.querySelector("[data-hero-cta]");
    const GAP = 12;

    const layoutLine = () => {
      if (!section || !emailLabel || !heroCta) return;
      const ctaDot = heroCta.querySelector(".rounded-full") ?? heroCta;
      const dotRect = ctaDot.getBoundingClientRect();
      const ctaRect = heroCta.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      // Ignore the hero's intro slide-up offset on the CTA
      const ctaBottom = ctaRect.bottom + window.scrollY - (Number(gsap.getProperty(heroCta, "y")) || 0);
      const top = ctaBottom + GAP - rootTop;
      const bottom = emailLabel.getBoundingClientRect().top - sectionRect.top - GAP;

      line.style.top = `${top}px`;
      line.style.height = `${Math.max(bottom - top, 0)}px`;
      line.style.left = `${dotRect.left + dotRect.width / 2 - sectionRect.left}px`;
    };

    layoutLine();
    ScrollTrigger.addEventListener("refreshInit", layoutLine);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: root,
            start: "top 90%",
            end: "top 30%",
            scrub: 0.3,
          },
        }
      );
    }, root);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", layoutLine);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative z-[6] md:h-[200vh] -mt-[14svh] md:-mt-[22svh] xl:mt-0">
      {/* Below xl the hero CTA sits mid-screen, so this block is pulled up over the hero's empty
          lower part. z-[6] keeps it above the hero's bottom fade (z-5). */}

      {/* Sticky—Contact */}
      <div className="h-auto md:sticky md:top-0 md:h-screen z-10">
        <section id="contact-section" className="md:h-screen w-full relative">
          <div className="h-full flex items-start xl:items-center">
            <div className="w-full px-6 sm:px-10 md:pl-12 xl:pl-80 2xl:pl-120 md:pr-6 md:pt-[14vh] xl:pt-0 pb-16 sm:pb-20">

              {/* Scroll-animated vertical line */}
              <div
                ref={lineRef}
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                className="w-px z-30 bg-linear-to-b from-transparent to-foreground absolute pointer-events-none"
              >
                <span className="w-[3px] h-[3px] bg-foreground rounded-full absolute bottom-0 left-1/2 -translate-x-1/2" />
              </div>

              {/* Email */}
              <div className="mb-10 sm:mb-12 md:mb-16">
                <p data-email-label className="para text-desc mb-3 md:mb-2">Email</p>
                <h2 className="heading-xl text-subheading break-words">
                  <a
                    href="mailto:think@wearepointof.com"
                    title="Email Point Of"
                    className="transition-colors duration-200 hover:text-heading"
                  >
                    think@wearepointof.com
                  </a>
                </h2>
              </div>

              {/* Bottom Grid */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-8 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-20 [&_.para]:text-sm [&_.para]:md:text-base [&_.para]:lg:text-base [&_.para]:xl:text-base">
                <div className="w-fit">
                  <h3 className="heading-md text-subheading mb-3 md:mb-4">Contact</h3>
                  <a
                    href="https://wa.me/919167991888"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    className="para text-desc mb-2 block transition-colors duration-200 hover:text-heading"
                  >
                    (+91) 91679 91888
                  </a>
                  <a
                    href="https://wa.me/919167991888"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    className="para text-desc flex items-center gap-2 transition-colors duration-200 hover:text-heading"
                  >
                    WhatsApp
                  </a>
                </div>

                <a
                  href="https://maps.app.goo.gl/kT1qQH69GXNvwQqB6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-fit"
                  title="Open Mumbai office in Google Maps"
                >
                  <h3 className="heading-md text-subheading mb-3 md:mb-4 transition-colors duration-200 group-hover:text-heading">Mumbai, India</h3>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">Vaswani Chambers,</p>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">Dr Annie Besant Rd, Worli,</p>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">Mumbai, MH 400030</p>
                </a>

                <a
                  href="https://maps.app.goo.gl/Fqe7dUF8b8McqXdt6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-fit"
                  title="Open Barcelona office in Google Maps"
                >
                  <h3 className="heading-md text-subheading mb-3 md:mb-4 transition-colors duration-200 group-hover:text-heading">Barcelona, Spain</h3>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">Carrer de Girona 179,</p>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">Eixample, Barcelona</p>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">Catalunya 08037</p>
                </a>

                <a
                  href="https://maps.app.goo.gl/bAnZraZc83nM5eLB7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-fit"
                  title="Open Austin office in Google Maps"
                >
                  <h3 className="heading-md text-subheading mb-3 md:mb-4 transition-colors duration-200 group-hover:text-heading">Austin, USA</h3>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">Point Of Action LLC</p>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">701 Tillery Street</p>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">Unit 12, Suite 1996</p>
                  <p className="para text-desc transition-colors duration-200 group-hover:text-heading">Austin TX 78702</p>
                </a>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* Absolute—GetInTouch slides up over Contact */}
      <div className="w-full h-auto md:absolute md:bottom-0 md:left-0 md:h-screen z-20">
        <GetInTouch />
      </div>

    </div>
  );
};

export default ContactSection;