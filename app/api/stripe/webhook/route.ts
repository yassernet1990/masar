import { stripe, saveOrder } from "../../../commerce/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET)
    return new Response("Unavailable", { status: 503 });
  let event;
  try {
    event = stripe().webhooks.constructEvent(
      await request.text(),
      request.headers.get("stripe-signature") || "",
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
  if (
    [
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
    ].includes(event.type)
  ) {
    const session = event.data
      .object as import("stripe").default.Checkout.Session;
    if (
      session.payment_status === "paid" &&
      (session.metadata?.catalog === "masar_brand_202609" ||
        session.metadata?.catalog?.startsWith("masar_services_"))
    ) {
      try {
        await saveOrder(session.id, {
          sessionId: session.id,
          amount: session.amount_total,
          currency: session.currency,
          email: session.customer_details?.email,
          metadata: session.metadata,
          paymentIntent: session.payment_intent,
          paidAt: new Date(event.created * 1000).toISOString(),
          eventId: event.id,
        });
      } catch {
        return new Response("Storage unavailable", { status: 500 });
      }
    }
  }
  return Response.json({ received: true });
}
