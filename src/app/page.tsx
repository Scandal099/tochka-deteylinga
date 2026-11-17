import { Header } from "@/components/Header";
import { HeroImage } from "@/components/HeroImage";
import { ServiceCatalog } from "@/components/ServiceCatalog";
import { ServiceConfigurator } from "@/components/ServiceConfigurator";
import { StudioProcess } from "@/components/StudioProcess";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BookingFooter } from "@/components/BookingFooter";
import { CarePlanBar } from "@/components/CarePlanBar";
import { CarePlanDrawer } from "@/components/CarePlanDrawer";

export default function HomePage() {
  return (
    <>
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#F5F5F5] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#08080A]"
      >
        Перейти к каталогу услуг
      </a>
      <Header />
      <main id="main-content">
        <HeroImage />
        <ServiceCatalog />
        <ServiceConfigurator />
        <StudioProcess />
        <ReviewsSection />
      </main>
      <BookingFooter />
      <CarePlanBar />
      <CarePlanDrawer />
    </>
  );
}
