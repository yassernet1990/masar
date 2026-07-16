import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./amaala.css";
import "./amaala-overrides.css";
import ThemeBridge from "./theme-bridge";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://masar-procurement.yasserkadir-3919.chatgpt.site"),
  title: {
    default: "MASAR Procurement Solutions | حلول مسار للمشتريات",
    template: "%s | MASAR",
  },
  description: "Integrated procurement consulting, strategic sourcing, trading, import, warehousing and delivery solutions across MENA.",
  keywords: ["procurement", "strategic sourcing", "Saudi Arabia", "المشتريات", "التوريد الاستراتيجي", "إدارة الموردين"],
  authors: [{ name: "MASAR Procurement Solutions" }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    title: "MASAR Procurement Solutions",
    description: "Smart procurement solutions connecting markets and building resilient supply chains.",
    images: [{ url: "/images/masar-hero.png", width: 1200, height: 630, alt: "MASAR Procurement Solutions" }],
  },
  twitter: { card: "summary_large_image", title: "MASAR Procurement Solutions", images: ["/images/masar-hero.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f4f0e8" };

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ar" suppressHydrationWarning><body><ThemeBridge />{children}</body></html>;
}
