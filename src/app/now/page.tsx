import ReactMarkdown from "react-markdown";
import styles from "../page.module.css";
import n from "./now.module.css";
import { getNow } from "@/lib/pages";

export const metadata = {
  title: "Now",
  description: "What Eren Ege Çelik is working on at the moment.",
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  const now = getNow();

  return (
    <main className={`${styles.column} ${styles.page}`}>
      <div className={styles.prose620}>
        <h1 className={styles.h1Page}>Now</h1>
        {now.updated && <p className={n.updated}>Updated {now.updated}</p>}

        <ul className={n.list}>
          {now.items.map((item, i) => (
            <li key={item.title} className={`${n.item} ${i === 0 ? n.itemFirst : ""}`}>
              <h2 className={n.itemTitle}>{item.title}</h2>
              <div className={n.itemBody}>
                <ReactMarkdown>{item.body}</ReactMarkdown>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
