export type Lang = "ar" | "en";
export type Item = {
  id: string;
  name: string;
  ar: string;
  sar: number;
  original?: number;
  features?: [string, string][];
};
const start: [string, string][] = [
  ["Landing page · 3 design directions", "صفحة هبوط · 3 توجهات تصميم"],
  ["Logo · 3 concepts + 3 revision rounds", "شعار · 3 أفكار و3 جولات تعديل"],
  ["One year hosting + 2 business emails", "استضافة سنة وبريدان رسميان"],
  ["LinkedIn company setup and branding", "إعداد صفحة الشركة على لينكدإن"],
  ["Email signature and Gmail connection", "توقيع البريد وربطه بـ Gmail"],
  [
    "Mobile responsive + basic SEO",
    "توافق مع الموبايل وتهيئة أساسية لمحركات البحث",
  ],
];
const essential: [string, string][] = [
  [
    "RFQ, quotation and supplier comparison templates",
    "نماذج طلب تسعير وعرض سعر ومقارنة موردين",
  ],
  ["Basic services contract template", "نموذج عقد خدمات أساسي"],
];
const grow: [string, string][] = [
  [
    "Complete corporate website · 3 design directions",
    "موقع شركة متكامل · 3 توجهات تصميم",
  ],
  ["One year hosting + 10 business emails", "استضافة سنة و10 عناوين بريد رسمي"],
  ["Logo · 3 concepts + 3 revision rounds", "شعار · 3 أفكار و3 جولات تعديل"],
  ["Company profile · 10–12 pages", "بروفايل شركة · 10–12 صفحة"],
  [
    "Brand identity + mini guidelines · 5–8 pages",
    "هوية بصرية ودليل مختصر · 5–8 صفحات",
  ],
  [
    "Quotation, invoice and PowerPoint designs",
    "تصميم عرض سعر وفاتورة وقالب باوربوينت",
  ],
  [
    "Business card, email signature and LinkedIn branding",
    "بطاقة أعمال وتوقيع بريد وتجهيز لينكدإن",
  ],
  [
    "Mobile responsive + basic SEO",
    "توافق مع الموبايل وتهيئة أساسية لمحركات البحث",
  ],
];
export const packages: Item[] = [
  {
    id: "start",
    name: "START",
    ar: "انطلاقة",
    sar: 2250,
    original: 3900,
    features: start,
  },
  {
    id: "start-procure",
    name: "START + PROCURE",
    ar: "انطلاقة + مشتريات",
    sar: 3250,
    original: 5500,
    features: [...start, ...essential],
  },
  {
    id: "grow",
    name: "GROW",
    ar: "نمو",
    sar: 5900,
    original: 9900,
    features: grow,
  },
  {
    id: "grow-procure",
    name: "GROW + PROCURE",
    ar: "نمو + مشتريات",
    sar: 7250,
    original: 12500,
    features: [
      ...grow,
      ...essential,
      [
        "Purchase order, vendor registration and evaluation forms",
        "نماذج أمر شراء وتسجيل وتقييم الموردين",
      ],
      [
        "Procurement tracker and workflow",
        "متابعة المشتريات وإجراءات العمل الأساسية",
      ],
    ],
  },
  {
    id: "premium",
    name: "PREMIUM",
    ar: "بريميوم",
    sar: 10900,
    original: 17900,
    features: [
      ["Premium corporate website + CMS", "موقع احترافي متكامل ولوحة تحكم"],
      ["3 premium creative directions", "3 توجهات تصميم احترافية"],
      [
        "One year hosting + 20 business emails",
        "استضافة سنة و20 عنوان بريد رسمي",
      ],
      [
        "Complete logo system · 3 concepts + revision rounds",
        "نظام شعار متكامل · 3 أفكار وجولات تعديل",
      ],
      ["Company profile · 10–15 pages", "بروفايل شركة · 10–15 صفحة"],
      [
        "Complete brand guidelines · 15–20 pages",
        "دليل هوية متكامل · 15–20 صفحة",
      ],
      ["10 brand applications", "10 تطبيقات للهوية البصرية"],
      [
        "Business card, email signature and LinkedIn branding",
        "بطاقة أعمال وتوقيع بريد وتجهيز لينكدإن",
      ],
      [
        "SEO, analytics, lead forms and WhatsApp",
        "تهيئة البحث والتحليلات ونماذج التواصل وواتساب",
      ],
    ],
  },
];
export const addons: Item[] = [
  {
    id: "catalogue-short",
    name: "Services catalogue · 12–15 pages",
    ar: "كتالوج خدمات · 12–15 صفحة",
    sar: 933.75,
  },
  {
    id: "catalogue-long",
    name: "Services catalogue · 15–30 pages",
    ar: "كتالوج خدمات · 15–30 صفحة",
    sar: 1683.75,
  },
  {
    id: "contract-short",
    name: "Sale / lease agreement · short",
    ar: "عقد بيع أو إيجار · مختصر",
    sar: 746.25,
  },
  {
    id: "contract-long",
    name: "Comprehensive commercial agreement",
    ar: "عقد تجاري متكامل",
    sar: 1683.75,
  },
  {
    id: "documents",
    name: "3 document brand applications",
    ar: "3 تطبيقات هوية للمستندات",
    sar: 558.75,
  },
  {
    id: "physical",
    name: "3 physical brand applications",
    ar: "3 تطبيقات هوية للمركبات والملابس وغيرها",
    sar: 746.25,
  },
];
export const refund = {
  ar: "يمكنك طلب استرداد المبلغ المدفوع خلال 3 أيام (72 ساعة) من وقت الدفع. يُردّ كامل المبلغ بعد خصم الرسوم الإدارية ورسوم التحويل فقط. لطلب الاسترداد، راسل info@masarps.com مع رقم الطلب.",
  en: "You may request a refund within 3 days (72 hours) of payment. The amount paid will be refunded, less administrative and transfer fees only. To request a refund, email info@masarps.com with your order reference.",
};
export const policyVersion = "2026-09-08";
