import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoredConfig = { config: unknown; updatedAt: number };

const dataDirectory = () => process.env.MASAR_DATA_DIR || path.join(process.cwd(), "data");
const dataFile = () => path.join(dataDirectory(), "site-config.json");

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
    return Response.json({ ok: true, config: stored?.config ?? null, updatedAt: stored?.updatedAt ?? null }, { headers: { "Cache-Control": "no-store" } });
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
