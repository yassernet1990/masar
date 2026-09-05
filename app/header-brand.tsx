"use client";

import { useState } from "react";
import styles from "./header-brand.module.css";

const descriptor = "PROCUREMENT / SOLUTIONS";

export default function HeaderBrand() {
  const [replay, setReplay] = useState(0);
  const replayShimmer = () => setReplay((value) => value + 1);

  return (
    <a className={styles.brand} href="#top" dir="ltr" lang="en"
      aria-label="MASAR Procurement / Solutions — home"
      onPointerEnter={replayShimmer} onFocus={replayShimmer} onPointerDown={replayShimmer}>
      <span className={styles.symbol} aria-hidden="true">
        {/* Native vector assets keep the approved geometry sharp at every pixel density. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/masar-header-symbol.svg" width="1140" height="564" alt="" />
        <span className={styles.mask}><span key={replay} className={styles.shine} /></span>
      </span>
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.lettering} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.wordmark} src="/images/masar-header-wordmark.svg" width="308" height="45" alt="" />
        <span className={styles.descriptor}>
          {Array.from(descriptor).map((letter, index) => (
            <span key={index}>{letter === " " ? "\u00a0" : letter}</span>
          ))}
        </span>
      </span>
    </a>
  );
}
