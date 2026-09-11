"use client";

import { useEffect } from "react";

const NEW_SRC = "/images/operations-systems.webp?v=20260911-verified";

export default function BusinessServiceImageBridge() {
  useEffect(() => {
    const apply = () => {
      document
        .querySelectorAll<HTMLImageElement>('img[src*="/images/operations-systems.webp"], img[src*="/service-business-image.webp"], img[src*="/api/business-advisory-image"], img[src*="business-advisory-20260911"]')
        .forEach((img) => {
          const src = img.getAttribute("src") || "";
          if (src !== NEW_SRC) img.setAttribute("src", NEW_SRC);
        });
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    return () => observer.disconnect();
  }, []);

  return null;
}
