"use client";

import React, { useEffect, useState } from "react";
import { Menu, X, ArrowRight, ArrowUpRight, Sparkles, Phone } from "lucide-react";
import { STUDIO_INFO } from "@/data/studio";
import { useCarePlan } from "@/context/CarePlanContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Услуги", href: "#services" },
  { label: "До / После", href: "#portfolio" },
  { label: "Подбор", href: "#configurator" },
  { label: "Подход", href: "#process" },
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
        mode === "top" && "border-b border-transparent pt-2 md:pt-[14px]",
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
            href="#booking"
            aria-label="Записаться"
            className="group hidden h-11 w-11 items-center justify-center rounded-full border border-white/40 text-[#F3F3F1] transition-all duration-500 hover:border-white hover:bg-white hover:text-[#08080A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:inline-flex"
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45" aria-hidden="true" />
          </a>

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

      {/* Responsive Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="border-t border-white/12 bg-[#08080A]/96 px-4 pb-6 pt-4 backdrop-blur-2xl xl:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#F5F5F5] transition-colors hover:border-white/35"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-[#9A9CA2]">
                <p className="font-medium text-[#F5F5F5]">{STUDIO_INFO.brandName}</p>
                <p>
                  {STUDIO_INFO.addressShort} · {STUDIO_INFO.hours}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={STUDIO_INFO.phones.detailing.href}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/18 px-4 py-2 text-xs text-[#F5F5F5]"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{STUDIO_INFO.phones.detailing.display}</span>
                </a>
                <a
                  href="#booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-[#F5F5F5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#08080A]"
                >
                  <span>Записаться</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
