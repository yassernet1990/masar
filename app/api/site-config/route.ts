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
      "مسار لحلول المشتريات شركة متخصصة في الاستشارات، التوريد الاستراتيجي، إدارة الموردين، تأسيس الأعمال، بناء الأنظمة التشغيلية، وتطوير الهوية والحضور في السوق. نعمل كامتداد لفريقك لنحمي التكلفة والجودة والوقت.",
    services: [
      [
        "03",
        "تأسيس الأعمال والأنظمة التشغيلية",
        "نموذج العمل، تصميم الخدمات، الهيكل التنظيمي، الوصف الوظيفي، السياسات والإجراءات والنماذج.",
        "/images/operations-systems.webp",
      ],
      [
        "04",
        "الهوية والحضور في السوق",
        "الاسم والهوية البصرية، الملف التعريفي، الموقع، لينكدإن وأصول الإطلاق التسويقي.",
        "/images/brand-presence.webp",
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
      "Masar Procurement Solutions specializes in consulting, strategic sourcing, vendor management, business setup, operational systems, and brand and market presence. We work as an extension of your team to protect cost, quality and time.",
    services: [
      [
        "03",
        "Business setup & operational systems",
        "Business models, service design, organization structures, job descriptions, policies, procedures and templates.",
        "/images/operations-systems.webp",
      ],
      [
        "04",
        "Brand identity & market presence",
        "Naming, visual identity, company profiles, websites, LinkedIn and launch-ready marketing assets.",
        "/images/brand-presence.webp",
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

  if (isRecord(media) && Array.isArray(media.services)) {
    if (
      media.services[2] === "/images/trade.webp" ||
      media.services[2] === "/images/cx-method.png"
    ) {
      media.services[2] = "/images/operations-systems.webp";
    }
    if (
      media.services[3] === "/images/warehouse.webp" ||
      media.services[3] === "/images/cx-network.png"
    ) {
      media.services[3] = "/images/brand-presence.webp";
    }
  }

  if (!isRecord(content)) return next;

  (["ar", "en"] as const).forEach((lang) => {
    const savedLang = content[lang];
    if (!isRecord(savedLang)) return;
    const current = currentServiceContent[lang];

    if (includesLegacyServiceText(savedLang.introText))
      savedLang.introText = current.introText;

    if (Array.isArray(savedLang.services)) {
      savedLang.services[2] = current.services[0];
      savedLang.services[3] = current.services[1];
    }

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
