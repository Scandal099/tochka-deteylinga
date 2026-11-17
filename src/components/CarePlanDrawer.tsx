"use client";

import React from "react";
import { ArrowRight, Trash2, X, Sparkles, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCarePlan } from "@/context/CarePlanContext";
import { STUDIO_INFO } from "@/data/studio";

export function CarePlanDrawer() {
  const {
    services,
    count,
    totalFrom,
    drawerOpen,
    setDrawerOpen,
    removeItem,
    clearPlan,
  } = useCarePlan();

  const handleGoToBooking = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      const target = document.getElementById("booking");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 180);
  };

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l border-white/12 bg-[#08080A]/98 p-0 text-[#F5F5F5] sm:max-w-[440px]"
      >
        <SheetHeader className="border-b border-white/12 px-6 py-5 text-left">
          <div className="flex items-center justify-between pr-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#9A9CA2]">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {STUDIO_INFO.brandName}
            </span>
            <span className="font-mono text-xs text-[#9A9CA2]">
              {count} {count === 1 ? "позиция" : count >= 2 && count <= 4 ? "позиции" : "позиций"}
            </span>
          </div>
          <SheetTitle className="mt-3 font-display text-xl font-medium uppercase tracking-[0.06em] text-[#F5F5F5]">
            Мой план ухода
          </SheetTitle>
          <SheetDescription className="text-sm text-[#9A9CA2]">
            Выбранные позиции автоматически подставятся в заявку на осмотр и расчёт под ваш автомобиль.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {services.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/14 bg-[#121316]/60 p-8 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
                <Sparkles className="h-5 w-5 text-[#9A9CA2]" aria-hidden="true" />
              </div>
              <p className="font-display text-base font-medium text-[#F5F5F5]">
                План ухода пока пуст
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#9A9CA2]">
                Добавляйте услуги прямо во время скролл-тура вокруг Porsche 911, в каталоге или через быстрый подбор.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <a
                  href="#services"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.12em] text-[#F5F5F5] transition-colors hover:border-white/40"
                >
                  Открыть каталог
                </a>
                <a
                  href="#configurator"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full bg-[#F5F5F5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#08080A]"
                >
                  Подобрать пакет
                </a>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="group relative rounded-2xl border border-white/12 bg-[#121316] p-4 transition-colors hover:border-white/25"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-[#9A9CA2]">
                        <Check className="h-3 w-3 text-[#F5F5F5]" aria-hidden="true" />
                        {service.category}
                      </span>
                      <h4 className="mt-1 text-sm font-medium leading-snug text-[#F5F5F5]">
                        {service.name}
                      </h4>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#9A9CA2]">
                        <span className="font-mono text-[#F5F5F5]">
                          {service.priceDisplay}
                        </span>
                        <span>·</span>
                        <span>{service.duration}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(service.id)}
                      aria-label={`Удалить «${service.name}» из плана ухода`}
                      className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#9A9CA2] transition-colors hover:border-white/30 hover:bg-white/10 hover:text-[#F5F5F5]"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-white/12 bg-[#121316]/90 px-6 py-5">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#9A9CA2]">
                Предварительный ориентир
              </p>
              <p className="mt-0.5 text-[11px] text-[#9A9CA2]">
                Точный расчёт зависит от класса кузова и состояния ЛКП
              </p>
            </div>
            <p className="font-display text-xl font-semibold tabular-nums text-[#F5F5F5]">
              {totalFrom > 0
                ? `от ${totalFrom.toLocaleString("ru-RU")} ₽`
                : "0 ₽"}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {count > 0 && (
              <button
                type="button"
                onClick={clearPlan}
                aria-label="Очистить весь план ухода"
                className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-1.5 rounded-full border border-white/16 bg-transparent px-4 text-xs uppercase tracking-[0.12em] text-[#9A9CA2] transition-colors hover:border-white/35 hover:text-[#F5F5F5]"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Сбросить</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleGoToBooking}
              className="inline-flex min-h-[46px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F5F5F5] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#08080A] transition-all hover:bg-white"
            >
              <span>Перейти к записи</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
