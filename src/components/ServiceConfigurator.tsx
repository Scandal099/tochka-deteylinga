"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, Check, Plus, RotateCcw, Sparkles } from "lucide-react";
import { getServiceById, type DetailingService } from "@/data/services";
import { type CarClassId, useCarePlan } from "@/context/CarePlanContext";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, SectionHeading } from "@/components/ui/lux";
import { cn } from "@/lib/utils";

type ConditionId = "new" | "daily" | "worn";
type GoalId = "armor" | "gloss" | "interior" | "total";

const CAR_CLASSES: { id: CarClassId; label: string; hint: string }[] = [
  { id: "sedan", label: "Седан / Хэтчбек", hint: "C / D / E класс" },
  { id: "coupe", label: "Спорткар / Купе", hint: "911 / F32 / GT" },
  { id: "crossover", label: "Кроссовер", hint: "X5 / Cayenne / Macan" },
  { id: "suv", label: "Внедорожник / Минивэн", hint: "Крупный кузов" },
];

const CONDITIONS: { id: ConditionId; label: string; hint: string }[] = [
  { id: "new", label: "Новый из салона", hint: "Пробег до 3 000 км" },
  { id: "daily", label: "Лёгкая паутинка", hint: "Ежедневная эксплуатация" },
  { id: "worn", label: "Сколы и затёртость", hint: "Требует восстановления" },
];

const GOALS: { id: GoalId; label: string; hint: string }[] = [
  { id: "armor", label: "Броня от сколов", hint: "PPF + оптика" },
  { id: "gloss", label: "Глубокий глянец", hint: "Полировка + керамика" },
  { id: "interior", label: "Свежий салон и стёкла", hint: "Химчистка + кожа + антидождь" },
  { id: "total", label: "Комплекс под ключ", hint: "Кузов + салон + защита" },
];

function buildRecommendation(
  condition: ConditionId,
  goal: GoalId
): { title: string; reason: string; serviceIds: string[] } {
  if (goal === "armor") {
    return {
      title: "Архитектурная броня от сколов и пескоструя",
      reason:
        condition === "new"
          ? "Идеальный момент закрыть зоны риска и фары полиуретаном до первых трассовых сколов, закрепив кузов керамикой."
          : "Перед оклейкой освежаем оптику и лак полировкой, затем защищаем переднюю часть полиуретаном и стеклом антидождём.",
      serviceIds:
        condition === "new"
          ? ["protect-ppf-risk-zones", "optics-headlights-ppf", "protect-ceramic-1"]
          : [
              "body-antihologram-polish",
              "protect-ppf-risk-zones",
              "optics-headlights-ppf",
              "optics-antidote-rain",
            ],
    };
  }

  if (goal === "gloss") {
    return {
      title: "Выставочное зеркало и гидрофобный барьер",
      reason:
        condition === "worn"
          ? "Восстановительная полировка уберёт глубокую паутину, а 2 слоя керамики и полировка фар вернут чёткость отражения."
          : "Антиголограммная доводка раскроет глубину оттенка, а керамика упростит регулярные мойки.",
      serviceIds:
        condition === "new"
          ? ["protect-ceramic-2", "optics-antidote-rain"]
          : condition === "daily"
          ? ["body-polish-ceramic-duo", "optics-headlights-polish"]
          : ["body-restorative-polish", "protect-ceramic-2", "optics-headlights-polish", "body-chip-masking"],
    };
  }

  if (goal === "interior") {
    return {
      title: "Чистота салона и обзорность в дождь",
      reason:
        "Глубокая детейлинг-химчистка удалит загрязнения из кожи и швов, керамика защитит кресла от окрашивания, а антидождь снимет нагрузку со щёток.",
      serviceIds:
        condition === "worn"
          ? [
              "interior-detail-clean",
              "interior-leather-ceramic",
              "interior-trim-polish",
              "optics-windshield-polish",
              "optics-antidote-rain",
            ]
          : ["interior-detail-clean", "interior-leather-ceramic", "optics-antidote-rain"],
    };
  }

  return {
    title: "Полный комплекс «ТОЧКА ДЕТЕЙЛИНГА» под ключ",
    reason:
      "Сбалансированный сценарий для максимального сохранения стоимости автомобиля: полировка, защита кузова, чистый салон и уход за оптикой.",
    serviceIds:
      condition === "new"
        ? [
            "protect-ppf-risk-zones",
            "protect-ceramic-2",
            "interior-leather-ceramic",
            "optics-antidote-rain",
          ]
        : [
            "body-polish-ceramic-duo",
            "protect-ppf-risk-zones",
            "interior-detail-clean",
            "optics-headlights-ppf",
          ],
  };
}

export function ServiceConfigurator() {
  const { carClass, setCarClass, addMany, isInPlan } = useCarePlan();
  const [condition, setCondition] = useState<ConditionId>("daily");
  const [goal, setGoal] = useState<GoalId>("gloss");

  const recommendation = useMemo(
    () => buildRecommendation(condition, goal),
    [condition, goal]
  );

  const recommendedServices = useMemo(
    () =>
      recommendation.serviceIds
        .map((id) => getServiceById(id))
        .filter((s): s is DetailingService => Boolean(s)),
    [recommendation.serviceIds]
  );

  const totalFrom = useMemo(
    () => recommendedServices.reduce((sum, s) => sum + (s.priceFrom ?? 0), 0),
    [recommendedServices]
  );

  const allAdded = recommendedServices.every((s) => isInPlan(s.id));

  return (
    <section id="configurator" aria-labelledby="configurator-heading" className="section-lux bg-[#08080A]">
      <div className="wrap-lux">
        <SectionHeading
          id="configurator-heading"
          index="03"
          eyebrow="Персональный подбор"
          title="Подбор"
          accent="за 10 секунд"
          description="Класс кузова, состояние и задача — конфигуратор соберёт набор услуг из прайса без навязанных позиций."
        />

        <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-12 lg:col-span-7">
            <Step index="01" label="Класс автомобиля">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {CAR_CLASSES.map((item) => (
                  <Option key={item.id} active={carClass === item.id} onClick={() => setCarClass(item.id)} label={item.label} hint={item.hint} />
                ))}
              </div>
            </Step>
            <Step index="02" label="Состояние ЛКП и салона">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {CONDITIONS.map((item) => (
                  <Option key={item.id} active={condition === item.id} onClick={() => setCondition(item.id)} label={item.label} hint={item.hint} />
                ))}
              </div>
            </Step>
            <Step index="03" label="Главная цель">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {GOALS.map((item) => (
                  <Option key={item.id} active={goal === item.id} onClick={() => setGoal(item.id)} label={item.label} hint={item.hint} />
                ))}
              </div>
            </Step>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="card-lux flex h-full flex-col justify-between p-7 sm:p-10 lg:sticky lg:top-28">
              <div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/45">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Рекомендация студии
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCarClass("coupe");
                      setCondition("daily");
                      setGoal("gloss");
                    }}
                    aria-label="Сбросить параметры подбора"
                    className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    Сброс
                  </button>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${condition}-${goal}`}
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h3 className="mt-8 text-[26px] font-light leading-[1.15] tracking-[-0.015em] text-[#F3F3F1] sm:text-[30px]">
                      {recommendation.title}
                    </h3>
                    <p className="mt-4 text-[14px] font-light leading-relaxed text-white/55">{recommendation.reason}</p>

                    <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
                      {recommendedServices.map((srv) => (
                        <li key={srv.id} className="flex items-center justify-between gap-4 py-4">
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-light text-[#F3F3F1]">{srv.name}</p>
                            <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/40">
                              {srv.category} · {srv.duration}
                            </p>
                          </div>
                          <span className="shrink-0 text-[13px] tabular-nums text-white/80">{srv.priceDisplay}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-10">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Суммарный ориентир</p>
                    <p className="mt-1 text-[11px] text-white/35">{recommendedServices.length} услуги по прайсу</p>
                  </div>
                  <p className="font-display text-[34px] font-extralight tabular-nums leading-none tracking-[-0.02em] text-[#F3F3F1] sm:text-[40px]">
                    от {totalFrom.toLocaleString("ru-RU")} ₽
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => addMany(recommendedServices.map((s) => s.id))}
                    aria-pressed={allAdded}
                    className="btn-add h-[52px] flex-1 justify-center text-[11px]"
                  >
                    {allAdded ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                    {allAdded ? "Добавлено в план" : "Добавить всё в план"}
                  </button>
                  <a
                    href="#booking"
                    onClick={() => addMany(recommendedServices.map((s) => s.id))}
                    className="btn-lux group justify-between"
                  >
                    <span>Записаться</span>
                    <span className="btn-lux-icon">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Step({ index, label, children }: { index: string; label: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="mb-5 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-white/45">
        <span className="tabular-nums text-white/80">{index}</span>
        <span className="h-px w-8 bg-white/20" />
        {label}
      </p>
      {children}
    </Reveal>
  );
}

function Option({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative flex min-h-[76px] cursor-pointer items-center justify-between gap-4 rounded-[20px] border px-5 py-4 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        active
          ? "border-white/70 bg-white/[0.06]"
          : "border-white/[0.08] bg-white/[0.015] hover:border-white/25 hover:bg-white/[0.03]"
      )}
    >
      <span>
        <span className={cn("block text-[15px] font-light transition-colors", active ? "text-[#F3F3F1]" : "text-white/75")}>
          {label}
        </span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-white/40">{hint}</span>
      </span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
          active ? "border-white bg-white" : "border-white/25"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full bg-[#08080A] transition-transform duration-500", active ? "scale-100" : "scale-0")} />
      </span>
    </button>
  );
}
