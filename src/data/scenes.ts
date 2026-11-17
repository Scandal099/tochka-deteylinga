import { FRAME_COUNT } from "./frames-manifest";

export interface SceneHotspot {
  id: string;
  label: string;
  detail: string;
  /** Position inside the pinned 100vw x 100vh stage */
  xPercent: number;
  yPercent: number;
  align?: "left" | "right";
}

export interface ScrollScene {
  id: string;
  index: number;
  code: string;
  zoneLabel: string;
  title: string;
  italicAccent: string;
  description: string;
  /** Progress boundaries across 0..1 scroll track */
  start: number;
  end: number;
  /** Ideal landing point when jumping via side zone nav */
  focusProgress: number;
  serviceId: string | null;
  secondaryServiceId?: string | null;
  hotspot: SceneHotspot | null;
  isSummary?: boolean;
}

export const TOTAL_FRAMES = FRAME_COUNT;

export const SCROLL_SCENES: readonly ScrollScene[] = [
  {
    id: "studio-reveal",
    index: 0,
    code: "01",
    zoneLabel: "Свет студии",
    title: "Студийная приёмка",
    italicAccent: "в абсолютном фокусе",
    description:
      "Под профессиональным потолочным светом проявляется каждая грань кузова Porsche 911 — именно так начинается диагностика лака перед работой.",
    start: 0.0,
    end: 0.12,
    focusProgress: 0.07,
    serviceId: null,
    hotspot: {
      id: "hs-studio",
      label: "Свет CRI 95+",
      detail: "Безжалостный инспекционный свет выявляет малейшие голограммы и риски ЛКП",
      xPercent: 54,
      yPercent: 48,
      align: "left",
    },
  },
  {
    id: "hood-polish",
    index: 1,
    code: "02",
    zoneLabel: "Капот и крыло",
    title: "Восстановительная полировка",
    italicAccent: "глубина зеркала",
    description:
      "Наезд на капот и переднее крыло: убираем паутину от моек и дорожную матовость в 2–3 прохода с сохранением толщины заводского лака.",
    start: 0.12,
    end: 0.27,
    focusProgress: 0.20,
    serviceId: "body-restorative-polish",
    secondaryServiceId: "body-antihologram-polish",
    hotspot: {
      id: "hs-hood",
      label: "Плоскость капота",
      detail: "Замер толщиномером до 1 мкм перед полировкой каждого элемента",
      xPercent: 38,
      yPercent: 44,
      align: "right",
    },
  },
  {
    id: "wheels-calipers",
    index: 2,
    code: "03",
    zoneLabel: "Диски и суппорты",
    title: "Детейлинг дисков и суппортов",
    italicAccent: "до внутренней полки",
    description:
      "Удаление прикипевшей тормозной пыли, битума и дорожных реагентов со спиц, перфорированных роторов и суппортов. Доступна порошковая покраска.",
    start: 0.27,
    end: 0.42,
    focusProgress: 0.35,
    serviceId: "wheels-powder-detailing",
    hotspot: {
      id: "hs-wheel",
      label: "Суппорт и кованый обод",
      detail: "Кислотно-безопасная очистка и термостойкая консервация дисков",
      xPercent: 52,
      yPercent: 60,
      align: "right",
    },
  },
  {
    id: "optics-windshield",
    index: 3,
    code: "04",
    zoneLabel: "Оптика и стекло",
    title: "Полировка оптики и антидождь",
    italicAccent: "хрустальная чистота",
    description:
      "Матричная оптика и лобовое стекло без пескоструя и ночных бликов: полировка, бронирование полиуретаном и гидрофобный состав на полусферу.",
    start: 0.42,
    end: 0.56,
    focusProgress: 0.49,
    serviceId: "optics-headlights-ppf",
    secondaryServiceId: "optics-antidote-rain",
    hotspot: {
      id: "hs-optics",
      label: "Матричная фара PDLS+",
      detail: "Полировка + оклейка полиуретаном + антидождь полусферы",
      xPercent: 39,
      yPercent: 56,
      align: "right",
    },
  },
  {
    id: "interior-care",
    index: 4,
    code: "05",
    zoneLabel: "Салон и кожа",
    title: "Детейлинг-химчистка и кожа",
    italicAccent: "тактильная свежесть",
    description:
      "Безрамочная дверь открывает интерьер: деликатная чистка швов и перфорации, удаление засаленного блеска и защита кожи матовой керамикой.",
    start: 0.56,
    end: 0.70,
    focusProgress: 0.65,
    serviceId: "interior-detail-clean",
    secondaryServiceId: "interior-leather-ceramic",
    hotspot: {
      id: "hs-interior",
      label: "Кожа и консоль",
      detail: "Безопасные pH-нейтральные составы + керамика от окрашивания одеждой",
      xPercent: 48,
      yPercent: 48,
      align: "right",
    },
  },
  {
    id: "ppf-ceramic",
    index: 5,
    code: "06",
    zoneLabel: "Броня и керамика",
    title: "Защита кузова PPF и керамика",
    italicAccent: "невидимая броня",
    description:
      "Облёт к заднему крылу: антигравийный полиуретан с подворотами краёв на зоны риска или целиком + 2–3 слоя керамики для максимального гидрофоба.",
    start: 0.70,
    end: 0.85,
    focusProgress: 0.78,
    serviceId: "protect-ppf-risk-zones",
    secondaryServiceId: "protect-ceramic-2",
    hotspot: {
      id: "hs-rear-fender",
      label: "Арка и заднее крыло",
      detail: "Полиуретан 200 мкм + многослойная керамическая матрица",
      xPercent: 62,
      yPercent: 44,
      align: "left",
    },
  },
  {
    id: "studio-finale",
    index: 6,
    code: "07",
    zoneLabel: "Ваш план",
    title: "Сводка «Моего плана ухода»",
    italicAccent: "готов к записи",
    description:
      "Все отмеченные зоны собраны в ваш персональный план. Откройте список выбранных работ или перейдите сразу к записи в студию на Митинской, 15.",
    start: 0.85,
    end: 1.0,
    focusProgress: 0.94,
    serviceId: "body-polish-ceramic-duo",
    hotspot: null,
    isSummary: true,
  },
] as const;
