import { assetPath } from "@/lib/utils";

export function HeroImage() {
  return (
    <section
      id="hero-stage"
      className="relative h-[100dvh] w-full overflow-hidden bg-[#08080A]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assetPath("/hero-photo.jpg")}
        alt="Porsche 911 в студии детейлинга"
        className="h-full w-full object-cover object-[40%_50%] md:object-center"
        fetchPriority="high"
      />
    </section>
  );
}
