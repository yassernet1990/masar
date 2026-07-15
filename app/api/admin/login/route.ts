const encoder = new TextEncoder();
const expectedEmail = "yasser.sr1990@gmail.com";

async function signature(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(signed))).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string };
  const adminPassword = ((globalThis as unknown as { __masarEnv?: Record<string, string | undefined> }).__masarEnv?.MASAR_ADMIN_PASSWORD) || "";
  if (body.email?.toLowerCase() !== expectedEmail || !adminPassword || body.password !== adminPassword) {
    return Response.json({ ok: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }
  const expires = Date.now() + 1000 * 60 * 60 * 8;
  const encodedEmail = btoa(expectedEmail).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  const token = `${encodedEmail}.${expires}`;
  const sig = await signature(token, adminPassword);
  return Response.json({ ok: true }, { headers: { "Set-Cookie": `masar_admin=${token}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800` } });
}
