import type { Metadata, Viewport } from "next";
import { Noto_Serif_Arabic } from "next/font/google";
import "./globals.css";
import "./amaala.css";
import "./amaala-overrides.css";
import ThemeBridge from "./theme-bridge";

const notoSerifArabic = Noto_Serif_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-serif-arabic",