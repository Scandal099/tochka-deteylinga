"use client";

import React from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { VERIFIED_REVIEWS } from "@/data/portfolio-reviews";
import { STUDIO_INFO } from "@/data/studio";
import { Reveal, SectionHeading } from "@/components/ui/lux";

export function ReviewsSection() {
  const [featured, ...rest] = VERIFIED_REVIEWS;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="section-lux bg-[#08080A]">
      <div className="wrap-lux">
        <SectionHeading
          id="reviews-heading"
          index="05"
          eyebrow="Отзывы с Яндекс Карт"
          title="Доверие"
          accent="владельцев"
          description={`Отзывы постоянных клиентов студии на Митинской, 15. Полный архив — ${STUDIO_INFO.rating.reviewsCount} отзывов — в карточке Яндекс Карт.`}
          aside={
            <a
              href={STUDIO_INFO.links.yandexMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-6"
            >
              <span className="font-display text-[88px] font-extralight leading-none tracking-[-0.05em] text-[#F3F3F1]">
                {STUDIO_INFO.rating.score.toFixed(1)}
              </span>
              <span className="text-[10px] uppercase leading-[1.9] tracking-[0.24em] text-white/50">
                <span className="flex gap-0.5 pb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-white/85 text-white/85" aria-hidden="true" />
                  ))}
                </span>
                {STUDIO_INFO.rating.ratingsCount} оценка
                <span className="flex items-center gap-1.5 text-white/85 transition-colors group-hover:text-white">
                  Все отзывы <ArrowUpRight className="h-3 w-3 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </span>
            </a>
          }
        />

        {/* featured quote */}
        {featured && (
          <Reveal className="mt-20 grid grid-cols-1 gap-8 border-t border-white/10 pt-14 lg:grid-cols-12">
            <span aria-hidden="true" className="font-serif text-[140px] leading-[0.6] text-white/15 lg:col-span-1">
              “
            </span>
            <figure className="lg:col-span-10">
              <blockquote className="font-serif text-[clamp(26px,3.2vw,44px)] font-light italic leading-[1.25] tracking-[-0.01em] text-[#F3F3F1]">
                {featured.text}
              </blockquote>
              <figcaption className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
                <span className="text-[#F3F3F1]">{featured.author}</span>
                <span className="h-px w-8 bg-white/25" />
                <span>{featured.serviceTag}</span>
                <span>· {featured.date}</span>
              </figcaption>
            </figure>
          </Reveal>
        )}

        {/* aspect bars */}
        <div className="mt-20 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {STUDIO_INFO.aspectHighlights.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.06}>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-light text-white/80">{a.label}</span>
                <span className="font-display text-[22px] font-extralight tabular-nums text-[#F3F3F1]">{a.score}</span>
              </div>
              <div className="mt-3 h-px w-full bg-white/10">
                <div className="h-px bg-white/80" style={{ width: a.score }} />
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/35">{a.count}</p>
            </Reveal>
          ))}
        </div>

        {/* review grid */}
        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((rev, i) => (
            <Reveal as="article" key={rev.id} delay={(i % 3) * 0.08} className="card-lux flex flex-col justify-between p-8 transition-colors duration-700 hover:border-white/20">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5" aria-label={`Оценка ${rev.rating} из 5`}>
                    {Array.from({ length: rev.rating }).map((_, k) => (
                      <Star key={k} className="h-3 w-3 fill-white/85 text-white/85" aria-hidden="true" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">{rev.date}</span>
                </div>
                <blockquote className="mt-7 text-[15px] font-light leading-[1.7] text-white/80">{rev.text}</blockquote>
              </div>
              <footer className="mt-10 border-t border-white/10 pt-5">
                <p className="text-[14px] text-[#F3F3F1]">{rev.author}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">{rev.serviceTag}</p>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
