"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const brands = [
  { name: "Sketchers", logo: "/brands/Logos/balanced-assets/Skechers.svg" },
  { name: "TODs", logo: "/brands/Logos/balanced-assets/TODs.svg" },
  { name: "Voltas", logo: "/brands/Logos/balanced-assets/Voltas.svg" },
  { name: "JBL", logo: "/brands/Logos/balanced-assets/JBL.svg" },
  { name: "PEPSI", logo: "/brands/Logos/balanced-assets/Pepsi.svg" },
  { name: "Being Human", logo: "/brands/Logos/balanced-assets/Being Human.svg" },
  { name: "Mokobara", logo: "/brands/Logos/balanced-assets/Mokobara.svg" },
  { name: "Gaurav Gupta", logo: "/brands/Logos/balanced-assets/Gaurav Gupta.svg" },
  { name: "IDFC First Bank", logo: "/brands/Logos/balanced-assets/IDFC FIRST Bank.svg" },
  { name: "Goodrich Maritime", logo: "/brands/Logos/balanced-assets/Goodrich Maritime.svg" },
  { name: "Limelight Diamonds", logo: "/brands/Logos/balanced-assets/Limelight Diamonds.svg" },
  { name: "Salman Khan Films", logo: "/brands/Logos/balanced-assets/Salman Khan Films.svg" },
  { name: "Label Ritu Kumar", logo: "/brands/Logos/balanced-assets/Label Ritu Kumar.svg" },
  { name: "House of Namah", logo: "/brands/Logos/balanced-assets/House of Namah.svg" },
  { name: "Casa Carigar", logo: "/brands/Logos/balanced-assets/Casa Carigar.svg" },
  { name: "Groww", logo: "/brands/Logos/balanced-assets/Groww.svg" },
  { name: "Rage Coffee", logo: "/brands/Logos/balanced-assets/Rage Coffee.svg" },
  { name: "Good Flipping Burgers", logo: "/brands/Logos/balanced-assets/Good Flippin Burgers.svg" },
  { name: "Talwalkers", logo: "/brands/Logos/balanced-assets/Talwalkars.svg" },
  { name: "Charagh Din", logo: "/brands/Logos/balanced-assets/Charagh Din.svg" },
  { name: "Tripoto", logo: "/brands/Logos/balanced-assets/Tripoto.svg" },
  { name: "KVAR", logo: "/brands/Logos/balanced-assets/KVAR.svg" },
  { name: "Chhaya Jain", logo: "/brands/Logos/balanced-assets/Chhaya Jain.svg" },
  { name: "Inega", logo: "/brands/Logos/balanced-assets/INEGA Talent.svg" },
  { name: "Orca Dive Club", logo: "/brands/Logos/balanced-assets/Orca Dive Club.svg" },
];

const SelectedBrands = () => {
  const itemRefs = useRef([]);

  useEffect(() => {
    const triggers = [];

    itemRefs.current.forEach((el) => {
      if (!el) return;

      const st = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scroller: "body",   // change to your custom scroller if needed
          start: "top 85%",
          end: "top 70%",
          scrub: 1,
        },
      });

      st.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      triggers.push(st.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <section className="min-h-screen w-full py-16 sm:py-20 md:py-28 lg:py-32 px-6 sm:px-8 md:px-12 lg:px-14 xl:px-20">
      <h2 className="mb-10 md:mb-12 heading-xl text-subheading">
        Selected Brands
      </h2>

      <div className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5">
        {brands.map((brand, index) => (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            className={[
              "group relative aspect-square border border-gray-300/40",
              brand.name === "Orca Dive Club" ? "max-xl:hidden" : "",
            ].join(" ")}
          >
            {/* Hover cover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 brightness-[0.8] transition-all duration-300 group-hover:opacity-100">
              <h2 className="heading-md text-heading">{brand.name}</h2>
            </div>

            {/* Logo */}
            <div className="flex h-full w-full items-center justify-center transition-all duration-800 group-hover:opacity-0">
              <Image
              width={100}
              height={100}
                src={brand.logo}
                alt={brand.name}
                sizes="(max-width: 640px) 30vw, (max-width: 768px) 20vw, 12vw"
                className="w-full h-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SelectedBrands;