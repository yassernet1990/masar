const runtimeEnv = () => (globalThis as unknown as { __masarEnv?: Record<string, unknown> }).__masarEnv || {};
async function verifySignature(message: string, value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  const bytes = Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0));
  return crypto.subtle.verify("HMAC", key, bytes, encoder.encode(message));
}

async function authorized(request: Request) {
  const secret = String(runtimeEnv().MASAR_ADMIN_PASSWORD || "");
  const cookie = request.headers.get("Cookie")?.match(/(?:^|; )masar_admin=([^;]+)/)?.[1];
  if (!secret || !cookie) return false;
  const parts = cookie.split(".");
  const encodedEmail = btoa("yasser.sr1990@gmail.com").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  if (parts.length !== 3 || parts[0] !== encodedEmail || Number(parts[1]) < Date.now()) return false;
  const raw = `${parts[0]}.${parts[1]}`;
  const valid = await verifySignature(raw, parts[2], secret);
  if (!valid) return false;
  return raw;
}

export async function GET() {
  const db = runtimeEnv().DB as D1Database | undefined;
  if (!db) return Response.json({ ok: true, config: null });
  await db.prepare("CREATE TABLE IF NOT EXISTS site_settings (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)").run();
  const row = await db.prepare("SELECT payload, updated_at FROM site_settings WHERE id = ?1").bind("main").first<{ payload: string; updated_at: number }>();
  return Response.json({ ok: true, config: row ? JSON.parse(row.payload) : null, updatedAt: row?.updated_at || null });
}

export async function PUT(request: Request) {
  if (!(await authorized(request))) return Response.json({ ok: false }, { status: 401 });
  const body = await request.json().catch(() => null) as { config?: unknown } | null;
  if (!body?.config) return Response.json({ ok: false, message: "بيانات غير صالحة" }, { status: 400 });
  const db = runtimeEnv().DB as D1Database | undefined;
  if (!db) return Response.json({ ok: false, message: "قاعدة الحفظ غير متاحة بعد" }, { status: 503 });
  const now = Date.now();
  await db.prepare("CREATE TABLE IF NOT EXISTS site_settings (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)").run();
  await db.prepare("INSERT INTO site_settings (id, payload, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at").bind("main", JSON.stringify(body.config), now).run();
  return Response.json({ ok: true, updatedAt: now });
}
