"use client";

import { useEffect } from "react";
import c1 from "./service-business-image-chunks/1";
import c2 from "./service-business-image-chunks/2";
import c3 from "./service-business-image-chunks/3";
import c4 from "./service-business-image-chunks/4";
import c5 from "./service-business-image-chunks/5";
import c6 from "./service-business-image-chunks/6";

const NEW_SRC = `data:image/webp;base64,${c1}${c2}${c3}${c4}${c5}${c6}`;

export default function BusinessServiceImageBridge() {
  useEffect(() => {
    const apply = () => {
      document
        .querySelectorAll<HTMLImageElement>('img[src*="/images/operations-systems.webp"], img[src="/service-business-image.webp"]')
        .forEach((img) => {
          if (img.src !== NEW_SRC) img.src = NEW_SRC;
        });
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
