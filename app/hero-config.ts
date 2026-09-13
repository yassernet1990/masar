export type HeroCopy = {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  tagline: string;
  intro: string;
  cta: string;
};

export type HeroV16 = { en: HeroCopy; ar: HeroCopy };

export const heroDefaults: HeroV16 = {
  en: {
    eyebrow: "Integrated procurement intelligence",
    titleTop: "Procurement that",
    titleAccent: "moves business forward.",
    tagline: "Strategy. Sourcing. Contracts. Systems.",
    intro:
      "MASAR transforms procurement into structure, clarity, and measurable business advantage — connecting demand to the right market, suppliers and commercial decisions.",
    cta: "Discover MASAR",
  },
  ar: {
    eyebrow: "ذكاء متكامل في المشتريات",
    titleTop: "مشتريات تدفع",
    titleAccent: "الأعمال إلى الأمام.",
    tagline: "الاستراتيجية. التوريد. العقود. الأنظمة.",
    intro:
      "تحوّل مسار المشتريات إلى هيكل واضح وقرارات تجارية قابلة للقياس، وتربط الاحتياج بالسوق والموردين والفرص الصحيحة.",
    cta: "اكتشف مسار",
  },
};

export function heroConfig(config: { heroV16?: HeroV16 }, lang: "en" | "ar") {
  return config.heroV16?.[lang] || heroDefaults[lang];
}
