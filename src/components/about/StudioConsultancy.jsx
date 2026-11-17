"use client";
import React from "react";
import { motion } from "framer-motion";

const items = [
  {
    title: "The Studio",
    tag: "0→1 (Foundation)",
    desc: "This is where brands are born. We take an idea—sometimes just a conviction and a name—and build it into something real. Strategy, positioning, identity, digital, print. The full creative foundation, built to hold weight from day one.",
  },
  {
    title: "The Consultancy",
    tag: "1→100 (Growth)",
    desc: "This is where brands grow. Once the foundation is set, we stay in—as creative partner, strategic counsel, and fractional CMO. Brand strategy, media production, social, campaigns, events, performance. Whatever the brand needs to scale, we're already in the room.",
  },
];

const StudioConsultancy = () => {
  return (
    <section className="w-full px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-x-6">
        <motion.h2
          className="md:col-span-5 font-heading font-light leading-[1.35] text-heading text-[21px] md:text-[22px] lg:text-[24px] xl:text-[1.8vw] max-w-[420px] xl:max-w-[26vw]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          We work with brands at two distinct moments, and across everything in between.
        </motion.h2>

        <div className="md:col-span-7 flex flex-col gap-12 md:gap-16 max-w-[740px]">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.15 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4 md:mb-5">
                <h3 className="heading-md uppercase text-heading">{item.title}</h3>
                <span aria-hidden="true" className="w-1 h-1 rounded-full bg-desc self-center" />
                <span className="para-acc text-desc">{item.tag}</span>
              </div>
              <p className="para-acc text-desc leading-[1.8]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudioConsultancy;
