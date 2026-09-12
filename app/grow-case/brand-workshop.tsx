"use client";
import { useState, type CSSProperties } from "react";

const palettes = [
  { name: ["Navy & gold", "كحلي وذهبي"], colours: ["#091B34", "#E9BB63", "#91C9FF", "#F5F8FF"], note: ["A formal, premium corporate direction.", "توجه مؤسسي رسمي وفاخر."] },
  { name: ["Ivory & terracotta", "عاجي وطوبي"], colours: ["#FFF2DE", "#A83912", "#914600", "#52200D"], note: ["A bright, warm identity with earthy accents.", "هوية فاتحة ودافئة بلمسات ترابية."] },
  { name: ["Violet & electric", "بنفسجي وكهربائي"], colours: ["#3B0764", "#F0ABFC", "#67E8F9", "#FAF5FF"], note: ["An expressive, energetic digital direction.", "توجه رقمي جريء ومفعم بالحيوية."] },
  { name: ["Emerald & lime", "زمردي وليموني"], colours: ["#065F46", "#FDE047", "#6EE7B7", "#ECFDF5"], note: ["A fresh green identity with vivid yellow accents.", "هوية خضراء منعشة بلمسات صفراء واضحة."] },
];
function SacMark() { return <svg className="gc-sac-mark" viewBox="0 0 420 320" width="82" height="64" aria-hidden="true"><path fill="var(--brand-accent)" d="M24 103 132 12h264l-75 58H158l-33 31 119 27-71 61z"/><path fill="var(--brand-secondary)" d="m296 126 82 18-194 164-41-45z"/></svg>; }
const fontPairs = [
  { name: ["Contemporary & refined", "عصري وراقي"], en: '"Manrope", Arial, sans-serif', ar: '"Alexandria", sans-serif', names: "Manrope + Alexandria" },
  { name: ["Editorial & elegant", "تحريري وأنيق"], en: '"Cormorant Garamond", Georgia, serif', ar: '"Noto Naskh Arabic", serif', names: "Cormorant Garamond + Noto Naskh Arabic" },
  { name: ["Distinctive & modern", "مميز وحديث"], en: '"Space Grotesk", Arial, sans-serif', ar: '"IBM Plex Sans Arabic", sans-serif', names: "Space Grotesk + IBM Plex Sans Arabic" },
];
export default function BrandWorkshop({ ar }: { ar: boolean }) {
  const [palette, setPalette] = useState(0);
  const [font, setFont] = useState(0);
  const [logo, setLogo] = useState(0);
  const t = (en: string, arabic: string) => ar ? arabic : en;
  const p = palettes[palette];
  const names = [t("01 / Existing SAC symbol", "01 / رمز SAC الحالي"), t("02 / Geometric wordmark", "02 / شعار كتابي هندسي"), t("03 / Editorial wordmark", "03 / شعار كتابي رسمي")];
  const style = { "--brand-base": p.colours[0], "--brand-accent": p.colours[1], "--brand-secondary": p.colours[2], "--brand-paper": p.colours[3], "--brand-font-ar": fontPairs[font].ar, "--brand-font-en": fontPairs[font].en } as CSSProperties;
  return <div className="gc-brand-lab" style={style}>
    <div className="gc-lab-heading"><p className="gc-kicker">{t("TRY THE DESIGN DECISIONS", "جرّب قرارات التصميم")}</p><h3>{t("Colours. Type. Logo.", "ألوان. خطوط. شعار.")}</h3><p>{t("Change each element and see the result immediately. During your project, we compare directions against your audience, sector and real uses, then record your approved choices.", "غيّر العناصر وشاهد النتيجة مباشرة. في مشروعك نقارن التوجهات بحسب جمهورك وقطاعك واستخداماتك الفعلية، ثم نوثّق اختياراتك المعتمدة.")}</p></div>
    <div className="gc-lab-grid"><div className="gc-lab-controls">
      <fieldset><legend>{t("1. Choose the colour direction", "1. اختر التوجه اللوني")}</legend><div className="gc-palette-buttons">{palettes.map((item, i) => <button key={item.name[0]} aria-pressed={palette === i} onClick={() => setPalette(i)}><span className="gc-mini-swatches" aria-hidden="true">{item.colours.map(c => <i key={c} style={{ background: c }} />)}</span><span>{item.name[ar ? 1 : 0]}</span></button>)}</div><p>{p.note[ar ? 1 : 0]} {t("We check contrast, small-size legibility and light/dark applications before approval.", "نراجع التباين والوضوح بالأحجام الصغيرة وعلى الخلفيات الفاتحة والغامقة قبل الاعتماد.")}</p></fieldset>
      <fieldset><legend>{t("2. Compare Arabic & English type", "2. قارن الخط العربي والإنجليزي")}</legend><div className="gc-font-buttons">{fontPairs.map((pair,i) => <button key={pair.names} aria-pressed={font === i} onClick={() => setFont(i)}><b>{pair.name[ar ? 1 : 0]}</b><span dir="ltr">{pair.names}</span></button>)}</div><p>{t("We agree heading and body fonts, weights and spacing, then check Arabic and English together. Font licensing is confirmed for the intended use.", "نتفق على خطوط العناوين والنصوص وأوزانها ومسافاتها، ونراجع العربية والإنجليزية معاً، ونتأكد من الترخيص للاستخدام المطلوب.")}</p></fieldset>
    </div><div className="gc-brand-preview" aria-live="polite"><div className="gc-preview-choice">{p.name[ar ? 1 : 0]} · <span dir="ltr">{fontPairs[font].names}</span></div><div className="gc-preview-brandline" dir="ltr"><span>SAC / BRAND PREVIEW</span><span>0{palette + 1}</span></div><div className={`gc-live-wordmark gc-live-wordmark-${logo}`} dir="ltr">{logo === 0 && <SacMark />}<div><strong>SAC{logo === 1 && <span>.</span>}</strong><small>LOGISTICS</small></div></div><div className="gc-type-specimen"><h4 style={{fontFamily:fontPairs[font].ar}} lang="ar" dir="rtl">نحرّك أعمالك إلى الأمام.</h4><h4 style={{fontFamily:fontPairs[font].en}} lang="en" dir="ltr">Moving your business forward.</h4><p style={{fontFamily:fontPairs[font].ar}} lang="ar" dir="rtl">حلول المعدات والنقل والدعم التشغيلي.</p><p style={{fontFamily:fontPairs[font].en}} lang="en" dir="ltr">Equipment, transport and operational support.</p></div><div className="gc-colour-tokens">{p.colours.map((c,i) => <div key={c}><i style={{background:c}} /><code>{c}</code><span>{[t("Base", "أساسي"),t("Accent", "إبراز"),t("Secondary", "مساند"),t("Text", "نصوص")][i]}</span></div>)}</div></div></div>
    <fieldset className="gc-logo-field"><legend>{t("3. Compare different logo approaches", "3. قارن أساليب مختلفة للشعار")}</legend><div className="gc-logo-options">{names.map((name,i) => <button key={name} className={`gc-logo-option gc-logo-option-${i}`} aria-pressed={logo===i} onClick={()=>setLogo(i)}><span className="gc-logo-sample" dir="ltr">{i===0 && <SacMark />}<span><strong>SAC{i===1&&<i>.</i>}</strong><small>LOGISTICS</small></span></span><b>{name}</b><span>{logo===i?t("In the preview ✓", "ظاهر في المعاينة ✓"):t("Preview this approach", "عاين هذا الأسلوب")}</span></button>)}</div></fieldset>
    <p className="gc-note">{t("The first option uses the existing SAC symbol; the other two are illustrative wordmark studies, not final commissioned logos. These local choices are not saved or sent. The selected palette updates the symbol and its applications; the selected fonts update the Arabic and English preview.", "الخيار الأول يستخدم رمز SAC الحالي؛ والآخران دراستان توضيحيتان لشعار كتابي، وليسا شعارات نهائية معتمدة. الاختيارات هنا محلية ولا تُحفظ أو تُرسل. تُطبّق الألوان المختارة على الرمز وتطبيقاته، والخطوط على المعاينة العربية والإنجليزية.")}</p>
  </div>;
}

const timelineInputs = [
  ["Company brief, agreed scope and payment confirmation.", "موجز الشركة، النطاق المتفق عليه وتأكيد الدفع."],
  ["Company name, audience and visual references.", "اسم الشركة والجمهور والمراجع البصرية."],
  ["Review the three concepts and gather your team's comments.", "مراجعة الأفكار الثلاثة وتجميع ملاحظات فريقك."],
  ["One selected direction and consolidated refinements.", "توجه واحد مختار وملاحظات تنقيح موحّدة."],
  ["Approved logo, colours, typography and page structure.", "الشعار والألوان والخطوط المعتمدة وهيكل الصفحات."],
  ["Company copy, services, images, projects and contact details.", "نصوص الشركة والخدمات والصور والمشاريع وبيانات التواصل."],
  ["One approved website concept and complete final content.", "نموذج موقع واحد معتمد ومحتوى نهائي مكتمل."],
  ["Approved identity and the website's company information.", "الهوية المعتمدة ومعلومات الشركة المستخدمة في الموقع."],
  ["Selected profile layout, company history, credentials and project facts.", "تصميم البروفايل المختار وتاريخ الشركة والمؤهلات وحقائق المشاريع."],
  ["Approved profile layout and verified company information.", "تصميم البروفايل المعتمد ومعلومات الشركة المدققة."],
  ["Staff names, email addresses and authorised business details.", "أسماء الموظفين وعناوين البريد وبيانات الأعمال المعتمدة."],
  ["Consolidated final review and written client approval.", "مراجعة نهائية موحّدة واعتماد العميل الكتابي."],
];
export function VisualTimeline({ ar, rows }: { ar: boolean; rows: string[][] }) {
  const [selected, setSelected] = useState(0);
  const t = (en: string, arabic: string) => ar ? arabic : en;
  const row = rows[selected];
  const owner = (i: number) => [2,5,8].includes(i) ? "client" : [0,3,11].includes(i) ? "joint" : "masar";
  const ownerName = (i: number) => owner(i) === "client" ? t("Client", "العميل") : owner(i) === "joint" ? t("Together", "معاً") : t("MASAR", "مسار");
  const phase = selected <= 3 ? "identity" : selected <= 6 ? "website" : selected <= 9 ? "profile" : "handover";
  const preview = phase === "identity" ? "preview-3.webp" : phase === "website" ? "preview-6.webp" : "profile-1.webp";
  return <div className="gc-timeline">
    <div className="gc-timeline-heading"><h3>{t("Explore your next step.", "استكشف خطوتك التالية.")}</h3><p>{t("Choose a stage or a day to see the inputs, responsibility and outcome. This is a proposed plan, not live project progress.", "اختر مرحلة أو يوماً لتشوف المدخلات والمسؤول والمخرج. هذه خطة مقترحة، وليست متابعة لمشروع جارٍ.")}</p></div>
    <div className="gc-explore-controls"><label htmlFor="gc-stage-select">{t("Explore stage", "استكشف المرحلة")}</label><select id="gc-stage-select" value={selected} onChange={e=>setSelected(Number(e.target.value))}>{rows.map((r,i)=><option key={r[0]} value={i}>{r[0]} · {r[ar?2:1]}</option>)}</select><div><button type="button" disabled={selected===0} onClick={()=>setSelected(s=>s-1)}>{t("Previous", "السابقة")}</button><button type="button" disabled={selected===rows.length-1} onClick={()=>setSelected(s=>s+1)}>{t("Next", "التالية")}</button></div></div>
    <div className="gc-stage-detail" id="gc-stage-detail" aria-live="polite" aria-atomic="true">
      <div className="gc-stage-copy" key={selected}><div className="gc-stage-tags"><span>{t("DAY", "اليوم")} <b dir="ltr">{row[0]}</b></span><span className={owner(selected)}>{ownerName(selected)}</span><span>{selected+1} / {rows.length}</span></div><h4>{row[ar?2:1]}</h4><dl><div><dt>{t("What we need", "المدخلات المطلوبة")}</dt><dd>{timelineInputs[selected][ar?1:0]}</dd></div><div><dt>{t("What happens / outcome", "ما يتم / المخرج")}</dt><dd>{row[ar?4:3]}</dd></div></dl><a href={`#${phase}`}>{t("Explore this part of the journey", "استعرض هذا الجزء من الرحلة")} ↗</a></div>
      <div className="gc-stage-visual">{phase!=="handover" ? <img src={`/images/grow-case/${preview}`} alt={t("Illustrative design reference for this stage", "مرجع تصميم توضيحي لهذه المرحلة")} loading="lazy" width="800" height="550" /> : <div className="gc-stage-delivery-art" aria-hidden="true"><span>GROW</span><b>01 / BRAND</b><b>02 / WEBSITE</b><b>03 / PROFILE</b><b>04 / DOCUMENTS</b></div>}<span>{t("ILLUSTRATIVE PREVIEW", "معاينة توضيحية")}</span></div>
    </div>
    <div className="gc-timeline-legend"><span><i className="masar" />{t("MASAR", "مسار")}</span><span><i className="client" />{t("Client", "العميل")}</span><span><i className="joint" />{t("Joint approval", "اعتماد مشترك")}</span></div>
    <div className="gc-timeline-scroll" role="region" aria-label={t("Interactive working-day timeline; scroll horizontally", "برنامج أيام العمل التفاعلي؛ قابل للتمرير أفقياً")} tabIndex={0}><div className="gc-gantt" dir="ltr"><div className="gc-gantt-axis"><span>{t("STAGE / DAY", "المرحلة / اليوم")}</span><div>{Array.from({length:22},(_,i)=>{const stage=rows.findIndex(r=>{const [a,b]=r[0].split("–").map(Number);return i+1>=a&&i+1<=(b||a)});return <button type="button" key={i} aria-label={`${t("Day", "اليوم")} ${i+1} · ${rows[stage][ar?2:1]}`} aria-pressed={selected===stage} aria-controls="gc-stage-detail" onClick={()=>setSelected(stage)}>{i+1}</button>})}</div></div>{rows.map((r,i)=>{const [start,end]=r[0].split("–").map(Number);const duration=(end||start)-start+1;return <div className={`gc-gantt-row ${selected===i?"gc-active-stage":""}`} key={r[0]}><button type="button" className="gc-stage-label" dir={ar?"rtl":"ltr"} aria-pressed={selected===i} aria-controls="gc-stage-detail" onClick={()=>setSelected(i)}>{r[ar?2:1]}</button><div className="gc-gantt-track"><button type="button" className={`gc-gantt-bar ${owner(i)}`} style={{gridColumn:`${start} / span ${duration}`}} aria-label={`${r[0]} · ${r[ar?2:1]}`} aria-pressed={selected===i} aria-controls="gc-stage-detail" onClick={()=>setSelected(i)}><b>{duration>1?r[0]:"◆"}</b></button></div></div>})}</div></div>
    <p className="gc-note">{t("Each column is one working day, from left to right. Dependent dates move if content or approval is delayed.", "كل عمود يوم عمل، من اليسار إلى اليمين. تتغير المواعيد التابعة إذا تأخر المحتوى أو الاعتماد.")}</p>
  </div>;
}
