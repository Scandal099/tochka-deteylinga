export function HeroImage() {
  return (
    <section
      id="hero-stage"
      className="relative w-full h-[100dvh] bg-[#08080A] overflow-hidden"
    >
      <img
        src="/hero-photo.jpg"
        alt="Porsche 911"
        className="w-full h-full object-cover"
      />
    </section>
  );
}
