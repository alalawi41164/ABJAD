import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize server-side Gemini client with proper configuration options
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. A localized high-quality mathematical analysis will be used instead.");
  }

  // Health check API endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiConfigured: !!apiKey });
  });

  // Deep Astrological & Numerological Analysis API endpoint using Gemini model
  app.post("/api/analyze", async (req, res) => {
    const {
      name,
      motherName,
      dob,
      abjadValue,
      motherAbjadValue,
      totalAbjadSum,
      dominantElement,
      elementsBreakdown,
      westernSign,
      westernSignElement,
      arabicCalculatedSign,
      luckyNumbers,
      planet,
      stone
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "الرجاء إدخال الاسم للتحليل." });
    }

    try {
      if (!ai) {
        // Fallback response with beautiful static analysis when API key is missing
        return res.json({
          report: `### القراءة الكونية التفصيلية بجدول الجمل الكبير (قراءة محلية بديلة)
          
مرحباً بك يا **${name}**. لم نتمكن من تنشيط قارئ النجوم المدعوم بالذكاء الاصطناعي (يرجى إدخال مفتاح الـ API لـ Gemini في لوحة الإعدادات لتفعيل التحليل الفائق!)، ولكن إليك التحليل الحسابي الفلكي الأساسي وفق جدول الجمل المعتمد:

1. **طاقة الحروف ورنين الاسم الحسابي**:
   * قيمة اسمك العددية الكلية بـ (حساب الجمل الكبير) هي: **${abjadValue}**.
   * هذا الرقم يحمل اهتزازاً متميزاً يعبّر عن طاقة شخصية مستقلة ووعي فكري متواصل.
   * الطبيعة الغالبة على حرف الاسم هي **طبيعة ${dominantElement}** بتركيز فائق. إن طاقة هذا العنصر تمنحك خصائص غنية تحدد مسارات تفاعلك اليومي، حيث يتأثر مزاجك واختياراتك بهذا التدفق الطبيعي.

2. **البرج الفلكي الغربي والبرج الطالع الحسابي**:
   * برجك الغربي المعتمد على تاريخ ميلادك هو: **${westernSign}** (عنصر ${westernSignElement}) وكوكبه المهيمن هو **${planet}** وحجره الكريم الأنسب هو **${stone}**.
   ${motherName ? `* برجك الطالع الحسابي المرتبط بـ (اسم الأم: ${motherName}) هو برج **${arabicCalculatedSign}** الذي تم احتسابه فلكياً بقسمة مجموع الجمل (${totalAbjadSum}) على منازل الأبراج الاثني عشر.` : "* بإمكانك إدخال اسم الأم لحساب برجك الطالع الحسابي الدقيق وفق الموروث الفلكي العربي القديم."}
   
3. **أسرار التناغم الكوني والتوجيه الروحي**:
   * أرقام حظك المباشرة هي: **${luckyNumbers?.join('، ') || '3, 7, 9'}**.
   * نوصيك بالتأمل الهادئ والاتصال بعنصرك الحرفي الغالب لخفض منسوب التوتر وزيادة الإلهام الإبداعي في حياتك المهنية والعاطفية.`
        });
      }

      // Prepare Prompt for Gemini model
      const prompt = `أنت عالم فلك ومقوّم بارع في علم الحرف وحساب الجمل الكبير وعلم الفلك الروحي القديم.
أصدر تقريراً فلكياً مبهراً، منسقاً بعناية وجذاباً بلغة عربية فصحى ساحرة ذات طبع أدبي روحاني عميق، لتحليل هذه البيانات الحسابية والفلكية الخاصة بالشخص:

البيانات الرياضية والفلكية للمستعلم:
- الاسم المستعلم عنه: ${name}
- قيمة الاسم بجدول الجمل الكبير: ${abjadValue}
- الطبائع الأربعة للاسم (التركيز الحرفي):
  * نارية: ${elementsBreakdown.fire}%
  * ترابية: ${elementsBreakdown.earth}%
  * هوائية: ${elementsBreakdown.air}%
  * مائية: ${elementsBreakdown.water}%
- العنصر الغالب للاسم: ${dominantElement}

بيانات تاريخ الميلاد فلكياً:
- تاريخ الميلاد: ${dob}
- البرج الغربي: ${westernSign} (العنصر: ${westernSignElement})
- الكوكب الحاكم للبرج: ${planet}
- الحجر الكريم المصاحب: ${stone}
- أرقام الحظ العددية: ${luckyNumbers?.join('، ')}

${motherName ? `بيانات البرج الطالع الحسابي (علم الجفر):
- اسم الأم: ${motherName} (قيمة اسم الأم الحرفية: ${motherAbjadValue})
- المجموع المشترك (الاسم + الأم): ${totalAbjadSum}
- البرج الطالع الحسابي المكتشف (المجموع % 12): ${arabicCalculatedSign}` : ""}

المطلوب صياغة التقرير الكوني في الأقسام التالية مع التنسيق باستخدام Markdown بأسلوب جميل ومؤثر وخالي من الركاكة:
1.  **سر رنين الاسم وطاقة الأرقام المكتشفة**: قم بتحليل قيمة الجمل (${abjadValue}) ومعناه الروحي وبواطن القوة والضعف في حروف هذا النطق.
2.  **تحليل الطبائع الأربعة للاسم وتأثيرها الشخصي**: علق على غلبة عنصر (${dominantElement}) ونسبة توزيع العناصر الأخرى في شخصيته وحياته اليومية، وكيف يصنع توازناً بين المائي والهوائي والترابي والناري.
3.  **تداخل النجوم والولادة والبرج الطالع**: اشرح التناغم بين برجه الغربي (${westernSign}) ${motherName ? `وبرجه الحسابي الطالع (${arabicCalculatedSign}) المكتشف من أسرار روحانية الأم` : ""} وتأثير الكوكب المسيطر (${planet}) عليه، ومفهوم الحجر الروحي (${stone}).
4.  **نبوءات التوازن الحياتي والروحي لعام 2026/2027**: توصيات مخصصة للارتقاء بروحه وتفعيل طاقة أرقام حظه (${luckyNumbers?.join('، ')})، واستخدام حجر الجواهر لديه، والشهور التي تصعد فيها طاقته لأقصى مدى.

اجعل النص غنياً بالمعاني، ذو ملمس كوني فاخر، مليء باللمحات الروحية المطمئنة والتعبيرات العميقة التي تجعل القارئ يشعر بدقة وعظمة التناسق الفلكي والحسابي.`;

      // Call Gemini 3.5 Flash Model
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "أنت بروفيسور محترف في الفلك الروحي وعلاقة الحروف بالأرقام والأبراج والطبائع الكونية الحكيمة.",
          temperature: 0.85,
        }
      });

      const reportText = response.text || "لم نتمكن من صياغة التقرير حالياً.";
      res.json({ report: reportText });

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "فشلت عملية التحليل الكوني الذكي. يرجى تكرار المحاولة لاحقاً.",
        details: error.message
      });
    }
  });

  // Setup Vite Dev Server / Production File Server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static assets from", distPath);
  }

  // Bind exclusively to 0.0.0.0 and port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
