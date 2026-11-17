"use client";

import React, { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, Sparkles, Phone } from "lucide-react";
import { STUDIO_INFO } from "@/data/studio";
import { useCarePlan } from "@/context/CarePlanContext";
import { cn } from "@/lib/utils";
import { openCallback } from "@/lib/callback";

const NAV_ITEMS = [
  { label: "Цены", href: "#services" },
  { label: "Направления", href: "#directions" },
  { label: "Подход", href: "#process" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#booking" },
] as const;

export function Header() {
  const { count, setDrawerOpen } = useCarePlan();
  const [mode, setMode] = useState<"top" | "tour" | "page">("top");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero-stage");
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : 0;
      const y = window.scrollY;
      // "top" lasts until the framed hero has fully opened (≈0.4 viewport of scroll)
      setMode(y < window.innerHeight * 0.4 ? "top" : y < heroEnd - 10 ? "tour" : "page");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        mode === "top" && "border-b border-transparent",
        mode === "tour" && "border-b border-transparent",
        mode === "page" && "border-b border-white/[0.07] bg-[#08080A]/75 backdrop-blur-2xl"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-6 sm:h-[76px] lg:px-14">
        <a
          href="#hero-stage"
          className="group flex shrink-0 flex-col rounded-sm font-display text-[11px] font-normal uppercase leading-[1.25] tracking-[0.22em] text-[#F3F3F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:text-[12px]"
          aria-label="ТОЧКА ДЕТЕЙЛИНГА — наверх"
        >
          <span>Точка</span>
          <span className="text-white/60 transition-colors duration-500 group-hover:text-white">Детейлинга</span>
        </a>

        <nav aria-label="Основная навигация" className="hidden items-center gap-9 xl:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link text-[11px] font-normal uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Открыть мой план ухода, выбрано услуг: ${count}`}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 text-[11px] uppercase tracking-[0.18em] text-[#F3F3F1] transition-colors duration-500 hover:border-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <Sparkles className="h-3.5 w-3.5 text-white/55" aria-hidden="true" />
            <span className="hidden md:inline">План ухода</span>
            <span
              className={cn(
                "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium tabular-nums transition-colors",
                count > 0 ? "bg-[#F3F3F1] text-[#08080A]" : "bg-white/10 text-white/60"
              )}
            >
              {count}
            </span>
          </button>

          <a
            href={STUDIO_INFO.phones.detailing.href}
            className="hidden whitespace-nowrap px-2 text-[12px] tabular-nums tracking-[0.06em] text-white/80 transition-colors hover:text-white 2xl:inline"
          >
            {STUDIO_INFO.phones.detailing.display}
          </a>
          <button
            type="button"
            onClick={() => openCallback()}
            className="hidden h-11 cursor-pointer items-center gap-2 rounded-full border border-white/40 px-5 text-[11px] uppercase tracking-[0.18em] text-[#F3F3F1] transition-all duration-500 hover:border-white hover:bg-white hover:text-[#08080A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Заказать звонок
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 text-[#F3F3F1] transition-colors hover:border-white/40 xl:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100svh-64px)] overflow-y-auto border-t border-white/10 bg-[#08080A]/97 px-6 pb-8 pt-2 backdrop-blur-2xl xl:hidden">
          <nav aria-label="Меню" className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/[0.08] py-4 text-[22px] font-light text-[#F3F3F1]"
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 text-white/40" aria-hidden="true" />
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCallback();
              }}
              className="btn-lux btn-lux--plain w-full cursor-pointer justify-center"
            >
              Заказать звонок
            </button>
            <a href={STUDIO_INFO.phones.detailing.href} className="btn-ghost w-full">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {STUDIO_INFO.phones.detailing.display}
            </a>
            <p className="pt-2 text-center text-[12px] font-light text-white/45">
              {STUDIO_INFO.addressShort} · {STUDIO_INFO.hours}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
