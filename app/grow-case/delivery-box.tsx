"use client";
import { useState } from "react";

export default function DeliveryBox({ ar }: { ar: boolean }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const t = (en: string, arabic: string) => ar ? arabic : en;
  const items = [
    { code: "BRAND", name: t("Brand identity", "الهوية البصرية"), title: t("One identity. Every detail.", "هوية واحدة. بكل التفاصيل."), info: t("Your approved visual foundation, organised for consistent everyday use.", "مرجعك البصري المعتمد، منظّم لتستخدم هويتك باتساق كل يوم."), list: [t("Approved logo in the agreed source and export formats", "الشعار المعتمد بصيغ المصدر والتصدير المتفق عليها"), t("Colour codes and typography references", "أكواد الألوان ومراجع الخطوط"), t("Mini brand guidelines · 5–8 pages", "دليل الهوية المختصر · 5–8 صفحات")], mark: "Aa" },
    { code: "WEBSITE", name: t("Digital presence", "الحضور الرقمي"), title: t("Ready to meet your customers.", "جاهز لاستقبال عملائك."), info: t("Your approved company website and the essentials for your digital presence.", "موقع شركتك المعتمد والأساسيات اللازمة لحضورك الرقمي."), list: [t("Approved live corporate website", "موقع الشركة المنشور والمعتمد"), t("1-year hosting and up to 10 business emails", "استضافة سنة وما يصل إلى 10 عناوين بريد رسمي"), t("Email signature and LinkedIn branding", "توقيع البريد وتجهيز هوية لينكدإن")], mark: "www." },
    { code: "PROFILE", name: t("Company profile", "بروفايل الشركة"), title: t("Your company, clearly presented.", "قصة شركتك بصورة واضحة."), info: t("One approved profile aligned with your website and visual identity.", "بروفايل واحد معتمد ومتطابق مع معلومات موقعك وهويتك البصرية."), list: [t("Company profile · 10–12 pages", "بروفايل الشركة · 10–12 صفحة"), t("Verified company story, services and capabilities", "قصة الشركة وخدماتها وقدراتها بمعلومات مدقّقة"), t("Approved information aligned on the website", "توحيد المعلومات المعتمدة على الموقع")], mark: "SAC" },
    { code: "DOCUMENTS", name: t("Business documents", "مستندات الأعمال"), title: t("Your identity at work.", "هويتك في أعمالك اليومية."), info: t("Coordinated business templates, delivered in the formats agreed at kickoff.", "نماذج أعمال متناسقة، تُسلّم بالصيغ المتفق عليها عند الانطلاق."), list: [t("Quotation and invoice designs", "تصميم عرض سعر وفاتورة"), t("PowerPoint template", "قالب باوربوينت"), t("Business card design", "تصميم بطاقة الأعمال")], mark: "01 /" },
  ];
  const item = items[selected];
  return <div className={`gc-delivery-experience ${open ? "is-open" : ""}`}>
    <div className="gc-unbox-intro"><p className="gc-kicker">{t("YOUR GROW DELIVERY", "تسليم باقة GROW")}</p><h3>{t("Open what comes next.", "افتح صندوق حضورك الجديد.")}</h3><p>{t("Open the box, then explore each group of deliverables.", "افتح الصندوق، ثم اختر كل مجموعة لتستكشف محتوياتها.")}</p></div>
    <button type="button" className="gc-unbox-trigger" aria-expanded={open} aria-controls="gc-delivery-contents" onClick={()=>setOpen(v=>!v)}>
      <span className="gc-box-scene" aria-hidden="true"><span className="gc-box-rays" /><span className="gc-box-papers"><i>BRAND</i><i>WEB</i><i>PROFILE</i></span><span className="gc-box-body"><span>MASAR</span><strong>GROW</strong><small>ONE COMPLETE PRESENCE</small></span><span className="gc-box-lid"><b>M</b><span>THE NEXT CHAPTER</span></span></span>
      <span className="gc-box-action">{open ? t("Close the box", "أغلق الصندوق") : t("Open your delivery box", "افتح صندوق التسليم")} <span aria-hidden="true">{open ? "−" : "+"}</span></span>
    </button>
    <div id="gc-delivery-contents" hidden={!open}>
      <div className="gc-delivery-items" role="group" aria-label={t("Delivery groups", "مجموعات التسليم")}>{items.map((v,i)=><button type="button" key={v.code} className={`gc-delivery-item gc-delivery-item-${i}`} aria-pressed={selected===i} aria-controls="gc-delivery-detail" onClick={()=>setSelected(i)}><span className="gc-delivery-mini" aria-hidden="true"><small>0{i+1} / {v.code}</small><b>{v.mark}</b><i /></span><strong>{v.name}</strong><span>{selected===i?t("Exploring now", "تستعرضها الآن"):t("Explore contents", "استكشف المحتويات")} ↗</span></button>)}</div>
      <div className="gc-delivery-detail" id="gc-delivery-detail" aria-live="polite" aria-atomic="true"><div><span className="gc-kicker">0{selected+1} / {item.code}</span><h4>{item.title}</h4><p>{item.info}</p></div><ul>{item.list.map(v=><li key={v}><span aria-hidden="true">✓</span>{v}</li>)}</ul></div>
    </div>
    <p className="gc-unbox-note">{t("An illustrative digital delivery preview. Final files and access details are shared through the agreed project channel.", "معاينة توضيحية للتسليم الرقمي. تُشارك الملفات النهائية وبيانات الوصول عبر قناة المشروع المتفق عليها.")}</p>
  </div>;
}
