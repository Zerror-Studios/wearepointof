"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const cities = [
  {
    name: "Mumbai",
    label: "HQ",
    tagline: "Where it began & where it builds.",
    x: 1112,
    y: 484,
  },
  {
    name: "Barcelona",
    label: "EU",
    tagline: "Design culture. Creative capital.",
    x: 921,
    y: 319,
  },
  {
    name: "Austin",
    label: "AMERICAS",
    tagline: "Strategy, growth & new frontiers.",
    x: 850,
    y: 153,
  },
];

/* ---------- Wireframe globe geometry (computed once, deterministic) ---------- */

const G = { cx: 1040, cy: 312, r: 250 };
const TILT = (29.3 * Math.PI) / 180; // centre latitude: shows the north pole near the top
const ROLL = (9.2 * Math.PI) / 180; // leans the axis slightly right, as in the design
const LON0 = (7 * Math.PI) / 180;
const deg = Math.PI / 180;
const round = (n) => Math.round(n * 10) / 10;

const project = (lat, lon) => {
  const l = lon - LON0;
  const x = Math.cos(lat) * Math.sin(l);
  const y = Math.cos(TILT) * Math.sin(lat) - Math.sin(TILT) * Math.cos(lat) * Math.cos(l);
  const z = Math.sin(TILT) * Math.sin(lat) + Math.cos(TILT) * Math.cos(lat) * Math.cos(l);
  const X = x * G.r;
  const Y = -y * G.r;
  return {
    x: round(G.cx + X * Math.cos(ROLL) - Y * Math.sin(ROLL)),
    y: round(G.cy + X * Math.sin(ROLL) + Y * Math.cos(ROLL)),
    visible: z > 0,
  };
};

// Turn a sampled line into path segments, keeping only the front hemisphere
const toPath = (points) => {
  let d = "";
  let drawing = false;
  for (const p of points) {
    if (!p.visible) {
      drawing = false;
      continue;
    }
    d += `${drawing ? "L" : "M"}${p.x},${p.y}`;
    drawing = true;
  }
  return d;
};

const range = (from, to, step) => {
  const out = [];
  for (let v = from; v <= to + 1e-9; v += step) out.push(v);
  return out;
};

const globeLines = [
  // Meridians every 15°
  ...range(0, 345, 15).map((lon) =>
    toPath(range(-90, 90, 3).map((lat) => project(lat * deg, lon * deg)))
  ),
  // Parallels every 15°
  ...range(-75, 75, 15).map((lat) =>
    toPath(range(0, 360, 3).map((lon) => project(lat * deg, lon * deg)))
  ),
].filter(Boolean);

const ORBIT = { cx: 1039, cy: 360, rx: 379, ry: 113, angle: -15 };
// Lower (front) half of the orbit, drawn over the globe
const orbitFront = (() => {
  const a = ORBIT.angle * deg;
  const pt = (lx) => [
    round(ORBIT.cx + lx * Math.cos(a)),
    round(ORBIT.cy + lx * Math.sin(a)),
  ];
  const [x1, y1] = pt(ORBIT.rx);
  const [x2, y2] = pt(-ORBIT.rx);
  return `M${x1},${y1} A${ORBIT.rx},${ORBIT.ry} ${ORBIT.angle} 0 1 ${x2},${y2}`;
})();

const Globe = ({ active, onSelect }) => (
  <svg
    viewBox="625 40 731 540"
    className="w-full h-auto overflow-visible"
    fill="none"
    role="img"
    aria-label="Globe marking our studios in Mumbai, Barcelona and Austin"
  >
    {/* Orbit (back half gets covered by the globe's black fill) */}
    <ellipse
      cx={ORBIT.cx}
      cy={ORBIT.cy}
      rx={ORBIT.rx}
      ry={ORBIT.ry}
      transform={`rotate(${ORBIT.angle} ${ORBIT.cx} ${ORBIT.cy})`}
      stroke="#E8E8E1"
      strokeOpacity="0.55"
      strokeWidth="1.2"
    />

    <circle cx={G.cx} cy={G.cy} r={G.r} fill="#000" />
    <g stroke="#E8E8E1" strokeWidth="1" strokeOpacity="0.85" strokeLinejoin="round">
      {globeLines.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <circle cx={G.cx} cy={G.cy} r={G.r} strokeWidth="1.4" />
    </g>

    <path d={orbitFront} stroke="#E8E8E1" strokeOpacity="0.55" strokeWidth="1.2" />
    <circle cx="930" cy="497" r="3.5" fill="#E8E8E1" />

    {cities.map((city, i) => {
      const isActive = i === active;
      return (
        <g
          key={city.name}
          className="cursor-pointer"
          onMouseEnter={() => onSelect(i)}
          onClick={() => onSelect(i)}
        >
          {/* Bigger invisible hit area */}
          <circle cx={city.x} cy={city.y} r="22" fill="transparent" />
          {isActive && (
            <circle cx={city.x} cy={city.y} r="12" fill="#000" stroke="#E8E8E1" strokeWidth="1.5">
              <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite" />
            </circle>
          )}
          <circle
            cx={city.x}
            cy={city.y}
            r={isActive ? 6 : 4}
            fill="#E8E8E1"
            stroke="#000"
            strokeWidth="2"
            style={{ transition: "r 0.3s ease" }}
          />
          {/* Font sizes are in SVG units: on phones the globe renders at ~45%,
              so labels are drawn larger there to stay legible */}
          <text
            x={city.x + 21}
            y={city.y}
            dominantBaseline="central"
            className={isActive ? "text-[36px] md:text-[19px]" : "text-[30px] md:text-[15px]"}
            fill="#E8E8E1"
            fillOpacity={isActive ? 1 : 0.85}
            stroke="#000"
            strokeWidth="7"
            paintOrder="stroke fill"
            fontFamily="inherit"
            style={{
              transform: isActive ? "translate(8px, 1.5px)" : "none",
              transition: "font-size 0.3s ease, transform 0.3s ease",
            }}
          >
            {city.name}
          </text>
        </g>
      );
    })}
  </svg>
);

const OfficesSection = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % cities.length), 3500);
    return () => clearInterval(id);
  }, [paused]);

  const city = cities[active];

  return (
    <section className="w-full overflow-x-clip px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-x-6 md:items-start">
        <motion.div
          className="md:col-span-5 md:pt-[10%]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <h2 className="heading-xl text-heading mb-4 md:mb-5">Global presence.</h2>
          <div className="para-acc text-desc leading-[1.8] space-y-5 max-w-[500px]">
            <p>
              Our home is Worli, Mumbai. A neighbourhood that carries the memory of the city's mill district while becoming one of its most forward-thinking addresses.
            </p>
            <p>
              We work from Barcelona and Austin too. Two cities chosen for what they add, not just where they are. Different latitudes, different creative cultures, the same standard. One point of view.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-7"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Globe active={active} onSelect={setActive} />

          <div className="mt-8 md:mt-12 md:pl-[37%] min-h-[64px]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-heading" />
                  <h3 className="heading-md text-heading">{city.name}</h3>
                  <span className="para-acc text-desc">({city.label})</span>
                </div>
                <p className="para-acc text-desc mt-2 md:mt-3">{city.tagline}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfficesSection;
