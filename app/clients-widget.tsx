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
 