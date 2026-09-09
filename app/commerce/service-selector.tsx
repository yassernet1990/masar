"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { advisoryCatalogs, type ServiceKind, type ServiceLang } from "./service-catalog";
import "./service-selector.css";

type Selection = Record<string, number>;

const formatSar = (value: number, ar: boolean) =>
  new Intl.NumberFormat(ar ? "ar-SA" : "en-GB", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ServiceSelector({ kind, lang }: { kind: ServiceKind; lang: ServiceLang }) {
  const catalog = advisoryCatalogs[kind];
  const ar = lang === "ar";
  const t = (en: string, arabic: string) => (ar ? arabic : en);
  const [selection, setSelection] = useState<Selection>({});
  const [paymentPercent, setPaymentPercent] = useState<60 | 100>(100);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const requestId = useRef("");
  const services = useMemo(() => catalog.groups.flatMap((group) => group.services), [catalog]);

  useEffect(() => {
    requestId.current = crypto.randomUUID();
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(sessionStorage.getItem(`masar-services-${kind}`) || "null");
        if (saved?.selection && typeof saved.selection === "object") {
          const clean: Selection = {};
          for (const item of services) {
            const amount = Number(saved.selection[item.id]);
            if (Number.isInteger(amount) && amount >= item.min && amount <= item.max) clean[item.id] = amount;
          }
          setSelection(clean);
        }
        if (saved?.paymentPercent === 60 || saved?.paymentPercent === 100) setPaymentPercent(saved.paymentPercent);
      } catch {}
      const params = new URLSearchParams(location.search);
      if (params.get("checkout") === "cancelled") setResult("cancelled");
      if (params.get("checkout") === "success") {
        setResult("submitted");
        const session = params.get("session_id");
        if (session)
          fetch(`/api/service-checkout?session_id=${encodeURIComponent(session)}`)
            .then((response) => response.json())
            .then((data) => setResult(data.paid ? "paid" : "submitted"))
            .catch(() => setResult("submitted"));
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [kind, services]);

  const total = Object.values(selection).reduce((sum, amount) => sum + amount, 0);
  const dueNow = Math.round((total * paymentPercent) / 100);
  const remaining = total - dueNow;
  const toggle = (id: string) => {
    const item = services.find((entry) => entry.id === id)!;
    setError("");
    setSelection((current) => {
      const next = { ...current };
      if (id in next) delete next[id];
      else next[id] = item.min;
      return next;
    });
  };
  const setAmount = (id: string, amount: number) => {
    setError("");
    setSelection((current) => ({ ...current, [id]: amount }));
  };

  return (
    <section className="service-shop" dir={ar ? "rtl" : "ltr"}>
      <div className="ss-heading">
        <div>
          <p className="ss-eyebrow">{catalog.eyebrow[lang]}</p>
          <h1>{catalog.title[lang]}</h1>
          <p>{catalog.intro[lang]}</p>
        </div>
        <div className="ss-journey"><small>{t("YOUR SERVICE JOURNEY", "رحلة خدمتك")}</small><strong>{catalog.journey[lang]}</strong></div>
      </div>

      {result && <p className="ss-result" role="status">{
        result === "cancelled" ? t("Payment cancelled. Your selection is still saved.", "أُلغي الدفع. ما زالت اختياراتك محفوظة.") :
        result === "paid" ? t("Payment confirmed. Your MASAR order has been received.", "تم تأكيد الدفع واستلام طلبك لدى مسار.") :
        t("Your payment confirmation is being processed.", "تجري معالجة تأكيد دفعتك.")
      }</p>}

      <div className="ss-layout">
        <div className="ss-groups">
          {catalog.groups.map((group, index) => (
            <article className={`ss-group ss-group-${index + 1}`} key={group.id}>
              <header><span>0{index + 1}</span><div><h2>{group.title[lang]}</h2><p>{group.description[lang]}</p></div></header>
              <div className="ss-services">
                {group.services.map((item) => {
                  const selected = item.id in selection;
                  const variable = item.min !== item.max;
                  const amount = selection[item.id] ?? item.min;
                  const valid = Number.isInteger(amount) && amount >= item.min && amount <= item.max && (!variable || amount % 100 === 0);
                  return (
                    <div className={`ss-service ${selected ? "selected" : ""}`} key={item.id}>
                      <label>
                        <input type="checkbox" checked={selected} onChange={() => toggle(item.id)} />
                        <span className="ss-check" aria-hidden="true">✓</span>
                        <span className="ss-copy"><strong>{item.name[lang]}</strong><small>{item.description[lang]}</small></span>
                        <span className="ss-price">{variable ? `${formatSar(item.min, ar)}–${formatSar(item.max, ar)}` : formatSar(item.min, ar)}</span>
                      </label>
                      {selected && variable && (
                        <div className="ss-amount">
                          <label htmlFor={`${kind}-${item.id}`}>{t("Agreed amount", "المبلغ المتفق عليه")}</label>
                          <div><input id={`${kind}-${item.id}`} type="number" inputMode="numeric" min={item.min} max={item.max} step={100} value={amount} onChange={(event) => setAmount(item.id, Number(event.target.value))} aria-invalid={!valid} /><span>{t("SAR", "ر.س")}</span></div>
                          {!valid && <small role="alert">{t(`Enter an amount from ${formatSar(item.min, false)} to ${formatSar(item.max, false)} in steps of SAR 100.`, `أدخل مبلغًا بين ${formatSar(item.min, true)} و${formatSar(item.max, true)} بزيادة 100 ر.س.`)}</small>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <form className="ss-cart" onSubmit={async (event) => {
          event.preventDefault();
          if (!total || busy) return;
          const invalid = services.some((item) => item.id in selection && (!Number.isInteger(selection[item.id]) || selection[item.id] < item.min || selection[item.id] > item.max || (item.min !== item.max && selection[item.id] % 100 !== 0)));
          if (invalid) { setError(t("Please correct the highlighted amount.", "يرجى تصحيح المبلغ المحدد.")); return; }
          setBusy(true); setError("");
          const form = new FormData(event.currentTarget);
          sessionStorage.setItem(`masar-services-${kind}`, JSON.stringify({ selection, paymentPercent }));
          try {
            const response = await fetch("/api/service-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
              catalog: kind,
              items: Object.entries(selection).map(([id, amount]) => ({ id, amount })),
              paymentPercent,
              lang,
              email: form.get("email"),
              name: form.get("name"),
              company: form.get("company"),
              accepted: form.get("accepted") === "on",
              requestId: requestId.current,
            }) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || t("Payment unavailable.", "الدفع غير متاح."));
            window.location.assign(data.url);
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : t("Payment unavailable.", "الدفع غير متاح."));
            setBusy(false);
          }
        }}>
          <div className="ss-cart-title"><div><p>{t("YOUR SELECTION", "اختياراتك")}</p><h2>{t("Order summary", "ملخص الطلب")}</h2></div><span>{Object.keys(selection).length}</span></div>
          {!total ? <p className="ss-empty">{t("Select one or more services to build your order.", "اختر خدمة واحدة أو أكثر لتجهيز طلبك.")}</p> : <>
            <div className="ss-lines">{services.filter((item) => item.id in selection).map((item) => <div key={item.id}><span>{item.name[lang]}</span><strong>{formatSar(selection[item.id], ar)}</strong><button type="button" onClick={() => toggle(item.id)} aria-label={t("Remove service", "حذف الخدمة")}>×</button></div>)}</div>
            <div className="ss-payment-split">
              <p>{t("CHOOSE YOUR PAYMENT", "اختر طريقة الدفع")}</p>
              <label className={paymentPercent === 100 ? "active" : ""}><input type="radio" name="payment-choice" checked={paymentPercent === 100} onChange={() => setPaymentPercent(100)} /><span><strong>{t("Pay in full", "الدفع كاملًا")}</strong><small>{t("100% now", "100% الآن")}</small></span></label>
              <label className={paymentPercent === 60 ? "active" : ""}><input type="radio" name="payment-choice" checked={paymentPercent === 60} onChange={() => setPaymentPercent(60)} /><span><strong>{t("Pay initial payment", "دفع الدفعة الأولى")}</strong><small>{t("60% now · 40% upon completion", "60% الآن · 40% عند الإنجاز")}</small></span></label>
            </div>
            <div className="ss-totals"><div><span>{t("Service total", "إجمالي الخدمات")}</span><strong>{formatSar(total, ar)}</strong></div><div className="due"><span>{t(`Pay now · ${paymentPercent}%`, `الدفع الآن · ${paymentPercent}%`)}</span><strong>{formatSar(dueNow, ar)}</strong></div>{paymentPercent === 60 && <div><span>{t("Remaining upon completion", "المتبقي عند الإنجاز")}</span><strong>{formatSar(remaining, ar)}</strong></div>}</div>
            <div className="ss-pay-brand"><Image src="/images/stripe.svg" width={25} height={25} alt="" /><span><strong>{t("Secure Stripe Checkout", "دفع آمن عبر Stripe")}</strong><small>{t("You will continue to Stripe to complete payment.", "ستنتقل إلى Stripe لإتمام الدفع.")}</small></span></div>
            <label className="ss-field">{t("Full name", "الاسم الكامل")}<input name="name" autoComplete="name" maxLength={120} required /></label>
            <label className="ss-field">{t("Company", "الشركة")}<input name="company" autoComplete="organization" maxLength={120} /></label>
            <label className="ss-field">{t("Email", "البريد الإلكتروني")}<input name="email" type="email" autoComplete="email" maxLength={180} required /></label>
            <label className="ss-consent"><input name="accepted" type="checkbox" required /><span>{t("I confirm that the entered fees were agreed with MASAR and accept the selected payment terms.", "أؤكد أن الأتعاب المدخلة متفق عليها مع مسار وأوافق على شروط الدفع المختارة.")}</span></label>
            {error && <p className="ss-error" role="alert">{error}</p>}
            <button className="ss-pay" disabled={busy}>{busy ? t("Opening Stripe…", "جارٍ فتح Stripe…") : t("Pay securely with Stripe", "الدفع الآمن عبر Stripe")}</button>
          </>}
          <div className="ss-custom"><strong>{t("Need a tailored scope?", "تحتاج نطاقًا مخصصًا؟")}</strong><p>{t("Contact MASAR to agree the service scope and fee before checkout.", "تواصل مع مسار للاتفاق على نطاق الخدمة والأتعاب قبل الدفع.")}</p><a href="mailto:info@masarps.com">info@masarps.com</a></div>
        </form>
      </div>
      <div className="ss-steps">{[
        [t("Select", "اختر"), t("Choose the services you need", "حدد الخدمات التي تحتاجها")],
        [t("Enter", "أدخل"), t("Use the fee agreed with MASAR", "استخدم الأتعاب المتفق عليها")],
        [t("Review", "راجع"), t("Check your order and payment option", "راجع الطلب وخيار الدفع")],
        [t("Pay", "ادفع"), t("Complete payment securely with Stripe", "أكمل الدفع بأمان عبر Stripe")],
      ].map((step, index) => <div key={index}><span>0{index + 1}</span><strong>{step[0]}</strong><small>{step[1]}</small></div>)}</div>
    </section>
  );
}
