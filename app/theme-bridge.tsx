"use client";

import { useEffect } from "react";

const THEME_KEY = "amaala";

type HeroCopy = {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  tagline: string;
  intro: string;
  cta: string;
};

type HeroV16 = { en: HeroCopy; ar: HeroCopy };

type SiteConfigLike = Record<string, unknown> & {
  theme?: string;
  heroV16?: HeroV16;
};

const heroDefaults: HeroV16 = {
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

let currentConfig: SiteConfigLike = {};

function heroConfig(config: SiteConfigLike, lang: "en" | "ar") {
  return config.heroV16?.[lang] || heroDefaults[lang];
}

function pageLang(): "en" | "ar" {
  const page = document.querySelector<HTMLElement>(".cx-page");
  if (page?.classList.contains("ar") || page?.dir === "rtl") return "ar";
  return "en";
}

function applyTheme(theme?: string) {
  const enabled = theme === THEME_KEY;
  document.body.dataset.masarTheme = enabled ? THEME_KEY : theme || "masar";
  const page = document.querySelector<HTMLElement>(".cx-page");
  if (!page) return;
  page.classList.toggle("theme-amaala", enabled);
}

async function readConfig() {
  const response = await fetch("/api/site-config", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to read site configuration");
  return response.json();
}

async function writeConfig(config: SiteConfigLike) {
  const response = await fetch("/api/site-config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config }),
  });
  if (!response.ok) throw new Error("Unable to save site configuration");
  return response.json().catch(() => ({}));
}

async function activateAmaala() {
  const result = await readConfig();
  const config = { ...(result.config || {}), theme: THEME_KEY };
  await writeConfig(config);
  applyTheme(THEME_KEY);
  window.location.reload();
}

function injectAdminOption() {
  const grid = document.querySelector<HTMLElement>(".theme-grid");
  if (!grid || grid.querySelector('[data-theme-option="amaala"]')) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = `theme-option ${document.body.dataset.masarTheme === THEME_KEY ? "selected" : ""}`;
  button.dataset.themeOption = THEME_KEY;
  button.innerHTML = `
    <span class="theme-preview preview-amaala"><i></i><i></i><i></i></span>
    <b>Amaala Light</b>
    <span class="theme-identity">Coastal Editorial</span>
    <small>هوية فاتحة هادئة مستوحاة من الفخامة الساحلية والتحريرية</small>
    ${document.body.dataset.masarTheme === THEME_KEY ? "<em>مفعّل</em>" : ""}
  `;
  button.addEventListener("click", async () => {
    button.setAttribute("disabled", "true");
    try {
      await activateAmaala();
    } catch {
      button.removeAttribute("disabled");
      window.alert("تعذر حفظ الثيم. تأكد من تسجيل الدخول ثم حاول مجددًا.");
    }
  });
  grid.appendChild(button);
}

function ensureHeroAtmosphere() {
  const hero = document.querySelector<HTMLElement>(
    ".cx-page.theme-masar.home-page .cx-hero",
  );
  if (!hero) return;

  if (!hero.querySelector(".masar-clouds-v16")) {
    const clouds = document.createElement("div");
    clouds.className = "masar-clouds-v16";
    clouds.setAttribute("aria-hidden", "true");
    clouds.innerHTML = "<i></i><i></i><i></i>";
    hero.appendChild(clouds);
  }

  if (!hero.querySelector(".masar-routes-v16")) {
    const routes = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    routes.setAttribute("class", "masar-routes-v16");
    routes.setAttribute("viewBox", "0 0 1600 900");
    routes.setAttribute("preserveAspectRatio", "none");
    routes.setAttribute("aria-hidden", "true");
    routes.innerHTML = `
      <defs>
        <linearGradient id="masarRouteGradientV16" x1="0" x2="1">
          <stop offset="0%" stop-color="#67a9ff" stop-opacity="0" />
          <stop offset="25%" stop-color="#67a9ff" stop-opacity=".68" />
          <stop offset="70%" stop-color="#58e0ff" stop-opacity=".92" />
          <stop offset="100%" stop-color="#68a8ff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path class="route" d="M790 470 C 900 300, 1085 242, 1290 286" />
      <path class="route soft" d="M828 462 C 988 390, 1188 390, 1470 460" />
      <path class="route" d="M860 438 C 1035 215, 1278 148, 1538 208" />
      <path class="route soft" d="M815 488 C 1012 560, 1248 602, 1512 548" />
      <path class="route" d="M915 388 C 1100 352, 1288 362, 1458 305" />
    `;
    hero.appendChild(routes);
  }
}

function applyHeroCopy() {
  const page = document.querySelector<HTMLElement>(
    ".cx-page.theme-masar.home-page",
  );
  if (!page) return;
  const copy = page.querySelector<HTMLElement>(".hero-copy");
  if (!copy) return;

  const lang = pageLang();
  const value = heroConfig(currentConfig, lang);
  const signature = JSON.stringify(value);
  if (copy.dataset.heroV16 === signature) return;

  let eyebrow = copy.querySelector<HTMLElement>(".hero-v16-eyebrow");
  if (!eyebrow) {
    eyebrow = document.createElement("div");
    eyebrow.className = "hero-v16-eyebrow";
    copy.prepend(eyebrow);
  }
  eyebrow.textContent = value.eyebrow;

  const h1 = copy.querySelector<HTMLHeadingElement>("h1");
  if (h1) {
    h1.innerHTML = `
      <span class="hero-v16-title-top"></span>
      <strong class="hero-v16-accent"></strong>
    `;
    const top = h1.querySelector<HTMLElement>(".hero-v16-title-top");
    const accent = h1.querySelector<HTMLElement>(".hero-v16-accent");
    if (top) top.textContent = value.titleTop;
    if (accent) {
      accent.textContent = value.titleAccent;
      accent.dataset.text = value.titleAccent;
    }
  }

  const text = copy.querySelector<HTMLParagraphElement>("p");
  if (text) {
    text.innerHTML = "";
    const tagline = document.createElement("span");
    tagline.className = "hero-v16-tagline";
    tagline.textContent = value.tagline;
    const intro = document.createElement("span");
    intro.className = "hero-v16-intro";
    intro.textContent = value.intro;
    text.append(tagline, intro);
  }

  const cta = copy.querySelector<HTMLButtonElement>(".cx-button");
  if (cta) cta.textContent = `${value.cta}  →`;
  copy.dataset.heroV16 = signature;
}

function adminLanguage(): "en" | "ar" {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".language-switch button"),
  );
  const active = buttons.find((button) => button.classList.contains("active"));
  return active?.textContent?.toLowerCase().includes("english") ? "en" : "ar";
}

function heroSectionIsOpen() {
  const active = document.querySelector<HTMLButtonElement>(".section-list button.active");
  return active?.textContent?.includes("الغلاف") ?? false;
}

function field(label: string, key: keyof HeroCopy, value: string, multiline = false) {
  const escaped = value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  if (multiline)
    return `<label class="hero-v16-admin-field"><span>${label}</span><textarea data-hero-v16-key="${key}" rows="3">${escaped}</textarea></label>`;
  return `<label class="hero-v16-admin-field"><span>${label}</span><input data-hero-v16-key="${key}" value="${escaped}" /></label>`;
}

function injectHeroAdminEditor() {
  const editor = document.querySelector<HTMLElement>(".section-editor");
  const existing = document.querySelector<HTMLElement>(".hero-v16-admin");
  if (!editor || !heroSectionIsOpen()) {
    existing?.remove();
    return;
  }

  const lang = adminLanguage();
  if (existing?.dataset.lang === lang) return;
  existing?.remove();

  const value = heroConfig(currentConfig, lang);
  const panel = document.createElement("section");
  panel.className = "hero-v16-admin admin-card";
  panel.dataset.lang = lang;
  panel.innerHTML = `
    <div class="hero-v16-admin-head">
      <div>
        <span>MASAR V16 / HERO CONTENT</span>
        <h3>${lang === "ar" ? "محتوى الواجهة الجديدة" : "New hero content"}</h3>
      </div>
      <b>${lang === "ar" ? "مرتبط مباشرة بالواجهة" : "Live hero settings"}</b>
    </div>
    <div class="hero-v16-admin-grid">
      ${field(lang === "ar" ? "النص الصغير أعلى العنوان" : "Eyebrow", "eyebrow", value.eyebrow)}
      ${field(lang === "ar" ? "السطر الأول من العنوان" : "Title — first line", "titleTop", value.titleTop)}
      ${field(lang === "ar" ? "السطر اللامع" : "Shimmer line", "titleAccent", value.titleAccent)}
      ${field(lang === "ar" ? "الركائز" : "Pillars / tagline", "tagline", value.tagline)}
      ${field(lang === "ar" ? "النص التعريفي" : "Intro copy", "intro", value.intro, true)}
      ${field(lang === "ar" ? "زر الدعوة" : "CTA", "cta", value.cta)}
    </div>
    <div class="hero-v16-admin-actions">
      <span class="hero-v16-admin-status"></span>
      <button type="button" class="admin-primary hero-v16-save">${lang === "ar" ? "حفظ واجهة V16" : "Save V16 hero"}</button>
    </div>
  `;

  const toolbar = editor.querySelector(".content-toolbar");
  if (toolbar?.nextSibling) editor.insertBefore(panel, toolbar.nextSibling);
  else editor.appendChild(panel);

  panel.querySelector<HTMLButtonElement>(".hero-v16-save")?.addEventListener("click", async () => {
    const status = panel.querySelector<HTMLElement>(".hero-v16-admin-status");
    const save = panel.querySelector<HTMLButtonElement>(".hero-v16-save");
    const next = { ...currentConfig } as SiteConfigLike;
    const nextHero: HeroV16 = {
      en: { ...(currentConfig.heroV16?.en || heroDefaults.en) },
      ar: { ...(currentConfig.heroV16?.ar || heroDefaults.ar) },
    };
    const values = { ...nextHero[lang] };
    panel.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-hero-v16-key]").forEach((input) => {
      const key = input.dataset.heroV16Key as keyof HeroCopy;
      values[key] = input.value.trim();
    });
    nextHero[lang] = values;
    next.heroV16 = nextHero;
    if (status) status.textContent = lang === "ar" ? "جارٍ الحفظ..." : "Saving...";
    if (save) save.disabled = true;
    try {
      await writeConfig(next);
      currentConfig = next;
      if (status) status.textContent = lang === "ar" ? "✓ تم الحفظ والنشر" : "✓ Saved and published";
      applyHeroCopy();
    } catch {
      if (status) status.textContent = lang === "ar" ? "تعذر الحفظ" : "Unable to save";
    } finally {
      if (save) save.disabled = false;
    }
  });
}

function enhanceMasar() {
  ensureHeroAtmosphere();
  applyHeroCopy();
  injectAdminOption();
  injectHeroAdminEditor();
}

export default function ThemeBridge() {
  useEffect(() => {
    let stopped = false;
    readConfig()
      .then((result) => {
        if (stopped) return;
        currentConfig = (result.config || {}) as SiteConfigLike;
        applyTheme(currentConfig.theme);
        enhanceMasar();
      })
      .catch(() => {
        currentConfig = {};
        applyTheme("masar");
        enhanceMasar();
      });

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        injectAdminOption();
        if (document.body.dataset.masarTheme === THEME_KEY) applyTheme(THEME_KEY);
        enhanceMasar();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "dir"] });

    const onClick = () => setTimeout(enhanceMasar, 0);
    document.addEventListener("click", onClick);
    enhanceMasar();

    return () => {
      stopped = true;
      observer.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
