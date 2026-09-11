"use client";

import { useEffect } from "react";

const NEW_SRC = "/service-business-image.webp";

export default function BusinessServiceImageBridge() {
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll<HTMLImageElement>('img[src*="/images/operations-systems.webp"]').forEach((img) => {
        if (img.getAttribute("src") !== NEW_SRC) img.setAttribute("src", NEW_SRC);
      });
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
