import { createHash } from "node:crypto";
import {
  packages,
  addons,
  refund,
  policyVersion,
} from "../../commerce/catalog";
import { origin, quote, stripe } from "../../commerce/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("session_id");
  if (id) {
    if (!/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(id))
      return Response.json({ paid: false }, { status: 400 });
    try {
      const session = await stripe().checkout.sessions.retrieve(id);
      return Response.json(
        {
          paid:
            session.payment_status === "paid" &&
            session.metadata?.catalog === "masar_brand_202609",
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch {
      return Response.json({ paid: false }, { status: 503 });
    }
  }
  return Response.json(await quote(), {
    headers: { "Cache-Control": "no-store" },
  });
}
export async function POST(request: Request) {
  if (request.headers.get("origin") !== origin())
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.package !== "string" ||
    !Array.isArray(body.addons) ||
    body.addons.length > 6 ||
    new Set(body.addons).size !== body.addons.length ||
    !body.addons.every(
      (id: unknown) =>
        typeof id === "string" && addons.some((a) => a.id === id),
    ) ||
    !packages.some((p) => p.id === body.package) ||
    !["sar", "usd", "gbp"].includes(body.currency) ||
    !["ar", "en"].includes(body.lang) ||
    body.accepted !== true ||
    typeof body.email !== "string" ||
    body.email.length > 180 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.length > 120 ||
    typeof body.company !== "string" ||
    body.company.length > 120 ||
    typeof body.requestId !== "string" ||
    !/^[a-f0-9-]{36}$/.test(body.requestId)
  )
    return Response.json({ error: "Invalid order" }, { status: 400 });
  const current = await quote();
  if (!current.ready)
    return Response.json(
      {
        error:
          "Payments are not available yet. Please contact info@masarps.com.",
      },
      { status: 503 },
    );
  if (body.version !== current.version || !current.prices[body.currency])
    return Response.json(
      { error: "Prices updated. Refresh your order before paying." },
      { status: 409 },
    );
  const items = [
    packages.find((p) => p.id === body.package)!,
    ...body.addons.map((id: string) => addons.find((a) => a.id === id)!),
  ];
  const lang = body.lang as "en" | "ar";
  const metadata = {
    catalog: "masar_brand_202609",
    package: body.package,
    addons: body.addons.join(","),
    name: body.name,
    company: body.company,
    policy_version: policyVersion,
    refund_fees: current.fee?.[lang] || "Not yet specified",
    payment_terms: "100% upfront",
    quote_version: current.version,
  };
  try {
    const session = await stripe().checkout.sessions.create(
      {
        mode: "payment",
        currency: body.currency,
        customer_email: body.email,
        client_reference_id: body.requestId,
        integration_identifier: "masar_brand_abcdefgh",
        line_items: items.map((item) => ({
          quantity: 1,
          price_data: {
            currency: body.currency,
            unit_amount: current.prices[body.currency][item.id],
            product: `masar_${item.id.replaceAll("-", "_")}_202609`,
          },
        })),
        success_url: `${origin()}/packages?checkout=success&session_id={CHECKOUT_SESSION_ID}#brand-packages`,
        cancel_url: `${origin()}/packages?checkout=cancelled#brand-packages`,
        metadata,
        payment_intent_data: { metadata },
        invoice_creation: { enabled: true, invoice_data: { metadata } },
        custom_text: {
          submit: { message: [refund[lang], current.fee?.[lang]].filter(Boolean).join(" ") },
        },
        adaptive_pricing: { enabled: false },
      },
      {
        idempotencyKey: `masar-${body.requestId}-${createHash("sha256").update(JSON.stringify(body)).digest("hex")}`,
      },
    );
    if (!session.url)
      return Response.json(
        { error: "Unable to open payment" },
        { status: 502 },
      );
    return Response.json({ url: session.url });
  } catch {
    return Response.json(
      { error: "Unable to start payment. Please try again." },
      { status: 502 },
    );
  }
}
