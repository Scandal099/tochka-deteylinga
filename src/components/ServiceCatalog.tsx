"use client";

import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { SERVICE_CATEGORIES, SERVICES, type ServiceCategory } from "@/data/services";
import { useCarePlan } from "@/context/CarePlanContext";
import { LuxTabs, SectionHeading } from "@/components/ui/lux";

type FilterValue = "Все" | ServiceCategory;
const FILTERS: readonly FilterValue[] = ["Все", ...SERVICE_CATEGORIES];
const VISIBLE = 6;

export function ServiceCatalog() {
  const [category, setCategory] = useState<FilterValue>("Все");
  const [expanded, setExpanded] = useState(false);
  const { isInPlan, toggleItem } = useCarePlan();

  const counts = useMemo(() => {
    const c: Partial<Record<FilterValue, number>> = { Все: SERVICES.length };
    for (const cat of SERVICE_CATEGORIES) c[cat] = SERVICES.filter((s) => s.category === cat).length;
    return c;
  }, []);

  const list = useMemo(
    () => (category === "Все" ? SERVICES : SERVICES.filter((s) => s.category === category)),
    [category]
  );

  return (
    <section id="services" aria-labelledby="services-heading" className="section-lux bg-[#08080A]">
      <div className="wrap-lux">
        <SectionHeading
          id="services-heading"
          index="01"
          eyebrow="Услуги и прайс"
          title="Услуги"
          accent="и защита"
          description="Цены сверены с прайсом студии. Отмечайте позиции — они сразу попадут в «Мой план ухода» и в форму записи."
        />

        <div className="mt-16 sm:mt-20">
          <LuxTabs
            items={FILTERS}
            value={category}
            onChange={(c) => {
              setCategory(c);
              setExpanded(false);
            }}
            label="Фильтр услуг"
            counts={counts}
          />
        </div>

        {/* Price list */}
        <div className="mt-10 border-t border-white/10">
            {(expanded ? list : list.slice(0, VISIBLE)).map((service, i) => {
              const added = isInPlan(service.id);
              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="group relative grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-3 border-b border-white/10 py-6 transition-colors duration-500 hover:bg-white/[0.018] sm:py-9 lg:grid-cols-[72px_minmax(0,1.1fr)_minmax(0,1fr)_160px_150px] lg:items-center lg:gap-x-10"
                >
                  <span className="hidden text-[11px] tabular-nums tracking-[0.2em] text-white/35 lg:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.24em] text-white/40">
                      <span>{service.category}</span>
                      {service.badge && (
                        <span className="rounded-full border border-white/20 px-2.5 py-0.5 text-white/75">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-[18px] font-light leading-snug tracking-[-0.01em] text-[#F3F3F1] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 sm:text-[24px]">
                      {service.name}
                    </h3>
                  </div>

                  <p className="col-span-2 text-[14px] font-light leading-relaxed text-white/50 max-sm:hidden lg:col-span-1">
                    {service.shortDescription}
                    {service.highlightNote && (
                      <span className="mt-2 block text-[12px] text-white/70">— {service.highlightNote}</span>
                    )}
                  </p>

                  <div className="col-start-1 row-start-3 lg:col-start-auto lg:row-start-auto">
                    <p className="font-display text-[20px] font-light tabular-nums sm:text-[22px] tracking-[-0.01em] text-[#F3F3F1]">
                      {service.priceDisplay}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-white/40">{service.duration}</p>
                  </div>

                  <div className="col-start-2 row-start-3 flex justify-end lg:col-start-auto lg:row-start-auto">
                    <button
                      type="button"
                      onClick={() => toggleItem(service.id)}
                      aria-pressed={added}
                      aria-label={added ? `Убрать «${service.name}» из плана` : `Добавить «${service.name}» в план`}
                      className="btn-add"
                    >
                      {added ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                      {added ? "В плане" : "В план"}
                    </button>
                  </div>
                </motion.article>
              );
            })}
        </div>

        {list.length > VISIBLE && (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="btn-ghost cursor-pointer">
              {expanded ? "Свернуть" : `Показать все услуги · ${list.length}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
