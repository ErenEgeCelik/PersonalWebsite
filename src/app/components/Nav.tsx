"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "./Nav.module.css";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/research", key: "nav.research" },
  { href: "/whitepapers", key: "nav.whitepapers" },
  { href: "/blog", key: "nav.blog" },
  { href: "/trades", key: "nav.trades" },
  { href: "/cv", key: "nav.cv" },
];

export default function Nav() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.brand}>
        <span className={styles.dot} />
        erenege.com
      </Link>
      <div className={styles.links}>
        {links.map(({ href, key }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${active ? styles.active : ""}`}
            >
              {t(key)}
            </Link>
          );
        })}
      </div>
      <button
        className={styles.lang}
        onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
        aria-label="Toggle language"
      >
        {language === "tr" ? "TR / en" : "tr / EN"}
      </button>
    </nav>
  );
}
