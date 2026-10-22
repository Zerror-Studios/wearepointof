"use client";
import React from "react";
import Button from "../common/Button";
import Image from "next/image";

const logos = [
  // { name: "Being Human", src: "/home/logos/Being Human.svg", width: 109, height: 78 },
  { name: "Casa Carigar", src: "/home/logos/Casa Carigar.svg", width: 210, height: 78 },
  { name: "Charagh Din", src: "/home/logos/Charagh Din.svg", width: 181, height: 78 },
  // { name: "Chhaya Jain", src: "/home/logos/Chhaya Jain.svg", width: 230, height: 44 },
  { name: "Gaurav Gupta", src: "/home/logos/Gaurav Gupta.svg", width: 230, height: 58 },
  { name: "Good Flipping Burgers", src: "/home/logos/Good Flippin Burgers.svg", width: 229, height: 78 },
  { name: "Goodrich Maritime", src: "/home/logos/Goodrich Maritime.svg", width: 230, height: 62 },
  // { name: "Groww", src: "/home/logos/Groww.svg", width: 230, height: 60 },
  { name: "House of Namah", src: "/home/logos/House of Namah.svg", width: 230, height: 58 },
  { name: "IDFC First Bank", src: "/home/logos/IDFC FIRST Bank.svg", width: 230, height: 62 },
  { name: "Inega Talent", src: "/home/logos/INEGA Talent.svg", width: 230, height: 63 },
  { name: "JBL", src: "/home/logos/JBL.svg", width: 141, height: 78 },
  { name: "KVAR", src: "/home/logos/KVAR.svg", width: 176, height: 78 },
  { name: "Label Ritu Kumar", src: "/home/logos/Label Ritu Kumar.svg", width: 162, height: 78 },
  { name: "Limelight Diamonds", src: "/home/logos/Limelight Diamonds.svg", width: 230, height: 34 },
  { name: "Mokobara", src: "/home/logos/Mokobara.svg", width: 230, height: 34 },
  // { name: "Orca Dive Club", src: "/home/logos/Orca Dive Club.svg", width: 91, height: 78 },
  { name: "Pepsi", src: "/home/logos/Pepsi.svg", width: 203, height: 78 },
  { name: "Rage Coffee", src: "/home/logos/Rage Coffee.svg", width: 162, height: 78 },
  { name: "Salman Khan Films", src: "/home/logos/Salman Khan Films.svg", width: 183, height: 78 },
  { name: "Skechers", src: "/home/logos/Skechers.svg", width: 230, height: 24 },
  // { name: "Talwalkers", src: "/home/logos/Talwalkars.svg", width: 86, height: 78 },
  { name: "TOD's", src: "/home/logos/TODs.svg", width: 230, height: 67 },
  { name: "Tripoto", src: "/home/logos/Tripoto.svg", width: 230, height: 65 },
  { name: "Voltas", src: "/home/logos/Voltas.svg", width: 230, height: 42 },
];

const BrandsSection = () => {
  return (
    <section className="w-full pt-24 sm:pt-28 md:pt-40 lg:pt-48 xl:pt-52 bg-background relative">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 flex flex-col items-start">
        <h2 className="heading-xl text-heading mb-4">Our partnerships</h2>
        <p className="heading-xl text-desc">
          Brands we have had the privilege of building with.
        </p>
        <Button title={"See all our brands"} className={"!mt-6 sm:!mt-8"} href="/brands" />
      </div>

      {/* Logo marquee — top gap matches space above the heading */}
      <div className="w-full pt-24 sm:pt-28 md:pt-40 lg:pt-48 xl:pt-52">
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background to-transparent" />

          {/* Changes: gap-24 md:gap-32 → gap-12 md:gap-16 | pr-24 md:pr-32 → pr-12 md:pr-16 | 30s → 50s | h-24 md:h-28 → h-16 md:h-20 | min-w reduced */}
          <div className="flex w-max animate-[marquee_50s_linear_infinite] items-center gap-8 sm:gap-16 md:gap-20 pr-8 sm:pr-16 md:pr-20 will-change-transform">
            {[...logos, ...logos].map((logo, idx) => (
              <div
                key={`${logo.src}-${idx}`}
                className="h-10 sm:h-14 w-fit shrink-0 flex items-center opacity-80 hover:opacity-100 transition-opacity"
              >
                <Image
                  width={logo.width}
                  height={logo.height}
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="h-full w-auto max-w-[6.5rem] sm:max-w-none object-contain"
                  style={{
                    width: `clamp(${Math.round(logo.width * 0.5)}px, ${Math.round(logo.width / 20)}rem, ${Math.round(logo.width * 0.7)}px)`,
                    maxHeight: "100%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;