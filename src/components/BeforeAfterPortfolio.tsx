"use client";

import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PORTFOLIO_CASES } from "@/data/portfolio-reviews";
import { useCarePlan } from "@/context/CarePlanContext";
import { Reveal, SectionHeading } from "@/components/ui/lux";
import { assetPath, cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function BeforeAfterPortfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addMany, isInPlan } = useCarePlan();

  const current = PORTFOLIO_CASES[activeIndex];
  const allAdded = current.serviceIds.every((id) => isInPlan(id));

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSliderPos(Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const selectCase = (idx: number) => {
    setActiveIndex(idx);
    setSliderPos(50);
  };

  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className="section-lux bg-[#08080A]">
      <div className="wrap-lux">
        <SectionHeading
          id="portfolio-heading"
          index="02"
          eyebrow="Портфолио"
          title="Результат"
          accent="до и после"
          description="Потяните разделитель, чтобы сравнить лак, антигравийную защиту и кожу салона под жёстким студийным светом."
        />

        {/* case tabs */}
        <Reveal className="mt-16 grid grid-cols-1 border-t border-white/10 sm:mt-20 sm:grid-cols-3">
          {PORTFOLIO_CASES.map((item, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectCase(idx)}
                className="group relative cursor-pointer py-5 pr-6 text-left"
              >
                <span
                  className={cn(
                    "absolute inset-x-0 top-[-1px] h-px origin-left bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active ? "scale-x-100" : "scale-x-0"
                  )}
                />
                <span className="text-[10px] tabular-nums tracking-[0.24em] text-white/40">
                  0{idx + 1}
                </span>
                <span
                  className={cn(
                    "mt-1.5 block text-[13px] uppercase tracking-[0.16em] transition-colors duration-500",
                    active ? "text-[#F3F3F1]" : "text-white/40 group-hover:text-white/75"
                  )}
                >
                  {item.carModel.split("·")[0].trim()}
                </span>
              </button>
            );
          })}
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Slider */}
          <Reveal className="lg:col-span-8">
            <div
              ref={containerRef}
              role="slider"
              tabIndex={0}
              aria-label={`Сравнение до и после: ${current.title}`}
              aria-valuemin={3}
              aria-valuemax={97}
              aria-valuenow={Math.round(sliderPos)}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(true);
                updateFromClientX(e.clientX);
              }}
              onPointerMove={(e) => dragging && updateFromClientX(e.clientX)}
              onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
                setDragging(false);
              }}
              onPointerCancel={() => setDragging(false)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setSliderPos((p) => Math.max(3, p - 4));
                if (e.key === "ArrowRight") setSliderPos((p) => Math.min(97, p + 4));
              }}
              className="group/slider relative aspect-[16/10] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] bg-[#111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  <img
                    src={assetPath(current.afterImage)}
                    alt={current.afterLabel}
                    draggable={false}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ clipPath: `inset(0 ${(100 - sliderPos).toFixed(2)}% 0 0)` }}
                  >
                    <img
                      src={assetPath(current.beforeImage)}
                      alt={current.beforeLabel}
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

              <span className="pointer-events-none absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em] text-white/80">
                До
              </span>
              <span className="pointer-events-none absolute bottom-5 right-6 text-[10px] uppercase tracking-[0.3em] text-white/80">
                После
              </span>

              {/* handle */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white/90"
                style={{ left: `${sliderPos}%` }}
              >
                <div
                  className={cn(
                    "absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full border border-white/60 bg-black/25 text-white backdrop-blur-xl transition-transform duration-500",
                    dragging ? "scale-90" : "group-hover/slider:scale-105"
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Case details */}
          <Reveal delay={0.15} className="flex flex-col justify-between lg:col-span-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="flex h-full flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/45">
                    <span>
                      Кейс 0{activeIndex + 1} / 0{PORTFOLIO_CASES.length}
                    </span>
                    <span>{current.duration}</span>
                  </div>
                  <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-white/50">{current.carModel}</p>
                  <h3 className="mt-3 text-[28px] font-light leading-[1.15] tracking-[-0.015em] text-[#F3F3F1] sm:text-[32px]">
                    {current.title}
                  </h3>
                  <p className="mt-5 text-[14px] font-light leading-relaxed text-white/55">{current.workSummary}</p>

                  <dl className="mt-8 divide-y divide-white/10 border-y border-white/10 text-[13px] font-light">
                    <div className="flex gap-6 py-4">
                      <dt className="w-16 shrink-0 text-[10px] uppercase tracking-[0.24em] text-white/40">Было</dt>
                      <dd className="text-white/70">{current.beforeLabel.replace("До: ", "")}</dd>
                    </div>
                    <div className="flex gap-6 py-4">
                      <dt className="w-16 shrink-0 text-[10px] uppercase tracking-[0.24em] text-white/40">Стало</dt>
                      <dd className="text-[#F3F3F1]">{current.afterLabel.replace("После: ", "")}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-10">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-white/45">Ориентир по прайсу</span>
                    <span className="font-display text-[26px] font-light tabular-nums text-[#F3F3F1]">
                      {current.priceTag}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addMany(current.serviceIds)}
                    aria-pressed={allAdded}
                    className="btn-add mt-6 h-[52px] w-full justify-center text-[11px]"
                  >
                    {allAdded ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                    {allAdded ? "Комплекс в плане ухода" : "Добавить комплекс в план"}
                  </button>
                  <p className="mt-4 text-[11px] font-light leading-snug text-white/35">
                    {current.sourceNote}. Студийная визуализация эффекта программ.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
