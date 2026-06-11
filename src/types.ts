export interface ElementInfo {
  name: string;
  englishName: string;
  color: string;
  bgGradient: string;
  description: string;
  spiritualMeaning: string;
  characteristics: string[];
}

export const ELEMENTS: Record<string, ElementInfo> = {
  fire: {
    name: "ناري",
    englishName: "Fire",
    color: "#ef4444", // red
    bgGradient: "from-red-600 to-amber-600",
    description: "شخصية ديناميكية، قيادية، مفعمة بالحيوية والنشاط والطاقة العالية.",
    spiritualMeaning: "يُمثل عنصر الحرارة، الشغف، الإرادة القوية، والتحول الجذري والقدرة على البدء.",
    characteristics: ["القيادة والشجاعة", "الغضب السريع والسامح الأسرع", "العاطفة المتوقدة", "الاستقلالية وحب المغامرة"]
  },
  earth: {
    name: "ترابي",
    englishName: "Earth",
    color: "#1d4ed8", // brown/blue-slate
    bgGradient: "from-emerald-700 to-amber-800",
    description: "شخصية واقعية، مستقرة، مخلصة، تبحث عن الأمان والحلول العملية.",
    spiritualMeaning: "يُمثل الاستقرار، النمو التدريجي، القدرة على تلمس الحقائق والواقعية العالية.",
    characteristics: ["الصبر والمثابرة", "التخطيط الدقيق والمنطق", "الوفاء والارتباط بالبيئة", "الهدوء والصلابة أمام الصعاب"]
  },
  air: {
    name: "هوائي",
    englishName: "Air",
    color: "#06b6d4", // cyan
    bgGradient: "from-cyan-600 to-indigo-600",
    description: "شخصية تواصلية، ذكية، سريعة الفهم، تعشق المعرفة والتفكير الإبداعي.",
    spiritualMeaning: "يُمثل الفكر، الاتصال، سيل الأفكار، التحليق فوق المشاعر المباشرة والتوازن المعرفي.",
    characteristics: ["الفصاحة وحسن الحوار", "تغير المزاج بسرعة", "التفكير المتشعب والفضول العلمي", "حب السفر والتواصل الاجتماعي"]
  },
  water: {
    name: "مائي",
    englishName: "Water",
    color: "#3b82f6", // blue
    bgGradient: "from-blue-600 to-purple-800",
    description: "شخصية عاطفية، حساسة، بديهية، قادرة على الاحتواء والتعاطف العميق.",
    spiritualMeaning: "يُمثل النضج العاطفي، الانسيابية والتكيف مع الظروف، والقدرة على كشف الأسرار النفسية والروحية.",
    characteristics: ["الحدس العالي (البصيرة)", "رقة الملاحظة والمشاعر", "الغموض والجاذبية الهادئة", "القدرة على احتواء الآخرين ومساعدتهم"]
  }
};

export interface LetterConfig {
  value: number;
  element: "fire" | "earth" | "air" | "water";
}

// Arabic traditional Abjad layout map (أبجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ)
// Normalized and assigned precisely to elements (ناري، ترابي، هوائي، مائي) in cycle:
export const ABJAD_LETTERS: Record<string, LetterConfig> = {
  'أ': { value: 1, element: 'fire' },
  'ا': { value: 1, element: 'fire' }, // Alif same
  'إ': { value: 1, element: 'fire' },
  'أَ': { value: 1, element: 'fire' },
  'آ': { value: 1, element: 'fire' },
  'ء': { value: 1, element: 'fire' }, // Hamza usually counted as 1
  'ب': { value: 2, element: 'earth' },
  'ج': { value: 3, element: 'air' },
  'د': { value: 4, element: 'water' },
  'ه': { value: 5, element: 'fire' },
  'ة': { value: 400, element: 'earth' }, // Configurable later in math but defaults to 400 (Ta' Marbuta as Ta) or 5 (as Ha)
  'و': { value: 6, element: 'earth' },
  'ز': { value: 7, element: 'air' },
  'ح': { value: 8, element: 'water' },
  'ط': { value: 9, element: 'fire' },
  'ي': { value: 10, element: 'earth' },
  'ى': { value: 10, element: 'earth' }, // Alif Maqsura is usually treated as Ya (10)
  'ك': { value: 20, element: 'air' },
  'ل': { value: 30, element: 'water' },
  'م': { value: 40, element: 'fire' },
  'ن': { value: 50, element: 'earth' },
  'س': { value: 60, element: 'air' },
  'ع': { value: 70, element: 'water' },
  'ف': { value: 80, element: 'fire' },
  'ص': { value: 90, element: 'earth' },
  'ق': { value: 100, element: 'air' },
  'ر': { value: 200, element: 'water' },
  'ش': { value: 300, element: 'fire' },
  'ت': { value: 400, element: 'earth' },
  'ث': { value: 500, element: 'air' },
  'خ': { value: 600, element: 'water' },
  'ذ': { value: 700, element: 'fire' },
  'ض': { value: 800, element: 'earth' },
  'ظ': { value: 900, element: 'air' },
  'غ': { value: 1000, element: 'water' }
};

export interface ZodiacSign {
  name: string;
  englishName: string;
  dateRange: string;
  element: "fire" | "earth" | "air" | "water";
  planet: string;
  stone: string;
  traits: string[];
  luckyNumbers: number[];
}

export const WESTERN_ZODIAC: ZodiacSign[] = [
  {
    name: "الحمل",
    englishName: "Aries",
    dateRange: "21 مارس - 19 أبريل",
    element: "fire",
    planet: "المريخ",
    stone: "الألماس",
    traits: ["الشجاعة", "الريادة", "العفوية", "الحماس"],
    luckyNumbers: [9, 18, 27]
  },
  {
    name: "الثور",
    englishName: "Taurus",
    dateRange: "20 أبريل - 20 مايو",
    element: "earth",
    planet: "الزهرة",
    stone: "الزمرد",
    traits: ["الصبر", "الاستقرار", "الموثوقية", "الذوق الرفيع"],
    luckyNumbers: [6, 15, 24]
  },
  {
    name: "الجوزاء",
    englishName: "Gemini",
    dateRange: "21 مايو - 20 يونيو",
    element: "air",
    planet: "عطارد",
    stone: "العقيق",
    traits: ["الذكاء", "المرونة", "الاجتماعية", "الفصاحة"],
    luckyNumbers: [5, 14, 23]
  },
  {
    name: "السرطان",
    englishName: "Cancer",
    dateRange: "21 يونيو - 22 يوليو",
    element: "water",
    planet: "القمر",
    stone: "اللؤلؤ",
    traits: ["الحساسية العمياء", "الولاء", "الحدس", "الحنان العائلي"],
    luckyNumbers: [2, 7, 11]
  },
  {
    name: "الأسد",
    englishName: "Leo",
    dateRange: "23 يوليو - 22 أغسطس",
    element: "fire",
    planet: "الشمس",
    stone: "الزبرجد",
    traits: ["الفخر والمجد", "السخاء", "الجاذبية الكاريزمية", "الإبداع"],
    luckyNumbers: [1, 4, 10]
  },
  {
    name: "العذراء",
    englishName: "Virgo",
    dateRange: "23 أغسطس - 22 سبتمبر",
    element: "earth",
    planet: "عطارد",
    stone: "الياقوت الأزرق",
    traits: ["الدقة والتحليل", "العمل الدؤوب", "التواضع", "النقاء"],
    luckyNumbers: [5, 14, 23]
  },
  {
    name: "الميزان",
    englishName: "Libra",
    dateRange: "23 سبتمبر - 22 أكتوبر",
    element: "air",
    planet: "الزهرة",
    stone: "الأوبال (عين الشمس)",
    traits: ["الدبلوماسية", "العدالة", "الرومانسية", "تقدير الجمال"],
    luckyNumbers: [6, 15, 24]
  },
  {
    name: "العقرب",
    englishName: "Scorpio",
    dateRange: "23 أكتوبر - 21 نوفمبر",
    element: "water",
    planet: "بلوتو والحديد مريخ",
    stone: "التوباز",
    traits: ["القوة والغموض", "الشغف العميق", "الشعور الحدسي", "العزيمة"],
    luckyNumbers: [3, 9, 21]
  },
  {
    name: "القوس",
    englishName: "Sagittarius",
    dateRange: "22 نوفمبر - 21 ديسمبر",
    element: "fire",
    planet: "المشتري",
    stone: "الفيروز",
    traits: ["التفاؤل", "حب الحرية والمغامرة", "الفلسفة والصدق", "الذكاء العشوائي"],
    luckyNumbers: [3, 12, 30]
  },
  {
    name: "الجدي",
    englishName: "Capricorn",
    dateRange: "22 ديسمبر - 19 يناير",
    element: "earth",
    planet: "زحل",
    stone: "العقيق الأحمر",
    traits: ["الانضباط", "الطموح العالي", "الوقار والمسؤولية", "الصبر المتين"],
    luckyNumbers: [4, 8, 13]
  },
  {
    name: "الدلو",
    englishName: "Aquarius",
    dateRange: "20 يناير - 18 فبراير",
    element: "air",
    planet: "أورانوس وزحل",
    stone: "الجمشت",
    traits: ["الابتكار والإنسانية", "الفكر المستقل", "التمرد العقلاني", "الإخلاص"],
    luckyNumbers: [1, 7, 17]
  },
  {
    name: "الحوت",
    englishName: "Pisces",
    dateRange: "19 فبراير - 20 مارس",
    element: "water",
    planet: "نبتون والمشتري",
    stone: "الزبرجد البحري",
    traits: ["الخيال الواسع", "الحكمة الروحية", "التعاطف الوجداني", "الحس الفني"],
    luckyNumbers: [3, 7, 12]
  }
];

export interface EasternZodiac {
  animal: string;
  arabicName: string;
  traits: string[];
  compatibility: string[];
}

export const EASTERN_ZODIAC_LIST: Record<number, EasternZodiac> = {
  0: { animal: "Rat", arabicName: "الفأر", traits: ["الذكاء السريع", "المرونة والحيلة", "الاجتماعية والود"], compatibility: ["التنين", "القرد", "الثور"] },
  1: { animal: "Ox", arabicName: "الثور", traits: ["الصبر العظيم", "الاعتمادية والجد", "الهدوء والتحفظ"], compatibility: ["الجرذ", "الأفعى", "الديك"] },
  2: { animal: "Tiger", arabicName: "النمر", traits: ["القوة الجريئة", "الشجاعة والجاذبية", "الروح المتمردة"], compatibility: ["الحصان", "الكلب", "الخنزير"] },
  3: { animal: "Rabbit", arabicName: "الأرنب", traits: ["اللطافة والسلام", "اللباقة والحساسية", "الأمانة الفنية"], compatibility: ["الخروف", "الكلب", "الخنزير"] },
  4: { animal: "Dragon", arabicName: "التنين", traits: ["المهابة والكاريزما", "الحيوية الفائقة", "الاعتزاز بالنفس"], compatibility: ["الجرذ", "القرد", "الديك"] },
  5: { animal: "Snake", arabicName: "الأفعى", traits: ["الحكمة والغموض", "البصيرة الحادة", "الرقة والهدوء"], compatibility: ["الثور", "الديك"] },
  6: { animal: "Horse", arabicName: "الحصان", traits: ["السرعة والاستقلال", "النشاط المتقد", "الشخصية الدافئة"], compatibility: ["النمر", "الخروف", "الكلب"] },
  7: { animal: "Goat", arabicName: "الخروف / العنزة", traits: ["اللطف والرأفة", "الحنان الفني", "الهدوء الداخلي"], compatibility: ["الأرنب", "الحصان", "الخنزير"] },
  8: { animal: "Monkey", arabicName: "القرد", traits: ["الابتكار والمرح", "سرعة الإدراك والذكاء", "حب الاستطلاع"], compatibility: ["الجرذ", "التنين"] },
  9: { animal: "Rooster", arabicName: "الديك", traits: ["الانضباط والملاحظة", "الإخلاص والتنظيم", "الحب للمعلومات المثيرة"], compatibility: ["الثور", "الأفعى", "التنين"] },
  10: { animal: "Dog", arabicName: "الكلب", traits: ["الوفاء والإخلاص", "الأمانة العميقة", "الحس بالعدالة والواجب"], compatibility: ["النمر", "الأرنب", "الحصان"] },
  11: { animal: "Pig", arabicName: "الخنزير البري", traits: ["السخاء والصدق", "التسامح العذب", "الاستمتاع بالحياة والهوايات"], compatibility: ["النمر", "الأرنب", "الخروف"] }
};

export const MOON_STATIONS = [
  "الشرطين", "البطين", "الثريا", "الدبران", "الهقعة", "الهنعة", "الذراع",
  "النثرة", "الطرف", "الجبهة", "الزبرة", "الصرفة", "العواء", "السماك",
  "الغفر", "الزبانان", "الإكليل", "القلب", "الشولة", "النعائم", "البلدة",
  "سعد الذابح", "سعد بلع", "سعد السعود", "سعد الأخبية", "المقدم", "المؤخر", "الرشاء"
];
