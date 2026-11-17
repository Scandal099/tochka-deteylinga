"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { DIRECTIONS } from "@/data/directions";
import { openCallback } from "@/lib/callback";
import { Reveal, SectionHeading } from "@/components/ui/lux";
import { cn } from "@/lib/utils";

/** All directions of the studio (as in the detailinga.ru menu) as an accordion. */
export function DirectionsSection() {
  const [openId, setOpenId] = useState<string | null>(DIRECTIONS[0]?.id ?? null);

  return (
    <section id="directions" aria-labelledby="directions-heading" className="section-lux bg-[#08080A]">
      <div className="wrap-lux">
        <SectionHeading
          id="directions-heading"
          index="02"
          eyebrow="Все направления"
          title="Комплексно"
          accent="для автомобиля"
          description="Всё, чем занимается студия: от плёнки и керамики до шумоизоляции и шиномонтажа. Нажмите на услугу — перезвоним и назовём цену под вашу машину."
        />

        <div className="mt-14 border-t border-white/10 sm:mt-20">
          {DIRECTIONS.map((d, i) => {
            const isOpen = openId === d.id;
            return (
              <Reveal key={d.id} delay={Math.min(i, 4) * 0.04} className="border-b border-white/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : d.id)}
                    aria-expanded={isOpen}
                    aria-controls={`dir-${d.id}`}
                    className="group flex w-full cursor-pointer items-center gap-4 py-5 text-left sm:gap-8 sm:py-7"
                  >
                    <span className="w-7 shrink-0 text-[11px] tabular-nums tracking-[0.2em] text-white/35 sm:w-10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[20px] font-light tracking-[-0.01em] text-[#F3F3F1] sm:text-[30px]">
                      {d.title}
                    </span>
                    <span className="hidden text-[10px] uppercase tracking-[0.2em] text-white/40 sm:inline">
                      {d.items.length} услуг
                    </span>
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                        isOpen ? "rotate-45 border-white bg-white text-[#08080A]" : "border-white/20 text-white group-hover:border-white/50"
                      )}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                {/* grid-rows trick: smooth open/close without measuring heights */}
                <div
                  id={`dir-${d.id}`}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className="grid grid-cols-1 gap-x-10 pb-6 sm:grid-cols-2 sm:pb-8 sm:pl-[72px] lg:grid-cols-3">
                      {d.items.map((item) => (
                        <li key={item}>
                          <button
                            type="button"
                            tabIndex={isOpen ? 0 : -1}
                            onClick={() => openCallback(item)}
                            className="group flex w-full cursor-pointer items-center justify-between gap-4 border-b border-white/[0.06] py-3.5 text-left text-[15px] font-light text-white/75 transition-colors hover:text-white"
                          >
                            {item}
                            <span className="shrink-0 text-[9px] uppercase tracking-[0.2em] text-white/35 transition-colors group-hover:text-white">
                              Узнать цену
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* "Остались вопросы?" — callback strip, as on detailinga.ru */}
        <Reveal className="card-lux mt-14 flex flex-col items-start justify-between gap-6 p-7 sm:mt-20 sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-[22px] font-light leading-tight text-[#F3F3F1] sm:text-[28px]">Остались вопросы?</p>
            <p className="mt-2 text-[14px] font-light text-white/55">Закажите звонок — менеджер проконсультирует вас.</p>
          </div>
          <button type="button" onClick={() => openCallback()} className="btn-lux btn-lux--plain cursor-pointer max-sm:w-full max-sm:justify-center">
            Заказать звонок
          </button>
        </Reveal>
      </div>
    </section>
  );
}
