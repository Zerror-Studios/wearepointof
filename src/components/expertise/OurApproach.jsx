"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OurApproach = () => {
    const containerRef = useRef(null);
    const mobileTrackRef = useRef(null);
    const mobileProgressRef = useRef(null);
    const mobileDotRefs = useRef([]);

    useGSAP(() => {
        // ─── DESKTOP only (xl+) ───
        if (window.innerWidth >= 1280) {
            if (!containerRef.current) return;
            const aptl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#page4",
                    start: "top top",
                    end: "top -300%",
                    scrub: 1,
                    pin: true,
                },
            });

            aptl
                // STEP 1
                .fromTo(
                    "#page4 > h2, .approach-intro, .apr-circle2, .apr-circle3",
                    { opacity: 0 },
                    { opacity: 1, duration: 0.2 }
                )
                .set(".apr-circle1", { opacity: 1 })
                .fromTo(
                    "#step-three",
                    { backgroundColor: "transparent" },
                    { backgroundColor: "var(--light-line)", duration: 0.25 }
               
                )
                .to({}, { duration: 0.35 })
                // .apr-circle1 starts filled: it's where the OurProcess dot lands
                .fromTo(
                    ".approach1",
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 0.5 },
                    "a"
                )

                // STEP 2
                .fromTo(
                    ".approach2",
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 0.5 },
                    "b"
                )
                .fromTo(
                    ".step-loader-bar",
                    { width: "0%" },
                    { width: "50%", duration: 0.5 },
                    "b"
                )
                .fromTo(
                    ".apr-circle2",
                    { backgroundColor: "var(--light-line)", borderColor: "var(--light-line)" },
                    { backgroundColor: "var(--secondary)", borderColor: "var(--secondary)", duration: 0.2, delay: 0.5 },
                    "b"
                )
                .to(".apr-circle1-inner", { opacity: 0 }, "b")

                // STEP 3
                .fromTo(
                    ".approach3",
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 0.5 },
                    "c"
                )
                .fromTo(
                    ".step-loader-bar",
                    { width: "50%" },
                    { width: "100%", duration: 0.5 },
                    "c"
                )
                .fromTo(
                    ".apr-circle3",
                    { backgroundColor: "var(--light-line)", borderColor: "var(--light-line)" },
                    { backgroundColor: "var(--secondary)", borderColor: "var(--secondary)", duration: 0.2, delay: 0.5 },
                    "c"
                )

                // STEP 4
                .fromTo(
                    "#approach-content h5, #page4 > h2, .approach-intro, .step-loader-bar",
                    { opacity: 1 },
                    { opacity: 0, duration: 0.5 },
                    "d"
                )
                .fromTo(
                    "#step-three",
                    { backgroundColor: "var(--light-line)" },
                    { backgroundColor: "transparent", duration: 0.5 },
                    "d"
                )
                .set(".aprCir", {
                    borderColor: "var(--secondary)",
                    borderStyle: "solid",
                    borderWidth: 1,
                    opacity: 1,
                }, "d");

            // ── CENTER BLOOM ─────────────────────────────────────────
            const page4 = document.querySelector("#page4");
            const circles = document.querySelectorAll(".aprCir");
            const h2s = document.querySelectorAll("#approach-content h2");

            const page4Rect = page4.getBoundingClientRect();
            const centerX = page4Rect.left + page4Rect.width / 2 + window.scrollX;
            const centerY = page4Rect.top + page4Rect.height / 2 + window.scrollY;

            const offsets = [
                { x: -80, y: -40 },
                { x: 80, y: -40 },
                { x: 0, y: 80 },
            ];

            circles.forEach((circle, i) => {
                const rect = circle.getBoundingClientRect();
                const circleX = rect.left + circle.offsetWidth / 2 + window.scrollX;
                const circleY = rect.top + circle.offsetHeight / 2 + window.scrollY;

                aptl.to(
                    circle,
                    {
                        x: centerX - circleX + offsets[i].x,
                        y: centerY - circleY + offsets[i].y,
                        width: "30vw",
                        height: "30vw",
                        backgroundColor: "transparent",
                        transform: "translate(-50%, -50%)",
                        duration: 0.8,
                        ease: "power2.out",
                        delay: 0.5,
                    },
                    "d"
                );
            });

            h2s.forEach((h2, i) => {
                const rect = h2.getBoundingClientRect();
                const h2X = rect.left + rect.width / 2 + window.scrollX;
                const h2Y = rect.top + rect.height / 2 + window.scrollY;

                aptl.to(
                    h2,
                    {
                        x: centerX - h2X,
                        y: centerY - h2Y + i * 35,
                        duration: 0.8,
                        ease: "power2.out",
                        delay: 0.5,
                    },
                    "d"
                );
            });
        }

        // ─── MOBILE / TABLET (incl. iPad Pro): vertical progress + card fades ───
        if (window.innerWidth < 1280) {
            const track = mobileTrackRef.current;
            const progress = mobileProgressRef.current;
            const trackBg = track?.querySelector(".approach-mobile-track-bg");
            const dots = mobileDotRefs.current.filter(Boolean);
            const cards = gsap.utils.toArray(".approach-card-mobile");

            if (track && progress && trackBg && dots.length >= 2) {
                const layoutRail = () => {
                    const trackRect = track.getBoundingClientRect();
                    const first = dots[0].getBoundingClientRect();
                    const last = dots[dots.length - 1].getBoundingClientRect();
                    const top =
                        first.top + first.height / 2 - trackRect.top;
                    const bottom =
                        last.top + last.height / 2 - trackRect.top;
                    const height = Math.max(bottom - top, 0);

                    gsap.set([trackBg, progress], {
                        top,
                        height,
                        left: first.left + first.width / 2 - trackRect.left,
                    });
                };

                layoutRail();
                gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });
                gsap.set(dots, { backgroundColor: "#5a5a5a" });
                // First dot starts filled
                gsap.set(dots[0], { backgroundColor: "#E8E8E1" });

                gsap.to(progress, {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: dots[0],
                        endTrigger: dots[dots.length - 1],
                        start: "center 65%",
                        end: "center 65%",
                        scrub: 0.4,
                        invalidateOnRefresh: true,
                        onRefresh: layoutRail,
                        onUpdate: (self) => {
                            const p = self.progress;
                            // Fill each dot when the bar reaches it (0 → 1st, 0.5 → 2nd, 1 → 3rd)
                            dots.forEach((dot, i) => {
                                const threshold = i / (dots.length - 1);
                                gsap.set(dot, {
                                    backgroundColor:
                                        p >= threshold - 0.01 ? "#E8E8E1" : "#5a5a5a",
                                });
                            });
                        },
                    },
                });
            }

            cards.forEach((card) => {
                const content = card.querySelector(".approach-card-mobile-content");
                if (!content) return;
                gsap.fromTo(
                    content,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        }

    }, []);

    return (
        <>
            <style>{`
                .approach-desktop { display: flex; }
                .approach-mobile  { display: none;  }
                @media (max-width: 1279px) {
                    .approach-desktop { display: none  !important; }
                    .approach-mobile  { display: block !important; }
                }
                /* Same rendered size as the OurProcess dot (r 11 / 9 in a 741-wide SVG) */
                .approach-dot { width: calc(22 / 741 * 100vw); height: calc(22 / 741 * 100vw); }
                @media (min-width: 768px) {
                    .approach-dot {
                        width: calc(18 / 741 * min(92vw, 920px));
                        height: calc(18 / 741 * min(92vw, 920px));
                    }
                }
            `}</style>

            {/* ─── DESKTOP (original, completely unchanged) ─── */}
            <div
                id="page4"
                ref={containerRef}
                className="approach-desktop relative z-8 h-screen w-full flex-col justify-center px-[6vw] py-[2.3vw]"
            >
                <h2 className="heading-xl mb-4 text-heading">Our Approach</h2>
                <p className="approach-intro para text-desc max-w-2xl mb-[6vw]">
                  We work across three dimensions simultaneously—because strategy
                  without design is a document, and design without technology
                  doesn&apos;t scale.
                </p>

                <div id="approach-wrap" className="w-full">
                    <div
                        id="step-three"
                        className="relative mb-[4vw] h-[2px] w-[72%]"
                        style={{ backgroundColor: "transparent" }}
                    >
                        {/* Circle 1—left: 0, vertically centered with negative margin */}
                        <div
                            className="aprCir apr-circle1 absolute rounded-full origin-center"
                            style={{
                                left: 0,
                                top: "50%",
                                marginTop: -12.5,
                                width: 25,
                                height: 25,
                                backgroundColor: "var(--secondary)",
                                border: "1px solid var(--secondary)",
                            }}
                        >
                            <div
                                className="apr-circle1-inner h-full w-full rounded-full"
                                style={{
                                    backgroundColor: "var(--secondary)",
                                    border: "1px solid var(--secondary)",
                                }}
                            />
                        </div>

                        {/* Circle 2—centered, marginLeft instead of -translateX-1/2 */}
                        <div
                            className="aprCir apr-circle2 absolute rounded-full origin-center"
                            style={{
                                left: "50%",
                                marginLeft: -12.5,
                                top: "50%",
                                marginTop: -12.5,
                                width: 25,
                                height: 25,
                                backgroundColor: "var(--light-line)",
                                border: "1px solid var(--light-line)",
                            }}
                        />

                        {/* Circle 3—left-based positioning keeps the GSAP bloom aligned */}
                        <div
                            className="aprCir apr-circle3 absolute rounded-full origin-center"
                            style={{
                                left: "calc(100% - 25px)",
                                top: "50%",
                                marginTop: -12.5,
                                width: 25,
                                height: 25,
                                backgroundColor: "var(--light-line)",
                                border: "1px solid var(--light-line)",
                            }}
                        />

                        <div
                            className="step-loader-bar absolute left-0 top-0 h-full"
                            style={{ width: "0%", backgroundColor: "var(--secondary)" }}
                        />
                    </div>

                    <div
                        id="approach-content"
                        className="flex w-full items-start justify-between"
                    >
                        <div className="approach1 w-[28%] opacity-0">
                            <h2 className="heading-md mb-[2vw] w-fit">Strategy</h2>
                            <h5 className="para mb-[1vw] text-desc">
                                We collaborate closely to uncover your brand's vision,
                                audience, and market position—building a strategy that
                                drives real results.
                            </h5>
                            <h5 className="para2a para text-desc">
                                By the end, you'll have a clear roadmap to grow your
                                brand—whether it's industry disruption or becoming a
                                household name.
                            </h5>
                        </div>

                        <div className="approach2 w-[28%] opacity-0">
                            <h2 className="heading-md mb-[2vw] w-fit">Design</h2>
                            <h5 className="para mb-[1vw] text-desc">
                                Our bold, purpose-driven designs are crafted to make an
                                impact. From typography to color, everything is chosen to
                                communicate clearly and beautifully.
                            </h5>
                            <h5 className="para2a para text-desc">
                                We bring balance, clarity, and intention together to help
                                your brand stand out—and connect beyond first impressions.
                            </h5>
                        </div>

                        <div className="approach3 w-[28%] opacity-0">
                            <h2 className="heading-md mb-[2vw] w-fit">Technology</h2>
                            <h5 className="para mb-[1vw] text-desc">
                                Beyond aesthetics, we focus on how your brand performs
                                across platforms—crafting seamless, intelligent experiences
                                that adapt in real time.
                            </h5>
                            <h5 className="para2a para text-desc">
                                Guided by design and powered by AI, every interaction is
                                built for clarity, consistency, and connection across
                                screens, spaces, and systems.
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── MOBILE / TABLET ─── */}
            <div className="approach-mobile w-full px-6 sm:px-10 md:px-12 py-[14vw]">
                <h2 className="heading-xl mb-4 text-heading">Our Approach</h2>
                <p className="para text-desc max-w-2xl mb-[10vw]">
                  We work across three dimensions simultaneously—because strategy
                  without design is a document, and design without technology
                  doesn&apos;t scale.
                </p>

                <div ref={mobileTrackRef} className="relative">
                    {/* Vertical track — height set in JS from 1st → 3rd dot only */}
                    <div
                        className="approach-mobile-track-bg pointer-events-none absolute w-px -translate-x-1/2"
                        style={{ backgroundColor: "rgba(203,203,203,0.25)" }}
                        aria-hidden="true"
                    />
                    {/* Progress fill — stops at the 3rd dot */}
                    <div
                        ref={mobileProgressRef}
                        className="pointer-events-none absolute w-px origin-top -translate-x-1/2"
                        style={{
                            backgroundColor: "var(--secondary, #E8E8E1)",
                            transform: "scaleY(0)",
                        }}
                        aria-hidden="true"
                    />

                    {/* Card 1—Strategy */}
                    <div className="approach-card-mobile relative mb-[12vw] flex gap-5">
                        <div className="relative z-10 flex shrink-0 justify-center pt-[5px] md:pt-[3px]">
                            <span
                                ref={(el) => { mobileDotRefs.current[0] = el; }}
                                className="block approach-dot rounded-full"
                                style={{ backgroundColor: "#5a5a5a" }}
                            />
                        </div>
                        <div className="approach-card-mobile-content min-w-0 flex-1" style={{ opacity: 0 }}>
                            <h2 className="heading-md text-heading mb-2 md:mb-3 w-fit">Strategy</h2>
                            <h5 className="para mb-3 md:mb-4 text-desc">
                                We collaborate closely to uncover your brand&apos;s vision,
                                audience, and market position—building a strategy that
                                drives real results.
                            </h5>
                            <h5 className="para2a para text-desc">
                                By the end, you&apos;ll have a clear roadmap to grow your
                                brand—whether it&apos;s industry disruption or becoming a
                                household name.
                            </h5>
                        </div>
                    </div>

                    {/* Card 2—Design */}
                    <div className="approach-card-mobile relative mb-[12vw] flex gap-5">
                        <div className="relative z-10 flex shrink-0 justify-center pt-[5px] md:pt-[3px]">
                            <span
                                ref={(el) => { mobileDotRefs.current[1] = el; }}
                                className="block approach-dot rounded-full"
                                style={{ backgroundColor: "#5a5a5a" }}
                            />
                        </div>
                        <div className="approach-card-mobile-content min-w-0 flex-1" style={{ opacity: 0 }}>
                            <h2 className="heading-md text-heading mb-2 md:mb-3 w-fit">Design</h2>
                            <h5 className="para mb-3 md:mb-4 text-desc">
                                Our bold, purpose-driven designs are crafted to make an
                                impact. From typography to color, everything is chosen to
                                communicate clearly and beautifully.
                            </h5>
                            <h5 className="para2a para text-desc">
                                We bring balance, clarity, and intention together to help
                                your brand stand out—and connect beyond first impressions.
                            </h5>
                        </div>
                    </div>

                    {/* Card 3—Technology */}
                    <div className="approach-card-mobile relative flex gap-5">
                        <div className="relative z-10 flex shrink-0 justify-center pt-[5px] md:pt-[3px]">
                            <span
                                ref={(el) => { mobileDotRefs.current[2] = el; }}
                                className="block approach-dot rounded-full"
                                style={{ backgroundColor: "#5a5a5a" }}
                            />
                        </div>
                        <div className="approach-card-mobile-content min-w-0 flex-1" style={{ opacity: 0 }}>
                            <h2 className="heading-md text-heading mb-2 md:mb-3 w-fit">Technology</h2>
                            <h5 className="para mb-3 md:mb-4 text-desc">
                                Beyond aesthetics, we focus on how your brand performs
                                across platforms—crafting seamless, intelligent experiences
                                that adapt in real time.
                            </h5>
                            <h5 className="para2a para text-desc">
                                Guided by design and powered by AI, every interaction is
                                built for clarity, consistency, and connection across
                                screens, spaces, and systems.
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OurApproach;
