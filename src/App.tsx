import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Calculator,
  Compass,
  Flame,
  Wind,
  Droplet,
  Compass as EarthIcon,
  Calendar,
  User,
  Heart,
  Moon,
  Sun,
  Award,
  BookOpen,
  HelpCircle,
  Settings,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  Atom,
  Stars,
  Star
} from "lucide-react";
import {
  ABJAD_LETTERS,
  ELEMENTS,
  WESTERN_ZODIAC,
  EASTERN_ZODIAC_LIST,
  MOON_STATIONS,
  type ZodiacSign,
  type ElementInfo
} from "./types";

interface LetterDissection {
  char: string;
  value: number;
  element: "fire" | "earth" | "air" | "water";
}

export default function App() {
  // Input states
  const [userName, setUserName] = useState<string>("");
  const [motherName, setMotherName] = useState<string>("");
  const [dob, setDob] = useState<string>("1995-07-23"); // default date

  // Advanced calculation flags
  const [treatTaAs400, setTreatTaAs400] = useState<boolean>(true); // ة = 400
  const [treatYaAs10, setTreatYaAs10] = useState<boolean>(true); // ى = 10
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // AI Generation states
  const [report, setReport] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const loadingPhrases = [
    "يجري الآن تمشيط النجوم يوم ميلادك السعيد...",
    "يتم حساب أوزان الحروف وفك شفرة جدول الجمل الكبير...",
    "جاري استخلاص نسب الطبائع: النارية والترابية والهوائية والمائية...",
    "يجري احتساب البرج الطالع الروحي وربطه بقرانات الكواكب السيّارة...",
    "الذكاء الاصطناعي يستنطق منازل القمر ومطارح الحظ ليكتب تقريرك الكوني الأوفى..."
  ];

  // Rotate loading phrases beautifully
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingPhrases.length);
      }, 4000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Clean and dissect Arabic letters
  const dissectName = (nameStr: string): {
    letters: LetterDissection[];
    totalSum: number;
    elementsSum: Record<string, number>;
    elementsCount: Record<string, number>;
  } => {
    const letters: LetterDissection[] = [];
    let totalSum = 0;
    const elementsSum = { fire: 0, earth: 0, air: 0, water: 0 };
    const elementsCount = { fire: 0, earth: 0, air: 0, water: 0 };

    if (!nameStr) return { letters, totalSum, elementsSum, elementsCount };

    // Dissect every character
    for (let i = 0; i < nameStr.length; i++) {
      const char = nameStr[i];
      if (char === " " || char === "\t" || char === "\n") continue;

      let lookupChar = char;
      let calculatedValue = 0;
      let calculatedElement: "fire" | "earth" | "air" | "water" = "fire";

      // Apply hamza rules
      if (["أ", "إ", "آ", "ء", "ؤ", "ئ"].includes(char)) {
        lookupChar = "أ";
      }

      // Check letter details
      const config = ABJAD_LETTERS[lookupChar];
      if (config) {
        calculatedValue = config.value;
        calculatedElement = config.element;

        // Custom config: Ta' Marbuta (ة)
        if (char === "ة") {
          calculatedValue = treatTaAs400 ? 400 : 5;
          calculatedElement = treatTaAs400 ? "earth" : "fire"; // 400 = ت (earth), 5 = هـ (fire)
        }

        // Custom config: Alif Maqsura (ى)
        if (char === "ى") {
          calculatedValue = treatYaAs10 ? 10 : 1;
          calculatedElement = treatYaAs10 ? "earth" : "fire"; // 10 = ي (earth), 1 = ا (fire)
        }

        letters.push({
          char,
          value: calculatedValue,
          element: calculatedElement
        });

        totalSum += calculatedValue;
        elementsSum[calculatedElement] += calculatedValue;
        elementsCount[calculatedElement] += 1;
      } else {
        // Fallback for unrecognized printable/non-printable Arabic chars
        // e.g. shaddah, fatha, etc. are skipped or treated as 0
      }
    }

    return { letters, totalSum, elementsSum, elementsCount };
  };

  // Live Calculations for User Name
  const userNameAnalysis = useMemo(() => {
    return dissectName(userName);
  }, [userName, treatTaAs400, treatYaAs10]);

  // Live Calculations for Mother Name
  const motherNameAnalysis = useMemo(() => {
    return dissectName(motherName);
  }, [motherName, treatTaAs400, treatYaAs10]);

  // Dominant element determination
  const elementPercentage = useMemo(() => {
    const sum = userNameAnalysis.totalSum;
    if (sum === 0) return { fire: 0, earth: 0, air: 0, water: 0, dominant: "fire" };

    const firePct = Math.round((userNameAnalysis.elementsSum.fire / sum) * 100);
    const earthPct = Math.round((userNameAnalysis.elementsSum.earth / sum) * 100);
    const airPct = Math.round((userNameAnalysis.elementsSum.air / sum) * 100);
    const waterPct = Math.round((userNameAnalysis.elementsSum.water / sum) * 100);

    // Find key of max value
    const sums = userNameAnalysis.elementsSum;
    let maxKey = "fire";
    let maxVal = sums.fire;

    if (sums.earth > maxVal) { maxKey = "earth"; maxVal = sums.earth; }
    if (sums.air > maxVal) { maxKey = "air"; maxVal = sums.air; }
    if (sums.water > maxVal) { maxKey = "water"; maxVal = sums.water; }

    return {
      fire: firePct,
      earth: earthPct,
      air: airPct,
      water: waterPct,
      dominant: maxKey
    };
  }, [userNameAnalysis]);

  // Birthday Zodiac signs
  const birthdayAnalysis = useMemo(() => {
    if (!dob) return null;
    const date = new Date(dob);
    if (isNaN(date.getTime())) return null;

    const y = date.getFullYear();
    const m = date.getMonth() + 1; // 1-12
    const d = date.getDate();

    // Calculate Western Zodiac
    let sign: ZodiacSign = WESTERN_ZODIAC[11]; // default Pisces

    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) sign = WESTERN_ZODIAC[0]; // Aries
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) sign = WESTERN_ZODIAC[1]; // Taurus
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) sign = WESTERN_ZODIAC[2]; // Gemini
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) sign = WESTERN_ZODIAC[3]; // Cancer
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) sign = WESTERN_ZODIAC[4]; // Leo
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) sign = WESTERN_ZODIAC[5]; // Virgo
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) sign = WESTERN_ZODIAC[6]; // Libra
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) sign = WESTERN_ZODIAC[7]; // Scorpio
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) sign = WESTERN_ZODIAC[8]; // Sagittarius
    else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) sign = WESTERN_ZODIAC[9]; // Capricorn
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) sign = WESTERN_ZODIAC[10]; // Aquarius

    // Chinese Zodiac
    const cyclesIndex = (y - 1904) % 12;
    const normIndex = cyclesIndex < 0 ? (cyclesIndex + 12) % 12 : cyclesIndex;
    const easternZodiac = EASTERN_ZODIAC_LIST[normIndex] || EASTERN_ZODIAC_LIST[0];

    // Moon Station approximation based on index of year/day
    const stationIndex = (d + m * 2 + (y % 28)) % 28;
    const moonStation = MOON_STATIONS[stationIndex];

    return {
      year: y,
      month: m,
      day: d,
      westernSign: sign,
      easternZodiac,
      moonStation
    };
  }, [dob]);

  // Astro-Abjad Rising Sign based on Name & Mother name
  // Formula: (Name Abjad Value + Mother Abjad Value) % 12
  // If 0, it is 12 (Pisces)
  const arabicRisingSign = useMemo(() => {
    const userVal = userNameAnalysis.totalSum;
    const momVal = motherNameAnalysis.totalSum;
    if (userVal === 0) return null;

    const combined = userVal + momVal;
    let remainder = combined % 12;
    if (remainder === 0) remainder = 12;

    const matchedSign = WESTERN_ZODIAC[remainder - 1];

    return {
      combinedSum: combined,
      remainder,
      sign: matchedSign
    };
  }, [userNameAnalysis, motherNameAnalysis]);

  // Fire API request for complete detailed report
  const handleGenerateReport = async () => {
    if (!userName.trim()) {
      setErrorMsg("يرجى إدخال اسمك أولاً لحساب طالعك ونجمتك الكونية.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    setReport("");

    const payload = {
      name: userName,
      motherName: motherName || undefined,
      dob: dob,
      abjadValue: userNameAnalysis.totalSum,
      motherAbjadValue: motherNameAnalysis.totalSum,
      totalAbjadSum: arabicRisingSign ? arabicRisingSign.combinedSum : userNameAnalysis.totalSum,
      dominantElement: ELEMENTS[elementPercentage.dominant]?.name,
      elementsBreakdown: {
        fire: elementPercentage.fire,
        earth: elementPercentage.earth,
        air: elementPercentage.air,
        water: elementPercentage.water
      },
      westernSign: birthdayAnalysis?.westernSign.name,
      westernSignElement: ELEMENTS[birthdayAnalysis?.westernSign.element || "fire"]?.name,
      arabicCalculatedSign: arabicRisingSign?.sign?.name || undefined,
      luckyNumbers: birthdayAnalysis?.westernSign.luckyNumbers,
      planet: birthdayAnalysis?.westernSign.planet,
      stone: birthdayAnalysis?.westernSign.stone
    };

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("حدث خطأ في شبكة الاتصال الكونية، نرجو إعادة المحاولة.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setReport(data.report || "فشل توليد التقرير الكوني.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "حدثت مشكلة غير مفرطة أثناء توليد القراءة الروحانية.");
    } finally {
      setIsLoading(false);
    }
  };

  // Convert nature code to Arabic color context
  const getElementBadgeColor = (el: string) => {
    switch (el) {
      case "fire": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "earth": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "air": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "water": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // Helper Custom Markdown renderer inside App so zero package issues are met!
  const renderFormattedReport = (rawText: string) => {
    const parseLine = (line: string) => {
      const regex = /\*\*(.*?)\*\*/g;
      const children: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          children.push(line.slice(lastIndex, match.index));
        }
        children.push(
          <strong key={match.index} className="font-extrabold text-amber-200">
            {match[1]}
          </strong>
        );
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < line.length) {
        children.push(line.slice(lastIndex));
      }
      return children.length > 0 ? children : line;
    };

    const lines = rawText.split("\n");
    return (
      <div className="space-y-4 text-slate-200 leading-relaxed text-right font-serif" dir="rtl">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("### ")) {
            return (
              <h4 key={idx} className="text-xl font-bold mt-6 mb-2 text-indigo-300 border-r-4 border-indigo-500 pr-3 serif-heading">
                {parseLine(trimmed.slice(4))}
              </h4>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h3 key={idx} className="text-2xl font-bold mt-8 mb-4 text-amber-300 border-r-4 border-amber-500 pr-3 serif-heading">
                {parseLine(trimmed.slice(3))}
              </h3>
            );
          }
          if (trimmed.startsWith("# ")) {
            return (
              <h2 key={idx} className="text-3xl font-bold mt-10 mb-6 text-yellow-200 text-center border-b border-indigo-900/30 pb-4 serif-heading">
                {parseLine(trimmed.slice(2))}
              </h2>
            );
          }
          if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            return (
              <li key={idx} className="list-disc list-inside mr-4 text-slate-300 leading-relaxed">
                {parseLine(trimmed.slice(2))}
              </li>
            );
          }
          if (trimmed.match(/^\d+\.\s/)) {
            const content = trimmed.replace(/^\d+\.\s/, "");
            return (
              <p key={idx} className="text-slate-300 mr-2 border-r border-indigo-950/40 pr-3 leading-relaxed">
                <span className="font-semibold text-indigo-400 ml-1">{trimmed.match(/^\d+/)![0]}.</span>
                {parseLine(content)}
              </p>
            );
          }
          if (trimmed === "") {
            return <div key={idx} className="h-2" />;
          }
          return (
            <p key={idx} className="text-slate-300 text-lg font-sans leading-relaxed">
              {parseLine(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 sans-body p-4 md:p-6 overflow-x-hidden relative selection:bg-amber-600/30">
      {/* Subtle atmospheric gold and dark light filters */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-amber-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-indigo-900/10 blur-[130px] rounded-full pointer-events-none"></div>

      {/* Compact High-Density Header */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center border-b border-amber-900/30 pb-4 mb-4 gap-4 relative z-10" id="density-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-xl shadow-[0_0_15px_rgba(217,119,6,0.35)] text-slate-950 font-bold">◈</div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-amber-500 tracking-tight serif-heading leading-tight">ميزان الجُمّل والحساب الفلكي</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-medium mt-0.5">منظومة العلوم الحرفية والنسب الطبيعية الاستقصائية</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="text-right bg-slate-900/60 p-2 rounded border border-slate-800/80">
            <span className="block text-slate-500 text-[10px] leading-tight mb-0.5">التاريخ الحسابي</span>
            <span className="font-mono text-slate-350">{new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })} هـ</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Right Section: Inputs and Settings (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: User Profile Inputs */}
          <section className="bg-slate-900/40 border border-slate-800/85 p-5 rounded-xl shadow-lg cosmic-glow relative overflow-hidden" id="inputs-panel">
            <h2 className="text-amber-500 text-sm mb-4 font-semibold border-r-2 border-amber-600 pr-2 serif-heading flex items-center justify-between">
              <span>المدخلات الفلكية والحروفية</span>
              <Calculator className="w-3.5 h-3.5 text-amber-500" />
            </h2>

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1 text-right">
                  الاسم الشخصي (بالحروف العربية) <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="مثال: أحمد، سارة، علي..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-right text-slate-100 placeholder-slate-600 focus:border-amber-500 outline-none transition-all font-sans font-medium"
                    dir="rtl"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                {userNameAnalysis.totalSum > 0 && (
                  <div className="mt-1.5 flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                    <span className="text-slate-400 font-sans">مجموع الجمل الكبير</span>
                    <span className="font-mono text-sm font-bold text-amber-500">
                      {userNameAnalysis.totalSum}
                    </span>
                  </div>
                )}
              </div>

              {/* Mother Name Field */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1 text-right">
                  اسم الأم (اختياري - لحساب الطالع الحرفي والجفر)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="مثال: مريم، فاطمة، عائشة..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-right text-slate-100 placeholder-slate-600 focus:border-amber-500 outline-none transition-all font-sans font-medium"
                    dir="rtl"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Heart className="w-4 h-4 text-pink-500/50" />
                  </div>
                </div>
                {motherNameAnalysis.totalSum > 0 && (
                  <div className="mt-1.5 flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                    <span className="text-slate-400 font-sans">مجموع جمل اسم الأم</span>
                    <span className="font-mono text-sm font-bold text-pink-400">
                      {motherNameAnalysis.totalSum}
                    </span>
                  </div>
                )}
              </div>

              {/* DOB Field */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1 text-right">
                  تاريخ الميلاد (لاستخراج الأبراج ومنازل القمر)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm outline-none focus:border-amber-500 text-right text-slate-100 font-sans font-medium"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Config & Toggle Accordion */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full flex items-center justify-between text-slate-400 hover:text-amber-500 text-xs transition-colors py-1 focus:outline-none"
              >
                <div className="flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  <span>خيارات الحساب وموازنة الهاء والتاء</span>
                </div>
                {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showExplanation && (
                <div className="bg-slate-950 p-3 rounded-xl space-y-2.5 border border-slate-850 text-xs text-right leading-relaxed text-slate-400 animate-slide-down">
                  <div className="flex items-center justify-between gap-2">
                    <label className="cursor-pointer text-slate-300 font-sans text-[11px]" htmlFor="treatTaAs400">
                      حساب التاء المربوطة (ة) تاء كبرى (400)
                    </label>
                    <input
                      type="checkbox"
                      id="treatTaAs400"
                      checked={treatTaAs400}
                      onChange={(e) => setTreatTaAs400(e.target.checked)}
                      className="w-3.5 h-3.5 accent-amber-500 cursor-pointer rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-905">
                    <label className="cursor-pointer text-slate-300 font-sans text-[11px]" htmlFor="treatYaAs10">
                      حساب الألف المقصورة (ى) ياء (10)
                    </label>
                    <input
                      type="checkbox"
                      id="treatYaAs10"
                      checked={treatYaAs10}
                      onChange={(e) => setTreatYaAs10(e.target.checked)}
                      className="w-3.5 h-3.5 accent-amber-500 cursor-pointer rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Abjad Big Reference Matrix card */}
          <div className="bg-slate-900/40 border border-slate-800/85 p-4 rounded-xl">
            <h3 className="text-amber-500 text-xs mb-3 font-semibold border-r-2 border-amber-600 pr-2 serif-heading flex items-center justify-between">
              <span>جدول أبجد الكبير التقليدي</span>
              <span className="text-[9px] text-slate-500 tracking-widest uppercase">الأوزان الـ 28</span>
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 gap-1 text-[10px] font-mono leading-tight">
              {Object.entries(ABJAD_LETTERS)
                .filter(([char]) => char.length === 1 && !['إ','أ','آ','أَ','ء','ى'].includes(char))
                .slice(0, 16)
                .map(([char, details]) => {
                  const elColor = ELEMENTS[details.element]?.color || "#aaaaaa";
                  return (
                    <div
                      key={char}
                      className="bg-slate-950/80 py-1 px-1.5 rounded border border-slate-850/60 flex justify-between items-center group hover:border-amber-500/30 transition-colors"
                    >
                      <span className="text-slate-300 font-serif font-bold text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: elColor }}></span>
                        {char}
                      </span>
                      <span className="text-amber-500 font-bold">{details.value}</span>
                    </div>
                  );
                })}
            </div>
            <p className="text-[9px] text-slate-500 mt-2 text-right leading-relaxed font-sans">
              * تقسم قواعد الأبجدية إلى نارية، ترابية، هوائية، ومائية في تناوب دوري كوني.
            </p>
          </div>

        </div>

        {/* Left Section: Live Analysis Visualizers & AI Button (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">

          {/* If there's no name, show gentle prompt */}
          {!userName.trim() ? (
            <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="relative mb-4">
                <Stars className="w-12 h-12 text-amber-500/20 animate-pulse" />
                <Star className="w-4 h-4 text-amber-400 absolute top-0 right-0 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h3 className="text-xl font-bold mb-1.5 serif-heading text-amber-200">بانتظار رنين الاسم الطيب...</h3>
              <p className="max-w-md text-slate-400 text-xs leading-relaxed font-sans">
                الرجاء إدخال اسمك وتعديل تاريخ ميلادك في البطاقة المقابلة لمشاهدة استخراج وحساب توافقات الوفق والبرج مروحة واحدة.
              </p>
            </div>
          ) : (
            <>
              {/* Grand Total presentation block */}
              <div className="bg-slate-900/40 border border-amber-900/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-amber-600/5 blur-[80px] rounded-full"></div>
                
                <div className="text-right space-y-1 flex-1 order-2 sm:order-1">
                  <span className="text-slate-500 text-[10px] uppercase tracking-widest block font-sans">الميزان والاهتزاز الكوني للاسم</span>
                  <h3 className="text-xl font-bold text-slate-200 font-serif flex items-center justify-end gap-2 pr-1">
                    <span className="text-amber-500 font-normal">"{userName}"</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 max-w-sm ml-auto leading-relaxed">
                    هذا الاهتزاز العددي يقرنه الغالب بطبيعة {ELEMENTS[elementPercentage.dominant]?.name} بنسبة {elementPercentage[elementPercentage.dominant]}%، وهو رنين مفرد يؤثر في السمت والوفاق الحرفي.
                  </p>
                </div>

                <div className="relative flex-shrink-0 order-1 sm:order-2">
                  <div className="w-20 h-20 rounded-full border border-amber-600 flex flex-col items-center justify-center bg-slate-950 shadow-[0_0_15px_rgba(217,119,6,0.2)]">
                    <span className="text-[9px] text-slate-500 font-semibold uppercase leading-none">الجُمّل</span>
                    <span className="text-2xl font-bold text-amber-500 font-mono leading-tight mt-0.5">{userNameAnalysis.totalSum}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Letter dissection inside Name */}
              <section className="bg-slate-900/40 border border-slate-800/85 p-4 rounded-xl" id="letters-grid">
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-2 mb-3">
                  <div className="text-left font-mono text-xs text-amber-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    <span>{userName} = {userNameAnalysis.totalSum}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 justify-end serif-heading">
                    <Stars className="w-4 h-4 text-amber-500" />
                    <span>تشريح الحروف والأوزان الكونية</span>
                  </h3>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 text-right">
                  {userNameAnalysis.letters.map((dissect, index) => {
                    const elInfo = ELEMENTS[dissect.element];
                    return (
                      <div
                        key={index}
                        className="bg-slate-950/80 rounded-lg p-2 border border-slate-850 flex flex-col items-center justify-center relative overflow-hidden group hover:border-amber-500/30 transition-colors"
                      >
                        {/* Upper element color dot */}
                        <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: elInfo.color }}></span>
                        
                        <span className="text-lg font-bold font-serif text-slate-100 group-hover:scale-105 transition-transform">
                          {dissect.char}
                        </span>
                        
                        <span className="font-mono text-xs font-semibold text-amber-500 mt-0.5">
                          {dissect.value}
                        </span>

                        <span className="text-[9px] text-slate-500 font-sans mt-0.5">
                          {elInfo.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Card 3: Elements balance & Dominant Nature */}
              <section className="bg-slate-900/40 border border-slate-800/85 p-4 rounded-xl" id="nature-balance">
                <h3 className="text-sm font-semibold mb-3 text-slate-200 flex items-center justify-end gap-1.5 border-b border-slate-800/80 pb-2 serif-heading">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>توازنات العناصر المكونة لاسمك</span>
                </h3>

                {/* Dominant Element focus card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-3">
                  
                  {/* Dominant banner */}
                  <div className="md:col-span-5 bg-slate-950 p-3 rounded-lg border border-slate-850 text-right">
                    <span className="text-[10px] text-slate-500 font-medium block mb-0.5">العنصر الطاغي للاسم</span>
                    <h4 className="text-base font-bold text-amber-500 serif-heading mb-1 flex items-center gap-1.5 justify-end">
                      <span>طبيعة {ELEMENTS[elementPercentage.dominant]?.name}</span>
                      {elementPercentage.dominant === "fire" && <Flame className="w-4 h-4 text-red-500 animate-pulse" />}
                      {elementPercentage.dominant === "earth" && <Atom className="w-4 h-4 text-emerald-500" />}
                      {elementPercentage.dominant === "air" && <Wind className="w-4 h-4 text-cyan-400" />}
                      {elementPercentage.dominant === "water" && <Droplet className="w-4 h-4 text-blue-400" />}
                    </h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed font-sans">
                      {ELEMENTS[elementPercentage.dominant]?.description}
                    </p>
                  </div>

                  {/* Progressive bar meter elements */}
                  <div className="md:col-span-7 space-y-2 border-r border-slate-850/60 pr-4">
                    {/* Fire Bar */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-0.5 font-sans">
                        <span className="text-red-400 flex items-center gap-0.5">
                          <Flame className="w-3 h-3" />
                          <span>ناري (الاندفاع والظهور)</span>
                        </span>
                        <span className="font-mono text-slate-300 font-semibold">{elementPercentage.fire}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded transition-all duration-700"
                          style={{ width: `${elementPercentage.fire}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Earth Bar */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-0.5 font-sans">
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <Atom className="w-3 h-3" />
                          <span>ترابي (الاستقرار والواقع)</span>
                        </span>
                        <span className="font-mono text-slate-300 font-semibold">{elementPercentage.earth}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded transition-all duration-700"
                          style={{ width: `${elementPercentage.earth}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Air Bar */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-0.5 font-sans">
                        <span className="text-cyan-400 flex items-center gap-0.5">
                          <Wind className="w-3 h-3" />
                          <span>هوائي (العقل والفكر)</span>
                        </span>
                        <span className="font-mono text-slate-300 font-semibold">{elementPercentage.air}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full rounded transition-all duration-700"
                          style={{ width: `${elementPercentage.air}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Water Bar */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-0.5 font-sans">
                        <span className="text-blue-400 flex items-center gap-0.5">
                          <Droplet className="w-3 h-3" />
                          <span>مائي (العاطفة والبديهة)</span>
                        </span>
                        <span className="font-mono text-slate-300 font-semibold">{elementPercentage.water}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded transition-all duration-700"
                          style={{ width: `${elementPercentage.water}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Element characteristics pills */}
                <div className="border-t border-slate-800/80 pt-2 text-right">
                  <span className="text-[10px] text-slate-400 font-medium block mb-1">أبرز سمات طبعك الغالب المتقرن:</span>
                  <div className="flex flex-wrap gap-1 md:gap-1.5 justify-end">
                    {ELEMENTS[elementPercentage.dominant]?.characteristics.map((char, cIdx) => (
                      <span key={cIdx} className="bg-slate-950 text-slate-350 border border-slate-850 rounded px-2 py-0.5 text-[10px]">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Card 4: Detailed Astrological DOB Grid & Arabic Rising Sign */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4" id="astrology-synergy">
                
                {/* 4a. Western Birth Sign Card */}
                {birthdayAnalysis && (
                  <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-right relative overflow-hidden">
                    <div className="absolute top-[-20px] left-[-20px] opacity-5 pointer-events-none">
                      <Sun className="w-24 h-24 text-amber-500" />
                    </div>
                    
                    <h3 className="text-amber-500 font-bold mb-3 border-b border-slate-800/80 pb-2 flex items-center justify-end gap-1.5 serif-heading text-xs">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>البرج الغربي الميلادي</span>
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${getElementBadgeColor(birthdayAnalysis.westernSign.element)}`}>
                          كوكب {ELEMENTS[birthdayAnalysis.westernSign.element]?.name}
                        </span>
                        <span className="text-base font-bold font-serif text-slate-100 flex items-center gap-1">
                          برج {birthdayAnalysis.westernSign.name}
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-300 font-mono">{birthdayAnalysis.westernSign.dateRange}</span>
                          <span className="text-slate-400">فترة البرج:</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-amber-500 font-serif font-semibold">{birthdayAnalysis.westernSign.planet}</span>
                          <span className="text-slate-400">الكوكب المهيمن:</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-amber-100 font-medium">{birthdayAnalysis.westernSign.stone}</span>
                          <span className="text-slate-400">حجر الحظ الكريم:</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-emerald-400 font-sans text-xs">{birthdayAnalysis.westernSign.luckyNumbers.join(" ، ")}</span>
                          <span className="text-slate-400">أرقام طالع الحظ:</span>
                        </div>
                      </div>

                      {/* Traits list */}
                      <div className="pt-2 border-t border-slate-850/80 flex flex-wrap gap-1 justify-end">
                        {birthdayAnalysis.westernSign.traits.map((tr, tIdx) => (
                          <span key={tIdx} className="bg-slate-950 text-slate-350 px-2 py-0.5 rounded text-[9px]">
                            {tr}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4b. Arabic Numerological Star (Rising Sign) from Mother's Name */}
                <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-right relative overflow-hidden">
                  <div className="absolute top-[-20px] left-[-20px] opacity-[0.03] pointer-events-none">
                    <Moon className="w-24 h-24 text-blue-300" />
                  </div>

                  <h3 className="font-bold mb-3 text-pink-400 border-b border-slate-800/80 pb-2 flex items-center justify-end gap-1.5 serif-heading text-xs">
                    <Moon className="w-3.5 h-3.5 text-pink-400" />
                    <span>البرج الطالع الحسابي الجفري</span>
                  </h3>

                  {arabicRisingSign ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${getElementBadgeColor(arabicRisingSign.sign.element)}`}>
                          طاقة {ELEMENTS[arabicRisingSign.sign.element]?.name}
                        </span>
                        <span className="text-base font-bold font-serif text-slate-100">
                          طالع {arabicRisingSign.sign.name}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 leading-relaxed max-h-24 overflow-y-auto">
                        تجمع القيمة ({userNameAnalysis.totalSum}) مع اسم والدتك ({motherNameAnalysis.totalSum})، والقسمة الكلية ({arabicRisingSign.combinedSum}) على 12. باقي القسمة ({arabicRisingSign.remainder}) معين طالعك.
                      </div>

                      <div className="pt-2 border-t border-slate-850/80 space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-amber-500 font-semibold">{arabicRisingSign.sign.planet}</span>
                          <span className="text-slate-400 font-sans">السيّار الحاكم للروح:</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-300">{arabicRisingSign.sign.stone}</span>
                          <span className="text-slate-400 font-sans">معدن المساعد:</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[140px] text-center p-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        الرجاء كتابة اسم الأم في حقل الوفد بالجهة المقابلة لتفعيل حساب منزلة البرج الطالع الروحي.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4c. Chinese Zodiac & Moon Stations Details */}
                {birthdayAnalysis && (
                  <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-right md:col-span-2 relative overflow-hidden">
                    <h3 className="font-bold mb-3 text-emerald-300 border-b border-slate-800/80 pb-2 flex items-center justify-end gap-1.5 serif-heading text-xs">
                      <Stars className="w-3.5 h-3.5 text-emerald-400" />
                      <span>الأفق الفلكي الشرقي ومنازل الروح</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-200 font-semibold">{birthdayAnalysis.easternZodiac.arabicName} ({birthdayAnalysis.easternZodiac.animal})</span>
                          <span className="text-emerald-400 font-sans text-[11px]">البرج الصيني السنوي:</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                          السمات: {birthdayAnalysis.easternZodiac.traits.join(" ، ")}
                        </p>
                        <p className="text-[10px] text-indigo-350 font-sans">
                          يتوافق روحياً مع: {birthdayAnalysis.easternZodiac.compatibility.join(" ، ")}
                        </p>
                      </div>

                      <div className="space-y-1 border-t sm:border-t-0 sm:border-r border-slate-800/80 sm:pr-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-amber-500 font-serif text-sm font-semibold">{birthdayAnalysis.moonStation}</span>
                          <span className="text-yellow-500 font-sans text-[11px]">منزلة القمر المقدرة:</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal font-sans">
                          منزلة تمنح الهدوء واليمن والاستقرار وتعين على اتخاذ القرارات الصحيحة في شؤون المعاش والحكمة والبحث.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Card 5: AI Magical Deep Reading Box */}
              <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl relative overflow-hidden">
                <span className="absolute top-1 right-[10%] w-1 h-1 bg-amber-500 rounded-full animate-ping"></span>
                <span className="absolute bottom-5 left-5 w-1 h-1 bg-amber-600 rounded-full animate-pulse"></span>

                <div className="relative z-10 text-center space-y-3">
                  <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text serif-heading">
                    تحليل كتابك الفلكي الروحي الفائق
                  </h3>
                  <p className="max-w-md mx-auto text-slate-400 text-xs leading-relaxed font-sans">
                    سيبحر مستشار الفلك الروحي المدعوم بـ Gemini لإنتاج استخلاص حظ كوني متكامل ومقترن بالطبائع الأربعة المحددة لثقل رنين اسمك الطيب.
                  </p>

                  <button
                    onClick={handleGenerateReport}
                    disabled={isLoading}
                    className="cursor-pointer inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-amber-500 border border-amber-500/30 font-bold px-6 py-2.5 rounded-lg text-xs tracking-wide transition-all font-sans"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>يجري استقصاء المنازل الفلكية...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>طلب التفسير الروحي بـ Gemini ✨</span>
                      </>
                    )}
                  </button>

                  {errorMsg && (
                    <div className="text-red-400 text-[11px] bg-red-950/20 p-2 rounded border border-red-900/30 text-center">
                      {errorMsg}
                    </div>
                  )}
                </div>

                {/* Live Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-950 z-20 flex flex-col items-center justify-center p-4 text-center">
                    <div className="relative mb-3">
                      <div className="w-12 h-12 rounded-full border border-amber-500/20 border-t-amber-500 animate-spin"></div>
                      <Sparkles className="w-5 h-5 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    
                    <h4 className="text-sm font-semibold mb-1 text-amber-400 serif-heading">
                      يرصد مستشار الجفر والنجوم...
                    </h4>
                    
                    <p className="max-w-xs text-slate-400 text-xs leading-relaxed font-sans animate-pulse">
                      {loadingPhrases[loadingStep]}
                    </p>

                    <div className="mt-4 flex gap-1">
                      {loadingPhrases.map((_, pIdx) => (
                        <span
                          key={pIdx}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${loadingStep === pIdx ? "bg-amber-500 scale-125" : "bg-slate-800"}`}
                        ></span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Card 6: AI Generated Cosmic Reading Result */}
              {report && (
                <section className="bg-slate-900/50 rounded-xl p-5 border border-slate-800 relative overflow-hidden" id="ai-report-card">
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-slate-900 to-black"></div>
                  
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <button
                      onClick={() => {
                        setReport("");
                        window.scrollTo({ top: document.getElementById('inputs-panel')?.offsetTop || 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer text-[10px] text-slate-500 hover:text-slate-400 transition-colors flex items-center gap-1 bg-slate-950 border border-slate-900 px-2 py-1 rounded"
                    >
                      <span>تحديث الحساب</span>
                      <RefreshCw className="w-2.5 h-2.5" />
                    </button>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-amber-400 font-serif serif-heading">
                        كتابك الكوني واستنطاق الطبائع
                      </h3>
                      <Award className="w-4 h-4 text-amber-500" />
                    </div>
                  </div>

                  {/* Render formatted deep analysis */}
                  <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-900 text-right">
                    {renderFormattedReport(report)}
                  </div>

                  <div className="mt-4 border-t border-slate-850/60 pt-2 flex justify-between items-center text-[10px] text-slate-500 font-sans">
                    <span>* تم احتسابه فلكياً وبدعم من الذكاء الاصطناعي وفق رصد المنازل الحرفية.</span>
                    <span className="flex items-center gap-1 font-serif text-slate-400">
                      <span>{userName}</span>
                      <User className="w-3 h-3 text-amber-500" />
                    </span>
                  </div>
                </section>
              )}
            </>
          )}

        </div>

      </main>

      {/* Decorative calligraphic footer */}
      <footer className="max-w-7xl mx-auto px-4 mt-16 text-center border-t border-slate-900 pt-6 pb-8 text-[10px] text-slate-600 relative z-10 space-y-1">
        <p className="sans-body">جميع الحقوق الفلكية والعددية محفوظة ومحسوبة بالمعايرة الأبجدية للأبعاد الأربعة © 2026</p>
        <p className="font-serif italic text-amber-600/65">"الحروف طاقات، والأعداد لغات، والنجوم علامات بقدر القدير"</p>
      </footer>
    </div>
  );
}
