import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./seo";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/*?admin=", "/*&admin=", "/*?checkout=", "/*&checkout=", "/*?session_id=", "/*&session_id="] }, sitemap: `${SITE_ORIGIN}/sitemap.xml` };
}
