"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { packages, addons, refund, type Item, type Lang } from "./catalog";
import "./packages.css";
import { planCopy, packageFaqs } from "./reference-content";
type Quote = {
  prices: Record<string, Record<string, number>>;
  fee: { ar: string; en: string } | null;
  ready: boolean;
  version: string;
};
export default function Packages({ lang, backgroundImage }: { lang: Lang; backgroundImage: string }) {
  const ar = lang === "ar",
    t = (en: string, arabic: string) => (ar ? arabic : en);
  const [selected, setSelected] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [currency, setCurrency] = useState("sar");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [details, setDetails] = useState<Item | null>(null);
  const [bankOpen, setBankOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [result, setResult] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const bankDialog = useRef<HTMLDialogElement>(null);
  const requestId = useRef("");
  useEffect(() => {
    requestId.current = crypto.randomUUID();
    fetch("/api/checkout")
      .then((r) => r.json())
      .then(setQuote)
      .catch(() => setError("Unable to load prices."));
    const timer = window.setTimeout(() => {
      try {
        const cart = JSON.parse(sessionStorage.getItem("masar-cart") || "null");
        if (cart && packages.some((p) => p.id === cart.selected)) {
          setSelected(cart.selected);
          setExtras(
            Array.isArray(cart.extras)
              ? cart.extras.filter((id: string) =>
                  addons.some((a) => a.id === id),
                )
              : [],
          );
        }
      } catch {}
      const params = new URLSearchParams(location.search);
      if (params.get("checkout") === "cancelled") setResult("cancelled");
      if (params.get("checkout") === "success") {
        setResult("submitted");
        const session = params.get("session_id");
        if (session)
          fetch(`/api/checkout?session_id=${encodeURIComponent(session)}`)
            .then((r) => r.json())
            .then((data) => setResult(data.paid ? "paid" : "submitted"))
            .catch(() => setResult("submitted"));
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (details) dialog.current?.showModal();
    else dialog.current?.close();
  }, [details]);
  useEffect(() => {
    if (bankOpen) bankDialog.current?.showModal();
    else bankDialog.current?.close();
  }, [bankOpen]);
  const copyBankDetail = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };
  const money = (id: string) =>
    new Intl.NumberFormat(ar ? "ar-SA" : "en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(
      (quote?.prices[currency]?.[id] ??
        Math.round(
          [...packages, ...addons].find((p) => p.id === id)!.sar * 100,
        )) / 100,
    );
  const choose = (id: string) => {
    setSelected(id);
    setError("");
    setTimeout(
      () =>
        document
          .getElementById("package-order")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  };
  const items = [...packages, ...addons].filter(
    (i) => i.id === selected || extras.includes(i.id),
  );
  const total = items.reduce(
    (sum, i) =>
      sum + (quote?.prices[currency]?.[i.id] ?? Math.round(i.sar * 100)),
    0,
  );
  return (
    <section
      id="brand-packages"
      className="masar-packages"
      dir={ar ? "rtl" : "ltr"}
    >
      <div className="mp-scene" aria-hidden="true" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="mp-atmosphere" aria-hidden="true">
        <span className="mp-aurora mp-aurora-one" />
        <span className="mp-aurora mp-aurora-two" />
        <span className="mp-aurora mp-aurora-three" />
        <span className="mp-orbit mp-orbit-one"><i /><i /><i /></span>
        <span className="mp-orbit mp-orbit-two"><i /><i /></span>
      </div>
      <div className="mp-heading">
        <div>
          <p>
            {t("BRAND IDENTITY & MARKET PRESENCE", "الهوية والحضور في السوق")}
          </p>
          <h1>{t("Everything you need to launch and grow.", "كل ما تحتاجه لإطلاق شركتك وتنميتها.")}</h1>
          <p>
            {t(
              "Choose the package that matches your stage — from your first launch to a complete corporate presence.",
              "اختر الباقة التي تناسب مرحلتك، من الانطلاقة الأولى إلى حضور مؤسسي متكامل.",
            )}
          </p>
        </div>
      </div>
      <div className="mp-proof"><span>{t("Clear scope", "نطاق عمل واضح")}</span><span>{t("One-time project pricing", "رسوم مشروع لمرة واحدة")}</span><span>{t("Structured reviews", "مراجعات واعتمادات منظمة")}</span><span>{t("Optional ongoing support", "دعم مستمر اختياري")}</span></div>
      <div className="mp-kinetic" aria-hidden="true">
        <div className="mp-kinetic-track">
          <span>MASAR</span><b>•</b><span>BRAND</span><b>•</b><span>DIGITAL</span><b>•</b><span>PROCUREMENT</span><b>•</b><span>MARKET PRESENCE</span><b>•</b>
          <span>MASAR</span><b>•</b><span>BRAND</span><b>•</b><span>DIGITAL</span><b>•</b><span>PROCUREMENT</span><b>•</b><span>MARKET PRESENCE</span><b>•</b>
        </div>
      </div>
      <div className="mp-controls"><p>{t("Five packages. Find your fit.", "خمس باقات. اختر الأنسب لشركتك.")}</p><div className="mp-currencies" role="group" aria-label={t("Currency", "العملة")}>{["sar","usd","gbp"].map(c=><button key={c} type="button" aria-pressed={currency===c} disabled={c!=="sar"&&!quote?.prices[c]} onClick={()=>setCurrency(c)}>{c.toUpperCase()}</button>)}</div></div>
      <p className="mp-note">
        {t(
          "100% upfront · One-time project fee · Refund requests within 72 hours, less administrative and transfer fees.",
          "دفع 100% مقدمًا · رسوم مشروع لمرة واحدة · طلب الاسترداد خلال 72 ساعة مع خصم الرسوم الإدارية ورسوم التحويل.",
        )}
      </p>
      {result && (
        <p role="status" className="mp-message">
          {result === "cancelled"
            ? t(
                "Payment cancelled. Your selection is saved below.",
                "أُلغي الدفع. اختيارك محفوظ أدناه.",
              )
            : result === "paid"
              ? t(
                  "Payment confirmed. Thank you — your order has been received.",
                  "تم تأكيد الدفع. شكرًا لك — تم استلام طلبك.",
                )
              : t(
                  "Thank you. Payment confirmation is being processed. Your Stripe receipt confirms a successful payment; this return page alone does not.",
                  "شكرًا لك. جارٍ معالجة تأكيد الدفع. إيصال Stripe يؤكد نجاح الدفع؛ الرجوع لهذه الصفحة وحده لا يؤكده.",
                )}
        </p>
      )}
      <div className="mp-grid">
        {packages.map((p) => (
          <article
            key={p.id}
            className={`mp-card ${p.id === "grow" ? "mp-featured" : ""} ${selected===p.id ? "mp-selected" : ""}`}
          >
            <span className="mp-badge">
              {p.id === "grow"
                ? t("MOST POPULAR", "الأكثر طلبًا")
                : p.id === "grow-procure"
                  ? t("FOR B2B", "للشركات")
                  : t(`SAVE ${Math.round((1-p.sar/p.original!)*100)}%`, `وفر ${Math.round((1-p.sar/p.original!)*100)}٪`)}
            </span>
            <h3>{p.name}</h3>
            <p className="mp-description">{planCopy[p.id].description[lang]}</p>
            <del>
              {new Intl.NumberFormat(ar ? "ar-SA" : "en-GB", {
                style: "currency",
                currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
              }).format(
                p.original! *
                  ((quote?.prices[currency]?.[p.id] ?? p.sar * 100) /
                    (p.sar * 100)),
              )}
            </del>
            <strong className="mp-price">{money(p.id)}</strong>
            <small>{t("One-time payment", "دفعة واحدة")}</small>
            <button type="button" className="mp-choose" onClick={() => choose(p.id)}>
              {selected===p.id?t("Selected ✓", "تم الاختيار ✓"):t("Choose package", "اختيار الباقة")}
            </button>
            <p className="mp-card-micro">{t("100% upfront · One-time fee", "دفع كامل مقدمًا · لمرة واحدة")}</p>
            <div className="mp-included">{t("WHAT’S INCLUDED", "المشمول في الباقة")}</div>
            <ul>{planCopy[p.id].features[lang].slice(0,7).map(feature=><li key={feature}>{feature}</li>)}</ul>
            <p className="mp-more-count">{t(`+${Math.max(0, planCopy[p.id].features.en.length-7)} more included`, `+${Math.max(0, planCopy[p.id].features.ar.length-7)} مزايا إضافية`)}</p>
            <button type="button" className="mp-link" onClick={()=>setDetails(p)}>{t("View full details", "عرض التفاصيل كاملة")} <span aria-hidden="true">{ar?"←":"→"}</span></button>
          </article>
        ))}
      </div>
      <a className="mp-grow-story" href={`/grow-case?lang=${lang}`} aria-label={t("Explore the Grow case study", "استكشف دراسة حالة Grow")}>
        <div className="mp-story-art" aria-hidden="true"><img src="/images/grow-case/preview-3.webp" width="1360" height="940" alt="" loading="lazy" /><span>GROW / CASE STUDY</span></div>
        <div className="mp-story-copy"><span className="mp-story-eyebrow">{t("BEFORE YOU CHOOSE · SEE THE EXPERIENCE", "قبل أن تختار · شاهد التجربة")}</span><h2>{t("What happens after you choose Grow?", "ماذا يحدث بعد اختيار Grow؟")}</h2><p>{t("Try the colours and type, explore real design examples and follow your project from the first logo to final handover.", "جرّب الألوان والخطوط، واستعرض نماذج فعلية، وتابع مشروعك من أول فكرة للشعار إلى التسليم النهائي.")}</p><div className="mp-story-steps">{[t("Identity", "الهوية"),t("Website", "الموقع"),t("Profile", "البروفايل"),t("Handover", "التسليم")].map((label,i)=><span key={label}><b>0{i+1}</b>{label}</span>)}</div><strong className="mp-story-cta">{t("Explore the full journey", "اكتشف الرحلة كاملة")} <span aria-hidden="true">↗</span></strong></div>
      </a>
      <section className="mp-comparison" aria-labelledby="comparison-title">
        <p className="mp-eyebrow">{t("COMPARE PACKAGES", "قارن الباقات")}</p>
        <h2 id="comparison-title">{t("See the difference at a glance.", "شاهد الفرق بين الباقات بسرعة.")}</h2>
        <div className="mp-comparison-scroll">
          <table>
            <thead><tr><th>{t("Included", "المزايا")}</th>{packages.map(p=><th key={p.id}>{p.name}</th>)}</tr></thead>
            <tbody>{[
              ["Landing page / website", ["Landing page","Landing page","Corporate website","Corporate website","Premium website"]],
              ["Business emails", ["2","2","10","10","20"]],
              ["Company profile", ["—","—","10–12 pages","10–12 pages","10–15 pages"]],
              ["Brand identity", ["—","—","Mini guidelines","Mini guidelines","Complete guidelines"]],
              ["Procurement toolkit", ["—","Essential","—","Plus","—"]],
              ["CMS / analytics / forms", ["—","—","—","—","Included"]],
            ].map(([label, values])=><tr key={label as string}><th scope="row">{t(label as string, ({"Landing page / website":"الموقع / صفحة الهبوط","Business emails":"البريد الرسمي","Company profile":"بروفايل الشركة","Brand identity":"الهوية البصرية","Procurement toolkit":"أدوات المشتريات","CMS / analytics / forms":"لوحة التحكم والتحليلات والنماذج"} as Record<string,string>)[label as string])}</th>{(values as string[]).map((v,i)=><td key={i}>{v === "—" ? <span className="mp-dash">—</span> : v}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>
      <div className="mp-payment-strip" aria-label={t("Payment methods", "طرق الدفع")}>
        <div className="mp-payment-intro">
          <span>{t("FLEXIBLE PAYMENT", "خيارات دفع مرنة")}</span>
          <strong>{t("Pay online or by UK bank transfer", "ادفع إلكترونيًا أو عبر حساب الشركة في بريطانيا")}</strong>
          <p>{t("Secure card checkout through Stripe, or GBP and USD payment through Wise.", "دفع آمن بالبطاقة عبر Stripe، أو الدفع بالجنيه الإسترليني والدولار عبر Wise.")}</p>
        </div>
        <div className="mp-payment-brand">
          <span className="mp-logo-box mp-stripe-logo"><Image src="/images/stripe.svg" width={27} height={27} alt="" /><b>stripe</b></span>
          <small>{t("Secure online checkout", "دفع إلكتروني آمن")}</small>
        </div>
        <div className="mp-payment-brand">
          <span className="mp-logo-box mp-wise-logo"><Image src="/images/wise.svg" width={27} height={27} alt="" /><b>WISE</b></span>
          <button type="button" onClick={() => setBankOpen(true)}>{t("View bank details", "عرض بيانات الحساب")}</button>
        </div>
      </div>
      <p className="mp-note">
        {t(
          "SAR is the base currency. USD and GBP use the current available conversion quote; the final amount is shown before payment.",
          "الريال هو العملة الأساسية. الدولار والباوند بحسب سعر التحويل المتاح، ويظهر الإجمالي النهائي قبل الدفع.",
        )}{" "}
        <a
          href="https://www.exchangerate-api.com"
          target="_blank"
          rel="noreferrer"
        >
          ExchangeRate-API
        </a>
      </p>
      {selected && (
        <div id="package-order" className="mp-order">
          <div>
            <p className="mp-step">02 / {t("MAKE IT YOURS", "خصص طلبك")}</p>
            <h3>
              {t("Add what your business needs.", "أضف ما تحتاجه شركتك.")}
            </h3>
            <div className="mp-addons">
              {addons.map((a) => (
                <label key={a.id}>
                  <input
                    type="checkbox"
                    checked={extras.includes(a.id)}
                    onChange={(e) =>
                      setExtras(
                        e.target.checked
                          ? [...extras, a.id]
                          : extras.filter((id) => id !== a.id),
                      )
                    }
                  />
                  <span>{ar ? a.ar : a.name}</span>
                  <strong>{money(a.id)}</strong>
                </label>
              ))}
            </div>
            <p className="mp-note">
              {t(
                "Contract deliverables are business templates. Arrange a qualified legal review before use.",
                "العقود المقدمة نماذج تجارية. يلزم ترتيب مراجعة قانونية متخصصة قبل استخدامها.",
              )}
            </p>
            <p>
              {t(
                "Monthly website care and LinkedIn support can be arranged separately. No recurring subscription is added to this order.",
                "يمكن ترتيب الدعم الشهري للموقع ولينكدإن بشكل مستقل. لا يُضاف اشتراك متجدد إلى هذا الطلب.",
              )}
            </p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!quote || busy) return;
              setBusy(true);
              setError("");
              const f = new FormData(e.currentTarget);
              sessionStorage.setItem(
                "masar-cart",
                JSON.stringify({ selected, extras }),
              );
              try {
                const r = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    package: selected,
                    addons: extras,
                    currency,
                    lang,
                    version: quote.version,
                    email: f.get("email"),
                    name: f.get("name"),
                    company: f.get("company"),
                    accepted: f.get("accepted") === "on",
                    requestId: requestId.current,
                  }),
                });
                const data = await r.json();
                if (!r.ok) throw new Error(data.error);
                window.location.assign(data.url);
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Payment unavailable",
                );
                setBusy(false);
              }
            }}
            className="mp-summary"
          >
            <p className="mp-step">03 / {t("YOUR ORDER", "ملخص طلبك")}</p>
            <h3>
              {t("Everything, clearly priced.", "تفاصيل واضحة لكل مبلغ.")}
            </h3>
            {items.map((i) => (
              <div className="mp-row" key={i.id}>
                <span>{ar ? i.ar : i.name}</span>
                <strong>{money(i.id)}</strong>
              </div>
            ))}
            <div className="mp-total">
              <span>{t("Pay now · 100%", "ادفع الآن · 100%")}</span>
              <strong>
                {new Intl.NumberFormat(ar ? "ar-SA" : "en-GB", {
                  style: "currency",
                  currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
                }).format(total / 100)}
              </strong>
            </div>
            <div className="mp-payment-choices">
              <div className="mp-payment-choice mp-payment-choice-active">
                <span className="mp-logo-box mp-stripe-logo"><Image src="/images/stripe.svg" width={24} height={24} alt="" /><b>stripe</b></span>
                <div><strong>{t("Card payment", "الدفع بالبطاقة")}</strong><small>{t("Continue to secure Stripe Checkout below.", "تابع إلى صفحة Stripe الآمنة أدناه.")}</small></div>
              </div>
              <div className="mp-payment-choice">
                <span className="mp-logo-box mp-wise-logo"><Image src="/images/wise.svg" width={24} height={24} alt="" /><b>WISE</b></span>
                <div><strong>{t("UK bank transfer", "تحويل إلى حساب الشركة في بريطانيا")}</strong><small>{t("GBP by bank details, or USD through the Wise payment page.", "بالجنيه عبر بيانات الحساب، أو بالدولار عبر صفحة Wise.")}</small></div>
                <button type="button" onClick={() => setBankOpen(true)}>{t("Bank details", "بيانات الحساب")}</button>
              </div>
            </div>
            <label>
              {t("Full name", "الاسم الكامل")}
              <input name="name" autoComplete="name" maxLength={120} required />
            </label>
            <label>
              {t("Company", "الشركة")}
              <input
                name="company"
                autoComplete="organization"
                maxLength={120}
              />
            </label>
            <label>
              {t("Email", "البريد الإلكتروني")}
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={180}
                required
              />
            </label>
            <div className="mp-refund">
              <strong>
                {t("3-day refund window", "الاسترداد خلال 3 أيام")}
              </strong>
              <p>{refund[lang]}</p>
              {quote?.fee && <p>{quote.fee[lang]}</p>}
            </div>
            <label className="mp-consent">
              <input name="accepted" type="checkbox" required />
              <span>
                {t(
                  "I agree to the scope, full upfront payment and refund policy shown above.",
                  "أوافق على نطاق الخدمة والدفع الكامل مقدمًا وسياسة الاسترداد الموضحة أعلاه.",
                )}
              </span>
            </label>
            {error && <p role="alert">{error}</p>}
            <button disabled={busy || !quote?.ready}>
              {busy
                ? t("Opening payment…", "جارٍ فتح الدفع…")
                : t("Pay securely with Stripe", "الدفع الآمن عبر Stripe")}
            </button>
            {!quote?.ready && (
              <p role="status">
                {t(
                  "Online checkout is being prepared. Contact us to arrange your order.",
                  "جارٍ تجهيز الدفع الإلكتروني. تواصل معنا لترتيب طلبك.",
                )}{" "}
                <a href="mailto:info@masarps.com">info@masarps.com</a>
              </p>
            )}
          </form>
        </div>
      )}
      <div className="mp-trust"><div><b>{t("Clear pricing", "أسعار واضحة")}</b><p>{t("Your package and extras, item by item.", "باقتك وإضافاتك، مع توضيح كل مبلغ.")}</p></div><div><b>{t("Structured delivery", "تنفيذ منظم")}</b><p>{t("Clear stages, reviews and approvals.", "مراحل واضحة للمراجعة والاعتماد.")}</p></div><div><b>{t("Ongoing support", "دعم مستمر")}</b><p>{t("Optional care after your launch.", "خدمات دعم اختيارية بعد الإطلاق.")}</p></div><div><b>{t("Built for business", "مصمم للأعمال")}</b><p>{t("Brand, digital and commercial tools.", "هوية وحضور رقمي وأدوات تجارية.")}</p></div></div>
      <section className="mp-process"><p className="mp-eyebrow">{t("HOW IT WORKS", "كيف نعمل")}</p><h2>{t("From selection to launch.", "من اختيار الباقة إلى الإطلاق.")}</h2><div className="mp-process-grid">{[
        ["Choose your package","اختر الباقة","Select your package and any extra services.","حدد الباقة والخدمات الإضافية التي تحتاجها."],
        ["Confirm the scope","اعتماد نطاق العمل","Align deliverables, inputs and timeline before kickoff.","نتفق على المخرجات والمدخلات والجدول الزمني قبل بدء التنفيذ."],
        ["Design & build","التصميم والتنفيذ","Develop your project through clear review stages.","نطور مشروعك عبر مراحل مراجعة واعتماد واضحة."],
        ["Launch & handover","الإطلاق والتسليم","Receive your approved assets and launch-ready setup.","تستلم المخرجات النهائية المعتمدة والجاهزة للإطلاق."]
      ].map((step,i)=><article key={i}><span>0{i+1}</span><h3>{t(step[0],step[1])}</h3><p>{t(step[2],step[3])}</p></article>)}</div></section>
      {!selected&&<section className="mp-extras-preview"><p className="mp-eyebrow">{t("ADD-ONS", "خدمات إضافية")}</p><h2>{t("Make the package yours.", "خصص الباقة لتناسب شركتك.")}</h2><p>{t("Choose a package above, then add only what you need.", "اختر باقتك أولًا، ثم أضف فقط ما تحتاجه.")}</p><div>{addons.map(a=><article key={a.id}><h3>{ar?a.ar:a.name}</h3><strong>{money(a.id)}</strong></article>)}</div></section>}
      <div className="mp-faq-heading"><p className="mp-eyebrow">{t("GOOD TO KNOW", "معلومات مهمة")}</p><h2>{t("Before you choose.", "قبل اختيار الباقة.")}</h2></div>
      {packageFaqs.map(f=><details className="mp-faq" key={f.q.en}><summary>{f.q[lang]}</summary><p>{f.a[lang]}</p></details>)}
      <details className="mp-faq">
        <summary>
          {t("How does the refund work?", "كيف يعمل الاسترداد؟")}
        </summary>
        <p>{refund[lang]}</p>
        {quote?.fee && <p>{quote.fee[lang]}</p>}
      </details>
      <dialog
        ref={dialog}
        className="mp-dialog"
        onCancel={() => setDetails(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDetails(null);
        }}
      >
        <button
          className="mp-close"
          aria-label={t("Close", "إغلاق")}
          onClick={() => setDetails(null)}
        >
          ×
        </button>
        {details && (
          <>
            <p className="mp-dialog-eyebrow">{t("PACKAGE DETAILS", "تفاصيل الباقة")}</p>
            <h2>{details.name}</h2>
            <p className="mp-dialog-description">{planCopy[details.id].description[lang]}</p>
            <strong className="mp-dialog-price">{money(details.id)}</strong>
            <h3>{t("Everything included", "كل ما تشمله الباقة")}</h3>
            <ul>
              {planCopy[details.id].features[lang].map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <p>{t("Final deliverables, review rounds and timeline are confirmed before kickoff. Hosting and mailbox allowances cover the first year.", "يُعتمد نطاق العمل وجولات المراجعة والجدول الزمني قبل بدء التنفيذ. الاستضافة والبريد الإلكتروني للسنة الأولى.")}</p>
            <p>{refund[lang]}</p>
            <button
              onClick={() => {
                choose(details.id);
                setDetails(null);
              }}
            >
              {t("Choose this package", "اختيار هذه الباقة")}
            </button>
          </>
        )}
      </dialog>
      <dialog
        ref={bankDialog}
        className="mp-bank-dialog"
        onCancel={() => setBankOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setBankOpen(false);
        }}
      >
        <button className="mp-close" type="button" aria-label={t("Close", "إغلاق")} onClick={() => setBankOpen(false)}>×</button>
        <div className="mp-bank-head">
          <span className="mp-logo-box mp-wise-logo"><Image src="/images/wise.svg" width={30} height={30} alt="" /><b>WISE</b></span>
          <p className="mp-dialog-eyebrow">{t("UK COMPANY ACCOUNT", "حساب الشركة في بريطانيا")}</p>
          <h2>{t("Bank transfer details", "بيانات التحويل البنكي")}</h2>
          <p>{t("Use the UK details below for GBP transfers. For USD, open the company’s Wise payment page.", "استخدم البيانات البريطانية أدناه للتحويل بالجنيه الإسترليني. للدفع بالدولار، افتح صفحة Wise الرسمية للشركة.")}</p>
        </div>
        <div className="mp-bank-fields">
          {[
            [t("Account holder", "اسم صاحب الحساب"), "Masar Procurement & Solutions Ltd"],
            [t("Account number", "رقم الحساب"), "91726749"],
            [t("Sort code", "رمز الفرع"), "60-84-64"],
            ["IBAN", "GB65 TRWI 6084 6491 7267 49"],
            ["SWIFT / BIC", "TRWIGB2LXXX"],
          ].map(([label, value]) => (
            <div className="mp-bank-field" key={label}>
              <span>{label}</span>
              <strong dir="ltr">{value}</strong>
              <button type="button" onClick={() => copyBankDetail(label, value)}>{copied === label ? t("Copied ✓", "تم النسخ ✓") : t("Copy", "نسخ")}</button>
            </div>
          ))}
        </div>
        <div className="mp-bank-address">
          <strong>{t("Bank name and address", "اسم البنك وعنوانه")}</strong>
          <p dir="ltr">Wise Payments Limited<br />Worship Square, 65 Clifton Street<br />London, EC2A 4JE, United Kingdom</p>
        </div>
        <p className="mp-bank-note">{t("Add your company name and selected package to the transfer reference, then email the receipt to info@masarps.com. Bank transfers are confirmed manually.", "اكتب اسم شركتك واسم الباقة في مرجع التحويل، ثم أرسل إيصال الدفع إلى info@masarps.com. يتم تأكيد التحويلات البنكية يدويًا.")}</p>
        <div className="mp-bank-actions">
          <a href="https://wise.com/pay/business/masarprocurementsolutionsltd" target="_blank" rel="noreferrer">{t("Pay in USD through Wise", "الدفع بالدولار عبر Wise")}</a>
          <button type="button" onClick={() => setBankOpen(false)}>{t("Close", "إغلاق")}</button>
        </div>
      </dialog>
    </section>
  );
}
