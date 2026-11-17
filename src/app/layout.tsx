import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Manrope,
  Montserrat,
} from "next/font/google";
import { STUDIO_INFO } from "@/data/studio";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["100", "200", "300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#08080A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${STUDIO_INFO.brandName} — Детейлинг-студия в Москве (Митино)`,
  description:
    "Студия ТОЧКА ДЕТЕЙЛИНГА в Москве (Митинская ул., 15): восстановительная полировка, керамическая защита, оклейка полиуретаном PPF, детейлинг-химчистка, полировка фар и PDR. Рейтинг 5.0 на Яндекс Картах.",
  keywords: [
    "ТОЧКА ДЕТЕЙЛИНГА",
    "детейлинг Москва",
    "детейлинг Митино",
    "полировка кузова",
    "оклейка полиуретаном PPF",
    "керамика на авто",
    "химчистка салона",
    "Митинская 15",
  ],
  openGraph: {
    title: `${STUDIO_INFO.brandName} — Детейлинг, который видно по отражению`,
    description:
      "Премиальный детейлинг в Москве, Митинская ул., 15. Полировка, керамика, плёнка PPF, химчистка и шумоизоляция. Реальный прайс и запись онлайн.",
    type: "website",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${montserrat.variable} ${cormorant.variable} ${jetbrains.variable} dark`}
    >
      <body className="min-h-screen bg-[#08080A] text-[#F5F5F5] antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
