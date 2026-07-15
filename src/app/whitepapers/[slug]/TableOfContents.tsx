"use client";
import { useEffect, useState } from "react";
import styles from "./paper.module.css";

export type Heading = { level: number; text: string; slug: string };

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <div className={styles.tocLabel}>Contents</div>
      <ul className={styles.tocList}>
        {headings.map((h) => (
          <li
            key={h.slug}
            className={`${styles.tocItem} ${h.level === 3 ? styles.tocItemSub : ""} ${active === h.slug ? styles.tocItemActive : ""}`}
          >
            <a href={`#${h.slug}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
