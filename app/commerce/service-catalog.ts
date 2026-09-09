export type ServiceLang = "ar" | "en";
export type ServiceKind = "business" | "procurement" | "commercial";

export type AdvisoryService = {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  min: number;
  max: number;
};

export type AdvisoryGroup = {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  services: AdvisoryService[];
};

export type AdvisoryCatalog = {
  slug: ServiceKind;
  eyebrow: { en: string; ar: string };
  title: { en: string; ar: string };
  intro: { en: string; ar: string };
  journey: { en: string; ar: string };
  groups: AdvisoryGroup[];
};

const service = (
  id: string,
  en: string,
  ar: string,
  descEn: string,
  descAr: string,
  min: number,
  max = min,
): AdvisoryService => ({ id, name: { en, ar }, description: { en: descEn, ar: descAr }, min, max });

export const advisoryCatalogs: Record<ServiceKind, AdvisoryCatalog> = {
  business: {
    slug: "business",
    eyebrow: { en: "BUSINESS ADVISORY & OPERATIONAL SETUP", ar: "استشارات الأعمال والتأسيس التشغيلي" },
    title: { en: "From idea to operations — build a stronger business.", ar: "من الفكرة إلى التشغيل — ابنِ عملًا أقوى." },
    intro: { en: "Select the services you need, enter the agreed amount where a range applies, and pay securely online.", ar: "اختر الخدمات التي تحتاجها، وأدخل المبلغ المتفق عليه للخدمات ذات النطاق، ثم ادفع إلكترونيًا بأمان." },
    journey: { en: "Plan → Build → Improve → Advise", ar: "خطّط ← ابنِ ← حسّن ← استشر" },
    groups: [
      { id: "planning", title: { en: "Business Planning", ar: "تخطيط الأعمال" }, description: { en: "Turn an idea into a commercially viable and executable plan.", ar: "حوّل الفكرة إلى خطة قابلة للتنفيذ ومجدية تجاريًا." }, services: [
        service("feasibility-study", "Feasibility Study", "دراسة الجدوى", "Up to 20 pages plus a financial Excel model.", "حتى 20 صفحة مع نموذج مالي على Excel.", 8000),
        service("business-plan", "Business Plan & Financial Model", "خطة العمل والنموذج المالي", "Market, operations, financials and a three-year plan.", "السوق والتشغيل والماليات وخطة لثلاث سنوات.", 8000, 12000),
        service("market-entry", "Market Entry Study", "دراسة دخول السوق", "Market, competitors, risks and a practical entry plan.", "السوق والمنافسون والمخاطر وخطة دخول عملية.", 8000, 12000),
        service("business-proposal", "Business & Service Proposal", "مقترح الأعمال والخدمات", "Up to 20 pages plus a supporting Excel sheet.", "حتى 20 صفحة مع ملف Excel داعم.", 8000),
        service("pricing-revenue", "Pricing & Revenue Model", "نموذج التسعير والإيرادات", "Pricing structure, packages, margins and revenue logic.", "هيكل الأسعار والباقات والهوامش ومنطق الإيرادات.", 4000, 6000),
      ]},
      { id: "operations", title: { en: "Operational Setup", ar: "التأسيس التشغيلي" }, description: { en: "Build the systems, structure and controls required to operate professionally.", ar: "ابنِ الأنظمة والهيكل والضوابط اللازمة للتشغيل المهني." }, services: [
        service("org-manpower", "Organization Structure & Manpower Plan", "الهيكل التنظيمي وخطة القوى العاملة", "Structure, roles, headcount and hiring plan.", "الهيكل والأدوار والعدد وخطة التوظيف.", 5000, 8000),
        service("policies-procedures", "Policies & Procedures Setup", "إعداد السياسات والإجراءات", "Core policies, procedures and management guidelines.", "السياسات والإجراءات والأدلة الإدارية الأساسية.", 8000, 15000),
        service("authority-matrix", "Delegation of Authority Matrix", "مصفوفة تفويض الصلاحيات", "Financial, administrative and operational approval levels.", "مستويات الصلاحيات المالية والإدارية والتشغيلية.", 3000, 5000),
        service("sop-development", "SOP Development", "إعداد إجراءات التشغيل القياسية", "Standard operating procedures for critical workflows.", "إجراءات تشغيل قياسية لمسارات العمل الأساسية.", 4000, 10000),
        service("corporate-forms", "Corporate Forms & Templates", "النماذج والقوالب المؤسسية", "Forms, requests, approvals, reports and trackers.", "النماذج والطلبات والاعتمادات والتقارير وأدوات المتابعة.", 2500, 5000),
        service("kpi-reporting", "KPI & Reporting Structure", "مؤشرات الأداء وهيكل التقارير", "KPIs, reporting frequency and dashboard structure.", "مؤشرات الأداء ودورية التقارير وهيكل لوحات المتابعة.", 4000, 7000),
      ]},
      { id: "optimization", title: { en: "Business Optimization", ar: "تحسين الأعمال" }, description: { en: "Improve profitability, efficiency and management visibility.", ar: "حسّن الربحية والكفاءة ووضوح الأداء للإدارة." }, services: [
        service("business-model-review", "Business Model Review & Optimization", "مراجعة وتحسين نموذج العمل", "Review and enhance the existing business model.", "مراجعة نموذج العمل الحالي وتطويره.", 5000, 7500),
        service("performance-review", "Operational Performance Review", "مراجعة الأداء التشغيلي", "Identify bottlenecks and priority improvements.", "تحديد الاختناقات وأولويات التحسين.", 5000, 8000),
        service("cost-efficiency", "Cost & Efficiency Review", "مراجعة التكلفة والكفاءة", "Analyze costs and identify savings opportunities.", "تحليل التكاليف وتحديد فرص التوفير.", 5000, 10000),
        service("margin-optimization", "Pricing & Margin Optimization", "تحسين التسعير والهوامش", "Review pricing, margins, discounts and packages.", "مراجعة الأسعار والهوامش والخصومات والباقات.", 4000, 7000),
        service("process-improvement", "Process Improvement Study", "دراسة تحسين العمليات", "Redesign a key process or workflow.", "إعادة تصميم عملية أو مسار عمل رئيسي.", 4000, 8000),
        service("management-dashboard", "Management Dashboard Setup", "إعداد لوحة متابعة إدارية", "KPIs, reporting and management visibility.", "مؤشرات وتقارير تمنح الإدارة رؤية أوضح.", 4000, 7500),
      ]},
      { id: "advisory", title: { en: "Executive Advisory", ar: "الاستشارات التنفيذية" }, description: { en: "Senior on-demand support for founders and management teams.", ar: "دعم استشاري تنفيذي عند الطلب للمؤسسين والإدارات." }, services: [
        service("advisory-essential", "Executive Advisory — Essential", "الاستشارات التنفيذية — الأساسية", "10 hours, two online meetings and a recommendation report.", "10 ساعات واجتماعان عن بُعد وتقرير توصيات.", 5000),
        service("advisory-extended", "Executive Advisory — Extended", "الاستشارات التنفيذية — الممتدة", "20 hours, four online meetings and one face-to-face session.", "20 ساعة و4 اجتماعات عن بُعد واجتماع حضوري واحد.", 10000),
        service("retainer-10", "Monthly Retainer — 10 Hours", "استشارة شهرية — 10 ساعات", "Ongoing advisory support and guidance.", "دعم واستشارات مستمرة.", 4500),
        service("retainer-20", "Monthly Retainer — 20 Hours", "استشارة شهرية — 20 ساعة", "Ongoing advisory and implementation support.", "استشارات ودعم مستمر للتنفيذ.", 8500),
        service("retainer-40", "Monthly Retainer — 40 Hours", "استشارة شهرية — 40 ساعة", "Extended advisory and implementation support.", "دعم استشاري وتنفيذي ممتد.", 15000),
      ]},
    ],
  },
  procurement: {
    slug: "procurement",
    eyebrow: { en: "PROCUREMENT, STRATEGIC SOURCING & VENDOR MANAGEMENT", ar: "المشتريات والتوريد الاستراتيجي وإدارة الموردين" },
    title: { en: "Build procurement that creates measurable business value.", ar: "ابنِ مشتريات تصنع قيمة أعمال قابلة للقياس." },
    intro: { en: "Choose the support you need and enter the fee already agreed with MASAR within the displayed range.", ar: "اختر الدعم المطلوب وأدخل الأتعاب المتفق عليها مسبقًا مع مسار ضمن النطاق الظاهر." },
    journey: { en: "Design → Source → Govern → Optimize", ar: "صمّم ← ورّد ← اضبط ← حسّن" },
    groups: [
      { id: "strategy", title: { en: "Strategy & Function Setup", ar: "الاستراتيجية وتأسيس الإدارة" }, description: { en: "Build the operating model, governance and strategic direction.", ar: "بناء نموذج التشغيل والحوكمة والتوجه الاستراتيجي." }, services: [
        service("procurement-department", "Procurement Department Setup", "تأسيس إدارة المشتريات", "Structure, workflow, authority matrix, forms, KPIs and roadmap.", "الهيكل ومسار العمل والصلاحيات والنماذج والمؤشرات وخارطة الطريق.", 10000, 25000),
        service("procurement-strategy", "Procurement Strategy", "استراتيجية المشتريات", "Category, sourcing and supplier strategies with a roadmap.", "استراتيجيات الفئات والتوريد والموردين مع خارطة طريق.", 8000, 15000),
        service("procurement-audit", "Procurement Health Check / Audit", "فحص وتدقيق المشتريات", "Gap assessment, governance review, risks and quick wins.", "تقييم الفجوات والحوكمة والمخاطر والمكاسب السريعة.", 5000, 10000),
      ]},
      { id: "tender", title: { en: "Tendering & Award Support", ar: "دعم المناقصات والترسية" }, description: { en: "Prepare stronger competitions and documented award decisions.", ar: "إعداد منافسات أقوى وقرارات ترسية موثقة." }, services: [
        service("tender-rfp", "Tender & RFP Preparation", "إعداد المناقصة وطلب العروض", "Tender package, RFQ/RFP, requirements and evaluation criteria.", "حزمة المناقصة وطلبات التسعير والعروض والمتطلبات ومعايير التقييم.", 3500, 10000),
        service("tender-evaluation", "Tender Evaluation & Recommendation", "تقييم المناقصة وتوصية الترسية", "Technical and commercial analysis, normalization and recommendation.", "تحليل فني وتجاري وتوحيد العروض وتوصية الترسية.", 5000, 15000),
      ]},
      { id: "supplier", title: { en: "Supplier Management", ar: "إدارة الموردين" }, description: { en: "Build a stronger, qualified and more visible supplier base.", ar: "بناء قاعدة موردين أقوى ومؤهلة وأكثر وضوحًا." }, services: [
        service("supplier-prequalification", "Supplier Prequalification System", "نظام تأهيل الموردين", "Forms, criteria, weighted scoring, approvals and database structure.", "نماذج ومعايير وأوزان تقييم واعتمادات وهيكل قاعدة بيانات.", 5000, 8000),
        service("supplier-mapping", "Supplier Sourcing & Market Mapping", "البحث عن الموردين ورسم السوق", "Supplier mapping across Saudi Arabia, Türkiye, Syria, the Gulf and globally.", "حصر الموردين في السعودية وتركيا وسوريا والخليج والأسواق الدولية.", 3000, 8000),
      ]},
      { id: "value", title: { en: "Cost & Value Optimization", ar: "تحسين التكلفة والقيمة" }, description: { en: "Identify savings and strengthen commercial outcomes.", ar: "تحديد فرص التوفير وتعزيز النتائج التجارية." }, services: [
        service("procurement-cost-optimization", "Procurement Cost Optimization", "تحسين تكاليف المشتريات", "Spend review, benchmarking, savings opportunities and negotiation priorities.", "مراجعة الإنفاق والمقارنات وفرص التوفير وأولويات التفاوض.", 5000, 15000),
      ]},
    ],
  },
  commercial: {
    slug: "commercial",
    eyebrow: { en: "COMMERCIAL & CONTRACTS ADVISORY", ar: "الاستشارات التجارية والتعاقدية" },
    title: { en: "Protect value, control risk, and strengthen commercial decisions.", ar: "احمِ القيمة واضبط المخاطر وعزّز القرارات التجارية." },
    intro: { en: "Select the required commercial support and enter the fee agreed with MASAR within each allowed range.", ar: "اختر الدعم التجاري المطلوب وأدخل الأتعاب المتفق عليها مع مسار ضمن النطاق المسموح." },
    journey: { en: "Review → Assess → Manage → Control", ar: "راجع ← قيّم ← أدر ← اضبط" },
    groups: [
      { id: "contracts", title: { en: "Contract Review", ar: "مراجعة العقود" }, description: { en: "Understand obligations, exposure and commercial risk before commitment.", ar: "افهم الالتزامات والتعرض والمخاطر التجارية قبل الارتباط." }, services: [
        service("contract-review", "Contract Review", "مراجعة العقد", "Commercial review of clauses, obligations, payment, liabilities and change mechanisms.", "مراجعة تجارية للبنود والالتزامات والدفع والمسؤوليات وآليات التغيير.", 2500, 6000),
        service("commercial-risk", "Commercial Risk Assessment", "تقييم المخاطر التجارية", "Structured assessment before contract award or signature.", "تقييم منظم قبل ترسية العقد أو توقيعه.", 3500, 7500),
      ]},
      { id: "variations", title: { en: "Variations & Change", ar: "التغييرات والأوامر التغييرية" }, description: { en: "Assess entitlement, value and supporting records for changes.", ar: "تقييم الاستحقاق والقيمة والمستندات الداعمة للتغييرات." }, services: [
        service("variation-assessment", "Variation / Change Order Assessment", "تقييم الأمر التغييري", "Entitlement, valuation, contractual route, pricing and substantiation.", "الاستحقاق والتقييم والمسار التعاقدي والتسعير والمستندات.", 2500, 7500),
      ]},
      { id: "claims", title: { en: "Claims Strategy", ar: "استراتيجية المطالبات" }, description: { en: "Strengthen positioning, evidence and negotiation strategy.", ar: "تعزيز الموقف والأدلة واستراتيجية التفاوض." }, services: [
        service("claims-strategy", "Claims Strategy Review", "مراجعة استراتيجية المطالبة", "Review structure, contractual basis, records, valuation and negotiation strategy. Commercial advisory, not legal advice.", "مراجعة الهيكل والأساس التعاقدي والسجلات والتقييم والتفاوض. استشارة تجارية وليست قانونية.", 5000, 15000),
      ]},
      { id: "controls", title: { en: "Commercial Controls", ar: "الضبط التجاري" }, description: { en: "Create visibility across contracts, payments, variations and commitments.", ar: "توفير رؤية واضحة للعقود والمدفوعات والتغييرات والالتزامات." }, services: [
        service("commercial-dashboard", "Commercial Dashboard Setup", "إعداد لوحة المتابعة التجارية", "Dashboard for contracts, payments, variations, claims, commitments and exposure.", "لوحة للعقود والمدفوعات والتغييرات والمطالبات والالتزامات والتعرض.", 5000, 10000),
      ]},
    ],
  },
};

export const advisoryServices = Object.values(advisoryCatalogs).flatMap((catalog) =>
  catalog.groups.flatMap((group) => group.services.map((item) => ({ ...item, catalog: catalog.slug }))),
);

export const advisoryPolicyVersion = "2026-09-09";
