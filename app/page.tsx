"use client";
import { FormEvent, useEffect, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

type Lang = "ar" | "en";
type ThemeMedia = {
  hero: string;
  statement: string;
  contact: string;
  services: string[];
};
type SiteConfig = {
  content: typeof content;
  theme: string;
  media: ThemeMedia;
  mediaByTheme?: Record<string, ThemeMedia>;
};
type Inquiry = {
  id: string;
  company: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};
const defaultMedia = {
  hero: "/images/cx-hero.png",
  statement: "/images/logistics.webp",
  contact: "/images/delivery.webp",
  services: [
    "/images/sourcing.webp",
    "/images/network.webp",
    "/images/trade.webp",
    "/images/warehouse.webp",
  ],
};
const themeMedia: Record<string, ThemeMedia> = {
  midnight: {
    hero: "/themes/midnight/hero.webp",
    statement: "/themes/midnight/editorial.webp",
    contact: "/themes/midnight/hero.webp",
    services: [1, 2, 3, 4].map((n) => `/themes/midnight/service-${n}.webp`),
  },
  sand: {
    hero: "/themes/sand/hero.webp",
    statement: "/themes/sand/editorial.webp",
    contact: "/themes/sand/hero.webp",
    services: [1, 2, 3, 4].map((n) => `/themes/sand/service-${n}.webp`),
  },
  emerald: {
    hero: "/themes/emerald/hero.webp",
    statement: "/themes/emerald/editorial.webp",
    contact: "/themes/emerald/hero.webp",
    services: [1, 2, 3, 4].map((n) => `/themes/emerald/service-${n}.webp`),
  },
  obsidian: {
    hero: "/themes/obsidian/hero.webp",
    statement: "/themes/obsidian/editorial.webp",
    contact: "/themes/obsidian/hero.webp",
    services: [1, 2, 3, 4].map((n) => `/themes/obsidian/service-${n}.webp`),
  },
};
const themeNames: Record<
  string,
  { name: string; note: string; identity: string; vars: Record<string, string> }
> = {
  masar: {
    name: "Masar Signature",
    note: "الهوية الأصلية — محفوظة كما هي",
    identity: "Original Signature",
    vars: {
      "--ice": "#b8ccd5",
      "--blue": "#071bda",
      "--aqua": "#76cfc0",
      "--peach": "#f4c3a7",
    },
  },
  midnight: {
    name: "Midnight Executive",
    note: "مركز قيادة رقمي لسلاسل الإمداد",
    identity: "Digital Command",
    vars: {
      "--ice": "#172536",
      "--blue": "#147dff",
      "--aqua": "#63d4ce",
      "--peach": "#f3bf88",
    },
  },
  sand: {
    name: "Sand & Copper",
    note: "حداثة سعودية بطابع تحريري دافئ",
    identity: "Desert Modernism",
    vars: {
      "--ice": "#dfd5c4",
      "--blue": "#173d64",
      "--aqua": "#7ab1a8",
      "--peach": "#c78157",
    },
  },
  emerald: {
    name: "Emerald Flow",
    note: "مشتريات مستدامة وشبكات متجددة",
    identity: "Regenerative Network",
    vars: {
      "--ice": "#cbded8",
      "--blue": "#075d68",
      "--aqua": "#70c9b6",
      "--peach": "#e2a77e",
    },
  },
  obsidian: {
    name: "Obsidian Atelier",
    note: "دقة تنفيذية سوداء وذهبية",
    identity: "Executive Atelier",
    vars: {
      "--ice": "#080d14",
      "--blue": "#c7a76b",
      "--aqua": "#70d5c3",
      "--peach": "#e7c98f",
    },
  },
};
const content = {
  ar: {
    nav: ["عن مسار", "خدماتنا", "منهجيتنا", "الأسئلة"],
    lang: "English",
    contact: "تواصل",
    time: "2:55:04 م",
    place: "جدة، السعودية",
    heroTitle: (
      <>
        كل عملية شراء
        <br />
        يمكن أن تصنع
        <br />
        <strong>فرقًا أكبر</strong>
      </>
    ),
    heroText: (
      <>
        نحوّل المشتريات من وظيفة تشغيلية إلى ميزة استراتيجية.
        <br />
        <b>حلول ذكية تربط الاحتياج بالسوق، وتبني سلاسل إمداد أكثر مرونة.</b>
      </>
    ),
    heroCta: "طوّر مشترياتك",
    stat: "360°",
    statText: "إدارة متكاملة لدورة الشراء من الحاجة إلى التسليم",
    statSource: "MASAR PROCUREMENT",
    intro: "نحن مسار",
    introTitle: (
      <>
        نربط الأسواق
        <br />
        بالفرص الصحيحة.
      </>
    ),
    introText:
      "مسار لحلول المشتريات شركة متخصصة في الاستشارات، التوريد الاستراتيجي، إدارة الموردين، التجارة، الاستيراد، التخزين والتسليم. نعمل كامتداد لفريقك لنحمي التكلفة والجودة والوقت.",
    highlight: [
      ["01", "خبرة عملية", "قرارات شراء مبنية على السوق، لا على التخمين."],
      [
        "02",
        "من الألف إلى الياء",
        "فريق واحد يدير الطلب والمنافسة والعقد حتى التسليم.",
      ],
      [
        "03",
        "أثر قابل للقياس",
        "حوكمة واضحة، تقارير دقيقة ومؤشرات أداء مستمرة.",
      ],
    ],
    serviceK: "خدماتنا",
    serviceTitle: (
      <>
        حلول متكاملة
        <br />
        لإتقان <strong>المشتريات</strong>
      </>
    ),
    serviceMore: "اكتشف الخدمة",
    services: [
      [
        "01",
        "استشارات وحلول المشتريات",
        "تطوير الاستراتيجية والإجراءات، تحسين دورة الشراء، إدارة العقود، التدريب والدعم الرقمي.",
        "/images/cx-about.png",
      ],
      [
        "02",
        "التوريد الاستراتيجي وإدارة الموردين",
        "تحليل السوق، تأهيل الموردين، إدارة RFQ/RFP، التفاوض ومتابعة الأداء.",
        "/images/cx-sourcing.png",
      ],
      [
        "03",
        "التجارة والتوريد والاستيراد",
        "تأمين السلع والخدمات، الشحن، الجمارك والامتثال في أسواق المنطقة.",
        "/images/cx-network.png",
      ],
      [
        "04",
        "التخزين والمخزون والتسليم",
        "تخزين منظم، تتبع لحظي للمخزون، وتنسيق تسليم موثوق.",
        "/images/cx-method.png",
      ],
    ],
    whyK: "لماذا مسار؟",
    whyTitle: (
      <>
        شريكك الاستراتيجي
        <br />
        في كل <strong>نقطة قرار.</strong>
      </>
    ),
    whyText:
      "نستثمر في المعرفة، التقنية، والعلاقات لنمنح فرقك وضوحًا أكبر وتحكمًا أفضل في سلسلة التوريد.",
    whyCta: "ابدأ محادثة",
    methodK: "منهجيتنا",
    methodTitle: (
      <>
        إطار عمل يبدأ
        <br />
        من الحاجة وينتهي بـ<strong>القيمة.</strong>
      </>
    ),
    steps: [
      ["1", "نفهم", "نحدد الاحتياج والمواصفات والميزانية والمخاطر."],
      ["2", "نبحث", "نمسح السوق ونؤهل الموردين ونبني القائمة الصحيحة."],
      ["3", "ننّفذ", "ننافس ونتفاوض ونتابع الجودة والشحن والتسليم."],
    ],
    sectors:
      "نخدم المقاولات، التطوير العقاري، الصناعة، الضيافة، التجزئة والسلع الاستهلاكية.",
    roadmapK: "خارطة الطريق",
    roadmapTitle: "نبني اليوم شريك المشتريات الإقليمي للغد.",
    years: [
      ["2026", "التأسيس والانطلاق"],
      ["2030", "النمو الإقليمي"],
      ["2035", "ريادة السوق"],
    ],
    faqK: "الأسئلة المتكررة",
    faqTitle: "إجابات واضحة قبل أن نبدأ.",
    faqs: [
      [
        "هل تتولون دورة الشراء كاملة؟",
        "نعم، من تحديد الاحتياج وإعداد المنافسة حتى التفاوض والتعاقد والمتابعة والتسليم.",
      ],
      [
        "هل تعملون مع موردين خارج السعودية؟",
        "نعم، نربط عملاءنا بموردين محليين وإقليميين ودوليين مع تنسيق الاستيراد والامتثال.",
      ],
      [
        "هل يمكن طلب خدمة واحدة فقط؟",
        "نعم. يمكننا تنفيذ دراسة سوق أو RFQ/RFP أو تفاوض عقد أو توريد محدد.",
      ],
      [
        "كيف تضمنون الشفافية؟",
        "بمعايير تأهيل وتقييم موثقة، مقارنات تجارية واضحة وتقارير أداء ومخاطر.",
      ],
    ],
    formK: "ابدأ مشروعك معنا",
    formTitle: (
      <>
        حدثنا عن احتياجك،
        <br />
        وسنبني له <strong>المسار الصحيح.</strong>
      </>
    ),
    formText:
      "شاركنا نبذة عن المشروع، وسيتواصل معك فريق مسار لتنسيق مكالمة أولية.",
    company: "اسم الشركة",
    name: "الاسم الكريم",
    email: "البريد الإلكتروني",
    message: "نبذة عن الطلب",
    send: "إرسال",
    sent: "شكرًا لك. استلمنا طلبك وسنتواصل معك قريبًا.",
    footer: "حلول مشتريات ذكية تربط الأسواق وتبني سلاسل إمداد أكثر مرونة.",
    rights: "جميع الحقوق محفوظة",
  },
  en: {
    nav: ["About Masar", "Services", "Method", "FAQ"],
    lang: "عربي",
    contact: "Contact",
    time: "2:55:04 PM",
    place: "Jeddah, Saudi Arabia",
    heroTitle: (
      <>
        Every purchase
        <br />
        can create
        <br />
        <strong>a bigger difference</strong>
      </>
    ),
    heroText: (
      <>
        We turn procurement from an operating function into a strategic
        advantage.
        <br />
        <b>
          Smart solutions connecting need to market and building resilient
          supply chains.
        </b>
      </>
    ),
    heroCta: "Transform procurement",
    stat: "360°",
    statText: "End-to-end procurement from need to delivery",
    statSource: "MASAR PROCUREMENT",
    intro: "About Masar",
    introTitle: (
      <>
        Connecting markets
        <br />
        to the right opportunities.
      </>
    ),
    introText:
      "Masar Procurement Solutions specializes in consulting, strategic sourcing, vendor management, trading, import, warehousing and delivery. We work as an extension of your team to protect cost, quality and time.",
    highlight: [
      [
        "01",
        "Practical expertise",
        "Market-led procurement decisions, never guesswork.",
      ],
      [
        "02",
        "End to end",
        "One team managing the request, competition and contract through delivery.",
      ],
      [
        "03",
        "Measurable impact",
        "Clear governance, accurate reporting and continuous KPIs.",
      ],
    ],
    serviceK: "What we offer",
    serviceTitle: (
      <>
        Integrated solutions
        <br />
        to master <strong>procurement.</strong>
      </>
    ),
    serviceMore: "Explore service",
    services: [
      [
        "01",
        "Procurement consulting & solutions",
        "Strategy, process development, cycle optimization, contracts, training and digital support.",
        "/images/cx-about.png",
      ],
      [
        "02",
        "Strategic sourcing & vendor management",
        "Market analysis, supplier qualification, RFQ/RFP, negotiation and performance.",
        "/images/cx-sourcing.png",
      ],
      [
        "03",
        "Trading, supply & import",
        "Goods and services supply, shipping, customs and compliance across MENA.",
        "/images/cx-network.png",
      ],
      [
        "04",
        "Warehousing, inventory & delivery",
        "Organized storage, real-time inventory and reliable delivery coordination.",
        "/images/cx-method.png",
      ],
    ],
    whyK: "Why Masar",
    whyTitle: (
      <>
        Your strategic partner
        <br />
        at every <strong>decision point.</strong>
      </>
    ),
    whyText:
      "We invest in knowledge, technology and relationships to give your teams greater clarity and control across the supply chain.",
    whyCta: "Start a conversation",
    methodK: "Our method",
    methodTitle: (
      <>
        A framework that starts
        <br />
        with need and ends in <strong>value.</strong>
      </>
    ),
    steps: [
      ["1", "Understand", "Define the need, specification, budget and risk."],
      [
        "2",
        "Discover",
        "Map the market, qualify suppliers and build the right shortlist.",
      ],
      [
        "3",
        "Execute",
        "Compete, negotiate and track quality, shipping and delivery.",
      ],
    ],
    sectors:
      "Serving construction, real estate, industry, hospitality, retail and consumer goods.",
    roadmapK: "Roadmap",
    roadmapTitle: "Building tomorrow’s regional procurement partner, today.",
    years: [
      ["2026", "Establishment & foundation"],
      ["2030", "Regional growth"],
      ["2035", "Market leadership"],
    ],
    faqK: "Frequently asked",
    faqTitle: "Clear answers before we begin.",
    faqs: [
      [
        "Can you manage the full procurement cycle?",
        "Yes, from requirements and tender documents through negotiation, contracting, follow-up and delivery.",
      ],
      [
        "Do you source beyond Saudi Arabia?",
        "Yes, we connect clients with local, regional and international suppliers with import and compliance coordination.",
      ],
      [
        "Can we engage Masar for one service only?",
        "Yes. Engage us for a market study, RFQ/RFP, contract negotiation or a specific supply.",
      ],
      [
        "How do you ensure transparency?",
        "With documented qualification and evaluation criteria, clear comparisons and performance and risk reporting.",
      ],
    ],
    formK: "Start a project",
    formTitle: (
      <>
        Tell us what you need.
        <br />
        We’ll build the <strong>right path.</strong>
      </>
    ),
    formText:
      "Share a short brief and the Masar team will contact you to arrange an initial conversation.",
    company: "Company name",
    name: "Full name",
    email: "Work email",
    message: "Project brief",
    send: "Send",
    sent: "Thank you. Your enquiry has been received.",
    footer:
      "Smart procurement solutions connecting markets and building resilient supply chains.",
    rights: "All rights reserved",
  },
};

function Logo() {
  return (
    <a className="cx-logo" href="#top" aria-label="Masar home">
      <span className="logo-word">
        <b>MASAR</b>
        <small>PROCUREMENT / SOLUTIONS</small>
      </span>
    </a>
  );
}

function isElementLike(
  value: unknown,
): value is { type?: unknown; props?: { children?: unknown } } {
  return Boolean(
    value && typeof value === "object" && ("props" in value || "type" in value),
  );
}
function nodeText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (Array.isArray(value)) return value.map(nodeText).join("");
  if (isElementLike(value))
    return value.type === "br" ? "\n" : nodeText(value.props?.children);
  return "";
}
function editorContent(value: unknown): unknown {
  if (isElementLike(value)) return nodeText(value);
  if (Array.isArray(value)) return value.map(editorContent);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, editorContent(item)]),
    );
  return value;
}
function mergeEditable(base: unknown, saved: unknown): unknown {
  if (saved === undefined || isElementLike(saved)) return base;
  if (Array.isArray(base) && Array.isArray(saved))
    return saved.map((item, index) => mergeEditable(base[index], item));
  if (
    base &&
    typeof base === "object" &&
    saved &&
    typeof saved === "object" &&
    !Array.isArray(base) &&
    !Array.isArray(saved)
  ) {
    return Object.fromEntries(
      Object.keys(base).map((key) => [
        key,
        mergeEditable(
          (base as Record<string, unknown>)[key],
          (saved as Record<string, unknown>)[key],
        ),
      ]),
    );
  }
  return saved;
}

type EditableContent = Record<Lang, Record<string, unknown>>;
type ContentSection = { id: string; label: string; keys: string[] };

const contentSections: ContentSection[] = [
  {
    id: "hero",
    label: "الغلاف الرئيسي",
    keys: [
      "nav",
      "lang",
      "contact",
      "place",
      "heroTitle",
      "heroText",
      "heroCta",
      "stat",
      "statText",
      "statSource",
    ],
  },
  {
    id: "about",
    label: "من نحن والمميزات",
    keys: ["intro", "introTitle", "introText", "highlight"],
  },
  {
    id: "services",
    label: "الخدمات",
    keys: ["serviceK", "serviceTitle", "serviceMore", "services"],
  },
  {
    id: "why",
    label: "لماذا مسار",
    keys: ["whyK", "whyTitle", "whyText", "whyCta"],
  },
  {
    id: "method",
    label: "المنهجية والقطاعات",
    keys: ["methodK", "methodTitle", "steps", "sectors"],
  },
  {
    id: "roadmap",
    label: "خارطة الطريق",
    keys: ["roadmapK", "roadmapTitle", "years"],
  },
  { id: "faq", label: "الأسئلة الشائعة", keys: ["faqK", "faqTitle", "faqs"] },
  {
    id: "contact",
    label: "التواصل والتذييل",
    keys: [
      "formK",
      "formTitle",
      "formText",
      "company",
      "name",
      "email",
      "message",
      "send",
      "sent",
      "footer",
      "rights",
    ],
  },
];

const fieldLabels: Record<string, string> = {
  nav: "روابط القائمة",
  lang: "زر اللغة",
  contact: "زر التواصل",
  place: "الموقع",
  heroTitle: "العنوان الرئيسي",
  heroText: "النص التعريفي",
  heroCta: "زر الدعوة",
  stat: "الرقم البارز",
  statText: "وصف الرقم",
  statSource: "توقيع البطاقة",
  intro: "اسم القسم",
  introTitle: "عنوان القسم",
  introText: "النص التعريفي",
  highlight: "المميزات",
  serviceK: "اسم القسم",
  serviceTitle: "عنوان الخدمات",
  serviceMore: "رابط اكتشاف الخدمة",
  services: "الخدمات",
  whyK: "اسم القسم",
  whyTitle: "العنوان",
  whyText: "النص",
  whyCta: "زر الدعوة",
  methodK: "اسم القسم",
  methodTitle: "العنوان",
  steps: "خطوات المنهجية",
  sectors: "القطاعات",
  roadmapK: "اسم القسم",
  roadmapTitle: "العنوان",
  years: "المراحل الزمنية",
  faqK: "اسم القسم",
  faqTitle: "العنوان",
  faqs: "الأسئلة والأجوبة",
  formK: "اسم القسم",
  formTitle: "العنوان",
  formText: "النص التعريفي",
  company: "حقل الشركة",
  name: "حقل الاسم",
  email: "حقل البريد",
  message: "حقل الطلب",
  send: "زر الإرسال",
  sent: "رسالة النجاح",
  footer: "وصف التذييل",
  rights: "حقوق النشر",
};

const nestedLabels: Record<string, string[]> = {
  highlight: ["الرقم", "العنوان", "الوصف"],
  services: ["الرقم", "اسم الخدمة", "وصف الخدمة", "الصورة"],
  steps: ["الرقم", "اسم الخطوة", "الوصف"],
  years: ["السنة", "المرحلة"],
  faqs: ["السؤال", "الإجابة"],
};

function editableContent(value: unknown): EditableContent {
  return editorContent(value) as EditableContent;
}

function updateEditable(
  root: EditableContent,
  path: Array<string | number>,
  value: string,
): EditableContent {
  const copy = structuredClone(root) as EditableContent;
  let cursor: unknown = copy;
  for (let index = 0; index < path.length - 1; index += 1)
    cursor = (cursor as Record<string | number, unknown>)[path[index]];
  (cursor as Record<string | number, unknown>)[path[path.length - 1]] = value;
  return copy;
}

function contentFieldLabel(path: Array<string | number>) {
  const key = String(path[1]);
  if (path.length === 3)
    return `${fieldLabels[key] || key} ${Number(path[2]) + 1}`;
  if (path.length >= 4)
    return (
      nestedLabels[key]?.[Number(path[3])] ||
      `${fieldLabels[key] || key} ${Number(path[3]) + 1}`
    );
  return fieldLabels[key] || key;
}

function ContentFields({
  value,
  path,
  onChange,
}: {
  value: unknown;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: string) => void;
}) {
  const key = String(path[1] || "");
  if (Array.isArray(value)) {
    const isGrouped =
      path.length === 2 &&
      ["highlight", "services", "steps", "years", "faqs"].includes(key);
    return (
      <div className={isGrouped ? "content-groups" : "content-array"}>
        {value.map((item, index) => {
          if (key === "services" && Array.isArray(item)) {
            const textOnly = item.slice(0, 3);
            return (
              <div className="content-group" key={index}>
                <h4>{`الخدمة ${index + 1}`}</h4>
                <ContentFields
                  value={textOnly}
                  path={[...path, index]}
                  onChange={onChange}
                />
              </div>
            );
          }
          if (isGrouped)
            return (
              <div className="content-group" key={index}>
                <h4>{`${fieldLabels[key]} ${index + 1}`}</h4>
                <ContentFields
                  value={item}
                  path={[...path, index]}
                  onChange={onChange}
                />
              </div>
            );
          return (
            <ContentFields
              key={index}
              value={item}
              path={[...path, index]}
              onChange={onChange}
            />
          );
        })}
      </div>
    );
  }
  if (value && typeof value === "object")
    return (
      <>
        {Object.entries(value).map(([childKey, child]) => (
          <ContentFields
            key={childKey}
            value={child}
            path={[...path, childKey]}
            onChange={onChange}
          />
        ))}
      </>
    );
  const text = String(value ?? "");
  const multiline =
    text.length > 65 ||
    /Title|Text|footer|sent|sectors/i.test(key) ||
    path.length >= 4;
  return (
    <label className="content-field">
      <span>{contentFieldLabel(path)}</span>
      {multiline ? (
        <textarea
          value={text}
          rows={text.length > 180 ? 5 : 3}
          onChange={(event) => onChange(path, event.target.value)}
        />
      ) : (
        <input
          value={text}
          onChange={(event) => onChange(path, event.target.value)}
        />
      )}
    </label>
  );
}

function AdminPanel({
  siteContent,
  setSiteContent,
  config,
  setConfig,
  onClose,
}: {
  siteContent: typeof content;
  setSiteContent: (v: typeof content) => void;
  config: SiteConfig;
  setConfig: (v: SiteConfig) => void;
  onClose: () => void;
}) {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState("yasser.sr1990@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("content");
  const [draft, setDraft] = useState<EditableContent>(() =>
    editableContent(siteContent),
  );
  const [contentLang, setContentLang] = useState<Lang>("ar");
  const [contentSection, setContentSection] = useState("hero");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const login = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      return;
    }
    const c = await fetch("/api/site-config").then((x) => x.json());
    if (c.config) {
      const merged = mergeEditable(content, c.config.content || {});
      setSiteContent(merged as typeof content);
      setConfig({ ...config, ...c.config });
      setDraft(editableContent(merged));
    }
    setLogged(true);
  };
  const save = async () => {
    if (saving) return;
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const merged = mergeEditable(content, draft);
      const next = { ...config, content: draft };
      const r = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: next }),
      });
      if (!r.ok) {
        const detail = await r.json().catch(() => null);
        throw new Error(detail?.message || `HTTP ${r.status}`);
      }
      setSiteContent(merged as typeof content);
      setConfig(next as unknown as SiteConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "تعذر الحفظ، حاول تسجيل الدخول مجددًا.",
      );
    } finally {
      setSaving(false);
    }
  };
  const updateField = (path: Array<string | number>, value: string) =>
    setDraft((current) => updateEditable(current, path, value));
  const openInquiries = async () => {
    setTab("inquiries");
    setLoadingInquiries(true);
    setError("");
    try {
      const r = await fetch("/api/contact", { cache: "no-store" });
      const result = await r.json();
      if (!r.ok) throw new Error(result.message || "تعذر تحميل الطلبات");
      setInquiries(result.inquiries || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر تحميل الطلبات");
    } finally {
      setLoadingInquiries(false);
    }
  };
  if (!logged)
    return (
      <div className="admin-shell">
        <div className="admin-login">
          <button className="admin-close" onClick={onClose}>
            ×
          </button>
          <span className="admin-eyebrow">MASAR CONTROL CENTER</span>
          <h2>تسجيل الدخول</h2>
          <p>لوحة إدارة الموقع والمحتوى والثيمات.</p>
          <form onSubmit={login}>
            <label>
              البريد الإلكتروني
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              كلمة المرور
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </label>
            {error && <div className="admin-error">{error}</div>}
            <button className="admin-primary">دخول إلى لوحة التحكم</button>
          </form>
        </div>
      </div>
    );
  const selectedSection =
    contentSections.find((section) => section.id === contentSection) ||
    contentSections[0];
  const activeThemeKey = themeNames[config.theme] ? config.theme : "masar";
  const activeThemeMedia =
    activeThemeKey === "masar"
      ? config.media || defaultMedia
      : config.mediaByTheme?.[activeThemeKey] ||
        themeMedia[activeThemeKey] ||
        defaultMedia;
  const setActiveThemeMedia = (next: ThemeMedia) => {
    if (activeThemeKey === "masar") {
      setConfig({ ...config, media: next });
      return;
    }
    setConfig({
      ...config,
      mediaByTheme: { ...config.mediaByTheme, [activeThemeKey]: next },
    });
  };
  return (
    <div className="admin-shell">
      <div className="admin-panel">
        <aside>
          <div className="admin-brand">
            <b>MASAR</b>
            <small>ADMIN</small>
          </div>
          <button
            className={tab === "content" ? "active" : ""}
            onClick={() => setTab("content")}
          >
            المحتوى
          </button>
          <button
            className={tab === "visuals" ? "active" : ""}
            onClick={() => setTab("visuals")}
          >
            الصور
          </button>
          <button
            className={tab === "themes" ? "active" : ""}
            onClick={() => setTab("themes")}
          >
            الثيمات
          </button>
          <button
            className={tab === "inquiries" ? "active" : ""}
            onClick={openInquiries}
          >
            طلبات التواصل
          </button>
          <button className="admin-site" onClick={onClose}>
            عرض الموقع ↗
          </button>
        </aside>
        <section className="admin-main">
          <div className="admin-top">
            <div>
              <span className="admin-eyebrow">MASAR CONTROL CENTER</span>
              <h2>
                {tab === "content"
                  ? "إدارة المحتوى"
                  : tab === "visuals"
                    ? "إدارة الصور"
                    : tab === "themes"
                      ? "اختيار الثيم"
                      : "طلبات التواصل"}
              </h2>
            </div>
            {tab !== "inquiries" && (
              <div className="admin-actions">
                {saving && <span className="saving">⟳ جارٍ الحفظ...</span>}
                {saved && <span className="saved">✓ تم الحفظ بنجاح</span>}
                <button
                  className="admin-primary"
                  disabled={saving}
                  onClick={save}
                >
                  {saving ? "جارٍ الحفظ..." : "حفظ ونشر التغييرات"}
                </button>
              </div>
            )}
          </div>
          {error && <div className="admin-error admin-save-error">{error}</div>}
          {tab === "content" && (
            <div className="section-editor">
              <div className="content-toolbar">
                <div className="language-switch">
                  <button
                    className={contentLang === "ar" ? "active" : ""}
                    onClick={() => setContentLang("ar")}
                  >
                    العربية
                  </button>
                  <button
                    className={contentLang === "en" ? "active" : ""}
                    onClick={() => setContentLang("en")}
                  >
                    English
                  </button>
                </div>
                <p>اختر القسم، عدّل النص المطلوب فقط، ثم اضغط حفظ ونشر.</p>
              </div>
              <div className="content-editor-layout">
                <nav className="section-list" aria-label="أقسام المحتوى">
                  {contentSections.map((section) => (
                    <button
                      key={section.id}
                      className={contentSection === section.id ? "active" : ""}
                      onClick={() => setContentSection(section.id)}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
                <div className="admin-card section-fields">
                  <div className="section-fields-title">
                    <span>
                      {contentLang === "ar"
                        ? "المحتوى العربي"
                        : "English content"}
                    </span>
                    <h3>{selectedSection.label}</h3>
                  </div>
                  {selectedSection.keys.map((key) => (
                    <ContentFields
                      key={`${contentLang}-${key}`}
                      value={draft[contentLang]?.[key]}
                      path={[contentLang, key]}
                      onChange={updateField}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === "visuals" && (
            <div className="admin-card media-card">
              <span className="admin-eyebrow">
                {themeNames[activeThemeKey].identity}
              </span>
              <h3>صور ثيم {themeNames[activeThemeKey].name}</h3>
              <p>
                لكل ثيم مكتبته المستقلة. غيّر الصورة هنا ولن تتأثر صور الثيمات
                الأخرى.
              </p>
              {(
                [
                  ["hero", "صورة الغلاف الرئيسية"],
                  ["statement", "صورة قسم لماذا مسار"],
                  ["contact", "صورة قسم التواصل"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    value={activeThemeMedia[key]}
                    onChange={(e) =>
                      setActiveThemeMedia({
                        ...activeThemeMedia,
                        [key]: e.target.value,
                      })
                    }
                  />
                  <img src={activeThemeMedia[key]} alt="" />
                </label>
              ))}
              <h3>صور الخدمات</h3>
              {activeThemeMedia.services.map((src, i) => (
                <label key={i}>
                  الخدمة {String(i + 1).padStart(2, "0")}
                  <input
                    value={src}
                    onChange={(e) => {
                      const services = [...activeThemeMedia.services];
                      services[i] = e.target.value;
                      setActiveThemeMedia({ ...activeThemeMedia, services });
                    }}
                  />
                </label>
              ))}
            </div>
          )}
          {tab === "themes" && (
            <div className="theme-grid">
              {Object.entries(themeNames).map(([key, item]) => (
                <button
                  key={key}
                  className={`theme-option ${config.theme === key ? "selected" : ""}`}
                  onClick={() => setConfig({ ...config, theme: key })}
                >
                  <span
                    className={`theme-preview preview-${key}`}
                    style={item.vars as CSSProperties}
                  >
                    <i />
                    <i />
                    <i />
                  </span>
                  <b>{item.name}</b>
                  <span className="theme-identity">{item.identity}</span>
                  <small>{item.note}</small>
                  {config.theme === key && <em>مفعّل</em>}
                </button>
              ))}
            </div>
          )}
          {tab === "inquiries" && (
            <div className="inquiry-list">
              {loadingInquiries ? (
                <div className="admin-card">جارٍ تحميل الطلبات...</div>
              ) : inquiries.length === 0 ? (
                <div className="admin-card">
                  <h3>لا توجد طلبات بعد</h3>
                  <p>ستظهر هنا الطلبات المرسلة من نموذج التواصل.</p>
                </div>
              ) : (
                inquiries.map((item) => (
                  <article className="admin-card inquiry-card" key={item.id}>
                    <div>
                      <h3>{item.name}</h3>
                      <time>
                        {new Date(item.createdAt).toLocaleString("ar-SA")}
                      </time>
                    </div>
                    <p>{item.company || "بدون شركة"}</p>
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                    <blockquote>{item.message}</blockquote>
                  </article>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [contactError, setContactError] = useState("");
  const [clock, setClock] = useState("");
  const [activeService, setActiveService] = useState("01");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [admin, setAdmin] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("admin") === "1",
  );
  const [siteContent, setSiteContent] = useState(content);
  const [config, setConfig] = useState<SiteConfig>({
    content,
    theme: "masar",
    media: defaultMedia,
  });
  const t = siteContent[lang];
  const activeTheme = themeNames[config.theme] ? config.theme : "masar";
  const media =
    activeTheme === "masar"
      ? config.media || defaultMedia
      : config.mediaByTheme?.[activeTheme] ||
        themeMedia[activeTheme] ||
        defaultMedia;
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setContactError("");
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const result = await r.json().catch(() => null);
      if (!r.ok) throw new Error(result?.message || "تعذر إرسال الطلب");
      setSent(true);
      e.currentTarget.reset();
    } catch (error) {
      setContactError(
        error instanceof Error
          ? error.message
          : "تعذر إرسال الطلب، حاول مجددًا",
      );
    } finally {
      setSending(false);
    }
  };
  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => (r.ok ? r.json() : null))
      .then((c) => {
        if (c?.config) {
          setSiteContent(
            mergeEditable(content, c.config.content || {}) as typeof content,
          );
          setConfig((old) => ({
            ...old,
            ...c.config,
            content: c.config.content || old.content,
            media: c.config.media || old.media,
          }));
        }
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    const update = () =>
      setClock(
        new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
          timeZone: "Asia/Riyadh",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [lang]);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang]);
  const move = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: e.clientX - r.left - r.width / 2,
      y: e.clientY - r.top - r.height / 2,
    });
  };
  if (admin)
    return (
      <AdminPanel
        siteContent={siteContent}
        setSiteContent={setSiteContent}
        config={config}
        setConfig={setConfig}
        onClose={() => {
          history.replaceState({}, "", location.pathname);
          setAdmin(false);
        }}
      />
    );
  const themeVars = themeNames[activeTheme]?.vars || themeNames.masar.vars;
  return (
    <main
      id="top"
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`cx-page ${lang} theme-${activeTheme}`}
      style={
        {
          ...themeVars,
          "--px": `${pointer.x}px`,
          "--py": `${pointer.y}px`,
        } as CSSProperties
      }
    >
      <section
        className="cx-hero"
        onPointerMove={move}
        onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      >
        {activeTheme !== "masar" && (
          <>
            <div className="theme-grid-lines" aria-hidden="true" />
            <div className="theme-orbit" aria-hidden="true" />
          </>
        )}
        <div
          className="cx-art hero-art"
          style={{ backgroundImage: `url(${media.hero})` }}
        />
        <div className="hero-light" />
        <header>
          <Logo />
          <nav>
            {t.nav.map((n, i) => (
              <a
                key={n}
                onClick={() => go(["about", "services", "method", "faq"][i])}
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="cx-actions">
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
              {t.lang} ◉
            </button>
            <a className="contact-chip" onClick={() => go("contact")}>
              {t.contact} ✉
            </a>
          </div>
        </header>
        <div className="cx-time">
          <span>{clock || t.time}</span>
          <b>{t.place}</b>
        </div>
        <div className="hero-copy">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <button className="cx-button" onClick={() => go("contact")}>
            {t.heroCta} ↓
          </button>
        </div>
        <div className="stat-card">
          <strong>{t.stat}</strong>
          <p>{t.statText}</p>
          <i>{t.statSource}</i>
        </div>
        <div className="hero-dots">••••••</div>
        {activeTheme !== "masar" && (
          <div className="hero-identity" aria-hidden="true">
            <span>MASAR / 0{Object.keys(themeNames).indexOf(activeTheme) + 1}</span>
            <b>{themeNames[activeTheme].identity}</b>
          </div>
        )}
      </section>
      <section id="about" className="cx-intro reveal">
        <div>
          <p className="kicker">{t.intro}</p>
          <h2>{t.introTitle}</h2>
        </div>
        <div>
          <p className="body-copy">{t.introText}</p>
          <a className="under-link" onClick={() => go("services")}>
            {t.serviceMore} ↓
          </a>
        </div>
      </section>
      <section className="cx-highlights reveal">
        {t.highlight.map((x) => (
          <article key={x[0]}>
            <span>{x[0]}</span>
            <div>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </div>
          </article>
        ))}
      </section>
      <section id="services" className="cx-services reveal">
        <div className="section-title">
          <p className="kicker">{t.serviceK}</p>
          <h2>{t.serviceTitle}</h2>
          <span className="outline-number">04</span>
        </div>
        <div className="service-grid">
          {t.services.map((x) => (
            <article
              key={x[0]}
              className={activeService === x[0] ? "active" : ""}
              onMouseEnter={() => setActiveService(x[0])}
              onFocus={() => setActiveService(x[0])}
              tabIndex={0}
            >
              <div className="service-visual">
                <img src={media.services[Number(x[0]) - 1]} alt="" />
                <span>{x[0]}</span>
                <div className="service-orb">↗</div>
              </div>
              <div className="service-copy">
                <small>{x[0]} / 04</small>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
                <a>{t.serviceMore} ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="cx-statement reveal">
        <div
          className="cx-art statement-art"
          style={{ backgroundImage: `url(${media.statement})` }}
        />
        <div>
          <p className="kicker">{t.whyK}</p>
          <h2>{t.whyTitle}</h2>
          <p>{t.whyText}</p>
          <button className="cx-button" onClick={() => go("contact")}>
            {t.whyCta} ↓
          </button>
        </div>
      </section>
      <section id="method" className="cx-method reveal">
        <div className="section-title">
          <p className="kicker">{t.methodK}</p>
          <h2>{t.methodTitle}</h2>
        </div>
        <div className="method-grid">
          {t.steps.map((x) => (
            <article key={x[0]}>
              <b>{x[0]}</b>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </article>
          ))}
        </div>
        <div className="sector-note">
          {t.sectors} <span>✦</span>
        </div>
      </section>
      <section className="cx-roadmap reveal">
        <p className="kicker">{t.roadmapK}</p>
        <h2>{t.roadmapTitle}</h2>
        <div className="roadmap-row">
          {t.years.map((x) => (
            <article key={x[0]}>
              <b>{x[0]}</b>
              <span>{x[1]}</span>
            </article>
          ))}
        </div>
      </section>
      <section id="faq" className="cx-faq reveal">
        <div>
          <p className="kicker">{t.faqK}</p>
          <h2>{t.faqTitle}</h2>
        </div>
        <div>
          {t.faqs.map((x, i) => (
            <details key={x[0]} open={i === 0}>
              <summary>
                <span>0{i + 1}</span>
                {x[0]}
                <b>+</b>
              </summary>
              <p>{x[1]}</p>
            </details>
          ))}
        </div>
      </section>
      <section id="contact" className="cx-contact reveal">
        <div
          className="cx-art contact-art"
          style={{ backgroundImage: `url(${media.contact})` }}
        />
        <div className="contact-content">
          <p className="kicker">{t.formK}</p>
          <h2>{t.formTitle}</h2>
          <p>{t.formText}</p>
          {sent ? (
            <div className="success">
              ✓<p>{t.sent}</p>
              <button type="button" onClick={() => setSent(false)}>
                {lang === "ar" ? "إرسال طلب آخر" : "Send another request"}
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <input
                name="company"
                autoComplete="organization"
                aria-label={t.company}
                placeholder={t.company}
              />
              <input
                name="name"
                autoComplete="name"
                aria-label={t.name}
                placeholder={t.name}
                required
              />
              <input
                name="email"
                type="email"
                autoComplete="email"
                aria-label={t.email}
                placeholder={t.email}
                required
              />
              <textarea
                name="message"
                aria-label={t.message}
                placeholder={t.message}
                minLength={10}
                required
              />
              <input
                className="contact-trap"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              {contactError && (
                <div className="contact-error" role="alert">
                  {contactError}
                </div>
              )}
              <button className="cx-button" type="submit" disabled={sending}>
                {sending
                  ? lang === "ar"
                    ? "جارٍ الإرسال..."
                    : "Sending..."
                  : `${t.send} ↑`}
              </button>
            </form>
          )}
        </div>
      </section>
      <footer>
        <Logo />
        <p>{t.footer}</p>
        <div>
          <a href="mailto:info@masarps.com">info@masarps.com</a>
          <a href="tel:+966505476689">+966 50 547 6689</a>
          <a className="admin-entry" href="?admin=1">
            Admin
          </a>
          <span>© 2026 MASAR. {t.rights}</span>
        </div>
      </footer>
    </main>
  );
}
