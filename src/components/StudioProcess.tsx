"use client";

import React from "react";
import { Award } from "lucide-react";
import { STUDIO_PROCESS_STEPS } from "@/data/portfolio-reviews";
import { STUDIO_INFO } from "@/data/studio";
import { GUARANTEES } from "@/data/directions";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Reveal, SectionHeading } from "@/components/ui/lux";

const STATS = [
  { value: <NumberTicker value={5} decimalPlaces={1} />, label: "Рейтинг Яндекс Карт" },
  { value: <NumberTicker value={STUDIO_INFO.rating.ratingsCount} />, label: "Оценок клиентов" },
  { value: <NumberTicker value={STUDIO_INFO.rating.reviewsCount} />, label: "Живых отзывов" },
  { value: <>{STUDIO_INFO.foundedYear}</>, label: "Работаем с" },
];

export function StudioProcess() {
  return (
    <section id="process" aria-labelledby="process-heading" className="section-lux bg-[#08080A]">
      <div className="wrap-lux">
        <SectionHeading
          id="process-heading"
          index="03"
          eyebrow="Подход и регламент"
          title="Стандарты"
          accent="точки детейлинга"
          description={`С ${STUDIO_INFO.foundedYear} года команда в Митино работает по одному принципу: честная диагностика под светом, сохранение заводского лака и фотофиксация каждого этапа.`}
        />

        {/* stats */}
        <div className="mt-14 grid grid-cols-2 border-y border-white/10 sm:mt-20 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="border-white/10 px-1 py-7 max-sm:[&:nth-child(even)]:pl-5 sm:px-8 sm:py-12 [&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b"
            >
              <p className="font-display text-[clamp(48px,6vw,88px)] font-extralight leading-none tracking-[-0.04em] text-[#F3F3F1] tabular-nums">
                {s.value}
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-white/45">{s.label}</p>
            </Reveal>
          ))}
        </div>

        {/* guarantees (as on detailinga.ru) */}
        <div className="mt-14 grid grid-cols-1 gap-3 sm:mt-20 md:grid-cols-3 md:gap-5">
          {GUARANTEES.map((g, i) => (
            <Reveal key={g} delay={i * 0.06} className="card-lux flex items-start gap-5 p-6 sm:p-8">
              <span className="font-display text-[34px] font-extralight leading-none tabular-nums text-white/30">
                0{i + 1}
              </span>
              <p className="pt-1 text-[15px] font-light leading-snug text-[#F3F3F1]">{g}</p>
            </Reveal>
          ))}
        </div>

        {/* process timeline */}
        <ol className="swipe-row mt-14 sm:mt-24 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-5">
          {STUDIO_PROCESS_STEPS.map((stage, i) => (
            <Reveal as="li" key={stage.step} delay={i * 0.08} className="group relative">
              <div className="flex items-center gap-4">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-3 w-3 rounded-full border border-white/50 transition-transform duration-700 group-hover:scale-150" />
                  <span className="h-1 w-1 rounded-full bg-white" />
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-white/0" />
              </div>
              <p className="mt-8 font-display text-[56px] font-extralight leading-none tracking-[-0.04em] text-white/20 transition-colors duration-700 group-hover:text-white/60">
                {stage.step}
              </p>
              <h3 className="mt-5 text-[19px] font-light leading-snug text-[#F3F3F1]">{stage.title}</h3>
              <p className="mt-3 text-[13.5px] font-light leading-relaxed text-white/50">{stage.description}</p>
              <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-white/70">— {stage.metric}</p>
            </Reveal>
          ))}
        </ol>

        {/* award + amenities */}
        <Reveal className="card-lux mt-16 grid sm:mt-24 grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Award className="h-6 w-6 text-white/70" aria-hidden="true" strokeWidth={1.25} />
            <p className="mt-6 text-[26px] font-light leading-tight tracking-[-0.01em] text-[#F3F3F1]">
              Награда Яндекс Карт
              <span className="block font-serif text-[30px] italic text-white/80">«{STUDIO_INFO.rating.award}»</span>
            </p>
            <p className="mt-4 text-[14px] font-light text-white/50">
              Входит в подборку лучших студий детейлинга Москвы. Работаем с автомобилями всех классов, суперкарами и
              электрокарами.
            </p>
          </div>
          <ul className="grid grid-cols-1 content-center gap-x-10 sm:grid-cols-2 lg:col-span-7">
            {STUDIO_INFO.amenities.map((item) => (
              <li key={item} className="flex items-center gap-4 border-b border-white/10 py-4 text-[14px] font-light text-white/75">
                <span className="h-px w-4 bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
