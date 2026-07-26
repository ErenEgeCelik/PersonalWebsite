import Link from "next/link";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import EmailLink from "./components/EmailLink";
import FairValueChart from "./components/FairValueChart";
import { getAllPosts } from "@/lib/blog";
import { getAllWhitepapers } from "@/lib/whitepapers";
import { getProjects } from "@/lib/projects";
import { getHomeCopy } from "@/lib/home";
import { SITE_GITHUB } from "@/lib/site";

type Entry = {
  href: string;
  title: string;
  subtitle?: string;
  summary: string;
  date: string;
  kind: string;
  readingTime: string;
};

/** Everything I've published, newest first — drives both the featured slot and the list. */
function allWriting(): Entry[] {
  const papers: Entry[] = getAllWhitepapers().map((p) => ({
    href: `/whitepapers/${p.slug}`,
    title: p.title,
    subtitle: p.subtitle,
    summary: p.summary,
    date: p.date,
    kind: p.status,
    readingTime: p.readingTime,
  }));
  const posts: Entry[] = getAllPosts().map((p) => ({
    href: `/blog/${p.slug}`,
    title: p.title,
    summary: p.summary,
    date: p.date,
    kind: "Note",
    readingTime: p.readingTime,
  }));
  return [...papers, ...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

const statusClass: Record<string, string> = {
  live: styles.statusLive,
  draft: styles.statusDraft,
  idle: styles.statusIdle,
};

export default function Home() {
  const copy = getHomeCopy();
  const writing = allWriting();
  // Lead with the substantial paper rather than whatever is merely newest.
  const featured =
    writing.find((w) => w.href === "/whitepapers/polymarket-5min-microstructure") ?? writing[0];
  const rest = writing.filter((w) => w.href !== featured?.href);
  const projects = getProjects();

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.heroStatement}>{copy.statement}</h1>
        {copy.body && (
          <div className={styles.heroSupport}>
            <ReactMarkdown>{copy.body}</ReactMarkdown>
          </div>
        )}
        <div className={styles.heroContact}>
          <EmailLink />
          <span className={styles.contactSep}>·</span>
          <a
            href={SITE_GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroLink}
          >
            GitHub
          </a>
          <span className={styles.contactSep}>·</span>
          <Link href="/cv" className={styles.heroLink}>
            CV
          </Link>
        </div>
      </section>

      <section className={styles.chartBand}>
        {copy.chartLabel && <p className={styles.sectionLabel}>{copy.chartLabel}</p>}
        <FairValueChart />
      </section>

      <hr className={styles.rule} />

      {featured && (
        <Link href={featured.href} className={styles.featured}>
          <div className={styles.featuredMeta}>
            <span className={styles.featuredKind}>{featured.kind}</span>
            <span className={styles.metaSep}>·</span>
            <span>{featured.readingTime}</span>
            <span className={styles.metaSep}>·</span>
            <span>{featured.date}</span>
          </div>
          <h2 className={styles.featuredTitle}>{featured.title}</h2>
          {featured.subtitle && <p className={styles.featuredSubtitle}>{featured.subtitle}</p>}
          <p className={styles.featuredAbstract}>{featured.summary}</p>
          <div className={styles.featuredCta}>
            Read the paper <span>→</span>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <section className={styles.section}>
          <p className={styles.sectionLabel}>More writing</p>
          <div className={styles.plainList}>
            {rest.map((w) => (
              <Link key={w.href} href={w.href} className={styles.plainRow}>
                <div className={styles.plainRowMain}>
                  <span className={styles.plainRowTitle}>{w.title}</span>
                  <span className={styles.plainRowDesc}>{w.summary}</span>
                </div>
                <span className={styles.plainRowDate}>
                  {w.date}
                  <br />
                  {w.readingTime}
                </span>
              </Link>
            ))}
          </div>
          <div className={styles.sectionMore}>
            <Link href="/whitepapers" className={styles.moreLink}>
              All whitepapers →
            </Link>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Building</p>
        <div className={styles.projectList}>
          {projects.map((p) => (
            <article key={p.title} className={styles.projectRow}>
              <span className={styles.projectYear}>{p.period}</span>
              <div className={styles.projectBody}>
                <div className={styles.projectHead}>
                  <h3 className={styles.projectTitle}>{p.title}</h3>
                  <span className={`${styles.status} ${statusClass[p.status]}`}>
                    {p.status === "live" && <span className={styles.statusDot} />}
                    {p.statusLabel}
                  </span>
                </div>
                <p className={styles.projectDesc}>{p.desc}</p>
                <div className={styles.projectLinks}>
                  {p.links?.map((l) =>
                    l.external ? (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                      >
                        {l.label} ↗
                      </a>
                    ) : (
                      <Link key={l.href} href={l.href} className={styles.projectLink}>
                        {l.label} →
                      </Link>
                    ),
                  )}
                  {p.note && <span className={styles.projectNote}>{p.note}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Collaboration</p>
        <div className={styles.collab}>
          <p className={styles.collabText}>
            I&apos;m open to collaboration on prediction-market research, market microstructure, and
            anything where a model has to survive contact with real execution costs. If something
            here overlaps with what you&apos;re working on, write to me.
          </p>
          <EmailLink />
        </div>
      </section>
    </main>
  );
}
