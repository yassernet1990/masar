import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Inquiry = {
  id: string;
  company: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const dataDirectory = () => process.env.MASAR_DATA_DIR || path.join(process.cwd(), "data");
const inquiriesFile = () => path.join(dataDirectory(), "contact-submissions.json");
const recentSubmissions = new Map<string, number>();

async function verifySignature(message: string, value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  const bytes = Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0));
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

async function loadInquiries(): Promise<Inquiry[]> {
  try {
    return JSON.parse(await readFile(inquiriesFile(), "utf8")) as Inquiry[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function saveInquiries(inquiries: Inquiry[]) {
  const directory = dataDirectory();
  const target = inquiriesFile();
  const temporary = `${target}.${process.pid}.tmp`;
  await mkdir(directory, { recursive: true });
  await writeFile(temporary, JSON.stringify(inquiries, null, 2), "utf8");
  await rename(temporary, target);
}

export async function GET(request: Request) {
  if (!(await authorized(request))) return Response.json({ ok: false }, { status: 401 });
  try {
    const inquiries = await loadInquiries();
    return Response.json({ ok: true, inquiries: inquiries.slice().reverse() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false, message: "تعذر تحميل طلبات التواصل" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Partial<Inquiry> & { website?: string } | null;
  if (!body || body.website) return Response.json({ ok: true });

  const company = String(body.company || "").trim().slice(0, 120);
  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 180);
  const message = String(body.message || "").trim().slice(0, 3000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, message: "يرجى إدخال الاسم والبريد والطلب بشكل صحيح" }, { status: 400 });
  }

  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const lastSubmission = recentSubmissions.get(client) || 0;
  if (Date.now() - lastSubmission < 30_000) {
    return Response.json({ ok: false, message: "يرجى الانتظار قليلًا قبل إرسال طلب آخر" }, { status: 429 });
  }

  try {
    const inquiries = await loadInquiries();
    inquiries.push({ id: crypto.randomUUID(), company, name, email, message, createdAt: new Date().toISOString() });
    await saveInquiries(inquiries.slice(-500));
    recentSubmissions.set(client, Date.now());
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ ok: false, message: "تعذر إرسال الطلب حاليًا" }, { status: 500 });
  }
}
