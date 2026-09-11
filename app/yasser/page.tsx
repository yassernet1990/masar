import type { Metadata } from "next";
import Image from "next/image";
import HeaderBrand from "../header-brand";
import UKCompanyBadge from "../uk-company-badge";
import "../footer-identity.css";
import "./yasser.css";

type Lang = "en" | "ar";
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const isArabic = params.lang === "ar";
  return {
    title: isArabic ? "ياسر عبد القادر | المؤسس والمدير العام — مسار" : "Yasser Abdulkadir | Founder & Managing Director — MASAR",
    description: isArabic
      ? "صفحة المؤسس ونموذج التنفيذ المدعوم بالخبرات المتخصصة في مسار للحلول والمشتريات."
      : "Founder profile and specialist delivery model for MASAR Procurement & Solutions.",
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
    alternates: { canonical: "https://masarps.com/yasser" },
  };
}

const copy = {
  en: {
    nav: ["About Masar", "Services", "Method", "FAQ", "Packages & Pricing"],
    contact: "Contact",
    lang: "AR",
    eyebrow: "People & Expertise",
    title: <>The expertise<br />behind <em>the work.</em></>,
    heroTag: "Independent advisory · Direct accountability · Flexible specialist network",
    heroSide: <>Founder-led.<br />Specialist-supported.<br />The right expertise for every assignment.</>,
    heroBody: "MASAR is led directly by its founder, with specialist professionals engaged on a project basis when an assignment requires additional depth.",
    meet: "Meet the founder",
    status: "Founder-led advisory",
    locations: "Jeddah-based · UK-registered · Regional delivery",
    founder: "Founder",
    leadership: "Leadership / Perspective / Accountability",
    name: "Yasser Abdulkadir",
    role: "Founder & Managing Director",
    bio: "MASAR is founder-led, drawing on more than 13 years of practical experience across procurement, strategic sourcing, commercial management and business advisory in Saudi Arabia. Each assignment is led with direct accountability, documented governance and a market-led approach to execution.",
    proofs: [["13+", "Years of practical experience"], ["KSA", "Saudi market experience"], ["1", "Accountable client lead"]],
    focus: "Focus",
    focusItems: ["Procurement, strategic sourcing & vendor management", "Commercial & contracts advisory", "Business setup & operational systems", "Brand identity & market presence", "Project controls & quantity surveying"],
    serviceNav: [["Procurement, strategic sourcing & vendor management", "/services/procurement"], ["Commercial & contracts advisory", "/services/commercial-contracts"], ["Business setup & operational systems", "/services/business-setup"], ["Brand identity & market presence", "/packages"]],
    linkedin: "LinkedIn",
    how: "How MASAR works",
    modelTitle: <>Founder-led.<br /><em>Specialist-supported.</em></>,
    modelBody: "MASAR does not present a fixed team where one does not exist. Specialists are selected according to scope, credentials and relevant market experience, and are engaged only when their expertise adds measurable value.",
    steps: [["Direct accountability", "The founder remains the primary lead and client interface."], ["Expertise when required", "Project-based specialists are engaged according to scope, market and technical need."], ["One coordinated delivery", "A lean structure with clear ownership, visibility and control."]],
    network: "Specialist Network",
    flexible: "Project-based / Scope-led / Flexible",
    networkTitle: <>Specialist depth.<br /><em>Only when it adds value.</em></>,
    networkBody: "When an assignment requires additional depth, MASAR engages specialist professionals on a project basis. The model stays lean while giving clients access to the right capability at the right stage, under one accountable lead.",
    expertise: ["Procurement & Strategic Sourcing", "Commercial & Contracts", "Business Setup & Operations", "Brand Identity & Market Presence", "Project Controls & Quantity Surveying"],
    oneLead: <>One accountable lead.<br /><em>The right specialist at the right point.</em></>,
    bridge: ["Founder leads the assignment and defines the need.", "Specialist expertise is added only where required.", "MASAR coordinates delivery through one client interface."],
    cta: <>Tell us what you need.<br /><em>We’ll build the right path.</em></>,
    ctaCopy: <>The right people.<br />The right expertise.<br />Clear execution.</>,
    start: "Start a conversation",
    explore: "Explore MASAR services",
    footer: "Smart procurement solutions connecting markets and building resilient supply chains.",
    address: "Registered Office Address",
    rights: "All rights reserved.",
  },
  ar: {
    nav: ["عن مسار", "خدماتنا", "منهجيتنا", "الأسئلة", "الباقات والأسعار"],
    contact: "تواصل معنا",
    lang: "EN",
    eyebrow: "الأشخاص والخبرات",
    title: <>الخبرة التي تقف<br />خلف <em>العمل.</em></>,
    heroTag: "استشارات مستقلة · مساءلة مباشرة · شبكة خبرات مرنة",
    heroSide: <>بقيادة المؤسس.<br />بدعم المتخصصين.<br />الخبرة المناسبة لكل مهمة.</>,
    heroBody: "يقود المؤسس مسار بشكل مباشر، مع إشراك متخصصين وفق متطلبات كل مشروع عندما تحتاج المهمة إلى خبرة إضافية.",
    meet: "تعرّف إلى المؤسس",
    status: "استشارات بقيادة المؤسس",
    locations: "إدارة من جدة · تسجيل بريطاني · تنفيذ إقليمي",
    founder: "المؤسس",
    leadership: "القيادة / الرؤية / المساءلة",
    name: "ياسر عبد القادر",
    role: "المؤسس والمدير العام",
    bio: "تعمل مسار بقيادة مؤسسها مستندة إلى أكثر من 13 عاماً من الخبرة العملية في السعودية في المشتريات والتوريد الاستراتيجي والإدارة التجارية واستشارات الأعمال. تُقاد كل مهمة بمساءلة مباشرة وحوكمة موثقة ونهج تنفيذي مرتبط بالسوق.",
    proofs: [["13+", "سنة من الخبرة العملية"], ["KSA", "خبرة في السوق السعودي"], ["1", "قائد مسؤول أمام العميل"]],
    focus: "مجالات التركيز",
    focusItems: ["المشتريات والتوريد الاستراتيجي وإدارة الموردين", "الاستشارات التجارية والتعاقدية", "تأسيس الأعمال والأنظمة التشغيلية", "الهوية والحضور في السوق", "ضبط المشاريع وحصر الكميات"],
    serviceNav: [["المشتريات والتوريد الاستراتيجي وإدارة الموردين", "/services/procurement"], ["الاستشارات التجارية والتعاقدية", "/services/commercial-contracts"], ["تأسيس الأعمال والأنظمة التشغيلية", "/services/business-setup"], ["الهوية والحضور في السوق", "/packages"]],
    linkedin: "LinkedIn",
    how: "كيف تعمل مسار",
    modelTitle: <>بقيادة المؤسس.<br /><em>بدعم المتخصصين.</em></>,
    modelBody: "لا تعرض مسار فريقاً ثابتاً غير موجود. يتم اختيار المتخصصين وفق نطاق المهمة ومؤهلاتهم وخبرتهم ذات الصلة بالسوق، ولا تتم الاستعانة بهم إلا عندما تضيف خبرتهم قيمة قابلة للقياس.",
    steps: [["مساءلة مباشرة", "يبقى المؤسس القائد الأساسي ونقطة التواصل مع العميل."], ["خبرة عند الحاجة", "يتم إشراك متخصصين وفق نطاق المشروع والسوق والحاجة الفنية."], ["تنفيذ منسّق", "هيكل مرن بملكية واضحة ورؤية وسيطرة كاملة."]],
    network: "شبكة المتخصصين",
    flexible: "حسب المشروع / حسب النطاق / مرنة",
    networkTitle: <>عمق تخصصي.<br /><em>فقط عندما يضيف قيمة.</em></>,
    networkBody: "عندما تتطلب المهمة عمقاً إضافياً، تستعين مسار بمتخصصين على أساس المشروع. يبقى النموذج مرناً ويوفر للعميل الكفاءة المناسبة في المرحلة المناسبة، تحت قيادة واحدة مسؤولة.",
    expertise: ["المشتريات والتوريد الاستراتيجي", "الإدارة التجارية والعقود", "تأسيس الأعمال والتشغيل", "الهوية والحضور في السوق", "ضبط المشاريع وحصر الكميات"],
    oneLead: <>قائد واحد مسؤول.<br /><em>والمتخصص المناسب في الوقت المناسب.</em></>,
    bridge: ["يقود المؤسس المهمة ويحدد الحاجة.", "تُضاف الخبرة التخصصية فقط عند الحاجة.", "تنسّق مسار التنفيذ من خلال واجهة واحدة مع العميل."],
    cta: <>أخبرنا بما تحتاجه.<br /><em>وسنبني المسار المناسب.</em></>,
    ctaCopy: <>الأشخاص المناسبون.<br />الخبرة المناسبة.<br />تنفيذ واضح.</>,
    start: "ابدأ المحادثة",
    explore: "استكشف خدمات مسار",
    footer: "حلول مشتريات ذكية تربط الأسواق وتبني سلاسل توريد مرنة.",
    address: "عنوان المكتب المسجّل",
    rights: "جميع الحقوق محفوظة.",
  },
} as const;

export default async function YasserPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang: Lang = params.lang === "ar" ? "ar" : "en";
  const t = copy[lang];
  const homeSection = (id: string) => `/?lang=${lang}#${id}`;

  return (
    <main className={`cx-page theme-masar yp-page ${lang}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <section className="yp-hero">
        <div className="yp-map" aria-hidden="true">
          <img className="yp-map-image" src="/images/yasser-hero-global.webp?v=20260910b" width="1916" height="821" alt="" decoding="async" fetchPriority="high" />
        </div>
        <div className="yp-clouds" aria-hidden="true">
          <span className="yp-cloud yp-cloud-one" />
          <span className="yp-cloud yp-cloud-two" />
        </div>
        <header>
          <HeaderBrand href={`/?lang=${lang}`} />
          <nav aria-label={lang === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
            {t.nav.map((label, index) => index === 4 ? (
              <span className="nav-package-wrap" key={label}>
                <a className="nav-packages" href={homeSection("services")}>{label}</a>
                <span className="nav-package-menu">
                  {t.serviceNav.map(([item, path]) => <a key={item} href={`${path}?lang=${lang}`}>{item}</a>)}
                </span>
              </span>
            ) : <a key={label} href={homeSection(["about", "services", "method", "faq"][index])}>{label}</a>)}
          </nav>
          <div className="cx-actions">
            <a className="yp-lang" href={`/yasser?lang=${lang === "ar" ? "en" : "ar"}`} aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}>{t.lang} ◉</a>
            <a className="contact-chip" href={homeSection("contact")}>{t.contact} ✉</a>
          </div>
        </header>

        <div className="yp-hero-grid">
          <div className="yp-section-no">01<span /></div>
          <div className="yp-hero-copy">
            <p className="yp-eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="yp-hero-tag">{t.heroTag}</p>
          </div>
          <aside className="yp-hero-side">
            <strong>{t.heroSide}</strong>
            <p>{t.heroBody}</p>
            <a href="#founder">{t.meet} <span>↓</span></a>
          </aside>
        </div>
        <div className="yp-status"><span>MASAR · PROCUREMENT / SOLUTIONS</span><span className="yp-live">{t.status}</span><span>{t.locations}</span></div>
      </section>

      <section className="yp-section yp-founder" id="founder">
        <div className="yp-content-grid">
          <div className="yp-section-no dark">02<span /></div>
          <div className="yp-section-body">
            <div className="yp-section-head"><span className="yp-eyebrow">{t.founder}</span><span>{t.leadership}</span></div>
            <div className="yp-lead-grid">
              <div className="yp-portrait">
                <Image src="/images/yasser-founder.webp" alt={lang === "ar" ? "ياسر عبد القادر، مؤسس مسار" : "Yasser Abdulkadir, founder of MASAR"} fill quality={88} sizes="(max-width: 800px) calc(100vw - 44px), (max-width: 1200px) 36vw, 390px" />
                <span aria-hidden="true" />
              </div>
              <article className="yp-bio">
                <h2>{t.name}</h2>
                <p className="yp-role">{t.role}</p>
                <p>{t.bio}</p>
                <div className="yp-proof" aria-label={lang === "ar" ? "ملخص الخبرة" : "Experience highlights"}>
                  {t.proofs.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}
                </div>
                <div className="yp-focus"><b>{t.focus}</b><ul>{t.focusItems.map(item => <li key={item}>{item}</li>)}</ul></div>
                <a className="yp-linkedin" href="https://sa.linkedin.com/in/yasser-abdulkader" target="_blank" rel="noopener noreferrer" aria-label={lang === "ar" ? "فتح ملف ياسر عبد القادر على LinkedIn" : "Open Yasser Abdulkadir on LinkedIn"}><span aria-hidden="true">in</span>{t.linkedin}<b className="yp-linkedin-arrow" aria-hidden="true">↗</b></a>
              </article>
              <aside className="yp-model">
                <p className="yp-eyebrow">{t.how}</p><h3>{t.modelTitle}</h3><p>{t.modelBody}</p>
                <div>{t.steps.map(([title, body], index) => <article key={title}><b>{String(index + 1).padStart(2, "0")}</b><span><strong>{title}</strong><small>{body}</small></span></article>)}</div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="yp-section yp-network">
        <div className="yp-content-grid">
          <div className="yp-section-no dark">03<span /></div>
          <div className="yp-section-body">
            <div className="yp-section-head"><span className="yp-eyebrow">{t.network}</span><span>{t.flexible}</span></div>
            <div className="yp-network-intro"><h2>{t.networkTitle}</h2><p>{t.networkBody}</p></div>
            <div className="yp-expertise">{t.expertise.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")} / 05</span><i aria-hidden="true">{["⌁", "□", "◎", "↗", "⌇"][index]}</i><h3>{item}</h3></article>)}</div>
          </div>
        </div>
      </section>

      <section className="yp-bridge">
        <div className="yp-bridge-grid">
          <div className="yp-section-no">360°<span /></div>
          <h2>{t.oneLead}</h2>
          <div>{t.bridge.map((item, index) => <p key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</p>)}</div>
        </div>
      </section>

      <section className="yp-cta">
        <div className="yp-cta-grid">
          <div className="yp-section-no">04<span /></div>
          <h2>{t.cta}</h2>
          <p>{t.ctaCopy}</p>
          <div className="yp-cta-actions">
            <a href="mailto:info@masarps.com">{t.start} ↗</a>
            <a className="yp-cta-secondary" href={homeSection("services")}>{t.explore} →</a>
          </div>
        </div>
      </section>

      <footer className="masar-footer yp-footer">
        <div className="footer-brand"><HeaderBrand href={`/?lang=${lang}`} /><UKCompanyBadge /></div>
        <div className="footer-company"><p>{t.footer}</p><address><strong>{t.address}</strong><span dir="ltr">71-75, Shelton Street, Covent Garden<br />London, WC2H 9JQ, United Kingdom</span></address></div>
        <div className="footer-bottom"><i className="footer-light" aria-hidden="true" /><a href="mailto:info@masarps.com">info@masarps.com</a><a href="tel:+966505476689">+966 50 547 6689</a><span>© 2026 MASAR. {t.rights}</span></div>
      </footer>
    </main>
  );
}
