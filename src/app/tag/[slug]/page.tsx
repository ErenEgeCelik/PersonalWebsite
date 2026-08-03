import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import { getAllTagSlugs, getItemsForTag } from "@/lib/tags";

export function generateStaticParams() {
  return getAllTagSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { display, items } = getItemsForTag(slug);
  return {
    title: display,
    description: `${items.length} item${items.length === 1 ? "" : "s"} tagged ${display}.`,
    alternates: { canonical: `/tag/${slug}` },
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { display, items } = getItemsForTag(slug);
  if (items.length === 0) notFound();

  return (
    <main className={`${styles.column} ${styles.page}`}>
      <p className={styles.kicker}>Tag</p>
      <h1 className={styles.h1Page}>{display}</h1>
      <p className={styles.intro}>
        {items.length} item{items.length === 1 ? "" : "s"} tagged with this.
      </p>

      <div className={`${styles.list} ${styles.section}`}>
        {items.map((it) => (
          <Link key={it.href} href={it.href} className={styles.row}>
            <h2 className={`${styles.rowTitle} ${styles.rowTitleSm}`}>{it.title}</h2>
            <span className={styles.rowMeta}>{it.meta}</span>
            <p className={`${styles.rowSummary} ${styles.rowSummarySm}`}>{it.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
