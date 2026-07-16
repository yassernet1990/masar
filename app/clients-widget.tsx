"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ClientItem = { name: string; logo?: string };
type ClientsConfig = {
  enabled: boolean;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  items: ClientItem[];
};

const defaults: ClientsConfig = {
  enabled: true,
  titleAr: "نفخر بثقة عملائنا",
  titleEn: "Trusted by Our Clients",
  descriptionAr: "نفخر بدعم شركات من قطاعات متعددة بحلول مشتريات مرنة وموثوقة.",
  descriptionEn: "Proud to support organizations across multiple sectors with agile, reliable procurement solutions.",
  items: [
    { name: "CFP COATING" },
    { name: "CREET" },
    { name: "SAMA CITY" },
    { name: "SDC" },
    { name: "CLC" },
  ],
};

function normalize(value: unknown): ClientsConfig {
  if (!value || typeof value !== "object") return defaults;
  const input = value as Partial<ClientsConfig>;
  return {
    ...defaults,
    ...input,
    items: Array.isArray(input.items) && input.items.length
      ? input.items.map((item) => ({ name: String(item?.name || "Client"), logo: item?.logo ? String(item.logo) : "" }))
      : defaults.items,
  };
}

export default function ClientsWidget() {