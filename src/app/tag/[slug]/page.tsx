import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import subStyles from "../../cv/cv.module.css";
import { getAllTagSlugs, getItemsForTag } from "@/lib/tags";

export function generateStaticParams() {
  return getAllTagSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { display, items } = getItemsForTag(slug);
  return {
    title: display,
    description: `${items.length} whitepaper${items.length === 1 ? "" : "s"} and note${
      items.length === 1 ? "" : "s"
    } tagged ${display}.`,
    alternates: { canonical: `/tag/${slug}` },
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { display, items } = getItemsForTag(slug);
  if (items.length === 0) notFound();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <p className={subStyles.eyebrow}>Tag</p>
        <h1 className={subStyles.title}>{display}</h1>
        <p className={subStyles.subtitle}>
          {items.length} item{items.length === 1 ? "" : "s"} tagged with this.
        </p>
      </header>

      <div className={styles.plainList}>
        {items.map(({ kind, item }) => {
          const base =
            kind === "case-study" ? "case-studies" : kind === "whitepaper" ? "whitepapers" : "blog";
          const label =
            kind === "case-study" ? "case study" : kind === "whitepaper" ? "paper" : "note";
          const href = `/${base}/${item.slug}`;
          return (
            <Link key={`${kind}:${item.slug}`} href={href} className={styles.plainRow}>
              <div className={styles.plainRowMain}>
                <span className={styles.plainRowTitle}>
                  {item.title}
                  <span className={styles.plainRowBadge}>{label}</span>
                </span>
                <span className={styles.plainRowDesc}>{item.summary}</span>
              </div>
              <span className={styles.plainRowDate}>
                {item.date}
                <br />
                {item.readingTime}
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
