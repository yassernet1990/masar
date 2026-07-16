import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./amaala.css";
import "./amaala-overrides.css";
import "./amaala-fonts.css";
import "./amaala-frame.css";
import ThemeBridge from "./theme-bridge";

export const metadata: Metadata = {
  title: "MASAR Procurement Solutions | حلول مسار للمشتريات",
  description: "Integrated procurement consulting and sourcing solutions across MENA.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f0e8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body>
        <ThemeBridge />
        {children}
      </body>
    </html>
  );
}
