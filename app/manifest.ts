import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "MASAR Procurement & Solutions",
    short_name: "MASAR",
    description: "MASAR procurement, commercial advisory and business solutions.",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#06132f",
    theme_color: "#06132f",
    icons: [
      { src: "/icons/masar-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/masar-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/masar-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
