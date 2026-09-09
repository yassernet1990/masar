import { createHash } from "node:crypto";
import { advisoryPolicyVersion, advisoryServices, advisoryCatalogs, type ServiceKind } from "../../commerce/service-catalog";
import { origin, stripe } from "../../commerce/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const routes: Record<ServiceKind, string> = {
  business: "business-setup",
  procurement: "procurement",
  commercial: "commercial-contracts",
};

const sessionPattern = /^cs_(test_|live_)?[A-Za-z0-9_]+$/;

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("session_id");
  if (!id || !sessionPattern.test(id)) return Response.json({ paid: false }, { status: 400 });
  try {
    const session = await stripe().checkout.sessions.retrieve(id);
    return Response.json({
      paid: session.payment_status === "paid" && session.metadata?.catalog?.startsWith("masar_services_"),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ paid: false }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== origin()) return Response.json({ error: "Invalid origin" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (
    !body ||
    !Object.hasOwn(advisoryCatalogs, body.catalog) ||
    !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30 ||
    ![60, 100].includes(body.paymentPercent) ||
    !["ar", "en"].includes(body.lang) ||
    body.accepted !== true ||
    typeof body.email !== "string" || body.email.length > 180 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
    typeof body.name !== "string" || !body.name.trim() || body.name.length > 120 ||
    typeof body.company !== "string" || body.company.length > 120 ||
    typeof body.requestId !== "string" || !/^[a-f0-9-]{36}$/.test(body.requestId)
  ) return Response.json({ error: "Invalid order" }, { status: 400 });

  const ids = body.items.map((item: { id?: unknown }) => item?.id);
  if (ids.some((id: unknown) => typeof id !== "string") || new Set(ids).size !== ids.length)
    return Response.json({ error: "Invalid order" }, { status: 400 });

  const catalog = body.catalog as ServiceKind;
  const selected = body.items.map((submitted: { id: string; amount: unknown }) => {
    const item = advisoryServices.find((entry) => entry.id === submitted.id && entry.catalog === catalog);
    const amount = Number(submitted.amount);
    if (!item || !Number.isInteger(amount) || amount < item.min || amount > item.max || (item.min !== item.max && amount % 100 !== 0)) return null;
    return { ...item, amount };
  });
  if (selected.some((item: unknown) => !item)) return Response.json({ error: "A service amount is outside its allowed range." }, { status: 400 });

  const services = selected.filter(Boolean) as NonNullable<(typeof selected)[number]>[];
  const paymentPercent = body.paymentPercent as 60 | 100;
  const fullTotal = services.reduce((sum, item) => sum + item.amount, 0);
  const dueNow = Math.round((fullTotal * paymentPercent) / 100);
  const remaining = fullTotal - dueNow;
  const lang = body.lang as "ar" | "en";
  const metadata = {
    catalog: `masar_services_${catalog}_202609`,
    service_ids: services.map((item) => item.id).join(","),
    agreed_total_sar: String(fullTotal),
    payment_percent: String(paymentPercent),
    paid_now_sar: String(dueNow),
    remaining_sar: String(remaining),
    name: body.name.trim(),
    company: body.company.trim(),
    policy_version: advisoryPolicyVersion,
    payment_terms: paymentPercent === 100 ? "100% payment" : "60% initial payment; 40% upon completion",
  };

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      currency: "sar",
      customer_email: body.email,
      client_reference_id: body.requestId,
      integration_identifier: "masar_services_kqmtxjra",
      line_items: services.map((item) => ({
        quantity: 1,
        price_data: {
          currency: "sar",
          unit_amount: item.amount * paymentPercent,
          product_data: {
            name: item.name[lang],
            description: paymentPercent === 100
              ? (lang === "ar" ? "دفعة كاملة للخدمة المتفق عليها" : "Full payment for the agreed service")
              : (lang === "ar" ? "دفعة أولى 60% للخدمة المتفق عليها" : "60% initial payment for the agreed service"),
            metadata: { masar_service_id: item.id, agreed_fee_sar: String(item.amount) },
          },
        },
      })),
      success_url: `${origin()}/services/${routes[catalog]}?lang=${lang}&checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin()}/services/${routes[catalog]}?lang=${lang}&checkout=cancelled`,
      metadata,
      payment_intent_data: { metadata },
      invoice_creation: { enabled: true, invoice_data: { metadata } },
      managed_payments: { enabled: false },
      adaptive_pricing: { enabled: false },
      custom_text: { submit: { message: paymentPercent === 100
        ? (lang === "ar" ? "دفعة كاملة مقابل الخدمات المختارة." : "Full payment for the selected services.")
        : (lang === "ar" ? "دفعة أولى 60%. يستحق الرصيد المتبقي 40% عند الإنجاز." : "60% initial payment. The remaining 40% is due upon completion.") } },
    }, {
      idempotencyKey: `masar-services-${body.requestId}-${createHash("sha256").update(JSON.stringify({ catalog, items: body.items, paymentPercent })).digest("hex")}`,
    });
    if (!session.url) return Response.json({ error: "Unable to open payment" }, { status: 502 });
    return Response.json({ url: session.url });
  } catch (error) {
    const failure = error as { code?: string; type?: string };
    return Response.json({ error: "Unable to start payment. Please contact info@masarps.com.", supportCode: failure.code || failure.type || "payment_unavailable" }, { status: 502 });
  }
}
