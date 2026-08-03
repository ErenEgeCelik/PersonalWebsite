"use client";
import { useEffect, useState } from "react";
import styles from "../article.module.css";

export type Heading = { level: number; text: string; slug: string };

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
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
    <nav className={styles.rail} aria-label="Contents">
      <p className={styles.railLabel}>Contents</p>
      <ul className={styles.railList}>
        {headings.map((h) => (
          <li
            key={h.slug}
            className={`${styles.railItem} ${h.level === 3 ? styles.railSub : ""} ${
              active === h.slug ? styles.railActive : ""
            }`}
          >
            <a href={`#${h.slug}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
