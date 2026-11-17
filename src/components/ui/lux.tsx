"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Gentle fade-up when scrolled into view (no blur: cheap on phones, no layout shift). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article" | "span";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const Comp = motion[as];
  return (
    <Comp
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/** One line of text that rises out of a mask. */
function MaskLine({
  children,
  delay,
  inView,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  inView: boolean;
  className?: string;
}) {
  return (
    <span className={cn("block pb-[0.08em] [clip-path:inset(-0.2em_-100vw_0_-100vw)]", className)}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : undefined}
        transition={{ duration: 1.3, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Editorial section heading used across the page:
 * (01) eyebrow · thin uppercase title · italic serif accent.
 */
export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  accent,
  description,
  aside,
  className,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <div ref={ref} className={cn("flex flex-col justify-between gap-10 lg:flex-row lg:items-end", className)}>
      <div className="min-w-0">
        <Reveal className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/45 sm:text-[11px]">
          <span className="tabular-nums text-white/80">({index})</span>
          <span className="h-px w-10 bg-white/25" />
          <span>{eyebrow}</span>
        </Reveal>
        <h2 id={id} className="mt-7 text-[#F3F3F1]">
          <MaskLine
            delay={0.05}
            inView={inView}
            className="font-display text-[clamp(40px,7.2vw,112px)] font-extralight uppercase leading-[0.9] tracking-[-0.03em]"
          >
            {title}
          </MaskLine>
          <MaskLine
            delay={0.18}
            inView={inView}
            className="pl-[0.6em] font-serif text-[clamp(44px,7.6vw,120px)] font-light italic leading-[0.95] tracking-[-0.02em] text-white/85 sm:pl-[1.4em]"
          >
            {accent}
          </MaskLine>
        </h2>
        {description && (
          <Reveal delay={0.25} className="mt-8 max-w-xl text-[15px] font-light leading-relaxed text-white/55">
            {description}
          </Reveal>
        )}
      </div>
      {aside && <Reveal delay={0.3}>{aside}</Reveal>}
    </div>
  );
}

/** Underlined text tabs with a superscript counter. */
export function LuxTabs<T extends string>({
  items,
  value,
  onChange,
  label,
  counts,
}: {
  items: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  counts?: Partial<Record<T, number>>;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="no-scrollbar -mx-6 flex gap-x-7 gap-y-3 overflow-x-auto whitespace-nowrap px-6 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {items.map((item) => {
        const active = item === value;
        return (
          <button
            key={item}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item)}
            className={cn(
              "group relative shrink-0 cursor-pointer pb-2 text-[11px] uppercase tracking-[0.22em] transition-colors duration-500",
              active ? "text-[#F3F3F1]" : "text-white/40 hover:text-white/80"
            )}
          >
            {item}
            {counts?.[item] !== undefined && (
              <sup className="ml-1 text-[9px] tabular-nums text-white/40">{counts[item]}</sup>
            )}
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 h-px origin-left bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-hover:bg-white/30"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
