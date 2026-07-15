import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MASAR Procurement Solutions | حلول مسار للمشتريات",
  description: "Integrated procurement consulting, strategic sourcing, trading, import, warehousing and delivery solutions across MENA.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ar"><body>{children}</body></html>;
}
