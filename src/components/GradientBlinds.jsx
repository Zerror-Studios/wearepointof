"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const MAX_COLORS = 8;
const hexToRGB = (hex) => {
  const c = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};
const prepStops = (stops) => {
  const base = (stops && stops.length ? stops : ["#FF9FFC", "#5227FF"]).slice(
    0,
    MAX_COLORS
  );
  if (base.length === 1) base.push(base[0]);
  while (base.length < MAX_COLORS) base.push(base[base.length - 1]);
  const arr = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[i]));
  const count = Math.max(2, Math.min(MAX_COLORS, stops?.length ?? 2));
  return { arr, count };
};

const GradientBlinds = ({
  className,
  dpr,
  paused = false,
  gradientColors,
  angle = 0,
  noise = 0.3,
  blindCount = 16,
  blindMinWidth = 60,
  mouseDampening = 0.15,
  mirrorGradient = false,
  spotlightRadius = 0.5,
  spotlightSoftness = 1,
  spotlightOpacity = 1,
  distortAmount = 0,
  shineDirection = "left",
  mixBlendMode = "lighten",
  lightMode = false,
  /** Fixed copper-style glows in top-right + bottom-left */
  cornerGlow = false,
  /** Mouse follows a black soft vignette instead of a bright spotlight */
  mouseDarken = false,
}) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseTargetRef = useRef([0, 0]);
  const lastTimeRef = useRef(0);
  const firstResizeRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // A soft, noisy gradient gains nothing from retina density, and a full-screen shader at
    // 3x DPR is 9x the pixels on phones, so cap the backing resolution.
    const deviceDpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const isSmall = typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
    const renderer = new Renderer({
      dpr: dpr ?? Math.min(deviceDpr, isSmall ? 1 : 1.5),
      alpha: true,
      // A single full-screen triangle has no geometry edges to smooth
      antialias: false,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

    const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uMirror;
uniform float uDistort;
uniform float uShineFlip;
uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;
uniform float uLightMode;
uniform float uCornerGlow;
uniform float uMouseDarken;

varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

float valueNoise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = rand(i);
  float b = rand(i + vec2(1.0, 0.0));
  float c = rand(i + vec2(0.0, 1.0));
  float d = rand(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * valueNoise(p);
    p = p * 2.03 + vec2(17.1, 9.7);
    a *= 0.5;
  }
  return v;
}

vec2 rotate2D(vec2 p, float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c) * p;
}

vec3 getGradientColor(float t){
  float tt = clamp(t, 0.0, 1.0);
  int count = uColorCount;
  if (count < 2) count = 2;
  float scaled = tt * float(count - 1);
  float seg = floor(scaled);
  float f = fract(scaled);

  if (seg < 1.0) return mix(uColor0, uColor1, f);
  if (seg < 2.0 && count > 2) return mix(uColor1, uColor2, f);
  if (seg < 3.0 && count > 3) return mix(uColor2, uColor3, f);
  if (seg < 4.0 && count > 4) return mix(uColor3, uColor4, f);
  if (seg < 5.0 && count > 5) return mix(uColor4, uColor5, f);
  if (seg < 6.0 && count > 6) return mix(uColor5, uColor6, f);
  if (seg < 7.0 && count > 7) return mix(uColor6, uColor7, f);
  if (count > 7) return uColor7;
  if (count > 6) return uColor6;
  if (count > 5) return uColor5;
  if (count > 4) return uColor4;
  if (count > 3) return uColor3;
  if (count > 2) return uColor2;
  return uColor1;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv0 = fragCoord.xy / iResolution.xy;

  float aspect = iResolution.x / iResolution.y;
  vec2 p = uv0 * 2.0 - 1.0;
  p.x *= aspect;
  vec2 pr = rotate2D(p, uAngle);
  pr.x /= aspect;
  vec2 uv = pr * 0.5 + 0.5;

  vec2 uvMod = uv;
  if (uDistort > 0.0) {
    float a = uvMod.y * 6.0;
    float b = uvMod.x * 6.0;
    float w = 0.01 * uDistort;
    uvMod.x += sin(a) * w;
    uvMod.y += cos(b) * w;
  }
  float t = uvMod.x;
  if (uMirror > 0.5) {
    t = 1.0 - abs(1.0 - 2.0 * fract(t));
  }

  vec3 copper = getGradientColor(t);
  vec3 base;

  if (uCornerGlow > 0.5) {
    // Very slow autoplay drift — color patches keep breathing / sliding
    float time = iTime * 0.06;
    vec2 driftA = vec2(sin(time * 0.65), cos(time * 0.48)) * 0.055;
    vec2 driftB = vec2(cos(time * 0.42 + 1.2), sin(time * 0.58 + 0.7)) * 0.045;
    vec2 driftC = vec2(sin(time * 0.35 + 2.1), cos(time * 0.7 + 0.4)) * 0.04;

    // Ornn-style: copper band on the RIGHT, extreme top-right + bottom-left stay dark
    vec2 nUV = uv0 * vec2(2.8, 2.1) + vec2(time * 0.18, -time * 0.12);
    float n1 = fbm(nUV + vec2(2.1, 0.4));
    float n2 = fbm(nUV * 1.55 + vec2(8.3, 5.1));
    vec2 wUV = uv0 + (vec2(n1, n2) - 0.5) * 0.12;

    // Primary glow — upper-mid RIGHT (not the extreme corner)
    float pMain = exp(-length((wUV - (vec2(0.78, 0.72) + driftA)) * vec2(1.55, 1.35)) * 2.05);
    pMain *= mix(0.7, 1.0, smoothstep(0.25, 0.7, n1));

    // Secondary — softer lower-right band
    float pBR = exp(-length((wUV - (vec2(0.88, 0.22) + driftB)) * vec2(1.7, 2.0)) * 2.85);
    pBR *= mix(0.5, 1.0, smoothstep(0.3, 0.75, n2)) * 0.5;

    // Soft spill toward top-center / mid-right
    float pSpill = exp(-length((wUV - (vec2(0.62, 0.82) + driftC * 0.7)) * vec2(2.0, 1.5)) * 3.1);
    pSpill *= 0.32;

    // Subtle bottom-left glow (a bit — not as strong as the right)
    float pBL = exp(-length((wUV - (vec2(0.12, 0.08) + driftB * 0.8)) * vec2(2.1, 2.4)) * 3.15);
    pBL *= mix(0.45, 1.0, smoothstep(0.28, 0.72, n2)) * 0.38;

    float light = clamp(pMain + pBR + pSpill + pBL, 0.0, 1.0);

    // Keep far LEFT mostly dark (but allow the small BL glow through)
    light *= mix(0.22, 1.0, smoothstep(0.05, 0.55, uv0.x));

    // Extreme TOP-RIGHT corner goes dark
    float cornerTR = length((uv0 - vec2(1.0, 1.0)) * vec2(1.1, 1.25));
    light *= smoothstep(0.1, 0.48, cornerTR);

    // Soft dark void mid-left / center (don't kill the BL glow)
    vec2 voidPos = vec2(0.32, 0.48) + driftC * 0.5;
    float voidL = exp(-length((uv0 - voidPos) * vec2(1.7, 1.15)) * 2.35);
    light *= 1.0 - voidL * 0.9;

    // Slow color-stop breathe across the gradient palette
    float colorPulse = sin(time * 0.9) * 0.5 + 0.5;
    vec3 toneHot = mix(uColor1, uColor0, clamp(pMain * 1.15 + colorPulse * 0.15, 0.0, 1.0));
    vec3 toneCool = mix(uColor3, uColor2, clamp(pBR + pBL + (1.0 - colorPulse) * 0.12, 0.0, 1.0));
    vec3 patchCol = mix(toneCool, toneHot, clamp(pMain / max(pMain + pBR + pBL, 1e-3), 0.0, 1.0));

    base = patchCol * light * 1.45;
    base = min(base, vec3(1.0));
  } else {
    // Slow horizontal wash of the gradient colors
    float tShift = fract(t + iTime * 0.025);
    base = getGradientColor(tShift);
  }

  float blindCount = max(uBlindCount, 1.0);
  float stripePhase = uvMod.x * blindCount;
  float stripe = fract(stripePhase);
  float stripeAA = clamp(blindCount * 1.25 / min(iResolution.x, iResolution.y), 0.001, 0.12);
  float edgeDistance = min(stripe, 1.0 - stripe);
  float edgeBlend = 1.0 - smoothstep(0.0, stripeAA, edgeDistance);
  stripe = mix(stripe, 0.5, edgeBlend);
  if (uShineFlip > 0.5) stripe = 1.0 - stripe;

  // Blind shading: deeper troughs for a darker overall look
  float shade = mix(0.1, 1.0, stripe);

  // Pixel-space distance with a slight horizontal stretch → soft ellipse
  vec2 mousePx = iMouse.xy;
  vec2 fragPx = uv0 * iResolution.xy;
  vec2 dxy = fragPx - mousePx;
  dxy.x *= 0.58; // wider horizontal ellipse
  float dPx = length(dxy);
  float minSide = min(iResolution.x, iResolution.y);
  float rPx = max(uSpotlightRadius, 1e-4) * minSide;
  float dn = dPx / max(rPx, 1e-4);
  float spot = pow(max(0.0, 1.0 - dn), max(uSpotlightSoftness, 0.01)) * uSpotlightOpacity;

  vec3 col;
  if (uMouseDarken > 0.5) {
    // Darken copper on the ridge faces only — denser, liquid-like ink pool
    float fall = exp(-(dPx * dPx) / max(rPx * rPx, 1e-4) * max(uSpotlightSoftness * 0.75, 0.25));
    float darken = clamp(fall * uSpotlightOpacity, 0.0, 1.0);
    darken = smoothstep(0.0, 1.0, darken);
    darken = darken * darken * (3.0 - 2.0 * darken);
    // Deeper core for liquid feel
    darken = mix(darken, darken * darken, 0.45);
    // Only affect lit blind faces (preserve troughs / line structure)
    float ridge = smoothstep(0.12, 0.8, stripe);
    vec3 lit = base * (1.0 - darken * ridge * 1.0);
    col = lit * shade;
  } else if (uCornerGlow > 0.5) {
    col = base * shade;
  } else {
    base *= shade;
    vec3 cir = vec3(spot);
    vec3 ran = vec3(stripe);
    vec3 revealSignal = cir + copper - ran;
    if (uLightMode > 0.5) {
      float peak = max(copper.r, max(copper.g, copper.b));
      vec3 pigment = copper / max(peak, 0.0001);
      float neutral = min(pigment.r, min(pigment.g, pigment.b));
      pigment = max(pigment - vec3(neutral * 0.72), vec3(0.0));
      pigment /= max(max(pigment.r, max(pigment.g, pigment.b)), 0.0001);
      pigment = mix(pigment, pigment * pigment, 0.12) * 0.72;
      vec3 revealed = clamp(revealSignal, 0.0, 1.0);
      float coverage = max(revealed.r, max(revealed.g, revealed.b));
      col = mix(vec3(1.0), pigment, coverage);
    } else {
      col = revealSignal;
    }
  }

  col += (rand(gl_FragCoord.xy + iTime) - 0.5) * uNoise;
  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

    const { arr: colorArr, count: colorCount } = prepStops(gradientColors);
    const uniforms = {
      iResolution: {
        value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1],
      },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uAngle: { value: (angle * Math.PI) / 180 },
      uNoise: { value: noise },
      uBlindCount: { value: Math.max(1, blindCount) },
      uSpotlightRadius: { value: spotlightRadius },
      uSpotlightSoftness: { value: spotlightSoftness },
      uSpotlightOpacity: { value: spotlightOpacity },
      uMirror: { value: mirrorGradient ? 1 : 0 },
      uDistort: { value: distortAmount },
      uShineFlip: { value: shineDirection === "right" ? 1 : 0 },
      uColor0: { value: colorArr[0] },
      uColor1: { value: colorArr[1] },
      uColor2: { value: colorArr[2] },
      uColor3: { value: colorArr[3] },
      uColor4: { value: colorArr[4] },
      uColor5: { value: colorArr[5] },
      uColor6: { value: colorArr[6] },
      uColor7: { value: colorArr[7] },
      uColorCount: { value: colorCount },
      uLightMode: { value: lightMode ? 1 : 0 },
      uCornerGlow: { value: cornerGlow ? 1 : 0 },
      uMouseDarken: { value: mouseDarken ? 1 : 0 },
    };

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms,
    });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
        1,
      ];

      if (blindMinWidth && blindMinWidth > 0) {
        const maxByMinWidth = Math.max(
          1,
          Math.floor(rect.width / blindMinWidth)
        );
        const effective = blindCount
          ? Math.min(blindCount, maxByMinWidth)
          : maxByMinWidth;
        uniforms.uBlindCount.value = Math.max(1, effective);
      } else {
        uniforms.uBlindCount.value = Math.max(1, blindCount);
      }

      if (firstResizeRef.current) {
        firstResizeRef.current = false;
        // Start dark vignette near center (matches reference mood)
        const cx = gl.drawingBufferWidth * 0.42;
        const cy = gl.drawingBufferHeight * 0.48;
        uniforms.iMouse.value = [cx, cy];
        mouseTargetRef.current = [cx, cy];
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scale = renderer.dpr || 1;
      const x = (e.clientX - rect.left) * scale;
      const y = (rect.height - (e.clientY - rect.top)) * scale;
      mouseTargetRef.current = [x, y];
      if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    // Listen on container so moves still track when canvas is under content
    container.addEventListener("pointermove", onPointerMove);

    // Only run the render loop while the canvas is on screen and the tab is visible,
    // so the rest of the page scrolls without a shader burning every frame.
    let onScreen = true;
    const start = () => {
      if (rafRef.current || !onScreen || document.hidden) return;
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(container);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const loop = (t) => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value;
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }
      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj, key) => {
        if (obj && typeof obj[key] === "function") {
          obj[key].call(obj);
        }
      };
      callIfFn(programRef.current, "remove");
      callIfFn(geometryRef.current, "remove");
      callIfFn(meshRef.current, "remove");
      callIfFn(rendererRef.current, "destroy");
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr,
    paused,
    gradientColors,
    angle,
    noise,
    blindCount,
    blindMinWidth,
    mouseDampening,
    mirrorGradient,
    spotlightRadius,
    spotlightSoftness,
    spotlightOpacity,
    distortAmount,
    shineDirection,
    lightMode,
    cornerGlow,
    mouseDarken,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden relative ${className ?? ""}`}
      style={{
        ...(!lightMode &&
          mixBlendMode &&
          mixBlendMode !== "normal" && {
            mixBlendMode,
          }),
      }}
    />
  );
};

export default GradientBlinds;
