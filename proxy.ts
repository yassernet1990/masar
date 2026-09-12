import { NextRequest, NextResponse } from "next/server";

// Forward the validated locale to the root layout for correct server-rendered HTML.
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-masar-language", request.nextUrl.searchParams.get("lang") === "ar" ? "ar" : "en");
  return NextResponse.next({ request: { headers: requestHeaders } });
}
export const config = { matcher: ["/", "/yasser", "/grow-case", "/packages", "/services/procurement", "/services/business-setup", "/services/commercial-contracts"] };
