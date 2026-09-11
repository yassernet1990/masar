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
      ? "رؤية مؤسس مسار ونموذج نمو الشركة القائم على القيادة المباشرة وبناء الشراكات المناسبة للتوسع في الخدمات والأسواق."
      : "Founder vision and partnership-led growth model for MASAR Procurement & Solutions.",
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
    alternates: { canonical: "https://masarps.com/yasser" },
  };
}

const copy = {
  en: {
    nav: ["About Masar", "Services", "Method", "FAQ", "Packages & Pricing"],
    contact: "Contact",
    lang: "AR",
    eyebrow: "Founder Vision",
    title: <>Building MASAR<br />with <em>the right partners.</em></>,
    heroTag: "Founder-led · Partnership-driven · Built to expand across services and markets",
    heroSide: <>Founded with purpose.<br />Designed for partnership.<br />Built to grow together.</>,
    heroBody: "I founded MASAR to begin with direct leadership and grow deliberately through the right partners—experienced professionals, specialist firms and complementary businesses that can strengthen our services and extend our reach.",
    meet: "Meet the founder",
    status: "Founder-led · Built for partnership",
    locations: "Jeddah-based · UK-registered · Regional ambition",
    founder: "Founder",
    leadership: "Vision / Partnership / Growth",
    name: "Yasser Abdulkadir",
    role: "Founder & Managing Director",
    bio: "I founded MASAR with a clear ambition: to build a focused advisory business that starts with direct accountability and grows through the right partnerships. The aim is to bring together trusted professionals, specialist consultancies and complementary businesses that can expand MASAR's capabilities across every service area while preserving clear ownership, quality and execution.",
    proofs: [["13+", "Years of practical experience"], ["KSA", "Saudi market experience"], ["FOUNDER-LED", "Direct leadership and accountability"]],
    focus: "Growth areas",
    focusItems: ["Procurement, strategic sourcing & vendor management", "Commercial & contracts advisory", "Business setup & operational systems", "Brand identity & market presence", "Project controls & quantity surveying"],
    serviceNav: [["Procurement, strategic sourcing & vendor management", "/services/procurement"], ["Commercial & contracts advisory", "/services/commercial-contracts"], ["Business setup & operational systems", "/services/business-setup"], ["Brand identity & market presence", "/packages"]],
    linkedin: "LinkedIn",
    how: "MASAR Growth Model",
    modelTitle: <>Founder-led.<br /><em>Built for partnership.</em></>,
    modelBody: "MASAR is designed to expand through collaboration. As opportunities grow, the right partners will be brought around each service and assignment—without building unnecessary fixed overhead.",
    steps: [["Clear leadership", "The founder remains accountable for direction, standards and the client relationship."], ["Right partners", "Specialists and complementary businesses are brought in where they strengthen capability and delivery."], ["Shared growth", "MASAR creates a platform where strong partnerships can turn the right opportunities into lasting value."]],
    network: "Partners & Expertise",
    flexible: "Collaborative / Scalable / Opportunity-led",
    networkTitle: <>Built to grow<br /><em>through partnership.</em></>,
    networkBody: "MASAR's next stage is about building a strong ecosystem of experienced professionals, specialist consultancies, technical experts and strategic partners. The goal is to broaden capability across every service, strengthen delivery and create wider access to markets and opportunities.",
    expertise: ["Procurement & Strategic Sourcing", "Commercial & Contracts", "Business Setup & Operations", "Brand Identity & Market Presence", "Project Controls & Quantity Surveying"],
    oneLead: <>One founder vision.<br /><em>Expanded by the right partners.</em></>,
    bridge: ["The founder sets direction and remains accountable for the outcome.", "Partners add specialist depth and complementary capability where it creates value.", "MASAR brings the relationship together through one coordinated model."],
    cta: <>Build with MASAR.<br /><em>Grow the right opportunities together.</em></>,
    ctaCopy: <>Expertise that complements.<br />Partnerships that add value.<br />Ambition that scales.</>,
    start: "Start a conversation",
    explore: "Explore MASAR services",
    footer: "Founder-led advisory built to grow through the right partnerships, capabilities and markets.",
    address: "Registered Office Address",
    rights: "All rights reserved.",
  },
  ar: {
    nav: ["عن مسار", "خدماتنا", "منهجيتنا", "الأسئلة", "الباقات والأسعار"],
    contact: "تواصل معنا",
    lang: "EN",
    eyebrow: "رؤية المؤسس",
    title: <>نبني مسار<br />مع <em>الشركاء المناسبين.</em></>,
    heroTag: "قيادة مباشرة · شراكات نوعية · قدرات تتوسع مع الفرص",
    heroSide: <>بدأت برؤية واضحة.<br />وتنمو بالشراكات.<br />وتتوسع بخبرات متكاملة.</>,
    heroBody: "أسست مسار لتبدأ بقيادة مباشرة وواضحة، على أن تنمو تدريجياً عبر شراكات نوعية مع خبراء وشركات متخصصة تضيف قدرات جديدة وتوسّع نطاق خدماتنا وأسواقنا.",
    meet: "تعرّف إلى المؤسس",
    status: "بقيادة المؤسس · مصممة للنمو بالشراكات",
    locations: "إدارة من جدة · تسجيل بريطاني · طموح إقليمي",
    founder: "المؤسس",
    leadership: "الرؤية / الشراكات / النمو",
    name: "ياسر عبد القادر",
    role: "المؤسس والمدير العام",
    bio: "أسست مسار بطموح واضح: بناء شركة استشارية مركّزة تبدأ بمسؤولية مباشرة وقيادة واضحة، ثم تتوسع من خلال الشراكات المناسبة. رؤيتي هي أن تجمع مسار حولها خبراء موثوقين ومكاتب استشارية وشركات متخصصة تكمل قدراتها، بحيث نوسّع خدماتنا ونرفع جودة التنفيذ ونبني حضوراً أقوى في الأسواق، من دون أن نفقد وضوح المسؤولية أو مرونة العمل.",
    proofs: [["13+", "سنة من الخبرة العملية"], ["KSA", "خبرة في السوق السعودي"], ["بقيادة المؤسس", "مسؤولية مباشرة وقيادة واضحة"]],
    focus: "مجالات التوسع",
    focusItems: ["المشتريات والتوريد الاستراتيجي وإدارة الموردين", "الاستشارات التجارية والتعاقدية", "تأسيس الأعمال والأنظمة التشغيلية", "الهوية والحضور في السوق", "ضبط المشاريع وحصر الكميات"],
    serviceNav: [["المشتريات والتوريد الاستراتيجي وإدارة الموردين", "/services/procurement"], ["الاستشارات التجارية والتعاقدية", "/services/commercial-contracts"], ["تأسيس الأعمال والأنظمة التشغيلية", "/services/business-setup"], ["الهوية والحضور في السوق", "/packages"]],
    linkedin: "LinkedIn",
    how: "نموذج نمو مسار",
    modelTitle: <>بقيادة المؤسس.<br /><em>وتتوسع بالشراكات.</em></>,
    modelBody: "صُممت مسار لتكبر بالتعاون، لا بتضخيم الهيكل. ومع كل فرصة جديدة، نطمح إلى ضم الشريك أو الخبرة التي تقوّي الخدمة وتضيف قيمة حقيقية للعميل.",
    steps: [["قيادة واضحة", "يبقى المؤسس مسؤولاً عن الاتجاه والمعايير والعلاقة مع العميل."], ["الشريك المناسب", "تُضاف الخبرات والشركات المكملة عندما ترفع القدرة وجودة التنفيذ."], ["نمو مشترك", "تبني مسار منصة تتيح للشراكات القوية تحويل الفرص المناسبة إلى قيمة مستدامة."]],
    network: "الشركاء والخبرات",
    flexible: "تعاون مرن / قدرات قابلة للتوسع / حسب الفرصة",
    networkTitle: <>نؤمن أن التوسع الحقيقي<br /><em>يبدأ من الشراكات الصحيحة.</em></>,
    networkBody: "المرحلة القادمة في مسار تقوم على بناء منظومة من الخبراء والمكاتب الاستشارية والشركات المتخصصة والشركاء الاستراتيجيين الذين تتكامل قدراتهم مع خدماتنا. هدفنا أن نوسّع الخبرات في كل مجال، ونقوّي التنفيذ، ونفتح أبواباً أوسع للأسواق والفرص.",
    expertise: ["المشتريات والتوريد الاستراتيجي", "الإدارة التجارية والعقود", "تأسيس الأعمال والتشغيل", "الهوية والحضور في السوق", "ضبط المشاريع وحصر الكميات"],
    oneLead: <>رؤية يقودها المؤسس.<br /><em>وتتسع بالشركاء المناسبين.</em></>,
    bridge: ["يقود المؤسس الرؤية ويبقى مسؤولاً عن الاتجاه والنتيجة.", "تضيف الشراكات خبرات متخصصة وقدرات مكملة حيث تصنع قيمة حقيقية.", "تجمع مسار الجميع ضمن نموذج عمل واضح وتنسيق موحّد مع العميل."],
    cta: <>نبني الفرص معاً.<br /><em>ونتوسع مع الشركاء المناسبين.</em></>,
    ctaCopy: <>خبرات تتكامل.<br />شراكات تضيف قيمة.<br />وطموح ينمو بثبات.</>,
    start: "ابدأ المحادثة",
    explore: "استكشف خدمات مسار",
    footer: "شركة استشارية بقيادة المؤسس، مصممة للنمو من خلال الشراكات المناسبة والخبرات المتكاملة والأسواق الواعدة.",
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