import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./accessibility.css";
import "./globals.css";
import "./amaala.css";
import "./amaala-overrides.css";
import "./clients-widget.css";
import "./refinement.css";
import "./masar-v15.css";
import "./masar-v16.css";
import "./masar-v17.css";
import "./masar-v18.css";
import "./masar-v19.css";
import "./masar-v20.css";
import "./masar-v21.css";
import "./masar-v22.css";
import "./masar-v23-mobile.css";
import ThemeBridge from "./theme-bridge";
import MasarV17Bridge from "./masar-v17-bridge";
import MasarV22Bridge from "./masar-v22-bridge";
import MasarMobileMenu from "./masar-mobile-menu";

export const metadata: Metadata = {
  title: "MASAR Procurement Solutions | حلول مسار للمشتريات",
  description: "Integrated procurement consulting and sourcing solutions across MENA.",
  applicationName: "MASAR",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "MASAR", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/favicon.ico?v=masar2", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon.svg?v=masar2", type: "image/svg+xml", sizes: "any" },
      { url: "/icons/masar-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/masar-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/masar-512.png", type: "image/png", sizes: "512x512" },
    ],
    other: [{ rel: "mask-icon", url: "/icons/masar-mask.svg", color: "#328bff" }],
    shortcut: "/favicon.ico?v=masar2",
    apple: [{ url: "/apple-touch-icon.png?v=masar2", sizes: "180x180", type: "image/png" }],
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#06132f" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = (await headers()).get("x-masar-language") === "ar" ? "ar" : "en";
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body><ThemeBridge /><MasarV17Bridge /><MasarV22Bridge /><MasarMobileMenu />{children}</body>
    </html>
  );
}
