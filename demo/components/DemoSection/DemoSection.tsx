import type { ReactNode } from 'react';
import styles from './DemoSection.module.scss';

/** What the page's registry gives each demo: where it sits and what it is called. */
export interface DemoHeading {
  id: string;
  title: string;
  readmePath: string;
}

export interface DemoSectionProps extends DemoHeading {
  /** Inline content only: it renders inside a paragraph. */
  description: ReactNode;
  /** The usage snippet shown under the live preview. */
  code: string;
  children: ReactNode;
}

/** One component on the demo page: its name, a live preview and the code that produced it. */
export default function DemoSection({
  id,
  title,
  readmePath,
  description,
  code,
  children,
}: DemoSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h3 id={headingId} className={styles.title}>
          {title}
        </h3>
        <code className={styles.readmePath}>{readmePath}</code>
      </header>
      <p className={styles.description}>{description}</p>
      <div className={styles.preview}>{children}</div>
      <pre className={styles.code}>
        <code>{code}</code>
      </pre>
    </section>
  );
}
