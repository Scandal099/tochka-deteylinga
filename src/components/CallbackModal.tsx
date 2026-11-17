"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Phone, X } from "lucide-react";
import { STUDIO_INFO } from "@/data/studio";
import { CALLBACK_EVENT } from "@/lib/callback";

/**
 * "Заказать звонок" dialog — same fields as on detailinga.ru (марка авто, имя,
 * телефон). The site is static, so the request is handed to WhatsApp / a call.
 */
export function CallbackModal() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<string | undefined>();
  const [car, setCar] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setTopic((e as CustomEvent<string | undefined>).detail);
      setDone(false);
      setError("");
      setOpen(true);
    };
    window.addEventListener(CALLBACK_EVENT, onOpen);
    return () => window.removeEventListener(CALLBACK_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstField.current?.focus(), 250);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  const message = [
    `Заказ звонка — ${STUDIO_INFO.brandName}`,
    topic ? `Услуга: ${topic}` : "",
    `Марка авто: ${car.trim()}`,
    name.trim() ? `Имя: ${name.trim()}` : "",
    `Телефон: ${phone.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!car.trim()) return setError("Укажите марку автомобиля.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Укажите телефон полностью.");
    setError("");
    setDone(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="callback-title"
            className="relative w-full max-w-[480px] rounded-t-[28px] border border-white/10 bg-[#0F0F11] p-6 pb-8 shadow-2xl sm:rounded-[28px] sm:p-10"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {!done ? (
              <form onSubmit={submit} noValidate>
                <p className="label-lux">Заказать звонок</p>
                <h2 id="callback-title" className="mt-3 pr-12 text-[24px] font-light leading-tight text-[#F3F3F1] sm:text-[28px]">
                  Перезвоним и всё подскажем
                </h2>
                {topic && (
                  <p className="mt-3 inline-flex rounded-full border border-white/15 px-3 py-1 text-[12px] font-light text-white/75">
                    {topic}
                  </p>
                )}

                <div className="mt-7 space-y-6">
                  <label className="block">
                    <span className="label-lux">Марка авто *</span>
                    <input
                      ref={firstField}
                      value={car}
                      onChange={(e) => setCar(e.target.value)}
                      placeholder="Например, BMW X5"
                      autoComplete="off"
                      className="field-lux"
                    />
                  </label>
                  <label className="block">
                    <span className="label-lux">Имя</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Как к вам обращаться"
                      autoComplete="name"
                      className="field-lux"
                    />
                  </label>
                  <label className="block">
                    <span className="label-lux">Телефон *</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className="field-lux"
                    />
                  </label>
                </div>

                {error && (
                  <p role="alert" className="mt-4 text-[13px] font-light text-red-300">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-lux btn-lux--plain mt-8 w-full cursor-pointer justify-center">
                  Заказать звонок
                </button>
                <p className="mt-4 text-[11px] font-light leading-snug text-white/40">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a href={STUDIO_INFO.links.privacy} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    политикой обработки персональных данных
                  </a>
                  .
                </p>
              </form>
            ) : (
              <div>
                <p className="label-lux">Заявка готова</p>
                <h2 id="callback-title" className="mt-3 pr-12 text-[24px] font-light leading-tight text-[#F3F3F1]">
                  Отправьте её администратору
                </h2>
                <p className="mt-3 text-[14px] font-light text-white/55">
                  Одно нажатие — и заявка уйдёт в WhatsApp студии. Или просто позвоните.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/79299991819?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-lux btn-lux--plain w-full justify-center"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Отправить в WhatsApp
                  </a>
                  <a href={STUDIO_INFO.phones.detailing.href} className="btn-ghost w-full">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {STUDIO_INFO.phones.detailing.display}
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
