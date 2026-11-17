"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  MessageCircle,
  Navigation,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { STUDIO_INFO } from "@/data/studio";
import { type CarClassId, useCarePlan } from "@/context/CarePlanContext";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "@/components/ui/lux";

const CAR_CLASS_LABELS: Record<CarClassId, string> = {
  sedan: "Седан / Хэтчбек",
  coupe: "Спорткар / Купе",
  crossover: "Кроссовер",
  suv: "Внедорожник / Минивэн",
};

export function BookingFooter() {
  const { services, totalFrom, carClass, setCarClass, removeItem } = useCarePlan();

  const [carModel, setCarModel] = useState("");
  const [clientName, setClientName] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedOrderText = useMemo(() => {
    const planLines =
      services.length > 0
        ? services
            .map((s, idx) => `${idx + 1}. ${s.name} (${s.priceDisplay})`)
            .join("\n")
        : "Консультация и осмотр в студии";
    const totalLine =
      totalFrom > 0 ? `Ориентир по прайсу: от ${totalFrom.toLocaleString("ru-RU")} ₽` : "";

    return [
      `Заявка в студию ${STUDIO_INFO.brandName}`,
      `Автомобиль: ${carModel.trim() || "Не указан"} (${CAR_CLASS_LABELS[carClass]})`,
      `Имя: ${clientName.trim() || "Не указано"}`,
      `Контакт: ${contact.trim()}`,
      `План ухода:`,
      planLines,
      totalLine,
      comment.trim() ? `Комментарий: ${comment.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [carClass, carModel, clientName, comment, contact, services, totalFrom]);

  const whatsappHref = useMemo(() => {
    return `https://wa.me/79299991819?text=${encodeURIComponent(formattedOrderText)}`;
  }, [formattedOrderText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carModel.trim()) {
      setErrorMsg("Укажите марку и модель автомобиля (например, Porsche 911 или BMW X5).");
      return;
    }
    if (!contact.trim()) {
      setErrorMsg("Укажите номер телефона или ник в Telegram для подтверждения записи.");
      return;
    }
    setErrorMsg("");
    setSubmitted(true);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(formattedOrderText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures
    }
  };

  const fieldCls = "field-lux";

  return (
    <footer id="booking" aria-labelledby="booking-heading" className="section-lux overflow-hidden bg-[#08080A] pb-0">
      <div className="wrap-lux">
        <SectionHeading
          id="booking-heading"
          index="05"
          eyebrow="Запись и контакты"
          title="Студия"
          accent="в Митино"
          description="Приезжайте на бесплатный осмотр при студийном свете — замерим ЛКП, покажем образцы полиуретана и зафиксируем смету до начала работ."
        />

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Contacts */}
          <Reveal className="lg:col-span-5">
            <dl className="divide-y divide-white/10 border-y border-white/10">
              <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[110px_1fr] sm:gap-6">
                <dt className="label-lux pt-1">Адрес</dt>
                <dd>
                  <p className="text-[17px] font-light leading-snug text-[#F3F3F1]">{STUDIO_INFO.addressFull}</p>
                  <p className="mt-2 text-[13px] font-light text-white/45">
                    {STUDIO_INFO.metro}
                    <br />
                    {STUDIO_INFO.busStop}
                  </p>
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[110px_1fr] sm:gap-6">
                <dt className="label-lux pt-1">Часы</dt>
                <dd className="text-[17px] font-light text-[#F3F3F1]">
                  {STUDIO_INFO.hours}
                  <p className="mt-1 text-[13px] text-white/45">Приёмка автомобилей без выходных</p>
                </dd>
              </div>
              {[STUDIO_INFO.phones.detailing, STUDIO_INFO.phones.carwash].map((p) => (
                <div key={p.href} className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[110px_1fr] sm:gap-6">
                  <dt className="label-lux pt-2">{p.label}</dt>
                  <dd>
                    <a
                      href={p.href}
                      className="group inline-flex items-center gap-3 whitespace-nowrap font-display text-[clamp(24px,2.4vw,30px)] font-extralight tabular-nums tracking-[-0.01em] text-[#F3F3F1]"
                    >
                      {p.display}
                      <ArrowUpRight className="h-4 w-4 text-white/40 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </a>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={STUDIO_INFO.links.yandexRoute} target="_blank" rel="noopener noreferrer" className="btn-lux group">
                <span>Построить маршрут</span>
                <span className="btn-lux-icon">
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
              <a href={STUDIO_INFO.links.telegram} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                Telegram
              </a>
              <a href={STUDIO_INFO.links.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="card-lux p-7 sm:p-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="label-lux">Онлайн-запись</p>
                  <h3 className="mt-3 text-[28px] font-light leading-tight tracking-[-0.015em] text-[#F3F3F1] sm:text-[34px]">
                    Записаться на <span className="font-serif italic text-white/85">осмотр</span>
                  </h3>
                </div>
                {totalFrom > 0 && (
                  <p className="text-right">
                    <span className="label-lux">Ориентир</span>
                    <span className="mt-1 block font-display text-[26px] font-extralight tabular-nums text-[#F3F3F1]">
                      от {totalFrom.toLocaleString("ru-RU")} ₽
                    </span>
                  </p>
                )}
              </div>

              {/* plan */}
              <div className="mt-10">
                <div className="flex items-center justify-between gap-2">
                  <span className="label-lux inline-flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Мой план ухода · {services.length}
                  </span>
                  <a href="#services" className="text-[10px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white">
                    {services.length > 0 ? "Добавить ещё" : "Выбрать услуги"}
                  </a>
                </div>
                {services.length === 0 ? (
                  <p className="mt-3 text-[13px] font-light text-white/40">
                    Пока пусто — можно записаться просто на диагностику или отметить услуги выше.
                  </p>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {services.map((srv) => (
                      <span
                        key={srv.id}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 py-1.5 pl-4 pr-1.5 text-[12px] font-light text-[#F3F3F1]"
                      >
                        {srv.name}
                        <span className="text-[11px] tabular-nums text-white/45">{srv.priceDisplay}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(srv.id)}
                          aria-label={`Убрать ${srv.name}`}
                          className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <X className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="mt-10 space-y-8" noValidate>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="booking-car-model" className="label-lux">
                        Марка и модель *
                      </Label>
                      <input
                        id="booking-car-model"
                        type="text"
                        required
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                        placeholder="Porsche 911 / BMW F32"
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-car-class" className="label-lux">
                        Класс кузова
                      </Label>
                      <Select value={carClass} onValueChange={(v) => setCarClass(v as CarClassId)}>
                        <SelectTrigger
                          id="booking-car-class"
                          className="h-auto w-full rounded-none border-0 border-b border-white/16 bg-transparent px-0 py-[14px] text-[16px] font-light text-[#F3F3F1] shadow-none focus-visible:ring-0 dark:bg-transparent"
                        >
                          <SelectValue placeholder="Выберите класс" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-white/10 bg-[#111113] text-[#F3F3F1]">
                          {Object.entries(CAR_CLASS_LABELS).map(([id, label]) => (
                            <SelectItem key={id} value={id}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="booking-name" className="label-lux">
                        Ваше имя
                      </Label>
                      <input
                        id="booking-name"
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Как к вам обращаться"
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-contact" className="label-lux">
                        Телефон или @Telegram *
                      </Label>
                      <input
                        id="booking-contact"
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="+7 (___) ___-__-__"
                        className={fieldCls}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="booking-comment" className="label-lux">
                      Пожелания или удобная дата
                    </Label>
                    <textarea
                      id="booking-comment"
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Например: удобнее в пятницу утром, нужен замер ЛКП"
                      className={cn(fieldCls, "resize-none")}
                    />
                  </div>

                  {errorMsg && (
                    <p role="alert" className="text-[13px] font-light text-red-300">
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button type="submit" className="btn-lux group cursor-pointer">
                      <span>Сформировать запись</span>
                      <span className="btn-lux-icon">
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </button>
                    <p className="text-[12px] font-light leading-snug text-white/40 sm:max-w-[240px] sm:text-right">
                      Без предоплаты. Подтвердим время в удобном мессенджере.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="mt-10 space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F3F1] text-[#08080A]">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h4 className="text-[20px] font-light text-[#F3F3F1]">Заявка готова</h4>
                      <p className="mt-1 text-[14px] font-light text-white/55">
                        Отправьте её мастеру-приёмщику в WhatsApp или Telegram, либо позвоните:{" "}
                        <a href={STUDIO_INFO.phones.detailing.href} className="text-[#F3F3F1] underline underline-offset-4">
                          {STUDIO_INFO.phones.detailing.display}
                        </a>
                      </p>
                    </div>
                  </div>
                  <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-5 font-sans text-[13px] font-light leading-relaxed text-white/80">
                    {formattedOrderText}
                  </pre>
                  <div className="flex flex-wrap gap-3">
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-lux group">
                      <span>Отправить в WhatsApp</span>
                      <span className="btn-lux-icon">
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </a>
                    <a href={STUDIO_INFO.links.telegram} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      Telegram
                    </a>
                    <button type="button" onClick={handleCopySummary} className="btn-ghost cursor-pointer">
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      {copied ? "Скопировано" : "Копировать"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="cursor-pointer px-3 text-[11px] uppercase tracking-[0.18em] text-white/50 underline-offset-4 hover:text-white hover:underline"
                    >
                      Редактировать
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* bottom bar */}
        <div className="mt-28 flex flex-col gap-6 border-t border-white/10 pt-8 text-[11px] uppercase tracking-[0.2em] text-white/40 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Ссылки студии" className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: "detailinga.ru", href: STUDIO_INFO.links.website },
              { label: "ВКонтакте", href: STUDIO_INFO.links.vk },
              { label: "YouTube", href: STUDIO_INFO.links.youtube },
              { label: "Telegram-канал", href: STUDIO_INFO.links.telegramChannel },
              { label: "Яндекс Карты · 5.0", href: STUDIO_INFO.links.yandexMaps },
            ].map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="nav-link transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
          <p className="normal-case tracking-normal text-[12px] font-light text-white/35">
            Демо-концепт сайта для компании «{STUDIO_INFO.brandName}». Удалим по первой просьбе.
          </p>
        </div>
      </div>

      {/* sign-off wordmark */}
      <div aria-hidden="true" className="pointer-events-none mt-10 select-none overflow-hidden">
        <p className="translate-y-[18%] text-center font-display text-[25vw] font-extralight uppercase leading-[0.8] tracking-[-0.04em] text-white/[0.06]">
          Точка
        </p>
      </div>
      <p className="sr-only">
        © {new Date().getFullYear()} {STUDIO_INFO.legalTitle} · {STUDIO_INFO.addressShort}
      </p>
    </footer>
  );
}
