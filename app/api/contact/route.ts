import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendContactEmail(inquiry: Inquiry) {
  const host = process.env.SMTP_HOST || "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = (process.env.SMTP_SECURE || "true").toLowerCase() === "true";
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const recipient = process.env.CONTACT_TO || "info@masarps.com";
  if (!user || !password) throw new Error("SMTP is not configured");

  const safeName = inquiry.name.replace(/[\r\n]+/g, " ");
  const rows = [
    ["Name", inquiry.name],
    ["Company", inquiry.company || "Not provided"],
    ["Email", inquiry.email],
    ["Submitted", new Date(inquiry.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Riyadh" })],
  ];

  const message = {
    from: `"MASAR Website" <${user}>`,
    to: recipient,
    // Keep all email routing on the authenticated mailbox. Visitor email is content only.
    replyTo: user,
    envelope: { from: user, to: [recipient] },
    subject: `[MASAR-${inquiry.id.slice(0, 8).toUpperCase()}] New website inquiry from ${safeName}`,
    text: `Reference: ${inquiry.id}\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nMessage:\n${inquiry.message}`,
    html: `<div style="font-family:Arial,sans-serif;color:#101827;line-height:1.6;max-width:640px">
      <h2 style="color:#071bda">New website inquiry</h2>
      <p><strong>Reference:</strong> ${inquiry.id}</p>
      <table style="width:100%;border-collapse:collapse">${rows.map(([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #dce3e8;font-weight:700">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #dce3e8">${escapeHtml(value)}</td></tr>`
      ).join("")}</table>
      <h3 style="margin-top:24px">Message</h3>
      <p style="white-space:pre-wrap;background:#f4f7f9;padding:16px">${escapeHtml(inquiry.message)}</p>
    </div>`,
  };
  const attempts = [{ port, secure }];
  if (host === "smtp.hostinger.com" && port !== 587) attempts.push({ port: 587, secure: false });

  let lastError: unknown;
  for (const attempt of attempts) {
    const transporter = nodemailer.createTransport({
      host,
      port: attempt.port,
      secure: attempt.secure,
      requireTLS: !attempt.secure,
      auth: { user, pass: password },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
    try {
      const result = await transporter.sendMail(message);
      const accepted = Array.isArray(result.accepted) ? result.accepted.map(String) : [];
      if (!accepted.some((address) => address.toLowerCase().includes(recipient.toLowerCase()))) {
        throw Object.assign(new Error("SMTP did not accept the recipient"), { code: "ERECIPIENT" });
      }
      console.info("Contact email accepted", { reference: inquiry.id, messageId: result.messageId });
      return result.messageId;
    } catch (error) {
      lastError = error;
      const smtpError = error as { code?: string; command?: string; responseCode?: number };
      console.error("Contact SMTP attempt failed", {
        port: attempt.port,
        secure: attempt.secure,
        code: smtpError.code,
        command: smtpError.command,
        responseCode: smtpError.responseCode,
      });
    }
  }
  throw lastError;
}

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
  const body = await request.json().catch(() => null) as Partial<Inquiry> | null;
  if (!body) return Response.json({ ok: false, message: "طلب غير صالح" }, { status: 400 });

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
    const inquiry = { id: crypto.randomUUID(), company, name, email, message, createdAt: new Date().toISOString() };
    await sendContactEmail(inquiry);
    try {
      const inquiries = await loadInquiries();
      inquiries.push(inquiry);
      await saveInquiries(inquiries.slice(-500));
    } catch {
      // Email delivery is authoritative; local inquiry storage is best-effort on serverless hosting.
    }
    recentSubmissions.set(client, Date.now());
    return Response.json({ ok: true, reference: inquiry.id.slice(0, 8).toUpperCase() }, { status: 201 });
  } catch {
    return Response.json({ ok: false, message: "تعذر إرسال الطلب حاليًا" }, { status: 500 });
  }
}
