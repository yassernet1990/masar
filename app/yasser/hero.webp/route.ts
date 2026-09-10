import c1 from "../hero-chunks/1";
import c2 from "../hero-chunks/2";
import c3 from "../hero-chunks/3";
import c4 from "../hero-chunks/4";
import c5 from "../hero-chunks/5";

export const dynamic = "force-static";

export async function GET() {
  const bytes = Buffer.from(c1 + c2 + c3 + c4 + c5, "base64");
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.length),
    },
  });
}
