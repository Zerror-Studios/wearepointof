"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Button from "./Button";
import { handleHashLinkClick } from "@/helper/scrollToHash";

function isNavActive(pathname, href) {
  if (!pathname || !href) return false;
  if (pathname === href) return true;
  return href !== "/" && pathname.startsWith(`${href}/`);
}

const HOVER_X = 12;

const FullscreenMenu = React.forwardRef(function FullscreenMenu(
  { pathname, setMenuOpen, socialLinks },
  ref
) {
  const router = useRouter();
  const linkRefs = useRef([]);

  const animateLinkX = (el, x) => {
    if (!el) return;
    gsap.to(el, {
      x,
      duration: 0.65,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-40 bg-secondary text-background overflow-hidden flex items-stretch"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0 0%)" }}
    >
      <div className="w-full flex flex-col h-dvh px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 pt-24 pb-16 md:pt-24 md:pb-28 lg:py-24 overflow-y-auto overscroll-contain">
        {/* TOP — links stay top; email at bottom through iPad Pro, beside from xl */}
        <div className="flex flex-1 min-h-0 mb-10 md:mb-16 flex-col">
          <div className="flex flex-1 xl:flex-none flex-col items-start gap-8 xl:flex-row xl:items-end xl:justify-between xl:gap-12">
            {/* NAV LINKS */}
            <nav className="flex flex-col gap-3 sm:gap-4 md:gap-5 shrink-0">
              {[
                { name: "About", href: "/about" },
                { name: "Work", href: "/work" },
                { name: "Expertise", href: "/expertise" },
                { name: "Brands", href: "/brands" },
                { name: "Connect", href: "/connect" },
              ].map((item, i) => {
                const isActive = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={() => animateLinkX(linkRefs.current[i], HOVER_X)}
                    onMouseLeave={() => animateLinkX(linkRefs.current[i], 0)}
                    onFocus={() => animateLinkX(linkRefs.current[i], HOVER_X)}
                    onBlur={() => animateLinkX(linkRefs.current[i], 0)}
                    className={`group block w-fit heading-xl uppercase font-heading font-extralight tracking-tight cursor-pointer will-change-transform transition-colors duration-500 ease-out ${
                      isActive
                        ? "text-background opacity-100"
                        : "text-gray-600 opacity-100 hover:text-background"
                    }`}
                    title={item.name}
                  >
                    <span className="nav-item link-underline">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* EMAIL BUTTON */}
            <div className="nav-item shrink-0 self-start mt-auto xl:mt-0 xl:self-auto">
              <Button
                title={"think@wearepointof.com"}
                href="mailto:think@wearepointof.com"
                color="#000000"
                textClassName="!text-base sm:!text-2xl !lowercase !font-normal"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="nav-item border-t border-gray-400 pt-5 md:pt-7 flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-5 shrink-0">
          {/* SOCIAL LINKS */}
          <div className="flex flex-wrap gap-4 sm:gap-12">
            {(socialLinks ?? []).map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="link-underline text-base md:text-lg lg:text-sm text-background opacity-100 hover:text-background cursor-pointer transition-colors duration-200"
                title={item.name}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-12">
            {[
              { label: "SHOWREEL", href: "/expertise" },
              { label: "CAREERS", href: "/connect#join-our-team" },
              { label: "UNIVERSE", href: "/universe" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                scroll={!item.href.includes("#")}
                onClick={(e) => {
                  // Always close immediately; hash links will be handled by
                  // `handleHashLinkClick` and navigate via `router.push`.
                  setMenuOpen(false);

                  handleHashLinkClick(e, item.href, {
                    onNavigate: (path) => {
                      if (path) router.push(path);
                    },
                  });
                }}
                title={item.label}
              >
                <Button title={item.label} color="#000000" className="mt-0!" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default FullscreenMenu;
