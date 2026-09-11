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
      ? "رؤية مسار ونموذج نموها القائم على القدرات المتخصصة والشراكات النوعية والعلاقات المهنية طويلة المدى."
      : "MASAR vision and partnership-led growth model, built around strong capabilities, trusted relationships and long-term value.",
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
    alternates: { canonical: "https://masarps.com/yasser" },
  };
}

const copy = {
  en: {
    nav: ["About Masar", "Services", "Method", "FAQ", "Packages & Pricing"],
    contact: "Contact",
    lang: "AR",
    eyebrow: "The Vision",
    title: <>Building MASAR<br />for <em>long-term value.</em></>,
    heroTag: "Focused advisory · Strategic partnerships · Scalable capabilities",
    heroSide: <>Independent by design.<br />Collaborative by nature.<br />Built to grow with the right capabilities.</>,
    heroBody: "MASAR was established as a focused advisory business with a long-term ambition: to broaden its capabilities through carefully selected partnerships, complementary expertise and strong professional relationships.",
    meet: "About the founder",
    status: "Independent advisory · Partnership-led growth",
    locations: "Jeddah-based · UK-registered · Regional ambition",
    founder: "About the Founder",
    leadership: "Leadership / Experience / Direction",
    name: "Yasser Abdulkadir",
    role: "Founder & Managing Director",
    bio: "MASAR was established by Yasser Abdulkadir following more than 13 years of practical experience in Saudi Arabia across procurement, strategic sourcing, commercial management and business advisory. The business is being developed around a clear principle: maintain direct accountability and a focused operating model, while expanding MASAR’s capabilities through the right professionals, specialist firms and strategic partners as opportunities evolve.",
    proofs: [["13+", "Years of practical experience"], ["KSA", "Saudi market experience"], ["DIRECT", "Clear accountability"]],
    focus: "Capability areas",
    focusItems: ["Procurement, strategic sourcing & vendor management", "Commercial & contracts advisory", "Business setup & operational systems", "Brand identity & market presence", "Project controls & quantity surveying"],
    serviceNav: [["Procurement, strategic sourcing & vendor management", "/services/procurement"], ["Commercial & contracts advisory", "/services/commercial-contracts"], ["Business setup & operational systems", "/services/business-setup"], ["Brand identity & market presence", "/packages"]],
    linkedin: "LinkedIn",
    how: "MASAR Growth Model",
    modelTitle: <>Built to expand<br /><em>through partnership.</em></>,
    modelBody: "MASAR combines a focused core with complementary expertise and strategic partnerships to strengthen capabilities as the business grows.",
    steps: [["Clear accountability", "Clear ownership anchors every engagement."], ["Complementary capability", "Partners add specialist expertise where it creates value."], ["Coordinated delivery", "MASAR brings capabilities together through one consistent client experience."]],
    network: "Partners & Expertise",
    flexible: "Collaborative / Scalable / Opportunity-led",
    networkTitle: <>Capabilities that grow<br /><em>through the right partnerships.</em></>,
    networkBody: "MASAR is being developed as a flexible advisory platform where expertise can expand alongside client needs and market opportunities. The ambition is to build strong relationships with experienced professionals, specialist consultancies, technical experts and complementary businesses across MASAR’s service areas.",
    expertise: ["Procurement & Strategic Sourcing", "Commercial & Contracts", "Business Setup & Operations", "Brand Identity & Market Presence", "Project Controls & Quantity Surveying"],
    oneLead: <>One clear direction.<br /><em>Broader capability through the right partnerships.</em></>,
    bridge: ["Clear accountability anchors every engagement.", "Partners add specialist expertise and complementary capabilities where they create value.", "MASAR brings those capabilities together through a coordinated and consistent delivery model."],
    cta: <>Building capability.<br /><em>Creating value together.</em></>,
    ctaCopy: <>The right expertise.<br />The right partnerships.<br />A clear approach to delivery.</>,
    start: "Start a conversation",
    explore: "Explore MASAR services",
    footer: "Focused advisory built to grow through strong capabilities, trusted partnerships and long-term relationships.",
    address: "Registered Office Address",
    rights: "All rights reserved.",
  },
  ar: {
    nav: ["عن مسار", "خدماتنا", "منهجيتنا", "الأسئلة", "الباقات والأسعار"],
    contact: "تواصل معنا",
    lang: "EN",
    eyebrow: "الرؤية",
    title: <>نبني مسار<br />لـ<em>قيمة تمتد على المدى الطويل.</em></>,
    heroTag: "استشارات مركّزة · شراكات نوعية · قدرات قابلة للتوسع",
    heroSide: <>مرونة في العمل.<br />انفتاح على الشراكات.<br />وقدرات تتطور مع الفرص.</>,
    heroBody: "انطلقت مسار كشركة استشارية متخصصة تحمل طموحاً طويل المدى لتوسيع قدراتها من خلال شراكات مدروسة، وخبرات متكاملة، وعلاقات مهنية قوية.",
    meet: "عن المؤسس",
    status: "استشارات مستقلة · نمو قائم على الشراكات",
    locations: "إدارة من جدة · تسجيل بريطاني · طموح إقليمي",
    founder: "عن المؤسس",
    leadership: "القيادة / الخبرة / التوجه",
    name: "ياسر عبد القادر",
    role: "المؤسس والمدير العام",
    bio: "تأسست مسار على يد ياسر عبد القادر بعد أكثر من 13 عاماً من الخبرة العملية في السوق السعودي، شملت المشتريات، والتوريد الاستراتيجي، والإدارة التجارية، واستشارات الأعمال. ويقوم توجه الشركة على مبدأ واضح: الحفاظ على مسؤولية مباشرة ونموذج عمل مركّز، مع تطوير قدرات مسار تدريجياً من خلال استقطاب الخبرات المناسبة، والتعاون مع الشركات المتخصصة، وبناء شراكات استراتيجية كلما تطلبت الفرص ذلك.",
    proofs: [["+13 سنة", "من الخبرة العملية"], ["السعودية", "خبرة في السوق السعودي"], ["مسؤولية واضحة", "إدارة مباشرة للعمل"]],
    focus: "مجالات القدرات",
    focusItems: ["المشتريات والتوريد الاستراتيجي وإدارة الموردين", "الاستشارات التجارية والتعاقدية", "تأسيس الأعمال والأنظمة التشغيلية", "الهوية والحضور في السوق", "ضبط المشاريع وحصر الكميات"],
    serviceNav: [["المشتريات والتوريد الاستراتيجي وإدارة الموردين", "/services/procurement"], ["الاستشارات التجارية والتعاقدية", "/services/commercial-contracts"], ["تأسيس الأعمال والأنظمة التشغيلية", "/services/business-setup"], ["الهوية والحضور في السوق", "/packages"]],
    linkedin: "LinkedIn",
    how: "نموذج نمو مسار",
    modelTitle: <>قدرات تتوسع<br /><em>بالشراكات.</em></>,
    modelBody: "تجمع مسار بين نموذج عمل مركّز وخبرات مكملة وشراكات استراتيجية تتيح للشركة توسيع قدراتها بالتوازي مع نمو أعمالها.",
    steps: [["مسؤولية واضحة", "وضوح المسؤولية يشكّل أساس كل مهمة."], ["قدرات مكملة", "تضيف الشراكات الخبرات المتخصصة عندما تحقق قيمة فعلية."], ["تنفيذ منسق", "تجمع مسار هذه القدرات ضمن تجربة موحدة ومنظمة للعميل."]],
    network: "الشركاء والخبرات",
    flexible: "تعاون مرن / قدرات قابلة للتوسع / حسب الفرصة",
    networkTitle: <>قدرات تتوسع<br /><em>مع الشراكات الصحيحة.</em></>,
    networkBody: "نعمل على تطوير مسار كنموذج استشاري مرن تتوسع قدراته بالتوازي مع احتياجات العملاء والفرص المتاحة في الأسواق. ونسعى إلى بناء علاقات قوية مع خبراء محترفين، ومكاتب استشارية متخصصة، وخبرات فنية، وشركات تتكامل خدماتها مع مجالات عمل مسار.",
    expertise: ["المشتريات والتوريد الاستراتيجي", "الإدارة التجارية والعقود", "تأسيس الأعمال والتشغيل", "الهوية والحضور في السوق", "ضبط المشاريع وحصر الكميات"],
    oneLead: <>اتجاه واضح.<br /><em>وقدرات أوسع بالشراكات المناسبة.</em></>,
    bridge: ["مسؤولية واضحة تشكّل أساس كل مهمة.", "تضيف الشراكات الخبرات والقدرات المكملة عندما تحقق قيمة فعلية للمشروع.", "تجمع مسار هذه القدرات ضمن نموذج عمل منسق وتجربة موحدة للعميل."],
    cta: <>نبني القدرات.<br /><em>ونصنع القيمة معاً.</em></>,
    ctaCopy: <>الخبرة المناسبة.<br />الشراكة المناسبة.<br />ومنظومة تنفيذ واضحة.</>,
    start: "ابدأ المحادثة",
    explore: "استكشف خدمات مسار",
    footer: "شركة استشارية متخصصة، تنمو من خلال قدرات قوية وشراكات موثوقة وعلاقات طويلة المدى.",
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
                <a className="yp-model-jump" href="#partners-expertise" aria-label={lang === "ar" ? "الانتقال إلى قسم الشركاء والخبرات" : "Continue to partners and expertise"}>↓</a>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="yp-section yp-network" id="partners-expertise">
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