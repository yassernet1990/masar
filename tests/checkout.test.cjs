const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const Module = require("node:module");
const original = Module._extensions[".ts"];
Module._extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const checkout = require("../app/api/checkout/route.ts");
const webhook = require("../app/api/stripe/webhook/route.ts");
const Stripe = require("stripe");
const directory = fs.mkdtempSync("/tmp/masar-order-tests-");
process.env.MASAR_DATA_DIR = directory;
const request = (body, origin = "https://masarps.com") =>
  new Request("https://masarps.com/api/checkout", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
const valid = {
  package: "start",
  addons: [],
  currency: "sar",
  lang: "en",
  accepted: true,
  email: "buyer@example.com",
  name: "Test Buyer",
  company: "Example",
  requestId: "01234567-1234-1234-1234-123456789012",
};
global.fetch = async () => {
  throw new Error("No live network in tests");
};
test("reject cross-origin requests", async () =>
  assert.equal(
    (await checkout.POST(request(valid, "https://evil.example"))).status,
    403,
  ));
test("reject duplicate and unknown extras, unknown package and missing consent", async () => {
  for (const patch of [
    { addons: ["documents", "documents"] },
    { addons: ["unknown"] },
    { package: "fake" },
    { accepted: false },
  ])
    assert.equal(
      (await checkout.POST(request({ ...valid, ...patch }))).status,
      400,
    );
});
test("payments fail closed without configuration; unavailable FX keeps SAR", async () => {
  delete process.env.STRIPE_RESTRICTED_KEY;
  delete process.env.STRIPE_WEBHOOK_SECRET;
  const q = await (
    await checkout.GET(new Request("https://masarps.com/api/checkout"))
  ).json();
  assert.equal(q.ready, false);
  assert.deepEqual(Object.keys(q.prices), ["sar"]);
  assert.equal(q.prices.sar.start, 225000);
  assert.equal((await checkout.POST(request(valid))).status, 503);
});
test("webhook rejects forgery, ignores unpaid events and saves signed paid events once", async () => {
  process.env.STRIPE_RESTRICTED_KEY = "rk_test_dummy";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_unit_test";
  const api = new Stripe("rk_test_dummy");
  const send = async (paid, signature = true) => {
    const body = JSON.stringify({
      id: "evt_example",
      type: "checkout.session.completed",
      created: 1700000000,
      data: {
        object: {
          id: "cs_test_example",
          payment_status: paid ? "paid" : "unpaid",
          metadata: { catalog: "masar_brand_202609" },
          amount_total: 225000,
          currency: "sar",
        },
      },
    });
    return webhook.POST(
      new Request("https://masarps.com/api/stripe/webhook", {
        method: "POST",
        headers: {
          "stripe-signature": signature
            ? api.webhooks.generateTestHeaderString({
                payload: body,
                secret: process.env.STRIPE_WEBHOOK_SECRET,
              })
            : "forged",
        },
        body,
      }),
    );
  };
  assert.equal((await send(true, false)).status, 400);
  assert.equal((await send(false)).status, 200);
  assert.equal(fs.existsSync(path.join(directory, "orders")), false);
  assert.equal((await send(true)).status, 200);
  assert.equal((await send(true)).status, 200);
  assert.equal(fs.readdirSync(path.join(directory, "orders")).length, 1);
  assert.equal(
    JSON.parse(
      fs.readFileSync(path.join(directory, "orders/cs_test_example.json")),
    ).amount,
    225000,
  );
});
after(() => {
  fs.rmSync(directory, { recursive: true, force: true });
  if (original) Module._extensions[".ts"] = original;
  else delete Module._extensions[".ts"];
});

test('checkout charges the complete server quote, ignores client amounts, and rejects stale quotes', async () => {
  const server = require('../app/commerce/server.ts');
  const savedQuote = server.quote, savedStripe = server.stripe;
  let sent;
  server.quote = async () => ({ ready:true,version:'current',fee:null,prices:{sar:{start:225000,documents:55875}} });
  server.stripe = () => ({checkout:{sessions:{create:async value=>{sent=value;return {url:'https://checkout.stripe.com/example'};}}}});
  try {
    assert.equal((await checkout.POST(request({...valid,version:'stale'}))).status,409);
    const response = await checkout.POST(request({...valid,version:'current',addons:['documents'],amount:1,paymentPercent:60}));
    assert.equal(response.status,200);
    assert.equal(sent.mode,'payment');
    assert.equal(sent.line_items.reduce((sum,item)=>sum+item.price_data.unit_amount*item.quantity,0),280875);
    assert.equal(sent.line_items[0].price_data.product,'masar_start_202609');
    assert.equal(sent.metadata.payment_terms,'100% upfront');
  } finally {server.quote=savedQuote;server.stripe=savedStripe;}
});

test('checkout enabled with both secrets while optional fee details are deferred', async () => {
  process.env.STRIPE_RESTRICTED_KEY='rk_test_dummy';
  process.env.STRIPE_WEBHOOK_SECRET='whsec_dummy';
  delete process.env.MASAR_REFUND_FEE_EN;
  delete process.env.MASAR_REFUND_FEE_AR;
  const q=await require('../app/commerce/server.ts').quote();
  assert.equal(q.ready,true); assert.equal(q.fee,null);
});
