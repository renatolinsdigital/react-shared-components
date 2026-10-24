import Container from '../Container';
import Section from '../Section';
import styles from './PageHero.module.scss';

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Number shown in the corner badge, such as the total number of posts. */
  count: number;
  countLabel: string;
}

/** Intro block at the top of a listing page: eyebrow, title, subtitle and a counter badge. */
export default function PageHero({ eyebrow, title, subtitle, count, countLabel }: PageHeroProps) {
  return (
    <Section noPadding>
      <div className={styles.hero}>
        <Container>
          <div className={styles.heroInner}>
            <div className={styles.heroCount}>
              <span className={styles.countNum}>{count}</span>
              <span className={styles.countLabel}>{countLabel}</span>
            </div>
            <span className={styles.heroEyebrow}>{eyebrow}</span>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroSubtitle}>{subtitle}</p>
            <div className={styles.heroLine} />
          </div>
        </Container>
      </div>
    </Section>
  );
}
