"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, Layers } from "lucide-react";
import { useCarePlan } from "@/context/CarePlanContext";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";

export function CarePlanBar() {
  const { count, totalFrom, setDrawerOpen } = useCarePlan();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-4 right-4 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:bottom-6 sm:right-6",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 [&_button]:pointer-events-none"
      )}
    >
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label={`Мой план ухода: ${count} выбранных услуг`}
        className={cn(
          "pointer-events-auto relative flex min-h-[48px] cursor-pointer items-center gap-3 overflow-hidden rounded-full border px-4 py-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5",
          count > 0
            ? "border-white/25 bg-[#121316]/92 text-[#F5F5F5]"
            : "border-white/14 bg-[#08080A]/85 text-[#9A9CA2] hover:border-white/30 hover:text-[#F5F5F5]"
        )}
      >
        {count > 0 && (
          <BorderBeam
            size={48}
            duration={6}
            colorFrom="rgba(245,245,245,0.75)"
            colorTo="rgba(245,245,245,0.12)"
          />
        )}
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
          <Layers className="h-3.5 w-3.5 text-[#F5F5F5]" aria-hidden="true" />
        </span>
        <span className="relative flex flex-col items-start text-left leading-tight">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#F5F5F5]">
            Мой план ухода{" "}
            <span className="font-mono text-white/80">({count})</span>
          </span>
          <span className="text-[11px] text-[#9A9CA2]">
            {count > 0
              ? `от ${totalFrom.toLocaleString("ru-RU")} ₽`
              : "Отмечайте зоны авто"}
          </span>
        </span>
        <ArrowUpRight className="relative h-4 w-4 text-[#9A9CA2]" aria-hidden="true" />
      </button>
    </div>
  );
}
