import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./amaala.css";
import "./amaala-overrides.css";
import ThemeBridge from "./theme-bridge";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://masar-procurement.yasserkadir-3919.chatgpt.site",
  ),
  title: {
    default: "MASAR Procurement Solutions | حلول مسار للمشتريات",
    template: "%s |