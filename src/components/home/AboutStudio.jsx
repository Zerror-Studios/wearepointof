"use client";

import React, { useLayoutEffect, useRef } from "react";
import Button from "../common/Button";
import SplitType from "split-type";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const AboutStudio = () => {
  const sectionRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const router = useRouter();

  useLayoutEffect(() => {
    if (!sectionRef.current || !p1Ref.current || !p2Ref.current) return;

    const isMobile = window.matchMedia("(max-width: 1279px)").matches;

    const ctx = gsap.context(() => {
      const circle2 = document.querySelector("#circle2");

      const split1 = new SplitType(p1Ref.current, {
        types: "words",
        wordClass: "word",
      });

      const split2 = new SplitType(p2Ref.current, {
        types: "words",
        wordClass: "word",
      });

      const words = gsap.utils.toArray([
        ...(p1Ref.current?.querySelectorAll?.(".word") || []),
        ...(p2Ref.current?.querySelectorAll?.(".word") || []),
      ]);

      // ── MOBILE: no pin, auto height, words animate as you scroll ──────────
      if (isMobile) {
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }).to(words, {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
        });

        return () => {
          split1.revert();
          split2.revert();
        };
      }

      // ── DESKTOP: full-size circle at bottom center, pin, shrink while sticky, then hand off ──
      if (circle2) {
        gsap.set(circle2, {
          position: "fixed",
          left: "50%",
          top: "80%",
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          width: "200vw",
          height: "200vw",
          scale: 1,
          opacity: 0,
          autoRound: false,
          zIndex: 0,
        });
      }

      const snapCircleSmall = () => {
        if (!circle2) return;
        gsap.set(circle2, {
          position: "fixed",
          left: "50%",
          top: "80%",
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          width: 20,
          height: 20,
          scale: 1,
          opacity: 1,
          autoRound: false,
          // Above Expertise bg so the dot never vanishes between sections
          zIndex: 40,
        });
      };

      // Hide the navbar gradient from when the circle starts fading in
      // until the About section stops being sticky (pin ends).
      let fadeTl;
      let pinTl;
      let gradientHidden = false;
      const syncNavGradient = () => {
        if (!fadeTl || !pinTl) return;
        const hidden = fadeTl.progress() > 0 && pinTl.scrollTrigger.progress < 1;
        if (hidden === gradientHidden) return;
        gradientHidden = hidden;
        window.dispatchEvent(
          new CustomEvent("nav-gradient:suppress", { detail: { suppressed: hidden } })
        );
      };

      fadeTl = gsap.timeline({
        onUpdate: syncNavGradient,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 20%",
          end: "top 0%",
          scrub: 0.5,
        },
      }).to(circle2, {
        opacity: 1,
        ease: "power2.out",
        duration: 1,
      });

      // Pin: 1) text fill → 2) slow shrink → 3) hold small while still sticky
      pinTl = gsap.timeline({
        onUpdate: syncNavGradient,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=360%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            if (self.pin) self.pin.style.overflow = "visible";
            if (self.pin?.parentNode) self.pin.parentNode.style.overflow = "visible";
          },
          onLeave: () => {
            snapCircleSmall();
            syncNavGradient();
          },
          onEnterBack: () => {
            syncNavGradient();
            if (circle2) {
              gsap.set(circle2, {
                left: "50%",
                top: "80%",
                xPercent: -50,
                yPercent: -50,
                opacity: 1,
                zIndex: 0,
              });
            }
          },
        },
      })
        .to(words, {
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "none",
        })
        .to(circle2, {
          width: 20,
          height: 20,
          duration: 3.2,
          ease: "power1.inOut",
          autoRound: false,
        })
        .to({}, { duration: 0.7 });

      return () => {
        split1.revert();
        split2.revert();
        if (gradientHidden) {
          window.dispatchEvent(
            new CustomEvent("nav-gradient:suppress", { detail: { suppressed: false } })
          );
        }
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      id="page2"
      className="relative w-full mix-blend-difference px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 py-6 sm:py-10 md:py-16 lg:py-20 xl:py-24 flex flex-col justify-center xl:h-screen"
    >
      <div className="mx-auto">
        <div className="max-w-5xl space-y-12">
          <p
            ref={p1Ref}
            className="relative z-12 heading-xl text-heading [font-kerning:none]"
          >
            Point Of is an independent consultancy based in Mumbai, rethinking
            how brands connect with culture and people.
          </p>

          <p
            ref={p2Ref}
            className="relative z-12 heading-xl text-heading [font-kerning:none]"
          >
            We work at the intersection of design, strategy, and
            technology—crafting identities that balance innovation with timeless
            storytelling. Building for India and beyond.
          </p>
        </div>

        <Button
          title={"Explore our Work"}
          onClick={() => {
            router.push("/about");
          }}
        />
      </div>
    </div>
  );
};

export default AboutStudio;
