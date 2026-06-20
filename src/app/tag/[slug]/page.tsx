import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import subStyles from "../../cv/cv.module.css";
import { getAllTagSlugs, getItemsForTag } from "@/lib/tags";

export function generateStaticParams() {
  return getAllTagSlugs().map((slug) => ({ slug }));
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { display, items } = getItemsForTag(slug);
  if (items.length === 0) notFound();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={subStyles.eyebrow}>Tag</div>
        <h1 className={subStyles.title}>
          # <span style={{ color: "var(--accent-warm)" }}>{display}</span>
        </h1>
        <p className={subStyles.subtitle}>
          {items.length} item{items.length === 1 ? "" : "s"} tagged with{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>{display}</code>
        </p>
      </header>

      <section className={styles.section}>
        <div className={subStyles.list}>
          {items.map(({ kind, item }) => {
            const href = kind === "whitepaper" ? `/whitepapers/${item.slug}` : `/blog/${item.slug}`;
            const kindLabel = kind === "whitepaper" ? "whitepaper" : "post";
            return (
              <article key={`${kind}:${item.slug}`} className={subStyles.row}>
                <span className={subStyles.rowDate}>{item.date}</span>
                <div className={subStyles.rowBody}>
                  <div className={subStyles.rowMeta}>
                    <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {kindLabel}
                    </span>
                  </div>
                  <Link href={href} className={styles.entryTitle}>
                    {item.title}
                  </Link>
                  <p className={subStyles.rowDetail}>{item.summary}</p>
                </div>
                <Link href={href} className={styles.entryAction}>
                  read →
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
