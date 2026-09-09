import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoredConfig = { config: unknown; updatedAt: number };

const dataDirectory = () => process.env.MASAR_DATA_DIR || path.join(process.cwd(), "data");
const dataFile = () => path.join(dataDirectory(), "site-config.json");
const currentServiceContent = {
  ar: {
    introText:
      "مسار شريك متكامل في المشتريات والتوريد الاستراتيجي وإدارة الموردين، والاستشارات التجارية والتعاقدية، وتأسيس الأعمال، وتطوير الهوية والحضور في السوق. نعمل كامتداد لفريقك لنحمي التكلفة والجودة والوقت.",
    services: [
      [
        "01",
        "المشتريات والتوريد الاستراتيجي وإدارة الموردين",
        "استشارات المشتريات المتكاملة، تحليل السوق، تأهيل الموردين، إدارة RFQ/RFP، التفاوض، قياس الأداء وتحسين الإجراءات.",
        "/images/sourcing.webp",
      ],
      [
        "02",
        "تأسيس الأعمال والأنظمة التشغيلية",
        "نموذج العمل، تصميم الخدمات، الهيكل التنظيمي، الوصف الوظيفي، السياسات والإجراءات والنماذج.",
        "/images/operations-systems.webp",
      ],
      [
        "03",
        "الهوية والحضور في السوق",
        "الاسم والهوية البصرية، الملف التعريفي، الموقع، لينكدإن وأصول الإطلاق التسويقي.",
        "/images/brand-presence.webp",
      ],
      [
        "04",
        "الاستشارات التجارية والتعاقدية",
        "مراجعة العقود والمخاطر، تقييم الأوامر التغييرية، استراتيجية المطالبات، والضبط التجاري.",
        "/images/cx-method.png",
      ],
    ],
    faqs: [
      [
        "هل تعملون مع موردين خارج السعودية؟",
        "نعم، نربط عملاءنا بموردين محليين وإقليميين ودوليين وندعم دراسة الأسواق وتأهيل الخيارات المناسبة.",
      ],
      [
        "هل يمكن طلب خدمة واحدة فقط؟",
        "نعم. يمكننا تنفيذ دراسة سوق أو RFQ/RFP أو تفاوض عقد، أو تطوير خدمة تأسيس أو هوية محددة.",
      ],
    ],
  },
  en: {
    introText:
      "MASAR integrates procurement, strategic sourcing and vendor management with commercial and contracts advisory, business setup, operational systems, and brand and market presence. We work as an extension of your team to protect cost, quality and time.",
    services: [
      [
        "01",
        "Procurement, strategic sourcing & vendor management",
        "End-to-end procurement advisory, market analysis, supplier qualification, RFQ/RFP management, negotiation, performance and process optimization.",
        "/images/sourcing.webp",
      ],
      [
        "02",
        "Business setup & operational systems",
        "Business models, service design, organization structures, job descriptions, policies, procedures and templates.",
        "/images/operations-systems.webp",
      ],
      [
        "03",
        "Brand identity & market presence",
        "Naming, visual identity, company profiles, websites, LinkedIn and launch-ready marketing assets.",
        "/images/brand-presence.webp",
      ],
      [
        "04",
        "Commercial & contracts advisory",
        "Contract and risk reviews, variation assessments, claims strategy and commercial controls.",
        "/images/cx-method.png",
      ],
    ],
    faqs: [
      [
        "Do you source beyond Saudi Arabia?",
        "Yes, we connect clients with local, regional and international suppliers and support market research and supplier qualification.",
      ],
      [
        "Can we engage Masar for one service only?",
        "Yes. Engage us for a market study, RFQ/RFP, contract negotiation, or a specific business setup or brand deliverable.",
      ],
    ],
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function includesLegacyServiceText(value: unknown) {
  return (
    typeof value === "string" &&
    /trading|import|warehousing|delivery coordination|التجارة|الاستيراد|التخزين|المخزون|التسليم/i.test(
      value,
    )
  );
}

function sanitizeStoredConfig(config: unknown) {
  if (!isRecord(config)) return config;
  const next = structuredClone(config);
  const content = next.content;
  const media = next.media;

  if (isRecord(media) && Array.isArray(media.services)) media.services = currentServiceContent.en.services.map((service) => service[3]);

  if (!isRecord(content)) return next;

  (["ar", "en"] as const).forEach((lang) => {
    const savedLang = content[lang];
    if (!isRecord(savedLang)) return;
    const current = currentServiceContent[lang];

    if (includesLegacyServiceText(savedLang.introText))
      savedLang.introText = current.introText;

    if (Array.isArray(savedLang.services)) savedLang.services = current.services;

    if (Array.isArray(savedLang.faqs)) {
      savedLang.faqs = savedLang.faqs.map((item, index) => {
        if (!Array.isArray(item) || !includesLegacyServiceText(item[1]))
          return item;
        return current.faqs[index - 1] ?? item;
      });
    }
  });

  return next;
}

async function verifySignature(message: string, value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  const bytes = Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0));
  return crypto.subtle.verify("HMAC", key, bytes, encoder.encode(message));
}

async function authorized(request: Request) {
  const secret = process.env.MASAR_ADMIN_PASSWORD || "";
  const cookie = request.headers.get("Cookie")?.match(/(?:^|; )masar_admin=([^;]+)/)?.[1];
  if (!secret || !cookie) return false;
  const parts = cookie.split(".");
  const encodedEmail = btoa("yasser.sr1990@gmail.com").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  if (parts.length !== 3 || parts[0] !== encodedEmail || Number(parts[1]) < Date.now()) return false;
  return verifySignature(`${parts[0]}.${parts[1]}`, parts[2], secret);
}

async function loadStoredConfig(): Promise<StoredConfig | null> {
  try {
    return JSON.parse(await readFile(dataFile(), "utf8")) as StoredConfig;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return null;
    throw error;
  }
}

export async function GET() {
  try {
    const stored = await loadStoredConfig();
    return Response.json({ ok: true, config: stored?.config ? sanitizeStoredConfig(stored.config) : null, updatedAt: stored?.updatedAt ?? null }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false, message: "تعذر قراءة إعدادات الموقع" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await authorized(request))) return Response.json({ ok: false, message: "انتهت جلسة الدخول" }, { status: 401 });
  const body = await request.json().catch(() => null) as { config?: unknown } | null;
  if (!body?.config) return Response.json({ ok: false, message: "بيانات غير صالحة" }, { status: 400 });

  try {
    const updatedAt = Date.now();
    const directory = dataDirectory();
    const target = dataFile();
    const temporary = `${target}.${process.pid}.tmp`;
    await mkdir(directory, { recursive: true });
    await writeFile(temporary, JSON.stringify({ config: body.config, updatedAt }), "utf8");
    await rename(temporary, target);
    return Response.json({ ok: true, updatedAt });
  } catch {
    return Response.json({ ok: false, message: "تعذر حفظ التغييرات على الخادم" }, { status: 500 });
  }
}
