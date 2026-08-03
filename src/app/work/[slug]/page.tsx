import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import styles from "../../page.module.css";
import a from "../../article.module.css";
import { getAllProjects, getProject } from "@/lib/work";
import { tagHref } from "@/lib/content";
import { extractHeadings } from "@/lib/headings";
import TableOfContents from "../../components/TableOfContents";
import PrintButton from "../../components/PrintButton";
import EquityChart from "../../components/EquityChart";
import { getEquitySeries } from "@/lib/equity";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.summary,
      type: "article",
      url: `/work/${p.slug}`,
    },
  };
}

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const headings = extractHeadings(project.content);
  const long = headings.length > 5;
  // Quantitative claims live on project pages, in context — never on the home page.
  const equity = project.equityChart ? getEquitySeries() : null;

  return (
    <main className={`${a.layout} ${long ? "" : a.layoutPlain}`}>
      <article className={`${a.article} ${a.wide}`}>
        <Link href="/work" className={a.back}>
          ← Work
        </Link>

        {project.kicker && <p className={a.kicker}>{project.kicker}</p>}
        <h1 className={a.titleProject}>{project.title}</h1>
        <p className={a.summary}>{project.summary}</p>

        <div className={a.facts}>
          <div>
            <p className={a.factLabel}>Role</p>
            <p className={a.factValue}>{project.role}</p>
          </div>
          <div>
            <p className={a.factLabel}>Period</p>
            <p className={a.factValue}>{project.period}</p>
          </div>
          <div>
            <p className={a.factLabel}>Stack</p>
            <p className={a.factValue}>{project.stack}</p>
          </div>
          {project.venue && (
            <div>
              <p className={a.factLabel}>Venue</p>
              <p className={a.factValue}>{project.venue}</p>
            </div>
          )}
        </div>

        {equity && <EquityChart series={equity} />}

        <div className={a.body}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: false }]]}
            rehypePlugins={[rehypeSlug, rehypeKatex]}
          >
            {project.content}
          </ReactMarkdown>
        </div>

        {project.tags.length > 0 && (
          <div className={a.tagRow}>
            {project.tags.map((t) => (
              <Link key={t} href={tagHref(t)} className={styles.tag}>
                {t}
              </Link>
            ))}
          </div>
        )}

        <div className={a.articleFoot}>
          {project.paper && (
            <Link href={project.paper} className={`${styles.btn} ${styles.btnPrimary}`}>
              Read the paper
            </Link>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Repository
            </a>
          )}
          <Link href="/contact" className={`${styles.btn} ${styles.btnSecondary}`}>
            Ask me about it
          </Link>
          <PrintButton />
        </div>
      </article>

      {long && <TableOfContents headings={headings} />}
    </main>
  );
}
