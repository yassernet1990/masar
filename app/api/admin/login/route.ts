const encoder = new TextEncoder();
const expectedEmail = "yasser.sr1990@gmail.com";

export const runtime = "nodejs";

async function signature(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(signed))).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string };
  const adminPassword = process.env.MASAR_ADMIN_PASSWORD || "";
  if (body.email?.toLowerCase() !== expectedEmail || !adminPassword || body.password !== adminPassword) {
    return Response.json({ ok: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }
  const expires = Date.now() + 1000 * 60 * 60 * 8;
  const encodedEmail = btoa(expectedEmail).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  const token = `${encodedEmail}.${expires}`;
  const sig = await signature(token, adminPassword);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return Response.json({ ok: true }, { headers: { "Set-Cookie": `masar_admin=${token}.${sig}; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=28800` } });
}
