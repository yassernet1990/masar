import c1 from "../service-business-image-chunks/1";
import c2 from "../service-business-image-chunks/2";
import c3 from "../service-business-image-chunks/3";
import c4 from "../service-business-image-chunks/4";
import c5 from "../service-business-image-chunks/5";
import c6 from "../service-business-image-chunks/6";

export const dynamic = "force-static";

export async function GET() {
  const bytes = Buffer.from(c1 + c2 + c3 + c4 + c5 + c6, "base64");
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.length),
    },
  });
}
