import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./amaala.css";
import "./amaala-overrides.css";
import ThemeBridge from "./theme-bridge";

export const metadata: Metadata = { title: "MASAR Procurement Solutions | حلول مسار للمشتريات", description: "Integrated procurement consulting and sourcing solutions across MENA.", icons: { icon: "/favicon.svg" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f4f0e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body><ThemeBridge />{children}</body>
    </html>
  );
}
