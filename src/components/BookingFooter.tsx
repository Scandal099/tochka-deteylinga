"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  MessageCircle,
  Navigation,
  Send,
} from "lucide-react";
import { STUDIO_INFO } from "@/data/studio";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "@/components/ui/lux";

export function BookingFooter() {
  const [carModel, setCarModel] = useState("");
  const [clientName, setClientName] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedOrderText = useMemo(() => {
    return [
      `Заявка в студию ${STUDIO_INFO.brandName}`,
      `Автомобиль: ${carModel.trim() || "Не указан"}`,
      `Имя: ${clientName.trim() || "Не указано"}`,
      `Телефон: ${contact.trim()}`,
      comment.trim() ? `Комментарий: ${comment.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [carModel, clientName, comment, contact]);

  const whatsappHref = useMemo(() => {
    return `https://wa.me/79299991819?text=${encodeURIComponent(formattedOrderText)}`;
  }, [formattedOrderText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carModel.trim()) {
      setErrorMsg("Укажите марку автомобиля.");
      return;
    }
    if (!contact.trim()) {
      setErrorMsg("Укажите телефон, чтобы мы могли перезвонить.");
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
                  <p className="label-lux">Онлайн-заявка</p>
                  <h3 className="mt-3 text-[26px] font-light leading-tight tracking-[-0.015em] text-[#F3F3F1] sm:text-[34px]">
                    Записаться на осмотр
                  </h3>
                  <p className="mt-2 text-[14px] font-light text-white/50">
                    Получите персональное предложение под ваш автомобиль.
                  </p>
                </div>
              </div>


              {!submitted ? (
                <form onSubmit={handleSubmit} className="mt-10 space-y-8" noValidate>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="booking-car-model" className="label-lux">
                        Марка авто *
                      </Label>
                      <input
                        id="booking-car-model"
                        type="text"
                        required
                        autoComplete="off"
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                        placeholder="Например, BMW X5"
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-name" className="label-lux">
                        Ваше имя
                      </Label>
                      <input
                        id="booking-name"
                        type="text"
                        autoComplete="name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Имя"
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-contact" className="label-lux">
                        Телефон *
                      </Label>
                      <input
                        id="booking-contact"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
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
                      Комментарий
                    </Label>
                    <textarea
                      id="booking-comment"
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Что нужно сделать, удобная дата"
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
                      <span>Отправить заявку</span>
                      <span className="btn-lux-icon">
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </button>
                    <p className="text-[12px] font-light leading-snug text-white/40 sm:max-w-[260px] sm:text-right">
                      Без предоплаты. Отправляя заявку, вы соглашаетесь с{" "}
                      <a href={STUDIO_INFO.links.privacy} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                        политикой обработки персональных данных
                      </a>
                      .
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

        {/* Telegram (as on detailinga.ru) */}
        <Reveal className="mt-20 flex flex-col items-start justify-between gap-5 border-y border-white/10 py-8 sm:flex-row sm:items-center">
          <p className="text-[20px] font-light leading-snug text-[#F3F3F1] sm:text-[24px]">
            Актуальные работы и акции — в нашем Telegram
          </p>
          <a href={STUDIO_INFO.links.telegramChannel} target="_blank" rel="noopener noreferrer" className="btn-ghost shrink-0">
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Подписаться
          </a>
        </Reveal>

        {/* bottom bar */}
        <div className="mt-8 flex flex-col gap-6 text-[11px] uppercase tracking-[0.2em] text-white/40 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Ссылки студии" className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: "detailinga.ru", href: STUDIO_INFO.links.website },
              { label: "ВКонтакте", href: STUDIO_INFO.links.vk },
              { label: "YouTube", href: STUDIO_INFO.links.youtube },
              { label: "Telegram-канал", href: STUDIO_INFO.links.telegramChannel },
              { label: "Яндекс Карты · 5.0", href: STUDIO_INFO.links.yandexMaps },
              { label: "Политика конфиденциальности", href: STUDIO_INFO.links.privacy },
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
      <div aria-hidden="true" className="pointer-events-none mt-10 select-none overflow-hidden pb-[3vw]">
        <p className="text-center font-display text-[25vw] font-extralight uppercase leading-[0.8] tracking-[-0.04em] text-white/[0.06]">
          Точка
        </p>
      </div>
      <p className="sr-only">
        © {new Date().getFullYear()} {STUDIO_INFO.legalTitle} · {STUDIO_INFO.addressShort}
      </p>
    </footer>
  );
}
