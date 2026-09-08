import Stripe from "stripe";
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { packages, addons } from "./catalog";
export const origin = () => process.env.MASAR_SITE_URL || "https://masarps.com";
export const stripe = () => {
  if (!process.env.STRIPE_RESTRICTED_KEY)
    throw new Error("Payments unavailable");
  return new Stripe(process.env.STRIPE_RESTRICTED_KEY, {
    maxNetworkRetries: 2,
  });
};
export async function rates(): Promise<Record<string, number>> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/SAR", {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    if (
      !response.ok ||
      data.result !== "success" ||
      data.base_code !== "SAR" ||
      Date.now() / 1000 - data.time_last_update_unix > 172800
    )
      throw new Error("Rate unavailable");
    if (
      ![data.rates.USD, data.rates.GBP].every(
        (v) => typeof v === "number" && v > 0 && Number.isFinite(v),
      )
    )
      throw new Error("Invalid rate");
    return { sar: 1, usd: data.rates.USD, gbp: data.rates.GBP };
  } catch {
    return { sar: 1 };
  }
}
export async function quote() {
  const fx = await rates();
  const prices: Record<string, Record<string, number>> = {};
  for (const [currency, rate] of Object.entries(fx))
    prices[currency] = Object.fromEntries(
      [...packages, ...addons].map((i) => [
        i.id,
        Math.round(i.sar * 100 * rate),
      ]),
    );
  const fee =
    process.env.MASAR_REFUND_FEE_EN && process.env.MASAR_REFUND_FEE_AR
      ? {
          en: process.env.MASAR_REFUND_FEE_EN,
          ar: process.env.MASAR_REFUND_FEE_AR,
        }
      : null;
  return {
    prices,
    fee,
    ready: !!(
      process.env.STRIPE_RESTRICTED_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      fee
    ),
    version: createHash("sha256")
      .update(JSON.stringify({ prices, fee }))
      .digest("hex"),
  };
}
export async function saveOrder(id: string, data: unknown) {
  if (!/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(id))
    throw new Error("Invalid session");
  const directory = path.join(
    process.env.MASAR_DATA_DIR || path.join(process.cwd(), "data"),
    "orders",
  );
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const target = path.join(directory, `${id}.json`);
  // Paid records are immutable. Duplicate webhook deliveries are harmless.
  try {
    await readFile(target);
    return;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  }
  const temporary = `${target}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(data), { mode: 0o600 });
  await rename(temporary, target);
}
