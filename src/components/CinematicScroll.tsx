"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { preload } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, MapPin, Plus, Sparkles, Star } from "lucide-react";
import { SCROLL_SCENES, TOTAL_FRAMES, type ScrollScene } from "@/data/scenes";
import { getServiceById } from "@/data/services";
import { STUDIO_INFO } from "@/data/studio";
import { useCarePlan } from "@/context/CarePlanContext";
import { scrollToY } from "@/lib/lenis";
import { assetPath, cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Geometry: canvas, poster and cutout share one rect so they stay     */
/* pixel-aligned. Landscape → cover. Portrait → wide centred band so    */
/* the whole car is visible on phones instead of a zoomed-in hood.      */
/* ------------------------------------------------------------------ */

const IMG_ASPECT = 16 / 9;
const PORTRAIT_BAND_SCALE = 1.7;
const PORTRAIT_TOUR_SCALE = 2.05;
const tourBlend = (p: number) => {
  const t = Math.max(0, Math.min(1, (p - 0.05) / 0.045));
  return 1 - Math.pow(1 - t, 3);
};

interface FrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
  portrait: boolean;
}

/** t: 0 = hero composition, 1 = tour (bigger band, lifted above the scene card). */
function getFrameRect(vw: number, vh: number, t = 0): FrameRect {
  const portrait = vw / vh < 0.9;
  if (portrait) {
    const scale = PORTRAIT_BAND_SCALE + (PORTRAIT_TOUR_SCALE - PORTRAIT_BAND_SCALE) * t;
    const cy = 0.42 + (0.355 - 0.42) * t;
    const w = vw * scale;
    const h = w / IMG_ASPECT;
    return { x: (vw - w) / 2, y: vh * cy - h / 2, w, h, portrait };
  }
  if (vw / vh > IMG_ASPECT) {
    const h = vw / IMG_ASPECT;
    return { x: 0, y: (vh - h) / 2, w: vw, h, portrait };
  }
  const w = vh * IMG_ASPECT;
  return { x: (vw - w) / 2, y: 0, w, h: vh, portrait };
}

function getSceneIndexForProgress(progress: number): number {
  for (let i = 0; i < SCROLL_SCENES.length; i++) {
    if (progress <= SCROLL_SCENES[i].end || i === SCROLL_SCENES.length - 1) return i;
  }
  return 0;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * The sequence stays on frame 1 while the hero exits, so the hi-res poster and
 * the canvas show the exact same picture — no ghosting when the poster goes.
 */
const HERO_HOLD = 0.05;
const frameForProgress = (p: number) =>
  Math.round(clamp01((p - HERO_HOLD) / (1 - HERO_HOLD)) * (TOTAL_FRAMES - 1));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const HERO_WORD = "ТОЧКА";
const HERO_SERVICES = ["Полировка", "Керамика", "Защита PPF", "Химчистка"];

export function CinematicScroll() {
  const { isInPlan, toggleItem, count, totalFrom, setDrawerOpen } = useCarePlan();

  preload(assetPath("/frames/hero-poster.webp"), { as: "image", fetchPriority: "high" });
  preload(assetPath("/frames/hero-car-cutout.webp"), { as: "image", fetchPriority: "high" });

  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const frameBorderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const cutoutRef = useRef<HTMLImageElement>(null);
  const bandFadeRef = useRef<HTMLDivElement>(null);
  const wordBoxRef = useRef<HTMLDivElement>(null);
  const heroBackRef = useRef<HTMLDivElement>(null);
  const heroItalicRef = useRef<HTMLDivElement>(null);
  const heroFrontRef = useRef<HTMLDivElement>(null);
  const sceneHudRef = useRef<HTMLDivElement>(null);
  const topProgressRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null));
  const loadedRef = useRef<boolean[]>(Array(TOTAL_FRAMES).fill(false));
  const loadingRef = useRef<Set<number>>(new Set());
  const variantRef = useRef<"desktop" | "mobile">("desktop");
  const finestStrideRef = useRef<number>(1);
  const lastDrawnIdxRef = useRef<number>(-1);
  const rectRef = useRef<FrameRect>({ x: 0, y: 0, w: 1, h: 1, portrait: false });
  const blendRef = useRef(0);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [introState, setIntroState] = useState<"pending" | "done">("pending");

  const activeScene = SCROLL_SCENES[activeSceneIdx] ?? SCROLL_SCENES[0];
  const primaryService = useMemo(
    () => (activeScene.serviceId ? getServiceById(activeScene.serviceId) : undefined),
    [activeScene.serviceId]
  );
  const secondaryService = useMemo(
    () => (activeScene.secondaryServiceId ? getServiceById(activeScene.secondaryServiceId) : undefined),
    [activeScene.secondaryServiceId]
  );

  /* ----------------------------- frames ----------------------------- */

  const getFrameSrc = useCallback((idx: number) => {
    const padded = String(idx + 1).padStart(4, "0");
    return assetPath(`/frames/${variantRef.current}/frame_${padded}.webp`);
  }, []);

  const findNearestLoadedFrame = useCallback((desiredIdx: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, desiredIdx));
    for (let offset = 0; offset < TOTAL_FRAMES; offset++) {
      const back = clamped - offset;
      if (back >= 0 && loadedRef.current[back]) return { index: back, img: imagesRef.current[back]! };
      const fwd = clamped + offset;
      if (offset > 0 && fwd < TOTAL_FRAMES && loadedRef.current[fwd]) {
        return { index: fwd, img: imagesRef.current[fwd]! };
      }
    }
    return null;
  }, []);

  const renderFrameToCanvas = useCallback(
    (desiredIdx: number, force = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      const nearest = findNearestLoadedFrame(desiredIdx);
      if (!nearest) return;
      if (!force && nearest.index === lastDrawnIdxRef.current) return;

      const dpr = canvas.width / Math.max(1, canvas.clientWidth);
      const r = rectRef.current;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      if (r.portrait) {
        ctx.fillStyle = "#08080A";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(nearest.img, r.x * dpr, r.y * dpr, r.w * dpr, r.h * dpr);
      lastDrawnIdxRef.current = nearest.index;
    },
    [findNearestLoadedFrame]
  );

  const loadSingleFrame = useCallback(
    (idx: number): Promise<void> => {
      if (idx < 0 || idx >= TOTAL_FRAMES || loadedRef.current[idx] || loadingRef.current.has(idx)) {
        return Promise.resolve();
      }
      loadingRef.current.add(idx);
      return new Promise((resolve) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = getFrameSrc(idx);
        img.onload = () => {
          const done = () => {
            loadingRef.current.delete(idx);
            imagesRef.current[idx] = img;
            loadedRef.current[idx] = true;
            const wanted = frameForProgress(smoothProgressRef.current);
            if (idx === 0 || Math.abs(idx - wanted) <= 2) renderFrameToCanvas(wanted, true);
            resolve();
          };
          // decode off the main thread so scrubbing never hitches on first draw
          img.decode().then(done, done);
        };
        img.onerror = () => {
          loadingRef.current.delete(idx);
          resolve();
        };
      });
    },
    [getFrameSrc, renderFrameToCanvas]
  );

  const loadList = useCallback(
    async (indices: number[], concurrency = 6, cancelled?: { current: boolean }) => {
      let cursor = 0;
      const worker = async () => {
        while (cursor < indices.length) {
          if (cancelled?.current) return;
          await loadSingleFrame(indices[cursor++]);
        }
      };
      await Promise.all(Array.from({ length: Math.min(concurrency, indices.length) }, worker));
    },
    [loadSingleFrame]
  );

  const prioritizeWindow = useCallback(
    (centerIdx: number) => {
      const step = finestStrideRef.current;
      const center = Math.round(centerIdx / step) * step;
      const list: number[] = [];
      for (let o = 0; o <= 36; o += step) {
        for (const f of o === 0 ? [center] : [center + o, center - o]) {
          if (f >= 0 && f < TOTAL_FRAMES && !loadedRef.current[f]) list.push(f);
        }
      }
      if (list.length) void loadList(list, 6);
    },
    [loadList]
  );

  /* ------------------------ layout / resize ------------------------- */

  useEffect(() => {
    const layout = () => {
      const canvas = canvasRef.current;
      const stage = stageRef.current;
      if (!canvas || !stage) return;
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;
      const r = getFrameRect(vw, vh, tourBlend(smoothProgressRef.current));
      rectRef.current = r;
      blendRef.current = tourBlend(smoothProgressRef.current);

      const place = (el: HTMLElement | null) => {
        if (!el) return;
        el.style.left = `${r.x}px`;
        el.style.top = `${r.y}px`;
        el.style.width = `${r.w}px`;
        el.style.height = `${r.h}px`;
      };
      [posterRef.current, cutoutRef.current, wordBoxRef.current].forEach(place);
      const fade = bandFadeRef.current;
      if (fade) {
        // overshoot by a few px so no sub-pixel edge of the band can peek through
        fade.style.display = r.portrait ? "block" : "none";
        fade.style.left = "0px";
        fade.style.width = "100%";
        fade.style.top = `${r.y - 3}px`;
        fade.style.height = `${r.h + 6}px`;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      renderFrameToCanvas(frameForProgress(smoothProgressRef.current), true);
    };
    layout();
    const ro = new ResizeObserver(layout);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [renderFrameToCanvas]);

  /* --------------------------- preloading --------------------------- */

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMq);

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = Boolean(conn?.saveData);
    const isMobile = window.innerWidth < 768;
    variantRef.current = isMobile || saveData ? "mobile" : "desktop";
    finestStrideRef.current = isMobile || saveData ? 2 : 1;

    const cancelled = { current: false };
    const every = (step: number, from = 0, to = TOTAL_FRAMES - 1) => {
      const out: number[] = [];
      for (let i = from; i <= to; i += step) if (!loadedRef.current[i]) out.push(i);
      return out;
    };

    (async () => {
      await loadSingleFrame(0);
      // coarse pass first so the whole tour is scrubbable fast, then refine
      await loadList(every(2, 1, 96), 6, cancelled);
      for (const step of [8, 4, 2, 1]) {
        if (cancelled.current || step < finestStrideRef.current) return;
        await loadList(every(step), 6, cancelled);
      }
    })();

    return () => {
      cancelled.current = true;
      mq.removeEventListener("change", onMq);
    };
  }, [loadList, loadSingleFrame]);

  /* ------------------------- intro animation ------------------------ */

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroState("done");
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let started = false;
    const waitFor = (img: HTMLImageElement | null) =>
      new Promise<void>((res) => {
        if (!img || img.complete) return res();
        img.addEventListener("load", () => res(), { once: true });
        img.addEventListener("error", () => res(), { once: true });
      });

    const start = () => {
      if (started) return;
      started = true;
      const plates = [posterRef.current, cutoutRef.current].filter(Boolean);
      const q = gsap.utils.selector(stage);

      tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          gsap.set(plates, { clearProps: "filter,transform" });
          setIntroState("done");
        },
      });
      tl.set(stage, { attr: { "data-intro": "running" } })
        .fromTo(plates, { scale: 1.14 }, { scale: 1, duration: 3.2, ease: "power3.out" }, 0)
        // studio lights: two short flickers, then a slow bloom to full exposure
        .fromTo(
          plates,
          { filter: "brightness(0.04)" },
          {
            keyframes: [
              { filter: "brightness(0.55)", duration: 0.07, ease: "none" },
              { filter: "brightness(0.12)", duration: 0.12, ease: "none" },
              { filter: "brightness(0.8)", duration: 0.06, ease: "none" },
              { filter: "brightness(0.35)", duration: 0.18, ease: "none" },
              { filter: "brightness(1)", duration: 1.4, ease: "power2.out" },
            ],
          },
          0.25
        )
        .fromTo(frameBorderRef.current, { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.6)
        .fromTo(
          q(".hero-letter"),
          { yPercent: 115, y: 0 },
          { yPercent: 0, y: 0, duration: 1.8, stagger: 0.075 },
          0.55
        )
        .fromTo(
          q(".hero-italic"),
          { clipPath: "inset(-30% 100% -30% -10%)", x: 60 },
          { clipPath: "inset(-30% -10% -30% -10%)", x: 0, duration: 2, ease: "expo.inOut" },
          0.9
        )
        .fromTo(
          q(".hero-reveal"),
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.07 },
          1.35
        )
        .add(() => window.dispatchEvent(new CustomEvent("hero-intro-done")), 1.6);
    };

    Promise.race([
      Promise.all([waitFor(posterRef.current), waitFor(cutoutRef.current)]),
      new Promise<void>((r) => setTimeout(r, 2500)),
    ]).then(start);

    return () => {
      tl?.kill();
    };
  }, []);

  /* ----------------- scroll-driven scrubbing + hero exit ------------- */

  useEffect(() => {
    if (reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const apply = (p: number) => {
      // framed card opens to full-bleed as the tour starts
      const open = easeOut(range(p, 0, 0.055));
      if (frameRef.current) {
        const inset = window.innerWidth < 768 ? 8 : 14;
        const i = (inset * (1 - open)).toFixed(2);
        const rad = (28 * (1 - open)).toFixed(2);
        frameRef.current.style.clipPath = `inset(${i}px round ${rad}px)`;
      }
      if (frameBorderRef.current) frameBorderRef.current.style.visibility = open < 0.98 ? "visible" : "hidden";

      const exit = range(p, 0.006, 0.05);
      // hard switch (no cross-fade): the canvas underneath is the same frame
      const plates = p < HERO_HOLD - 0.002 ? 1 : 0;
      if (posterRef.current) {
        posterRef.current.style.opacity = String(plates);
        posterRef.current.style.visibility = plates > 0.001 ? "visible" : "hidden";
      }
      if (cutoutRef.current) {
        cutoutRef.current.style.opacity = String(plates);
        cutoutRef.current.style.visibility = plates > 0.001 ? "visible" : "hidden";
      }
      if (heroBackRef.current) {
        heroBackRef.current.style.opacity = String(1 - exit);
        heroBackRef.current.style.transform = `translate3d(0, ${(-exit * 70).toFixed(1)}px, 0) scale(${(1 + exit * 0.08).toFixed(4)})`;
      }
      if (heroItalicRef.current) {
        heroItalicRef.current.style.opacity = String(1 - exit);
        heroItalicRef.current.style.transform = `translate3d(${(exit * 120).toFixed(1)}px, 0, 0)`;
      }
      if (heroFrontRef.current) {
        const f = 1 - range(p, 0.004, 0.035);
        heroFrontRef.current.style.opacity = String(f);
        heroFrontRef.current.style.transform = `translate3d(0, ${((1 - f) * 30).toFixed(1)}px, 0)`;
        heroFrontRef.current.style.pointerEvents = f > 0.3 ? "auto" : "none";
      }
      const hud = range(p, 0.05, 0.085);
      if (sceneHudRef.current) {
        sceneHudRef.current.style.opacity = String(hud);
        sceneHudRef.current.style.pointerEvents = hud > 0.3 ? "auto" : "none";
      }
      if (topProgressRef.current) topProgressRef.current.style.transform = `scaleX(${p})`;
    };

    const ctx = gsap.context(() => {
      if (!stageRef.current) return;
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 7.5)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetProgressRef.current = self.progress;
        },
      });
    }, stageRef);

    let lastScene = -1;
    let lastPrioritize = 0;
    const tick = (_t: number, deltaMs: number) => {
      const dt = Math.min(deltaMs || 16.6, 64) / 1000;
      const alpha = 1 - Math.exp(-14 * dt);
      const diff = targetProgressRef.current - smoothProgressRef.current;
      smoothProgressRef.current =
        Math.abs(diff) < 0.00015 ? targetProgressRef.current : smoothProgressRef.current + diff * alpha;

      const p = clamp01(smoothProgressRef.current);
      const frame = frameForProgress(p);

      // phones: grow/lift the video band as the tour starts
      let forceDraw = false;
      const blend = tourBlend(p);
      if (rectRef.current.portrait && Math.abs(blend - blendRef.current) > 0.0005 && stageRef.current) {
        blendRef.current = blend;
        const r = getFrameRect(stageRef.current.clientWidth, stageRef.current.clientHeight, blend);
        rectRef.current = r;
        const fade = bandFadeRef.current;
        if (fade) {
          fade.style.top = `${r.y - 3}px`;
          fade.style.height = `${r.h + 6}px`;
        }
        forceDraw = true;
      }
      renderFrameToCanvas(frame, forceDraw);
      apply(p);

      const now = performance.now();
      if (!loadedRef.current[frame] && now - lastPrioritize > 200) {
        lastPrioritize = now;
        prioritizeWindow(frame);
      }
      const s = getSceneIndexForProgress(p);
      if (s !== lastScene) {
        lastScene = s;
        setActiveSceneIdx(s);
      }
    };

    apply(0);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, [prioritizeWindow, reducedMotion, renderFrameToCanvas]);

  const jumpToScene = useCallback(
    (scene: ScrollScene) => {
      const frameIdx = frameForProgress(scene.focusProgress);
      prioritizeWindow(frameIdx);
      const st = scrollTriggerRef.current;
      if (reducedMotion || !st) {
        smoothProgressRef.current = targetProgressRef.current = scene.focusProgress;
        setActiveSceneIdx(scene.index);
        renderFrameToCanvas(frameIdx, true);
        return;
      }
      scrollToY(st.start + (st.end - st.start) * scene.focusProgress);
    },
    [prioritizeWindow, reducedMotion, renderFrameToCanvas]
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest('a[href="#cinematic-tour"]');
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      jumpToScene(SCROLL_SCENES[1]);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [jumpToScene]);

  /* ------------------------------ view ------------------------------ */

  return (
    <section
      id="hero-stage"
      aria-label="Интерактивный скролл-тур вокруг Porsche 911"
      className="relative w-full bg-[#08080A]"
    >
      <div
        ref={stageRef}
        data-intro={reducedMotion ? "done" : introState}
        className="hero-stage relative h-[100dvh] w-full overflow-hidden bg-[#08080A]"
      >
        {/* Framed card (rounded inset → full bleed on scroll) */}
        <div
          ref={frameRef}
          className="absolute inset-0 overflow-hidden bg-[#08080A]"
          style={{ clipPath: "inset(14px round 28px)" }}
        >
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />

          {/* Hi-res still of frame 1 for the static hero (2560px) */}
          <img
            ref={posterRef}
            src={assetPath("/frames/hero-poster.webp")}
            alt="Porsche 911 под студийным светом в ТОЧКЕ ДЕТЕЙЛИНГА"
            fetchPriority="high"
            decoding="async"
            className="plate pointer-events-none absolute left-0 top-0 h-full w-full select-none object-cover"
          />

          {/* Portrait: soften the top/bottom edges of the image band */}
          <div
            ref={bandFadeRef}
            aria-hidden="true"
            className="pointer-events-none absolute z-[4] hidden"
            style={{
              background:
                "linear-gradient(to bottom, #08080A 0%, rgba(8,8,10,0) 28%, rgba(8,8,10,0) 68%, #08080A 96%)",
            }}
          />

          {/* Cinematic grade: vignette + scrims */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[6]"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 45%, rgba(8,8,10,0) 55%, rgba(8,8,10,0.55) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[7] bg-gradient-to-t from-[#08080A]/85 via-[#08080A]/0 via-45% to-[#08080A]/40"
          />

          {/* Layer: giant thin word behind the car */}
          <div ref={wordBoxRef} aria-hidden="true" className="pointer-events-none absolute z-10 [container-type:inline-size]">
            <div ref={heroBackRef} className="absolute inset-x-0 top-[15%] flex justify-center will-change-transform max-md:top-[2%]">
              <span className="hero-word relative flex select-none font-display font-extralight uppercase leading-[0.8] text-[#ECECEC]">
                {/* studio line pinned to the word's top-left (ref: label above TERRA), so it can never collide */}
                <span className="hero-reveal hero-meta absolute bottom-full left-[0.5%] whitespace-nowrap font-sans text-[10px] font-normal leading-relaxed tracking-[0.24em] text-white/55 sm:text-[11px]">
                  Детейлинг-студия · с {STUDIO_INFO.foundedYear}
                  <span className="max-md:hidden"> · </span>
                  <br className="md:hidden" />
                  <span className="text-white/85">Москва, Митино</span>
                </span>
                {HERO_WORD.split("").map((ch, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
                    <span className="hero-letter inline-block">{ch}</span>
                  </span>
                ))}
              </span>
            </div>
          </div>

          {/* Layer: pixel-aligned car cutout (sits in front of the word) */}
          <img
            ref={cutoutRef}
            src={assetPath("/frames/hero-car-cutout.webp")}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="plate pointer-events-none absolute left-0 top-0 z-20 h-full w-full select-none object-cover"
          />

          {/* Layer: italic accent in front of the car */}
          <div
            ref={heroItalicRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[13%] z-30 flex justify-end px-6 will-change-transform max-md:bottom-auto max-md:top-[56%] max-md:justify-center lg:px-14"
          >
            <span className="hero-italic select-none font-serif text-[clamp(64px,12.5vw,210px)] italic font-light leading-[0.9] tracking-[-0.025em] text-[#F3F3F1] drop-shadow-[0_18px_50px_rgba(0,0,0,0.6)] max-md:text-[19vw]">
              Детейлинга
            </span>
          </div>

          {/* Layer: hero copy, CTA, meta */}
          <div ref={heroFrontRef} className="absolute inset-0 z-30 will-change-transform">

            <ul className="absolute right-6 top-[47%] hidden space-y-1.5 text-right text-[11px] uppercase tracking-[0.2em] text-white/70 md:block lg:right-14">
              {HERO_SERVICES.map((s) => (
                <li key={s} className="hero-reveal">
                  <span className="mr-2 text-white/35">—</span>
                  {s}
                </li>
              ))}
            </ul>

            {/* bottom-left: offer + CTA + address */}
            <div className="absolute inset-x-0 bottom-0 px-7 pb-9 sm:pb-10 lg:px-14 lg:pb-12">
              <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6">
                <div className="max-w-[420px]">
                  <h1 className="hero-reveal text-[20px] font-light leading-[1.3] tracking-[-0.01em] text-[#F3F3F1] sm:text-[24px]">
                    Детейлинг, который
                    <br />
                    видно по отражению.
                  </h1>

                  <div className="hero-reveal mt-6 flex flex-wrap items-center gap-3">
                    <a href="#booking" className="btn-lux group">
                      <span>Записаться на осмотр</span>
                      <span className="btn-lux-icon">
                        <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </a>
                  </div>

                  <p className="hero-reveal mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-[11px]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{STUDIO_INFO.addressShort} · 09:00–22:00</span>
                  </p>
                </div>

                <a
                  href={STUDIO_INFO.links.yandexMapsShort}
                  target="_blank"
                  rel="noreferrer"
                  className="hero-reveal hidden items-center gap-3 text-right lg:flex"
                >
                  <span className="font-display text-[44px] font-extralight leading-none text-[#F3F3F1]">
                    {STUDIO_INFO.rating.score.toFixed(1)}
                  </span>
                  <span className="text-[10px] uppercase leading-[1.7] tracking-[0.2em] text-white/55">
                    <span className="flex justify-end gap-0.5 pb-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 fill-white/85 text-white/85" aria-hidden="true" />
                      ))}
                    </span>
                    Яндекс Карты
                    <br />
                    {STUDIO_INFO.rating.reviewsCount} отзывов
                  </span>
                </a>
              </div>
            </div>

          </div>

          {/* Scene HUD */}
          <div
            ref={sceneHudRef}
            id="cinematic-tour"
            className="pointer-events-none absolute inset-0 z-30"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            {/* big scene index (editorial) */}
            <div className="absolute left-7 top-[96px] hidden md:block lg:left-14 lg:top-[110px]">
              <div key={activeScene.id} className="animate-in fade-in slide-in-from-bottom-3 duration-700">
                <p className="font-display text-[88px] font-extralight leading-none tracking-[-0.04em] text-white/90 lg:text-[112px]">
                  {activeScene.code}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/55">
                  {activeScene.zoneLabel} <span className="text-white/30">/ 07</span>
                </p>
              </div>
            </div>

            {/* Hotspot: ring + hairline + glass caption */}
            {activeScene.hotspot && (
              <div
                key={activeScene.hotspot.id}
                className="absolute hidden md:block"
                style={{ left: `${activeScene.hotspot.xPercent}%`, top: `${activeScene.hotspot.yPercent}%` }}
              >
                <div className="relative">
                  <span className="hotspot-ring absolute -left-[9px] -top-[9px] h-[18px] w-[18px] rounded-full border border-white/85">
                    <span className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                  </span>
                  <div
                    className={cn(
                      "absolute top-0 flex items-start",
                      activeScene.hotspot.align === "left" ? "right-[14px] flex-row-reverse" : "left-[14px]"
                    )}
                  >
                    <span
                      className={cn(
                        "hotspot-line mt-0 block h-px w-16 bg-white/50 lg:w-24",
                        activeScene.hotspot.align === "left" ? "origin-right" : "origin-left"
                      )}
                    />
                    <div className="glass-lux -mt-4 w-64 rounded-2xl px-4 py-3 hotspot-card">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">
                        {activeScene.hotspot.label}
                      </p>
                      <p className="mt-1.5 text-[13px] font-light leading-snug text-[#F3F3F1]">
                        {activeScene.hotspot.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scene card */}
            <div className="absolute inset-x-0 bottom-20 px-4 sm:bottom-10 sm:px-7 lg:px-14">
              <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-4">
                <div className="glass-lux pointer-events-auto w-full max-w-[460px] rounded-[22px] p-4 sm:p-7">
                  <div key={activeScene.id} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/50">
                      Зона {activeScene.code} / 07 · {activeScene.zoneLabel}
                    </p>
                    <h2 className="mt-2 text-[19px] sm:mt-3 sm:text-[22px] font-light leading-[1.15] tracking-[-0.015em] text-[#F3F3F1] lg:text-[26px]">
                      {activeScene.title}{" "}
                      <span className="font-serif text-[1.15em] italic text-white/80">{activeScene.italicAccent}</span>
                    </h2>
                    <p className="mt-3 text-[13px] font-light leading-relaxed text-white/60 max-sm:mt-2 max-sm:line-clamp-2 max-sm:text-[12.5px]">
                      {activeScene.description}
                    </p>

                    {!activeScene.isSummary && primaryService && (
                      <div className="mt-4 space-y-3 border-t border-white/10 pt-3 sm:mt-5 sm:pt-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[15px] font-medium tabular-nums text-[#F3F3F1]">
                              {primaryService.priceDisplay}
                            </p>
                            <p className="text-[11px] text-white/45">Срок: {primaryService.duration}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleItem(primaryService.id)}
                            className={cn(
                              "inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-full px-5 text-[11px] font-medium uppercase tracking-[0.14em] transition-all duration-300",
                              isInPlan(primaryService.id)
                                ? "border border-white/30 bg-white/[0.08] text-[#F3F3F1]"
                                : "bg-[#F3F3F1] text-[#08080A] hover:bg-white"
                            )}
                          >
                            {isInPlan(primaryService.id) ? (
                              <>
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />В плане
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" aria-hidden="true" />В план ухода
                              </>
                            )}
                          </button>
                        </div>

                        {secondaryService && (
                          <div className="max-sm:hidden flex items-center justify-between gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12px] text-[#F3F3F1]">{secondaryService.name}</p>
                              <p className="text-[11px] tabular-nums text-white/45">
                                {secondaryService.priceDisplay} · {secondaryService.duration}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleItem(secondaryService.id)}
                              aria-label={
                                isInPlan(secondaryService.id)
                                  ? `Убрать ${secondaryService.name} из плана`
                                  : `Добавить ${secondaryService.name} в план`
                              }
                              className={cn(
                                "inline-flex min-h-[34px] shrink-0 cursor-pointer items-center gap-1 rounded-full px-3 text-[10px] uppercase tracking-[0.12em] transition-colors",
                                isInPlan(secondaryService.id)
                                  ? "border border-white/30 bg-white/10 text-[#F3F3F1]"
                                  : "border border-white/15 text-[#F3F3F1] hover:border-white/40"
                              )}
                            >
                              {isInPlan(secondaryService.id) ? (
                                <>
                                  <Check className="h-3 w-3" aria-hidden="true" />В плане
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3 w-3" aria-hidden="true" />Добавить
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeScene.isSummary && (
                      <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                          <span className="flex items-center gap-2 text-[12px] text-[#F3F3F1]">
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            Выбрано услуг: <strong className="font-medium tabular-nums">{count}</strong>
                          </span>
                          <span className="text-[13px] font-medium tabular-nums text-[#F3F3F1]">
                            {totalFrom > 0 ? `от ${totalFrom.toLocaleString("ru-RU")} ₽` : "Нет позиций"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                            className="inline-flex min-h-[42px] flex-1 cursor-pointer items-center justify-center rounded-full border border-white/20 px-4 text-[11px] uppercase tracking-[0.14em] text-[#F3F3F1] transition-colors hover:border-white/45"
                          >
                            Открыть план ({count})
                          </button>
                          <a
                            href="#booking"
                            className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#F3F3F1] px-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#08080A] transition-colors hover:bg-white"
                          >
                            Записаться
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop zone rail */}
            <nav
              aria-label="Навигация по 7 зонам автомобиля"
              className="glass-lux pointer-events-auto absolute right-7 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3.5 rounded-2xl py-5 pl-6 pr-5 lg:flex lg:right-14"
            >
              {SCROLL_SCENES.map((scene) => {
                const active = scene.index === activeSceneIdx;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => jumpToScene(scene)}
                    aria-current={active ? "step" : undefined}
                    className="group flex cursor-pointer items-center gap-3"
                  >
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-[0.22em] transition-all duration-500",
                        active ? "text-[#F3F3F1]" : "text-white/35 group-hover:text-white/75"
                      )}
                    >
                      {scene.zoneLabel}
                    </span>
                    <span
                      className={cn(
                        "block h-px transition-all duration-500",
                        active ? "w-10 bg-white" : "w-4 bg-white/30 group-hover:w-7 group-hover:bg-white/60"
                      )}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Mobile zone rail */}
            <nav
              aria-label="Зоны скролл-тура"
              className="pointer-events-auto absolute inset-x-4 top-[76px] flex items-center justify-between gap-1 rounded-full border border-white/10 bg-[#08080A]/60 p-1 backdrop-blur-xl lg:hidden"
            >
              {SCROLL_SCENES.map((scene) => {
                const active = scene.index === activeSceneIdx;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => jumpToScene(scene)}
                    aria-label={`Зона ${scene.code}: ${scene.zoneLabel}`}
                    className={cn(
                      "flex h-7 flex-1 cursor-pointer items-center justify-center rounded-full text-[10px] tabular-nums transition-all duration-500",
                      active ? "bg-[#F3F3F1] font-medium text-[#08080A]" : "text-white/50"
                    )}
                  >
                    {scene.code}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* film grain */}
          <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-[-50%] z-40" />
        </div>

        {/* hairline border of the framed card */}
        <div
          ref={frameBorderRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 z-50 rounded-[22px] border border-white/[0.09] md:inset-[14px] md:rounded-[28px]"
        />

        {/* top hairline progress */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-50 h-px bg-white/[0.06]">
          <div ref={topProgressRef} className="h-full w-full origin-left bg-white/70" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
