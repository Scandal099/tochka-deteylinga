import { ArrowRight, MapPin, Star } from "lucide-react";
import { STUDIO_INFO } from "@/data/studio";
import { assetPath } from "@/lib/utils";

const HERO_SERVICES = ["Полировка", "Керамика", "Защита PPF", "Химчистка"];

/**
 * Static hero. The photo, the giant word and the car cutout live in one
 * box sized like `object-cover` (landscape) or a wide band (portrait), so the
 * word always sits exactly behind the roof line. Pure CSS, no animation.
 */
export function HeroImage() {
  return (
    <section id="hero-stage" aria-label="Первый экран" className="relative h-[100svh] w-full bg-[#08080A]">
      <div className="hero-frame absolute inset-2 overflow-hidden rounded-[22px] bg-[#08080A] md:inset-[14px] md:rounded-[28px]">
        <div className="hero-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/hero-photo.jpg")}
            alt="Porsche 911 под студийным светом в ТОЧКЕ ДЕТЕЙЛИНГА"
            fetchPriority="high"
            className="absolute inset-0 z-0 h-full w-full select-none"
          />

          {/* portrait: soften top/bottom edges of the photo band */}
          <div aria-hidden="true" className="hero-band-fade pointer-events-none absolute inset-[-3px] z-[4]" />

          {/* vignette + scrims for legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[6]"
            style={{ background: "radial-gradient(120% 90% at 50% 45%, rgba(8,8,10,0) 55%, rgba(8,8,10,0.55) 100%)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[7] bg-gradient-to-t from-[#08080A]/85 via-[#08080A]/0 via-45% to-[#08080A]/40"
          />

          {/* giant word behind the car */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[15%] z-10 flex justify-center max-md:top-[2%]">
            <span className="hero-word relative flex select-none font-display font-extralight uppercase leading-[0.8] text-[#ECECEC]">
              <span className="hero-meta absolute bottom-full left-[0.5%] whitespace-nowrap font-sans text-[10px] font-normal uppercase leading-relaxed text-white/55 sm:text-[11px]">
                Детейлинг-студия · с {STUDIO_INFO.foundedYear}
                <span className="max-md:hidden"> · </span>
                <br className="md:hidden" />
                <span className="text-white/85">Москва, Митино</span>
              </span>
              ТОЧКА
            </span>
          </div>

          {/* car cutout in front of the word */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/hero-car-cutout.webp")}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none"
          />
        </div>

        {/* italic accent in front of the car */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[13%] z-30 flex justify-end px-6 max-md:bottom-auto max-md:top-[56%] max-md:justify-center lg:px-14"
        >
          <span className="select-none font-serif text-[clamp(64px,12.5vw,210px)] font-light italic leading-[0.9] tracking-[-0.025em] text-[#F3F3F1] drop-shadow-[0_18px_50px_rgba(0,0,0,0.6)] max-md:text-[19vw]">
            Детейлинга
          </span>
        </div>

        {/* services list */}
        <ul className="absolute right-6 top-[47%] z-30 hidden space-y-1.5 text-right text-[11px] uppercase tracking-[0.2em] text-white/70 md:block lg:right-14">
          {HERO_SERVICES.map((s) => (
            <li key={s}>
              <span className="mr-2 text-white/35">—</span>
              {s}
            </li>
          ))}
        </ul>

        {/* bottom: offer + CTA + address, rating */}
        <div className="absolute inset-x-0 bottom-0 z-30 px-6 pb-8 sm:pb-10 lg:px-14 lg:pb-12">
          <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6">
            <div className="max-w-[420px]">
              <h1 className="text-[20px] font-light leading-[1.3] tracking-[-0.01em] text-[#F3F3F1] sm:text-[24px]">
                Детейлинг, который
                <br />
                видно по отражению.
              </h1>
              <div className="mt-6">
                <a href="#booking" className="btn-lux group">
                  <span>Записаться на осмотр</span>
                  <span className="btn-lux-icon">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              </div>
              <p className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-[11px]">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{STUDIO_INFO.addressShort} · 09:00–22:00</span>
              </p>
            </div>

            <a
              href={STUDIO_INFO.links.yandexMapsShort}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-3 text-right lg:flex"
            >
              <span className="font-display text-[44px] font-extralight leading-none text-[#F3F3F1]">
                {STUDIO_INFO.rating.score.toFixed(1)}
              </span>
              <span className="text-[10px] uppercase leading-[1.7] tracking-[0.2em] text-white/55">
                <span className="flex justify-end gap-0.5 pb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-white/85 text-white/85" aria-hidden="true" />
                  ))}
                </span>
                Яндекс Карты
                <br />
                {STUDIO_INFO.rating.reviewsCount} отзывов
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* hairline border of the framed card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 z-40 rounded-[22px] border border-white/[0.09] md:inset-[14px] md:rounded-[28px]"
      />
    </section>
  );
}
