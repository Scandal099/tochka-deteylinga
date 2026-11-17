export type ServiceCategory =
  | "Кузов"
  | "Защита"
  | "Салон"
  | "Оптика и диски";

export interface DetailingService {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  priceDisplay: string;
  priceFrom: number | null;
  duration: string;
  badge?: string;
  highlightNote?: string;
}

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  "Кузов",
  "Защита",
  "Салон",
  "Оптика и диски",
] as const;

export const SERVICES: readonly DetailingService[] = [
  // КУЗОВ
  {
    id: "body-restorative-polish",
    name: "Восстановительная полировка кузова",
    category: "Кузов",
    shortDescription:
      "Многоступенчатое удаление паутины, окислов и глубоких рисок с контролем толщины лака на каждом элементе.",
    priceDisplay: "от 20 000 ₽",
    priceFrom: 20000,
    duration: "1–2 дня",
    badge: "Хит студии",
    highlightNote: "Контроль ЛКП толщиномером до и после",
  },
  {
    id: "body-antihologram-polish",
    name: "Антиголограммная полировка",
    category: "Кузов",
    shortDescription:
      "Финишная безабразивная доводка тёмных и капризных лаков до чистого выставочного зеркала без ореолов под прожектором.",
    priceDisplay: "от 17 000 ₽",
    priceFrom: 17000,
    duration: "1 день",
  },
  {
    id: "body-polish-ceramic-duo",
    name: "Полировка + 2 слоя керамической защиты",
    category: "Кузов",
    shortDescription:
      "Комплексная программа: снятие дефектов лакокрасочного покрытия и консервация глубоким составом в 2 слоя.",
    priceDisplay: "от 30 000 ₽",
    priceFrom: 30000,
    duration: "2 дня",
    badge: "Выгодно комплексом",
  },
  {
    id: "body-local-polish",
    name: "Локальная полировка одной детали",
    category: "Кузов",
    shortDescription:
      "Точечное устранение притёртостей и царапин на капоте, крыле или двери с плавным переходом глянца.",
    priceDisplay: "от 10 000 ₽",
    priceFrom: 10000,
    duration: "3–4 часа",
  },
  {
    id: "body-pdr-dent",
    name: "Удаление вмятин без окраса (PDR)",
    category: "Кузов",
    shortDescription:
      "Ювелирная выправка парковочных и градовых вмятин с сохранением заводского лакокрасочного покрытия. Опыт мастеров более 15 лет.",
    priceDisplay: "от 3 000 ₽",
    priceFrom: 3000,
    duration: "от 1 часа",
  },
  {
    id: "body-chip-masking",
    name: "Маскировка сколов",
    category: "Кузов",
    shortDescription:
      "Подбор краски по коду кузова, заполнение сколов, сушка и деликатная шлифовка в плоскость заводского лака.",
    priceDisplay: "от 3 000 ₽",
    priceFrom: 3000,
    duration: "2–3 часа",
  },
  {
    id: "body-paint-panel",
    name: "Окрас одной детали (кузовной ремонт)",
    category: "Кузов",
    shortDescription:
      "Локальный или полный окрас элемента с разбором в собственной камере. Официальная гарантия 2 года на выполненную работу.",
    priceDisplay: "от 20 000 ₽",
    priceFrom: 20000,
    duration: "3–5 дней",
    highlightNote: "Гарантия 2 года на ЛКП",
  },

  // ЗАЩИТА
  {
    id: "protect-ppf-risk-zones",
    name: "Оклейка «зон риска» полиуретаном",
    category: "Защита",
    shortDescription:
      "Антигравийная полиуретановая защита переднего бампера, капота, крыльев, фар, зеркал, стоек и зон под ручками.",
    priceDisplay: "от 85 000 ₽",
    priceFrom: 85000,
    duration: "1–2 дня",
    badge: "Выбор для новых авто",
  },
  {
    id: "protect-ppf-full",
    name: "Оклейка кузова полиуретаном целиком",
    category: "Защита",
    shortDescription:
      "Полная невидимая броня кузова с подворотами краёв: защита от пескоструя, реагентов, гравия и мелких притёртостей.",
    priceDisplay: "от 250 000 ₽",
    priceFrom: 250000,
    duration: "4–6 дней",
  },
  {
    id: "protect-ppf-matte",
    name: "Оклейка матовым полиуретаном целиком",
    category: "Защита",
    shortDescription:
      "Трансформация глянца в благородный сатин с полноценной антигравийной защитой полиуретаном нового поколения.",
    priceDisplay: "от 260 000 ₽",
    priceFrom: 260000,
    duration: "5–7 дней",
  },
  {
    id: "protect-ceramic-1",
    name: "Керамическое покрытие 1 слой",
    category: "Защита",
    shortDescription:
      "Гидрофобный защитный состав от ультрафиолета и зимних реагентов, облегчающий регулярную мойку.",
    priceDisplay: "от 15 000 ₽",
    priceFrom: 15000,
    duration: "1 день",
  },
  {
    id: "protect-ceramic-2",
    name: "Керамическое покрытие 2 слоя",
    category: "Защита",
    shortDescription:
      "Усиленная двухслойная матрица: глубокий стеклянный блеск, насыщение цвета и стойкий гидрофобный эффект.",
    priceDisplay: "от 25 000 ₽",
    priceFrom: 25000,
    duration: "1–2 дня",
    badge: "Оптимум",
  },
  {
    id: "protect-ceramic-3",
    name: "Керамическое покрытие 3 слоя",
    category: "Защита",
    shortDescription:
      "Максимальная многослойная защита ЛКП для интенсивной городской и трассовой эксплуатации.",
    priceDisplay: "от 35 000 ₽",
    priceFrom: 35000,
    duration: "2 дня",
  },
  {
    id: "protect-antichrome",
    name: "Антихром. Оклейка хрома в чёрный глянец",
    category: "Защита",
    shortDescription:
      "Полный перевод молдингов, окантовок окон и решёток в строгий монохром без демонтажа хрупких клипс.",
    priceDisplay: "от 50 000 ₽",
    priceFrom: 50000,
    duration: "1–2 дня",
  },
  {
    id: "protect-anticor",
    name: "Антикоррозийное покрытие днища и арок",
    category: "Защита",
    shortDescription:
      "Многоэтапная мойка днища, обработка скрытых полостей и защита от зимних реагентов с фотоотчётом.",
    priceDisplay: "от 45 000 ₽",
    priceFrom: 45000,
    duration: "2 дня",
  },

  // САЛОН
  {
    id: "interior-detail-clean",
    name: "Детейлинг-химчистка салона",
    category: "Салон",
    shortDescription:
      "Глубокая деликатная очистка кожи, алькантары, потолка, ковролина, воздуховодов и стыков кнопок парогенератором и составами без резкого запаха.",
    priceDisplay: "от 16 000 ₽",
    priceFrom: 16000,
    duration: "1 день",
    badge: "Обязательный минимум",
  },
  {
    id: "interior-leather-ceramic",
    name: "Керамика для кожи салона",
    category: "Салон",
    shortDescription:
      "Матовый защитный барьер для светлой и тёмной кожи: защита от окрашивания джинсами, трения и растрескивания.",
    priceDisplay: "от 9 000 ₽",
    priceFrom: 9000,
    duration: "4 часа",
  },
  {
    id: "interior-textile-preserve",
    name: "Консервация текстиля и алькантары",
    category: "Салон",
    shortDescription:
      "Гидрофобная пропитка волокон алькантары и ткани — пролитый кофе и влага собираются в капли и не впитываются.",
    priceDisplay: "от 9 000 ₽",
    priceFrom: 9000,
    duration: "3 часа",
  },
  {
    id: "interior-trim-polish",
    name: "Полировка глянцевых вставок и экрана",
    category: "Салон",
    shortDescription:
      "Удаление микроцарапин с рояльного лака центральной консоли, дерева и приборной панели + защитная плёнка в салон.",
    priceDisplay: "от 5 000 ₽",
    priceFrom: 5000,
    duration: "3 часа",
  },
  {
    id: "interior-leather-repair",
    name: "Ремонт и перетяжка кожи салона",
    category: "Салон",
    shortDescription:
      "Локальная реставрация потёртостей боковин кресел, перетяжка руля и восстановление фактуры кожи.",
    priceDisplay: "от 5 000 ₽",
    priceFrom: 5000,
    duration: "от 1 дня",
  },
  {
    id: "interior-soundproof",
    name: "Шумоизоляция салона (комплексная)",
    category: "Салон",
    shortDescription:
      "Многослойная вибро- и звукоизоляция дверей, арок, пола и багажника со сборкой салона по заводским допускам.",
    priceDisplay: "от 60 000 ₽",
    priceFrom: 60000,
    duration: "2–3 дня",
  },

  // ОПТИКА И ДИСКИ
  {
    id: "optics-headlights-polish",
    name: "Полировка фар",
    category: "Оптика и диски",
    shortDescription:
      "Устранение пескоструя, помутнения и мелких рисок на матричной и диодной оптике с восстановлением светопропускания.",
    priceDisplay: "от 4 000 ₽",
    priceFrom: 4000,
    duration: "2 часа",
  },
  {
    id: "optics-headlights-ppf",
    name: "Бронирование фар полиуретановой плёнкой",
    category: "Оптика и диски",
    shortDescription:
      "Прозрачный полиуретан сохраняет дорогостоящую оптику от сколов и затирания щётками и омывателем.",
    priceDisplay: "от 5 000 ₽",
    priceFrom: 5000,
    duration: "2 часа",
  },
  {
    id: "optics-windshield-polish",
    name: "Полировка лобового стекла",
    category: "Оптика и диски",
    shortDescription:
      "Удаление затёртостей от дворников и бликов встречных фар без искажения оптики стекла.",
    priceDisplay: "от 7 000 ₽",
    priceFrom: 7000,
    duration: "3–4 часа",
  },
  {
    id: "optics-antidote-rain",
    name: "Антидождь (полусфера)",
    category: "Оптика и диски",
    shortDescription:
      "Гидрофобное покрытие лобового и боковых стёкол: капли срываются потоком воздуха уже от 60 км/ч.",
    priceDisplay: "от 3 500 ₽",
    priceFrom: 3500,
    duration: "1.5 часа",
  },
  {
    id: "optics-windshield-armor",
    name: "Бронирование лобового стекла SunTek",
    category: "Оптика и диски",
    shortDescription:
      "Внешняя защитная плёнка от сколов и трещин при попадании камней на трассе.",
    priceDisplay: "от 25 000 ₽",
    priceFrom: 25000,
    duration: "4 часа",
  },
  {
    id: "optics-tinting-gost",
    name: "Тонирование плёнкой LLumar / атермальная защита",
    category: "Оптика и диски",
    shortDescription:
      "Затемнение задней полусферы или прозрачная атермальная плёнка на передние стёкла по ГОСТу.",
    priceDisplay: "от 5 500 ₽",
    priceFrom: 5500,
    duration: "2–3 часа",
  },
  {
    id: "wheels-powder-detailing",
    name: "Порошковая покраска и детейлинг дисков",
    category: "Оптика и диски",
    shortDescription:
      "Глубокая очистка колёсных дисков от битума и металлической стружки, обработка суппортов и порошковое восстановление покрытия.",
    priceDisplay: "от 8 000 ₽",
    priceFrom: 8000,
    duration: "1–3 дня",
    highlightNote: "Также доступен аквабластинг и шиномонтаж",
  },
] as const;

export function getServiceById(id: string): DetailingService | undefined {
  return SERVICES.find((s) => s.id === id);
}
